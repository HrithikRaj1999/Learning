/*
String Compression (LC 443)

Compress `chars` IN PLACE: for every run of equal characters write
the character, and if the run is longer than 1 also write its length
as digits. Return the new length. O(1) extra space.

  ["a","a","b","b","c","c","c"] -> a2b2c3 -> return 6
*/

// ============================================================
// 1) INTUITION
// ============================================================
/*
- Run = block of same chars together. "aaabb" = a x3, b x2.

- TWO POINTERS on one array:
      readIndex  = fast. scans the input.
      writeIndex = slow. next empty slot for the output.

- Slow is always behind fast, so writing never eats unread data.
  A run of size L costs 1 + digits(L) cells, always <= L.
  So it always fits. That is why in place works, space O(1).

- For one run:
      1. save the char
      2. move readIndex while the char repeats
      3. runLength = how far it moved
      4. write the char
      5. runLength > 1 -> write its digits too

- Array holds CHARACTERS, count is a NUMBER.
  String(12) = "12" = 2 cells.

- runLength 1 -> write no number. "a1" is wrong.

- Return writeIndex. That is the new length.
*/

// ============================================================
// 2) VISUAL EXAMPLE
// ============================================================
/*
chars = ["a","a","b","b","c","c","c"]
         0   1   2   3   4   5   6

read=0  run 'a' x2   write 'a' then '2'
        [a, 2, b, b, c, c, c]
         w->2            r->2

read=2  run 'b' x2   write 'b' then '2'
        [a, 2, b, 2, c, c, c]
               w->4     r->4

read=4  run 'c' x3   write 'c' then '3'
        [a, 2, b, 2, c, 3, c]
                     w->6     r->7

return 6, and chars[0..5] = a 2 b 2 c 3   (index 6 is junk, ignored)

Single-char run, chars = ["a","b"]:
        [a, b]   'a' x1 -> write 'a' only, NO "1"
                 'b' x1 -> write 'b' only
        return 2

Two-digit run, chars = 12 x "a":
        write 'a', then '1', then '2'  -> length 3, not 2
*/

// ============================================================
// 3) SKELETON
// ============================================================
/*
compress(chars)
  writeIndex = 0
  readIndex  = 0
  while readIndex < chars.length
     currentChar = chars[readIndex]
     runStart    = readIndex
     advance readIndex while char stays the same
     runLength   = readIndex - runStart
     write currentChar
     if runLength > 1 -> write each digit of runLength
  return writeIndex
*/

function compress(chars) {
  // next free slot in the compressed output
  let writeIndex = 0;
  // scanning position in the original array
  let readIndex = 0;

  while (readIndex < chars.length) {
    const currentChar = chars[readIndex];
    const runStart = readIndex;

    while (readIndex < chars.length && chars[readIndex] === currentChar) {
      readIndex++;
    }

    const runLength = readIndex - runStart;

    // the character itself is always written
    chars[writeIndex] = currentChar;
    writeIndex++;

    // length 1 writes nothing ("a1" would be wrong AND longer)
    if (runLength > 1) {
      // 12 must become '1','2' - one cell per digit
      const digits = String(runLength);
      for (let i = 0; i < digits.length; i++) {
        chars[writeIndex] = digits[i];
        writeIndex++;
      }
    }
  }

  return writeIndex;
}

// ============================================================
// QUICK CHECK
// ============================================================
function run(input) {
  const chars = input.slice();
  const length = compress(chars);
  return chars.slice(0, length).join("");
}

console.log(run(["a", "a", "b", "b", "c", "c", "c"])); // "a2b2c3"
console.log(run(["a"])); // "a"
console.log(run(["a", "b", "c"])); // "abc"
console.log(run(Array(12).fill("a"))); // "a12"
console.log(run(["a", "a", "a", "b", "b", "a", "a"])); // "a3b2a2"
console.log(run([])); // ""

/*
============================================================
4) SAY OUT LOUD
============================================================
- COMPLEXITY:
    Time  : O(n) - every index is read once and written at most once.
    Space : O(1) - only pointers and a tiny digit string.
- WHY IN PLACE IS SAFE:
    A run of length L costs 1 + digits(L) cells, which is <= L for
    every L >= 1. So write can never overtake read.
- THE TWO TRAPS:
    1. Counts >= 10 take multiple cells - convert to string.
    2. A run of length 1 writes no number at all.
- EDGE CASES:
    Empty array -> 0. All distinct -> nothing shrinks, return n.
    Same char repeating far apart ("aaabbaa") counts as two runs.
- FOLLOW-UPS:
    Decompress it back, compress a string instead of an array
    (then a result array is fine and the in-place trick is moot),
    or run-length encode with counts always written.
*/
