/*
Encode and Decode Strings (LC 271)

Turn a list of strings into ONE string, and turn it back, losslessly.
Any character may appear inside the strings, including whatever I might
want to use as a separator.

  ["hello","world"]   -> encode -> decode -> ["hello","world"]
  ["","",""]          -> must survive (three empty strings, not zero)
  ["a#b","c"]         -> must survive (the '#' inside the data)
*/

// ============================================================
// 1) INTUITION
// ============================================================
/*
- The naive idea is to join with a separator like "#". It breaks the
  moment a string CONTAINS "#". There is no character I can reserve,
  because the input may contain any character.
- So I must not rely on a special character at all. Instead I say up front
  how long the next piece is:
        <length>#<raw bytes>
  The '#' here is safe because I never search for it - I read digits until
  the first '#', and then take exactly that many characters blindly.
- That is length-prefixed framing, the same idea as HTTP Content-Length.

- The ladder:
    1. join with a rare separator          O(n) but WRONG on real data
    2. escape the separator inside data    O(n), correct but fiddly
    3. length prefix, then raw bytes       O(n), correct and simple

- Traps:
    - the empty list encodes to "" and must decode back to [], while
      [""] encodes to "0#" and decodes to one empty string. Different!
    - decode must take the substring by COUNT, never by searching.
    - multi-digit lengths must work ("12#hello world!").
*/

// ============================================================
// 2) VISUAL EXAMPLE
// ============================================================
/*
ENCODE, strs = ["hello","world"]

  "hello"  length 5  ->  "5#hello"
  "world"  length 5  ->  "5#world"
  joined   ->  "5#hello5#world"

DECODE, s = "5#hello5#world"

  index    0  1  2  3  4  5  6  7  8  9 10 11 12 13
  char     5  #  h  e  l  l  o  5  #  w  o  r  l  d

  i = 0
    read digits from 0 until '#':  "5"  -> length 5, '#' sits at index 1
    the word starts at 1 + 1 = 2 and ends at 2 + 5 = 7
    take s[2..6] = "hello"          out = ["hello"]
    i = 7
  i = 7
    read digits from 7 until '#':  "5"  -> length 5, '#' sits at index 8
    word runs from 9 to 9 + 5 = 14
    take s[9..13] = "world"         out = ["hello","world"]
    i = 14 == s.length -> stop

  answer ["hello","world"]

THE CASE A SEPARATOR BREAKS, strs = ["a#b","c"]

  naive join with '#'  ->  "a#b#c"
  decode by splitting on '#'  ->  ["a","b","c"]   WRONG, 3 pieces not 2

  length prefix        ->  "3#a#b1#c"
  decode: digits "3", '#' at index 1, take 3 chars from index 2 -> "a#b"
          i = 5, digits "1", '#' at 6, take 1 char from 7 -> "c"
          ["a#b","c"]   CORRECT
                  ^
  the '#' inside the data is never examined - I jump over it by count.

EMPTY STRINGS, strs = ["","",""]  ->  "0#0#0#"
  decode: length 0 -> take 0 chars -> ""  (three times)  -> ["","",""]
*/

// ============================================================
// 3) BRUTE FORCE - JOIN WITH A SEPARATOR (AND WHY IT IS WRONG)
// ============================================================
/*
- Join on a "rare" character and split it back.
    Time  : O(n)   Space : O(n)
- INCORRECT for arbitrary input. I keep it to name the failure out loud:
  any separator I pick can legally appear inside a string.
*/
const NAIVE_SEPARATOR = "#";

function encodeNaive(strs) {
  return strs.join(NAIVE_SEPARATOR);
}

function decodeNaive(s) {
  if (s.length === 0) return [];
  return s.split(NAIVE_SEPARATOR);
}

// ============================================================
// 4) BETTER - ESCAPE THE SEPARATOR INSIDE THE DATA
// ============================================================
/*
- Make the separator safe by doubling it inside the payload:
      "#" inside data  ->  "##"
      the real boundary ->  "#;"
    Time  : O(n)   Space : O(n)
- Correct, and it is what CSV does. But the decoder needs a small state
  machine, which is more code to get right under pressure.
*/
function encodeEscaped(strs) {
  const pieces = [];

  for (let i = 0; i < strs.length; i++) {
    // double every '#' so it can never look like a boundary
    pieces.push(strs[i].split("#").join("##"));
  }

  // "#;" is the only unescaped '#' followed by ';', so it marks a boundary
  return pieces.join("#;");
}

