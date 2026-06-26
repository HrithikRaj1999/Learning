// ❌ NOT DRY — same email/password checks copy-pasted into 3 endpoints; they
// already drifted (login requires len>=6, register len>=8, reset len>=5).
export function login(email: string, password: string) {
  if (!email.includes("@")) throw new Error("bad email");
  if (password.length < 6) throw new Error("short password");
  return "logged in";
}
export function register(email: string, password: string) {
  if (!email.includes("@")) throw new Error("bad email"); // dup
  if (password.length < 8) throw new Error("short password"); // drifted!
  return "registered";
}
export function reset(email: string, password: string) {
  if (!email.includes("@")) throw new Error("bad email"); // dup
  if (password.length < 5) throw new Error("short password"); // drifted!
  return "reset";
}
