/*
Q3.9  Inventory Management Service (backend craft round)

================================================================
1. INTUITION
================================================================
WHAT
  A service that reserves stock for an order, safely, even
  when two people buy the last unit at the same moment.

THE FAILURE THAT DRIVES THE DESIGN
  Two customers buy the last unit in the same millisecond.
  Both read available = 1. Both think it is fine. Both write
  available = 0. I have now sold two units I do not have.
  So I must never read, then think, then write.

FIX 1 - GUARD THE WRITE (optimistic locking)
  The stock row carries a version number. My update says:
      UPDATE stock SET available = ?, version = version + 1
      WHERE sku = ? AND version = <the version I read>
  If someone committed in between, the version no longer
  matches, so 0 rows change. I know I lost the race, and
  nothing was corrupted. Then I retry with fresh data.

FIX 2 - GUARD THE RETRY (idempotency key)
  A different failure: the database commits, then my reply
  is lost on the network. The client retries and reserves
  twice. So I save the result under the client's key, in
  the SAME transaction. A retry finds it and returns the
  same answer instead of doing the work again.

FIX 3 - HANDLE FAILURE PROPERLY
  Retry only transient errors. Back off with jitter. Cap the
  attempts. Send whatever still fails to a dead letter queue.

COST
  One reserve = 1 transaction, a few indexed row reads.
  Retries only happen when two writers hit the same SKU.

================================================================
2. VISUAL EXAMPLE
================================================================
stock: sku-1, available 5, version 7. Two requests arrive.

  time  request A                  request B
  ----  -----------------------    -----------------------
  t1    BEGIN                      BEGIN
  t2    read 5, version 7          read 5, version 7
  t3    UPDATE WHERE version = 7
        1 row changed, v -> 8
  t4    COMMIT
  t5                               UPDATE WHERE version = 7
                                   0 ROWS CHANGED
                                   it lost the race
  t6                               ROLLBACK, sleep a bit
  t7                               retry: read 3, version 8
  t8                               UPDATE WHERE version = 8
                                   1 row. COMMIT.

Without that version check, B would write its own stale
"5 - 2 = 3" over A's work, and one reservation vanishes.

THE OTHER FAILURE - a lost reply, not a lost race

  client -> reserve(key-1) -> DB COMMITS -> reply lost
  client -> reserve(key-1) -> I find key-1 already saved
                           -> return the SAME answer
                           -> stock is not touched again

================================================================
3. SKELETON
================================================================
  reserve(command)
      retry loop. try, sort the error, back off, dead letter
  reserveOnce(tx, command)
      1. idempotency key already used? return that result
      2. read the stock row
      3. not enough? OutOfStockError (do NOT retry)
      4. guarded update. 0 rows -> VersionConflictError
      5. insert the reservation
      6. save the result under the key
  backoff(attempt)   exponential ceiling, random below it
  sleep(ms)

  SHORT SYNTAX
    if (!stock) / if (previous)   null check, no === null
    `only ${n} left`              template literal errors
    map.get(key) ?? null          miss becomes null
    2 ** (attempt - 1)            no Math.pow

================================================================
4. GOTCHAS
================================================================
- RETRY THE WHOLE TRANSACTION, never half of it. A retry
  must RE-READ the row, or it retries with the same stale
  version and fails forever.
- OUT OF STOCK IS NOT RETRYABLE. Waiting does not create
  stock. Only version conflicts and timeouts get retried.
- THE IDEMPOTENCY RECORD MUST COMMIT WITH THE STOCK CHANGE.
  As a separate write it can be lost after the commit, and
  then the retry reserves twice.
- JITTER IS NOT OPTIONAL. Plain backoff makes every client
  retry on the same beat and hit the database together.
- CAP THE ATTEMPTS, then dead letter. And alert on the
  queue depth. A silent dead letter queue is a black hole.
- CHECK (available >= 0) in the schema, so the database is
  the last line of defence if my code has a bug.
*/

type ReserveCommand = {
  idempotencyKey: string; // same key = same intent
  orderId: string;
  sku: string;
  quantity: number;
};

type ReserveResult = {
  status: "RESERVED";
  reservationId: string;
  remaining: number;
};

type StockRow = {
  sku: string;
  available: number;
  version: number; // bumped on every write. This IS the lock.
};

// all of this runs on one connection, so it commits as one
interface Transaction {
  findStock(sku: string): Promise<StockRow | null>;
  // returns rows changed. 0 means the version moved on me.
  updateStock(
    sku: string,
    remaining: number,
    version: number,
  ): Promise<number>;
  addReservation(
    order: string,
    sku: string,
    qty: number,
  ): Promise<string>;
  // both keyed by the client's idempotency key
  findResult(key: string): Promise<ReserveResult | null>;
  saveResult(key: string, result: ReserveResult): Promise<void>;
}

interface Database {
  runInTransaction<T>(
    work: (tx: Transaction) => Promise<T>,
  ): Promise<T>;
}

interface DeadLetterQueue {
  send(command: ReserveCommand, reason: string): Promise<void>;
}

// business failure. The answer will not change on a retry.
class OutOfStockError extends Error {}
// race lost. The answer probably WILL change on a retry.
class VersionConflictError extends Error {}

