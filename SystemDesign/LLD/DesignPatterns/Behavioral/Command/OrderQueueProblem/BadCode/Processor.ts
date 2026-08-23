// =============================================================================
// WHAT IS WRONG — missing Command pattern
// =============================================================================
// PATTERN IDEA: wrap each action as a Command object (an "execute" you can pass
// around). Once actions are objects, you can queue, persist, retry, log, or
// replay them uniformly.
//
// WHAT'S WRONG HERE: process() calls ship() and invoice() directly and
// immediately. The actions are method calls, not objects, so there is nothing to
// defer, store, or replay.
//
// REAL SCENARIO: orders spike and you want to QUEUE work to process later, RETRY
// a failed shipment, or REPLAY commands after a crash from a log. None of that is
// possible because the actions exist only as inline calls. Adding "send receipt"
// means editing this function again.
//
// WHY BAD: behavior isn't reified, so cross-cutting features (queue/retry/audit/
// undo) have nothing to operate on; every new action edits the processor.
//
// HOW TO FIX (no code): model each action (ShipCommand, InvoiceCommand) as a
// Command with execute(). A queue/invoker holds a list of commands and runs
// them — enabling batching, retry, persistence, and logging in one place.
// Adding an action = a new command class.
// =============================================================================
// ❌ NO COMMAND — order actions executed immediately + inline. Can't queue,
// retry, schedule, or log them uniformly.
class Warehouse { ship(id: string) { return "shipped " + id; } }
class Billing { invoice(id: string) { return "invoiced " + id; } }

export function process(id: string): string[] {
  // direct calls; no way to defer, batch, persist, or replay on crash
  return [new Warehouse().ship(id), new Billing().invoice(id)];
}
console.log(process("ORD-9"));
