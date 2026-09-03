/*
Roman to Integer (LC 13)

Convert a roman numeral string to a number.
Letters: I=1 V=5 X=10 L=50 C=100 D=500 M=1000
Normally values are written biggest first and added. But six pairs are
written small-then-big and mean subtract: IV IX XL XC CD CM.

  "III"     -> 3     (1+1+1)
  "LVIII"   -> 58    (50+5+1+1+1)
  "MCMXCIV" -> 1994  (1000 + CM 900 + XC 90 + IV 4)
*/

// ============================================================
// 1) INTUITION
// ============================================================
/*
- I do not need to memorise the six subtract pairs. There is one rule that
  covers all of them:
      if a letter is SMALLER than the letter to its right, subtract it,
      otherwise add it.
- Why that works: roman numerals are written in non-increasing order by
  design. A smaller value sitting to the LEFT of a bigger one is exactly
  the subtractive notation, and nothing else ever produces that shape.
- So one left-to-right pass with a peek at the next character is enough.

- The ladder:
    1. scan for the six two-letter pairs first, then    O(n) but fiddly
       add the leftovers
    2. left to right, compare with the NEXT letter      O(n) time, O(1) space
    3. right to left, compare with the RUNNING MAX      O(n), no peek needed

- Traps:
    - the last character has no neighbour to the right; it is always added.
    - do not "fix up" pairs by string replacement - it is slower and easy
      to get wrong.
*/

// ============================================================
// 2) VISUAL EXAMPLE
// ============================================================
/*
LOOK RIGHT view, s = "MCMXCIV"

  index    0    1    2    3    4    5    6
  char     M    C    M    X    C    I    V
  value 1000  100 1000   10  100    1    5

  i=0  M=1000, next C=100.   1000 >= 100 -> ADD      total = 0 + 1000 = 1000
  i=1  C=100,  next M=1000.  100 < 1000  -> SUBTRACT total = 1000 - 100 = 900
  i=2  M=1000, next X=10.    1000 >= 10  -> ADD      total = 900 + 1000 = 1900
  i=3  X=10,   next C=100.   10 < 100    -> SUBTRACT total = 1900 - 10 = 1890
  i=4  C=100,  next I=1.     100 >= 1    -> ADD      total = 1890 + 100 = 1990
  i=5  I=1,    next V=5.     1 < 5       -> SUBTRACT total = 1990 - 1 = 1989
  i=6  V=5,    no next       -> ADD                  total = 1989 + 5 = 1994

  answer 1994

  Notice CM became -100 then +1000 = 900, and IV became -1 then +5 = 4.
  The pairs fall out of the rule; I never special-cased them.

  INVARIANT: a value is subtracted exactly when a strictly larger value
  sits immediately to its right.

RIGHT TO LEFT view, s = "LVIII"   (no peeking needed)

  walk backwards, remember the biggest value seen so far

  i=4  I=1   biggest = 0,  1 >= 0 -> add   total = 1,  biggest = 1
  i=3  I=1   1 >= 1 -> add                 total = 2,  biggest = 1
  i=2  I=1   1 >= 1 -> add                 total = 3,  biggest = 1
  i=1  V=5   5 >= 1 -> add                 total = 8,  biggest = 5
  i=0  L=50  50 >= 5 -> add                total = 58, biggest = 50

  answer 58

SIMPLE case, s = "III"
  every letter is 1 and the next is also 1, so 1 >= 1 -> add each time
  total = 1 + 1 + 1 = 3
*/

// ============================================================
// 3) BRUTE FORCE - HANDLE THE SIX PAIRS EXPLICITLY
// ============================================================
/*
- Look for a two-letter subtractive pair; if found, take its value and
  jump two. Otherwise take the single letter.
    Time  : O(n)   Space : O(1)
- Correct but it hardcodes six special cases. Say it, then replace all six
  with one comparison.
*/
const ROMAN_VALUE = new Map([
  ["I", 1],
  ["V", 5],
  ["X", 10],
  ["L", 50],
  ["C", 100],
  ["D", 500],
  ["M", 1000],
]);