const MAX_ATTEMPTS = 3;
const BASE_DELAY_MS = 50;
const MAX_DELAY_MS = 2000;

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// full jitter: an exponential ceiling, then a random point
// below it, so a herd of retries spreads out instead of all
// hitting the database at the same instant
const backoff = (attempt: number): number => {
  const ceiling = BASE_DELAY_MS * 2 ** (attempt - 1);
  return Math.random() * Math.min(ceiling, MAX_DELAY_MS);
};

export class InventoryService {
  private readonly db: Database;
  private readonly deadLetters: DeadLetterQueue;

  // passed in, so tests can hand it fakes
  constructor(db: Database, deadLetters: DeadLetterQueue) {
    this.db = db;
    this.deadLetters = deadLetters;
  }

  async reserve(command: ReserveCommand): Promise<ReserveResult> {
    if (command.quantity <= 0) throw new Error("quantity must be > 0");


    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        // the retry wraps the WHOLE transaction, so it re-reads
        return await this.db.runInTransaction((tx) =>
          this.reserveOnce(tx, command),
        );
      } catch (error) {
        // retrying will never create stock, so stop now
        if (error instanceof OutOfStockError) throw error;
        if (attempt === MAX_ATTEMPTS) {
          // park it for a replay job, do not loop forever
          await this.deadLetters.send(command, String(error));
          throw error;
        }
        await sleep(backoff(attempt));
      }
    }
    throw new Error("unreachable");
  }

  // one attempt, already inside a transaction
  private async reserveOnce(
    tx: Transaction,
    command: ReserveCommand,
  ): Promise<ReserveResult> {
    // idempotency first. A client whose reply timed out sends
    // the same key again and must get the same answer.
    const previous = await tx.findResult(command.idempotencyKey);
    if (previous) return previous;

    const stock = await tx.findStock(command.sku);
    if (!stock) throw new OutOfStockError(`no sku ${command.sku}`);
    if (stock.available < command.quantity) {
      throw new OutOfStockError(`only ${stock.available} left`);
    }

    // the guarded write:
    //   UPDATE stock SET available = $1, version = version + 1
    //   WHERE sku = $2 AND version = $3
    // if anyone committed since my read, 0 rows change and I
    // know I lost the race without corrupting anything
    const remaining = stock.available - command.quantity;
    const version = stock.version;
    const rows = await tx.updateStock(command.sku, remaining, version);
    if (rows === 0) throw new VersionConflictError("stock moved");

    const id = await tx.addReservation(
      command.orderId,
      command.sku,
      command.quantity,
    );
    const result: ReserveResult = {
      status: "RESERVED",
      reservationId: id,
      remaining,
    };
    // saved in the SAME transaction as the stock change, or a
    // retry after a commit would reserve twice
    await tx.saveResult(command.idempotencyKey, result);
    return result;
  }
}

// quick check against a fake in-memory database
const stock: StockRow = { sku: "sku-1", available: 5, version: 1 };
const saved = new Map<string, ReserveResult>();
let loseTheRaceOnce = true;

const tx: Transaction = {
  async findStock() { return stock; },
  async updateStock(_sku, remaining, version) {
    // pretend a rival transaction commits first, exactly once
    if (loseTheRaceOnce) {
      loseTheRaceOnce = false;
      stock.version++;
    }
    // this is the WHERE version = ... check
    if (stock.version !== version) return 0;
    stock.available = remaining;
    stock.version++;
    return 1;
  },
  async addReservation(order) { return `res-${order}`; },
  async findResult(key) { return saved.get(key) ?? null; },
  async saveResult(key, result) { saved.set(key, result); },
};

const db: Database = {
  async runInTransaction(work) { return work(tx); },
};

const deadLetters: DeadLetterQueue = {
  async send(command, reason) {
    console.log("dead letter:", command.orderId, reason);
  },
};

const service = new InventoryService(db, deadLetters);
const command: ReserveCommand = {
  idempotencyKey: "key-1",
  orderId: "order-1",
  sku: "sku-1",
  quantity: 2,
};

service.reserve(command).then(async (first) => {
  // RESERVED, remaining 3, after losing one race
  console.log(first);
  // same key, same answer, stock is not touched again
  console.log(await service.reserve(command));
  console.log(stock); // available 3, not 1
});

/*
================================================================
5. SAY OUT LOUD
================================================================
- "The stock update, the reservation row and the idempotency
   record all commit together. Split them and you get a
   reservation with no stock movement."
- "Optimistic vs SELECT ... FOR UPDATE:
     optimistic  - no lock held. Great when conflicts are
                   rare. Costs a retry when they happen.
     FOR UPDATE  - the row is locked for the transaction.
                   Better for one hot SKU in a flash sale,
                   where optimistic retries would spin.
   I would start optimistic and move a hot SKU to
   pessimistic. And always lock rows in the same order, or
   two transactions deadlock."
- "The idempotency key needs a UNIQUE constraint. The
   constraint is the real guard. The SELECT is the fast path."
- "Reservations must expire. If one is never confirmed, a
   sweeper releases the stock, or inventory leaks into
   abandoned carts."
- "To scale: shard by SKU. For a very hot item, split one
   row into N sub-rows and pick one at random, so writers
   stop fighting over a single row."
*/
