// ❌ BAD ERROR HANDLING — returns null on failure; null leaks and explodes later.
export function charge(card: any, amount: number): { id: string } | null {
  if (!card || !card.token) return null;   // silent null
  if (amount <= 0) return null;            // another silent null
  return { id: "ch_123" };
}
const result = charge({ token: null }, 50);
console.log(result.id); // 💥 cannot read 'id' of null, far from the cause