const SUBTRACTIVE_PAIRS = new Map([
  ["IV", 4],
  ["IX", 9],
  ["XL", 40],
  ["XC", 90],
  ["CD", 400],
  ["CM", 900],
]);

function romanToIntPairs(s) {
  if (s.length === 0) return 0;

  let total = 0;
  let i = 0;

  while (i < s.length) {
    const pair = s.slice(i, i + 2);

    if (SUBTRACTIVE_PAIRS.has(pair)) {
      // a two-letter token - consume both characters
      total = total + SUBTRACTIVE_PAIRS.get(pair);
      i = i + 2;
    } else {
      total = total + ROMAN_VALUE.get(s[i]);
      i++;
    }
  }

  return total;
}

// ============================================================
// 4) BETTER - RIGHT TO LEFT, COMPARE WITH THE RUNNING MAX
// ============================================================
/*
- Walking backwards, a letter is subtractive exactly when it is smaller
  than the largest value already seen to its right.
    Time  : O(n)   Space : O(1)
- No lookahead at all, which makes it nice for a stream read in reverse.
*/
function romanToIntBackward(s) {
  if (s.length === 0) return 0;

  let total = 0;
  let biggestSoFar = 0;

  for (let i = s.length - 1; i >= 0; i--) {
    const value = ROMAN_VALUE.get(s[i]);

    if (value < biggestSoFar) {
      // something larger sits to my right, so I am a subtractive prefix
      total = total - value;
    } else {
      total = total + value;
      biggestSoFar = value;
    }
  }

  return total;
}

// ============================================================
// 5) OPTIMAL - LEFT TO RIGHT, PEEK AT THE NEXT LETTER
// ============================================================
/*
- One rule replaces all six special cases: smaller-before-bigger subtracts.
    Time  : O(n)   Space : O(1)
*/
function romanToInt(s) {
  if (s.length === 0) return 0;

  let total = 0;

  for (let i = 0; i < s.length; i++) {
    const value = ROMAN_VALUE.get(s[i]);
    // the last character has no right neighbour, so treat it as 0
    const nextValue = i + 1 < s.length ? ROMAN_VALUE.get(s[i + 1]) : 0;

    if (value < nextValue) {
      // smaller value written before a larger one means subtract
      total = total - value;
    } else {
      total = total + value;
    }
  }

  return total;
}

// ============================================================
// QUICK CHECK
// ============================================================
console.log(romanToInt("III")); // 3
console.log(romanToInt("LVIII")); // 58
console.log(romanToInt("MCMXCIV")); // 1994
console.log(romanToInt("IV")); // 4     pure subtractive
console.log(romanToInt("MMMCMXCIX")); // 3999  largest legal numeral
console.log(romanToInt("")); // 0     empty

console.log(romanToIntPairs("MCMXCIV")); // 1994
console.log(romanToIntBackward("MCMXCIV")); // 1994
console.log(romanToIntBackward("LVIII")); // 58

/*
============================================================
SAY OUT LOUD
============================================================
- COMPLEXITY: all three are O(n) time and O(1) space. The difference is how
  much special-casing I write.
- THE ONE RULE:
    subtract when a letter is smaller than the letter on its right, else
    add. That single line covers IV IX XL XC CD CM with no table of pairs.
- WHY THAT RULE IS COMPLETE:
    valid roman numerals are non-increasing except for the subtractive
    prefixes, so "smaller sits left of bigger" happens if and only if the
    numeral is subtractive.
- THE REAL TRAP:
    the final character has no right neighbour. Treating the missing value
    as 0 makes it fall into the ADD branch automatically - no special case.
- WHAT I WOULD ASK:
    "is the input guaranteed valid?" This code trusts the input; validating
    a numeral (no IIII, no IL) is a separate and much longer problem.
- FOLLOW-UPS:
    Integer to Roman (LC 12, the reverse - greedy over a value table),
    String to Integer / atoi (LC 8), Excel Sheet Column Number (LC 171).
*/
