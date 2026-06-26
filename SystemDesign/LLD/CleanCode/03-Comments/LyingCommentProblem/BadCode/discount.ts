// ❌ LYING COMMENTS — comments contradict the code (worse than none).
export function applyDiscount(price: number, code: string): number {
  // applies a 10% discount  <-- LIE: it's 20% below
  if (code === "SAVE") return price * 0.8;
  // free shipping for orders over $50  <-- LIE: there is no shipping logic here
  return price;
}
// returns the user's age  <-- LIE: returns the name
export function getInfo(u: { name: string }) { return u.name; }
