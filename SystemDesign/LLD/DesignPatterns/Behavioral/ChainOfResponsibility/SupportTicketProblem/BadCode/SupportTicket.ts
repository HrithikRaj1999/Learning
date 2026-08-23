// =============================================================================
// WHAT IS WRONG — missing Chain of Responsibility pattern
// =============================================================================
// PATTERN IDEA: a request passes along a chain of handlers (Bot -> Junior ->
// Senior -> Manager); each handles what it can or escalates to the next.
//
// WHAT'S WRONG HERE: handleTicket() is one if/else ladder mapping level->handler.
// Escalation order and every tier live in a single function.
//
// REAL SCENARIO: add a "Tier-2 specialist" between Junior and Senior, or change
// who handles level 3. You edit this method and risk the other branches. Each
// handler's behavior (and any side effects, like assigning the ticket) can't be
// owned by that handler or reused elsewhere.
//
// WHY BAD: routing + every handler are coupled in one place; adding/reordering
// tiers edits tested code; no per-handler isolation.
//
// HOW TO FIX (no code): each support tier becomes a Handler with a next link.
// handle(ticket) resolves it if within scope, else delegates to next. Compose
// the chain Bot->Junior->Senior->Manager. New tier = insert a link; the rest
// stays untouched.
// =============================================================================
// ❌ NO CHAIN OF RESPONSIBILITY — one giant if/else decides who handles a
// request. Adding a tier edits this method; ordering logic is hardcoded.

export function handleTicket(level: number, issue: string): string {
  if (level <= 1) {
    return "Bot handled: " + issue;
  } else if (level === 2) {
    return "Junior agent handled: " + issue;
  } else if (level === 3) {
    return "Senior agent handled: " + issue;
  } else if (level === 4) {
    return "Manager handled: " + issue;
  } else {
    return "Unhandled: " + issue; // grows with every new tier
  }
}
console.log(handleTicket(3, "refund dispute"));