function decodeEscaped(s) {
  if (s.length === 0) return [];

  const result = [];
  let current = "";
  let i = 0;

  while (i < s.length) {
    if (s[i] === "#" && i + 1 < s.length) {
      if (s[i + 1] === "#") {
        // an escaped hash - one real '#' in the data
        current = current + "#";
        i = i + 2;
      } else {
        // "#;" - a real boundary
        result.push(current);
        current = "";
        i = i + 2;
      }
    } else {
      current = current + s[i];
      i++;
    }
  }

  result.push(current);
  return result;
}

// ============================================================
// 5) OPTIMAL - LENGTH PREFIXED FRAMING (THE ONE TO WRITE)
// ============================================================
/*
- Write "<length>#<raw>" per string. Decode by reading digits to the first
  '#', then taking exactly that many characters, whatever they are.
    Time  : O(n) both ways   Space : O(n)
- Nothing inside the payload is ever inspected, so nothing can break it.
*/
const LENGTH_DELIMITER = "#";

function encode(strs) {
  const pieces = [];

  for (let i = 0; i < strs.length; i++) {
    // the length tells the decoder how far to jump, so the payload is opaque
    pieces.push(String(strs[i].length) + LENGTH_DELIMITER + strs[i]);
  }

  return pieces.join("");
}

function decode(s) {
  if (s.length === 0) return [];

  const result = [];
  let i = 0;

  while (i < s.length) {
    // the digits before the first '#' are the length of the next word
    let delimiter = i;
    while (s[delimiter] !== LENGTH_DELIMITER) delimiter++;

    const length = Number(s.slice(i, delimiter));
    const start = delimiter + 1;

    // take exactly `length` characters - never search inside the payload
    result.push(s.slice(start, start + length));

    i = start + length;
  }

  return result;
}

// ============================================================
// QUICK CHECK
// ============================================================
console.log(decode(encode(["hello", "world"]))); // ["hello","world"]
console.log(decode(encode(["a#b", "c"]))); // ["a#b","c"]   separator inside
console.log(decode(encode(["", "", ""]))); // ["","",""]    empty strings
console.log(decode(encode([]))); // []            empty list
console.log(decode(encode(["hello world!!"]))); // ["hello world!!"] 2-digit len
console.log(encode(["a#b", "c"])); // "3#a#b1#c"

console.log(decodeNaive(encodeNaive(["a#b", "c"]))); // ["a","b","c"]  <- the bug
console.log(decodeEscaped(encodeEscaped(["a#b", "c"]))); // ["a#b","c"]
console.log(decodeEscaped(encodeEscaped(["", "", ""]))); // ["","",""]

/*
============================================================
SAY OUT LOUD
============================================================
- COMPLEXITY:
    encode O(total characters) time and space
    decode O(total characters) time and space
    all three approaches are linear - the difference is CORRECTNESS.
- WHY A SEPARATOR CANNOT WORK:
    the strings may contain any character, so no character is safe to
    reserve. I would say this before writing anything.
- WHY LENGTH PREFIXING IS BULLETPROOF:
    the decoder never looks inside the payload. It reads a count and jumps.
    That is exactly how HTTP Content-Length and most binary protocols frame
    messages, so it is the answer a systems interviewer wants to hear.
- THE REAL TRAP:
    [] versus [""]. Empty list encodes to "" and must return []; a single
    empty string encodes to "0#" and must return [""]. Test both.
- WHAT I WOULD MENTION:
    the length digits are themselves ASCII, so this is still text-safe. For
    a binary protocol I would use a fixed 4-byte big-endian length instead.
- FOLLOW-UPS:
    Serialize and Deserialize Binary Tree (LC 297, same framing idea),
    Serialize and Deserialize BST (LC 449), Design TinyURL (LC 535).
*/
