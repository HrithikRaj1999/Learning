/*
Reverse Words in a String (LC 151)

Reverse the ORDER of the words. Words keep their own spelling.
Strip leading, trailing, and repeated spaces from the answer.

  "the sky is blue"     -> "blue is sky the"
  "  hello world  "     -> "world hello"     (edges trimmed)
  "a good   example"    -> "example good a"  (inner runs collapsed to one)
*/

// ============================================================
// 1) INTUITION
// ============================================================
/*
- Two separate jobs: find the words, then emit them backwards.
- Finding words is a scan: skip spaces, then read until the next space.
  That naturally deletes every extra space with no special cases.
- Emitting backwards is either a reversed loop, or the classic in-place
  trick used when the input is a mutable char array:
        reverse the WHOLE string, then reverse each word back
  Reversing twice puts the words in the new order but restores each word's
  own spelling.

- The ladder:
    1. split on spaces, filter empties, reverse, join   O(n) time, O(n) space
    2. scan for words right to left, append              O(n) time, O(n) space
    3. reverse whole, reverse each word, squeeze spaces  O(n) time, O(1)
       extra IF the input is a mutable array

- Traps:
    - "a  b".split(" ") gives ["a","","b"] - the empty string must be
      filtered or it becomes a phantom word.
    - multiple inner spaces must collapse to exactly one.
    - in JavaScript a string is immutable, so genuine O(1) space is not
      possible; I would say that and show the char-array version.
*/

// ============================================================
// 2) VISUAL EXAMPLE
// ============================================================
/*
SCAN FROM THE RIGHT view, s = "  hello world  "

  index    0  1  2  3  4  5  6  7  8  9 10 11 12 13 14
  char    ' ' ' ' h  e  l  l  o ' ' w  o  r  l  d ' ' ' '

  i = 14
    skip trailing spaces: i goes 14 -> 13 -> 12 (s[12] = 'd', not a space)
    the word ENDS at 12. Walk left while not a space:
        i: 12 'd', 11 'l', 10 'r', 9 'o', 8 'w', 7 ' ' -> stop
    the word runs from i+1 = 8 to end = 12  ->  "world"
    out = ["world"],  i = 7

  i = 7
    skip spaces: i = 7 is a space -> i = 6 (s[6] = 'o')
    word ends at 6. Walk left: 6 'o', 5 'l', 4 'l', 3 'e', 2 'h', 1 ' ' stop
    word runs from 2 to 6  ->  "hello"
    out = ["world","hello"],  i = 1

  i = 1
    skip spaces: 1 is a space -> 0 is a space -> i = -1, loop ends

  join with one space -> "world hello"

  INVARIANT: every character is visited at most twice (once skipping
  spaces, once reading a word), so the scan is linear.

DOUBLE REVERSE view, s = "a good example" as a char array

  original          a _ g o o d _ e x a m p l e
  reverse all       e l p m a x e _ d o o g _ a
                    ^^^^^^^^^       ^^^^^^   ^
                    the word ORDER is now right, but each word is spelled
                    backwards

  reverse each word back, one at a time:
      "elpmaxe" -> "example"
      "doog"    -> "good"
      "a"       -> "a"

  result            e x a m p l e _ g o o d _ a   ->  "example good a"

  Two reversals cancel inside each word but not between words - that is
  the whole trick.

EMPTY SPLIT TRAP, s = "a  b"
    "a  b".split(" ")  ->  ["a", "", "b"]
                                ^
                                a phantom empty word between the two spaces
    filtering it out is mandatory, or the answer gains a stray space.
*/

// ============================================================
// 3) BRUTE FORCE - SPLIT, FILTER, REVERSE, JOIN
// ============================================================
/*
- Let the library do the splitting, then throw away the empty pieces.
    Time  : O(n)   Space : O(n)
- One line of real logic and always correct. The honest first answer.
*/
function reverseWordsSplit(s) {
  if (s.length === 0) return "";

  const pieces = s.split(" ");
  const words = [];

  for (let i = 0; i < pieces.length; i++) {
    // consecutive spaces produce empty pieces - drop them
    if (pieces[i].length > 0) words.push(pieces[i]);
  }

  words.reverse();
  return words.join(" ");
}

