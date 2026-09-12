/*
Q3.9  Inventory Management Service (Backend Craft Round)

============================================================
1. DATA STRUCTURE NEEDED & WHY (Simple Explanation)
============================================================
- DATA STRUCTURE:
    Service with Optimistic Concurrency Control (`version` column)
    + Idempotency Store.
- WHY WE NEED IT:
    Prevents double-selling / race conditions when two customers
    buy the last unit simultaneously! Never read-then-write
    without guarding against concurrent updates.

============================================================
2. INTUITION (What I am thinking to tell interviewer)
============================================================
- "Race condition: 2 clients read `available = 1` concurrently.
   Both write `available = 0`, selling 2 units when only 1 exists."
- "FIX 1: Optimistic Locking (`version` column). Guarded update:
   `UPDATE stock SET available = $1, version = version + 1
    WHERE sku = $2 AND version = $3`. If 0 rows updated, lost
   the race -> abort transaction and retry!"
- "FIX 2: Idempotency Key. Network drops reply after DB commits ->
   client retries request. Storing result under `idempotencyKey`
   in SAME transaction returns saved result without re-deducting."
- "FIX 3: Exponential Backoff + Full Jitter spreads out retries."
- "FIX 4: OutOfStock is non-retryable; version conflict is."

============================================================
3. STEPS TO SOLVE & ALGORITHM SKELETON (In Words)
============================================================
- reserve(command): Retry loop (MAX_ATTEMPTS = 3).
    1. Wrap `reserveOnce(tx, command)` inside `runInTransaction()`.
    2. Catch error: If `OutOfStockError`, THROW IMMEDIATELY!
    3. If `attempt === MAX_ATTEMPTS`, send to DLQ and throw.
    4. Sleep `backoff(attempt)` (Exponential + Full Jitter).
- reserveOnce(tx, command):
    1. `tx.findResult(key)` -> return saved result if present.
    2. Read `stock = tx.findStock(sku)`.
    3. If missing or `stock.available < qty`, throw `OutOfStock`.
    4. `rows = tx.updateStock(sku, remaining, version)`.
    5. If `rows === 0`, throw `VersionConflictError` (triggers retry).
    6. Record `tx.addReservation()`.
    7. `tx.saveResult(key, result)` IN SAME TRANSACTION.

SHORT SYNTAX TRICKS:
  const ceiling = BASE_DELAY_MS * 2 ** (attempt - 1);
  Math.random() * Math.min(ceiling, MAX_DELAY_MS); // Full Jitter

============================================================
4. TIME & SPACE COMPLEXITY
============================================================
- TIME COMPLEXITY:
    - Normal path    : O(1) indexed SQL ops in 1 transaction.
    - Contended path : Retries up to MAX_ATTEMPTS with jitter.
- SPACE COMPLEXITY:
    - O(1) in-memory; O(Orders) storage for Idempotency log.

============================================================
5. VISUAL DIAGRAM
============================================================
Optimistic Locking Timeline (Stock: 5 available, Version: 7):

  Time  Client Request A          Client Request B
  t1    BEGIN TX                  BEGIN TX
  t2    Read stock (5, v7)        Read stock (5, v7)
  t3    UPDATE WHERE v=7
        Stock=3, Version=8
  t4    COMMIT TX
  t5                              UPDATE WHERE v=7 -> 0 ROWS!
                                  (Race lost!)
  t6                              ROLLBACK TX, Sleep backoff(1)
  t7                              Retry: BEGIN TX
  t8                              Read fresh stock (3, v8)
  t9                              UPDATE WHERE v=8 -> 1 ROW! COMMIT!

Idempotency Guard:
  Client -> reserve(key-1) -> DB COMMITS TX -> Network drops response
  Client -> reserve(key-1) -> DB finds key-1 -> Returns saved result!

============================================================
6. KEY GOTCHAS & THINGS TO SAY OUT LOUD
============================================================
- RETRY WHOLE TRANSACTION: Re-read fresh version on retry!
- DO NOT RETRY OUT-OF-STOCK: OutOfStock is a domain error.
- COMMIT IDEMPOTENCY RECORD IN SAME TRANSACTION: Saved
  separately, post-commit failure causes duplicate reserves.
- OPTIMISTIC VS PESSIMISTIC (`FOR UPDATE`): Optimistic for low
  contention; Pessimistic (`FOR UPDATE`) for flash sales.
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

