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
