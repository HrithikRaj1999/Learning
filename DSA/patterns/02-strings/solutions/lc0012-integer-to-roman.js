/*
Integer to Roman (LC 12)

Convert a number in [1, 3999] to a roman numeral.

  3     -> "III"
  58    -> "LVIII"      (50 + 5 + 1 + 1 + 1)
  1994  -> "MCMXCIV"    (1000 + 900 + 90 + 4)
*/

// ============================================================
// 1) INTUITION
// ============================================================
/*
- The trick that makes this easy: stop thinking of the six subtractive
  pairs (IV, IX, XL, XC, CD, CM) as special. Put them INTO the value table
  as if they were ordinary symbols worth 4, 9, 40, 90, 400, 900.
- Now the table has 13 entries, sorted from biggest to smallest, and the
  algorithm is plain greedy: take the biggest value that still fits, write
  its symbol, subtract it, repeat.
- Greedy is provably correct here because the table is built so that no
  smaller combination can ever beat a bigger symbol. That is exactly why
  roman numerals include the subtractive forms in the first place - they
  close the gaps (like 4 and 9) that would otherwise break greedy.

- The ladder:
    1. build the numeral digit by digit with four        O(1), fiddly, four
       hardcoded cases per digit position                near-identical blocks
    2. greedy over a 13-entry value table                O(1) time and space
    3. precomputed lookup of thousands/hundreds/tens/    O(1), zero loops
       ones, then concatenate four strings

- Traps:
    - the table must be sorted descending, or greedy takes the wrong symbol.
    - use a WHILE per entry, not an IF - III needs three I's.
    - the range is capped at 3999 because there is no symbol for 5000, so
      MMMM would be needed for 4000.
*/

// ============================================================
// 2) VISUAL EXAMPLE
// ============================================================
/*
GREEDY view, num = 1994

  table (descending)
     1000 M    900 CM   500 D    400 CD   100 C    90 XC
      50 L      40 XL    10 X      9 IX     5 V     4 IV     1 I

  remaining = 1994, out = ""

    1000 fits (1994 >= 1000)  -> out = "M"
                                 remaining = 1994 - 1000 = 994
    1000 fits again? 994 < 1000, no
     900 fits (994 >= 900)    -> out = "MCM"
                                 remaining = 994 - 900 = 94
     500 no, 400 no, 100 no (94 < 100)
      90 fits (94 >= 90)      -> out = "MCMXC"
                                 remaining = 94 - 90 = 4
      50 no, 40 no, 10 no, 9 no, 5 no
       4 fits (4 >= 4)        -> out = "MCMXCIV"
                                 remaining = 4 - 4 = 0
  remaining is 0 -> stop

  answer "MCMXCIV"

  Notice 900 and 4 were taken as single table entries. I never wrote a
  rule about subtraction anywhere.

REPEATED SYMBOL case, num = 3

    1000 no ... 5 no
       1 fits -> out = "I",   remaining = 3 - 1 = 2
       1 fits -> out = "II",  remaining = 2 - 1 = 1
       1 fits -> out = "III", remaining = 1 - 1 = 0
  answer "III"

  This is why each table entry needs a WHILE, not an IF.

SIMPLE case, num = 58

      50 fits -> out = "L",     remaining = 58 - 50 = 8
      40 no, 10 no, 9 no
       5 fits -> out = "LV",    remaining = 8 - 5 = 3
       4 no
       1 fits -> "LVI",  remaining 2
       1 fits -> "LVII", remaining 1
       1 fits -> "LVIII", remaining 0
  answer "LVIII"

  INVARIANT: `remaining` only ever decreases, and the symbols are appended
  in non-increasing value order, which is exactly how roman numerals read.

WHY GREEDY IS SAFE:
  the gaps that would break greedy are 4 (IIII would be needed) and 9
  (VIIII). The table plugs both with IV and IX, and the same at every
  power of ten. With those in place, the largest fitting symbol is always
  part of the shortest correct numeral.
*/

// ============================================================
// 3) BRUTE FORCE - HANDLE EACH DIGIT POSITION BY HAND
// ============================================================
/*
- Split the number into thousands, hundreds, tens, ones, then write four
  near-identical blocks of if/else covering 1-3, 4, 5-8, 9.
    Time  : O(1)   Space : O(1)
- Correct, but it is four copies of the same logic. Worth mentioning as
  the first thing that comes to mind, and then collapsing.
*/
function intToRomanByDigit(num) {
  if (num <= 0) return "";

  const pieces = [];

  pieces.push(digitToRoman(Math.floor(num / 1000), "M", "", ""));
  pieces.push(digitToRoman(Math.floor((num % 1000) / 100), "C", "D", "M"));
  pieces.push(digitToRoman(Math.floor((num % 100) / 10), "X", "L", "C"));
  pieces.push(digitToRoman(num % 10, "I", "V", "X"));

  return pieces.join("");
}

