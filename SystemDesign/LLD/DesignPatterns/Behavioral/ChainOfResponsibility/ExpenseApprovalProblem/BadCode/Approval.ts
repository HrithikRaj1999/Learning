// =============================================================================
// WHAT IS WRONG — missing Chain of Responsibility pattern
// =============================================================================
// PATTERN IDEA: a request travels along a chain of handlers; each handler either
// handles it or passes it to the next. Approvers (TeamLead -> Manager -> ...) are
// independent links you can add, remove, or reorder.
//
// WHAT'S WRONG HERE: approve() is one if/else ladder with every tier limit
// hardcoded in a single function. All approval levels and their thresholds are
// welded together.
//
// REAL SCENARIO: finance adds a new "Senior Manager" tier between Manager and
// Director, or raises the Director limit. You must edit this function and risk
// the other tiers. Each approver's rule (limit, who they are, side effects like
// notifying them) can't live with that approver — it's all in one blob. Can't
// reuse the Manager rule in another flow either.
//
// WHY BAD: adding/reordering tiers = editing tested code; thresholds and routing
// are tangled; no per-handler isolation or reuse.
//
// HOW TO FIX (no code): model each approver as a Handler with its own limit and
// a reference to the next handler. handle(amount) approves if within its limit,
// else delegates to next. Build the chain by linking handlers; adding a tier =
// insert a new link, existing handlers untouched.
// =============================================================================
// ❌ NO CHAIN — expense approval routed by an if/else ladder on amount tiers.
// New tier or reordered limits => edit this function.
export function approve(amount: number): string {
  if (amount <= 100) return "Team Lead approved " + amount;
  else if (amount <= 1000) return "Manager approved " + amount;
  else if (amount <= 10000) return "Director approved " + amount;
  else if (amount <= 100000) return "VP approved " + amount;
  else return "Board must approve " + amount; // limits hardcoded in one blob
}
console.log(approve(5000));
