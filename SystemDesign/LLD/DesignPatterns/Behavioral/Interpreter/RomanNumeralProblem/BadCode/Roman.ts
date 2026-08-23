// =============================================================================
// WHAT IS WRONG — missing Interpreter / rule-object structure
// =============================================================================
// PATTERN IDEA: represent each symbol rule (value + numeral) as a small,
// named entity the algorithm walks, instead of magic parallel arrays inline.
//
// WHAT'S WRONG HERE: toRoman() crams all symbol rules into two parallel arrays
// (vals/syms) that must stay index-aligned, driven by a bare while loop. The
// "grammar" of roman numerals is implicit and easy to corrupt.
//
// REAL SCENARIO: someone edits vals but forgets the matching index in syms — now
// 900 maps to the wrong numeral, a silent correctness bug. Adding a different
// numeral system (or validating input) means untangling this loop. The rules
// aren't first-class, so they can't be tested or reused individually.
//
// WHY BAD: index-aligned parallel arrays are fragile and order-coupled; the
// conversion grammar is buried in loop mechanics; hard to extend or verify.
//
// HOW TO FIX (no code): model each rule as a (value, symbol) pair object in one
// ordered list, and an interpreter that consumes the number against those rule
// objects. Symbols and values can't drift apart; rules are explicit data you can
// validate, reorder, or swap for another numeral system.
// =============================================================================
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
