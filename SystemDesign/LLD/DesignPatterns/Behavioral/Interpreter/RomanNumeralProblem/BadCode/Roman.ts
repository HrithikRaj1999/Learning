// ❌ NO INTERPRETER — roman numeral conversion as one tangled loop with magic
// arrays inline; hard to extend or reason about per-symbol rules.
export function toRoman(n: number): string {
  let result = "";
  // all symbol rules crammed into parallel arrays + a while loop
  const vals = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  const syms = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"];
  for (let i = 0; i < vals.length; i++) {
    while (n >= vals[i]) { result += syms[i]; n -= vals[i]; }
  }
  return result;
}
console.log(toRoman(1994));
