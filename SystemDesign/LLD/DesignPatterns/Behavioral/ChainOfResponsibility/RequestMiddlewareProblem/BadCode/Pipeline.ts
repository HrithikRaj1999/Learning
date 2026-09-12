// =============================================================================
// WHAT IS WRONG — missing Chain of Responsibility (middleware pipeline)
// =============================================================================
// PATTERN IDEA: a request flows through independent stages (middleware); each
// stage handles its concern and either short-circuits or passes to the next.
//
// WHAT'S WRONG HERE: handleRequest() crams auth, validation, rate-limiting, and
// handling into one function as sequential if-returns. The rate-limit even
// hardcodes an IP. Stages are not separable.
//
// REAL SCENARIO: you need to add a "logging" or "CORS" stage, or move
// rate-limiting before auth, or reuse auth on another endpoint. All require
// editing this function. Each stage's logic (and its config, like the IP list)
// can't be tested or reused in isolation.
//
// WHY BAD: cross-cutting stages are fused into one function; order is fixed in
// code; nothing is reusable or independently testable; config is hardcoded.
//
// HOW TO FIX (no code): model each stage as a middleware handler with a next
// reference (or a list the pipeline iterates). Each calls next() to continue or
// returns a response to short-circuit. Build the pipeline by composing stages;
// reorder/add by changing the composition, not the stages.
// =============================================================================
// ❌ NO CHAIN — request pipeline (auth -> validate -> rate-limit -> handle) is a
// nested if-block. Hard to reorder, hard to add a stage.
export function handleRequest(req: { token?: string; body?: string; ip: string }): string {
  if (!req.token) return "401 unauthorized";           // auth
  if (!req.body) return "400 bad request";             // validation
  if (req.ip === "1.2.3.4") return "429 too many";     // rate limit (hardcoded!)
  return "200 ok: " + req.body;                        // actual handling
}
console.log(handleRequest({ token: "t", body: "hi", ip: "9.9.9.9" }));
