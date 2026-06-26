// ❌ NO CHAIN — request pipeline (auth -> validate -> rate-limit -> handle) is a
// nested if-block. Hard to reorder, hard to add a stage.
export function handleRequest(req: { token?: string; body?: string; ip: string }): string {
  if (!req.token) return "401 unauthorized";           // auth
  if (!req.body) return "400 bad request";             // validation
  if (req.ip === "1.2.3.4") return "429 too many";     // rate limit (hardcoded!)
  return "200 ok: " + req.body;                        // actual handling
}
console.log(handleRequest({ token: "t", body: "hi", ip: "9.9.9.9" }));