function digitToRoman(digit, one, five, ten) {
  if (digit === 0) return "";
  // 1..3 is just repetition
  if (digit <= 3) return one.repeat(digit);
  // 4 is one-before-five
  if (digit === 4) return one + five;
  // 5..8 is five plus repetition
  if (digit <= 8) return five + one.repeat(digit - 5);
  // 9 is one-before-ten
  return one + ten;
}

// ============================================================
// 4) OPTIMAL - GREEDY OVER A 13-ENTRY TABLE (THE ONE TO WRITE)
// ============================================================
/*
- Put the subtractive forms into the table as ordinary values, sort
  descending, and take the biggest that fits, repeatedly.
    Time  : O(1) - at most 15 symbols are ever emitted
    Space : O(1)
*/
const ROMAN_TABLE = [
  [1000, "M"],
  [900, "CM"],
  [500, "D"],
  [400, "CD"],
  [100, "C"],
  [90, "XC"],
  [50, "L"],
  [40, "XL"],
  [10, "X"],
  [9, "IX"],
  [5, "V"],
  [4, "IV"],
  [1, "I"],
];

function intToRoman(num) {
  if (num <= 0) return "";

  const pieces = [];
  let remaining = num;

  for (let i = 0; i < ROMAN_TABLE.length; i++) {
    const value = ROMAN_TABLE[i][0];
    const symbol = ROMAN_TABLE[i][1];

    // while, not if - "III" needs the same symbol three times
    while (remaining >= value) {
      pieces.push(symbol);
      remaining = remaining - value;
    }
  }

  return pieces.join("");
}

// ============================================================
// 5) BEST - FOUR PRECOMPUTED LOOKUPS, NO LOOP AT ALL
// ============================================================
/*
- The input is capped at 3999, so each of the four digit positions has only
  ten possible strings. Precompute all forty and concatenate.
    Time  : O(1) with no loop   Space : O(1)
- This is the answer when the conversion is on a hot path. It is also a
  nice way to show that a bounded input space can just be tabulated.
*/
const THOUSANDS = ["", "M", "MM", "MMM"];
const HUNDREDS = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM"];
const TENS = ["", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC"];
const ONES = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"];

function intToRomanLookup(num) {
  if (num <= 0) return "";

  return (
    THOUSANDS[Math.floor(num / 1000)] +
    HUNDREDS[Math.floor((num % 1000) / 100)] +
    TENS[Math.floor((num % 100) / 10)] +
    ONES[num % 10]
  );
}

// ============================================================
// QUICK CHECK
// ============================================================
console.log(intToRoman(3)); // "III"     repetition
console.log(intToRoman(58)); // "LVIII"
console.log(intToRoman(1994)); // "MCMXCIV"  two subtractive forms
console.log(intToRoman(4)); // "IV"
console.log(intToRoman(9)); // "IX"
console.log(intToRoman(3999)); // "MMMCMXCIX"  the maximum
console.log(intToRoman(1)); // "I"       the minimum
console.log(intToRoman(0)); // ""        out of range

console.log(intToRomanByDigit(1994)); // "MCMXCIV"
console.log(intToRomanLookup(1994)); // "MCMXCIV"
console.log(intToRomanLookup(3999)); // "MMMCMXCIX"

// round trip against the reverse problem (LC 13) for every legal value
let allMatch = true;
for (let n = 1; n <= 3999; n++) {
  if (intToRoman(n) !== intToRomanLookup(n)) allMatch = false;
  if (intToRoman(n) !== intToRomanByDigit(n)) allMatch = false;
}
console.log(allMatch); // true   all three agree on 1..3999

/*
============================================================
SAY OUT LOUD
============================================================
- COMPLEXITY: O(1) time and space for all three. The input is capped at
  3999, so at most 15 symbols are ever written.
- THE KEY MOVE:
    put IV, IX, XL, XC, CD, CM into the value table as ordinary entries
    worth 4, 9, 40, 90, 400, 900. Then there are no special cases at all -
    it is plain greedy over 13 values.
- WHY GREEDY IS PROVABLY CORRECT HERE:
    greedy fails when a coin system has a gap, like 4 without a 4-coin.
    The subtractive forms exist precisely to close those gaps at every
    power of ten, so the largest fitting symbol is always right.
- THE REAL TRAP:
    using an if instead of a while per table entry. "III" and "MMM" need
    the same symbol repeated up to three times.
- WHY THE RANGE STOPS AT 3999:
    there is no symbol for 5000, so 4000 would need MMMM, which the
    standard notation does not allow.
- FOLLOW-UPS:
    Roman to Integer (LC 13, the reverse - compare each letter with its
    right neighbour), Coin Change (LC 322, where greedy FAILS and DP is
    needed - a good contrast to draw out loud), Integer to English Words
    (LC 273).
*/