// ============================================================
// 4) BETTER - SCAN FROM THE RIGHT, NO SPLIT AT ALL
// ============================================================
/*
- Walk backwards. Skip spaces, then read a whole word, then append it.
  No intermediate array of pieces, no filtering step.
    Time  : O(n)   Space : O(n) for the output only
- This is the version to write when the interviewer says "no split()".
*/
function reverseWords(s) {
  if (s.length === 0) return "";

  const words = [];
  let i = s.length - 1;

  while (i >= 0) {
    // step over any run of spaces
    while (i >= 0 && s[i] === " ") i--;
    if (i < 0) break;

    // the word ends here; walk left to find where it starts
    const end = i;
    while (i >= 0 && s[i] !== " ") i--;

    // i now sits on the space before the word, so the word starts at i+1
    words.push(s.slice(i + 1, end + 1));
  }

  return words.join(" ");
}

// ============================================================
// 5) OPTIMAL - REVERSE ALL, REVERSE EACH WORD, SQUEEZE
// ============================================================
/*
- The in-place algorithm, written on a char array because JavaScript
  strings cannot be mutated.
    Time  : O(n)   Space : O(1) extra beyond the char array itself
- This is what the follow-up "do it in O(1) space" is asking for, and it is
  the answer in C, C++, or Java where the input is char[].
*/
function reverseWordsInPlace(s) {
  if (s.length === 0) return "";

  const chars = s.split("");

  // step 1: collapse spaces and trim, compacting into the front of chars
  const length = squeezeSpaces(chars);

  // step 2: reverse everything - the word ORDER is now correct
  reverseRange(chars, 0, length - 1);

  // step 3: reverse each word back so its own spelling is restored
  let start = 0;
  for (let i = 0; i <= length; i++) {
    if (i === length || chars[i] === " ") {
      reverseRange(chars, start, i - 1);
      start = i + 1;
    }
  }

  return chars.slice(0, length).join("");
}

function squeezeSpaces(chars) {
  let write = 0;
  let read = 0;

  while (read < chars.length) {
    // skip any run of spaces before a word
    while (read < chars.length && chars[read] === " ") read++;
    if (read >= chars.length) break;

    // separate this word from the previous one with exactly one space
    if (write > 0) {
      chars[write] = " ";
      write++;
    }

    while (read < chars.length && chars[read] !== " ") {
      chars[write] = chars[read];
      write++;
      read++;
    }
  }

  return write;
}

function reverseRange(chars, left, right) {
  while (left < right) {
    const swap = chars[left];
    chars[left] = chars[right];
    chars[right] = swap;
    left++;
    right--;
  }
}

// ============================================================
// QUICK CHECK
// ============================================================
console.log(reverseWords("the sky is blue")); // "blue is sky the"
console.log(reverseWords("  hello world  ")); // "world hello"
console.log(reverseWords("a good   example")); // "example good a"
console.log(reverseWords("")); // ""       empty
console.log(reverseWords("   ")); // ""       spaces only
console.log(reverseWords("word")); // "word"   single

console.log(reverseWordsSplit("a good   example")); // "example good a"
console.log(reverseWordsInPlace("a good   example")); // "example good a"
console.log(reverseWordsInPlace("  hello world  ")); // "world hello"
console.log(reverseWordsInPlace("   ")); // ""

/*
============================================================
SAY OUT LOUD
============================================================
- COMPLEXITY:
    split + filter    O(n) time, O(n) space
    scan from right   O(n) time, O(n) output only
    double reverse    O(n) time, O(1) extra on a mutable char array
- WHY DOUBLE REVERSE WORKS:
    reversing the whole string fixes the ORDER of the words but breaks the
    spelling of each. Reversing each word again undoes the second effect
    without touching the first. Two reversals cancel locally, not globally.
- THE REAL TRAP:
    split(" ") on consecutive spaces produces empty strings. Either filter
    them, or split on a whitespace regex, or scan manually as I do above.
- WHY JAVASCRIPT CANNOT REALLY DO O(1):
    strings are immutable, so any answer allocates at least the output.
    I would say that explicitly and show the char-array version, which IS
    O(1) extra in C++ or Java.
- FOLLOW-UPS:
    Reverse Words in a String II (LC 186, input is already char[] so the
    in-place version is required), Reverse Words in a String III (LC 557,
    reverse each word but keep the order), Rotate Array (LC 189, the same
    triple-reverse trick).
*/
