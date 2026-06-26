// ❌ NOT DRY — same logic copy-pasted; fixing a bug means fixing it N times.
export function priceWithTaxUS(p: number) { return p + p * 0.07 + 5; } // +shipping 5
export function priceWithTaxUK(p: number) { return p + p * 0.20 + 5; } // copy, diff rate
export function priceWithTaxDE(p: number) { return p + p * 0.19 + 5; } // copy again

// Validation duplicated in three places (drifts over time):
export function createUser(email: string) {
  if (!email.includes("@") || email.length < 5) throw new Error("bad email");
  return { email };
}
export function updateUser(email: string) {
  if (!email.includes("@") || email.length < 5) throw new Error("bad email"); // dup
  return { email };
}
