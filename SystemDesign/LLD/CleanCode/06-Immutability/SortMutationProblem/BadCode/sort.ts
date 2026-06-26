// ❌ MUTATION — Array.sort()/reverse() mutate in place; caller's array reorders
// behind its back (a real, common surprise).
export function topThree(scores: number[]): number[] {
  return scores.sort((a, b) => b - a).slice(0, 3); // 🐛 sort() mutates `scores`
}
const original = [5, 1, 9, 3];
topThree(original);
console.log(original); // [9,5,3,1] -> caller's array silently reordered
