/*
Q3.9  Inventory Management Service (Backend Craft Round)

================================================================
1. DATA STRUCTURE NEEDED & WHY (Simple Explanation)
================================================================
- DATA STRUCTURE: Transactional Service with Optimistic Concurrency Control (Version field on Stock Row) + Idempotency Store.
- WHY: Prevents double-selling / race conditions when two customers buy the last item simultaneously!
  Never read-then-write without guarding against concurrent updates.

================================================================
2. INTUITION (What I am thinking to tell to interviewer)
================================================================
- "Race condition: 2 clients read `available = 1` concurrently. Both write `available = 0`, selling 2 units when only 1 exists."
- "FIX 1: Optimistic Locking (`version` column). Guarded SQL update: `UPDATE stock SET available = $1, version = version + 1 WHERE sku = $2 AND version = $3`. If 0 rows updated, we lost the race -> abort transaction and retry!"
- "FIX 2: Idempotency Key. Network drops response after DB commits -> client retries request. Storing result under `idempotencyKey` in the SAME transaction returns saved result without re-deducting stock."
- "FIX 3: Exponential Backoff with Full Jitter. Spreads out retries so concurrent writers don't thrasher database simultaneously."
- "FIX 4: Non-retryable Error distinction (Out of stock is permanent; version conflict is transient)."

================================================================
3. STEPS TO SOLVE & ALGORITHM SKELETON (In Words)
================================================================
- reserve(command): Retry Loop (up to MAX_ATTEMPTS = 3).
    1. Wrap `reserveOnce(tx, command)` inside `db.runInTransaction()`.
    2. Catch error: If `OutOfStockError`, THROW IMMEDIATELY (waiting won't generate stock!).
    3. If `attempt === MAX_ATTEMPTS`, send command to `DeadLetterQueue` and throw.
    4. Sleep with `backoff(attempt)` (Exponential delay with Full Jitter).
- reserveOnce(tx, command):
    1. Check `tx.findResult(command.idempotencyKey)`. If existing result found, return it immediately (Idempotency check).
    2. Read stock row: `tx.findStock(command.sku)`.
    3. If missing or `stock.available < command.quantity`, throw `OutOfStockError`.
    4. Attempt guarded update: `tx.updateStock(sku, remaining, version)`.
    5. If returned rows === 0, throw `VersionConflictError` (triggers transaction retry).
    6. Record reservation: `tx.addReservation()`.
    7. Save result into idempotency store: `tx.saveResult(key, result)` IN THE SAME TRANSACTION.

SHORT SYNTAX TRICKS:
  const ceiling = BASE_DELAY_MS * 2 ** (attempt - 1); // Exponential ceiling
  Math.random() * Math.min(ceiling, MAX_DELAY_MS);    // Full Jitter backoff

================================================================
4. TIME & SPACE COMPLEXITY
================================================================
- TIME COMPLEXITY:
    - Normal path: O(1) indexed SQL reads/writes inside 1 transaction.
    - Contended path: Retries up to MAX_ATTEMPTS (Exponential backoff bounded by MAX_DELAY_MS).
- SPACE COMPLEXITY: O(1) in memory; O(Orders) storage for Idempotency log & Reservation records.

================================================================
5. VISUAL DIAGRAM
================================================================
Optimistic Locking Timeline (Stock: 5 available, Version: 7):

  Time  Client Request A                    Client Request B
  t1    BEGIN TX                            BEGIN TX
  t2    Read stock (5, v7)                  Read stock (5, v7)
  t3    UPDATE WHERE v=7 -> 1 row updated!
        Stock = 3, Version = 8
  t4    COMMIT TX
  t5                                        UPDATE WHERE v=7 -> 0 ROWS UPDATED!
                                            (Race lost! v7 is stale!)
  t6                                        ROLLBACK TX, Sleep backoff(1)
  t7                                        Retry: BEGIN TX
  t8                                        Read fresh stock (3, v8)
  t9                                        UPDATE WHERE v=8 -> 1 row updated! COMMIT!

Idempotency Guard (Lost Network Response):
  Client -> reserve(key-1) -> DB COMMITS TX -> Network drops response
  Client -> reserve(key-1) -> DB finds key-1 saved -> Returns saved result! (Stock unchanged!)

================================================================
6. KEY GOTCHAS & THINGS TO SAY OUT LOUD
================================================================
- RETRY WHOLE TRANSACTION: Never retry half the steps! Retry MUST restart transaction to fetch fresh version number!
- DO NOT RETRY OUT-OF-STOCK: OutOfStock is a business domain error (waiting does not replenish stock).
- COMMIT IDEMPOTENCY RECORD IN SAME TRANSACTION: If saved in a separate write, network failure after stock commit causes duplicate deductions.
- OPTIMISTIC VS PESSIMISTIC (`SELECT ... FOR UPDATE`): Use Optimistic when conflicts are low; switch to Pessimistic (`FOR UPDATE`) for flash sales with extreme single-SKU contention.
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
