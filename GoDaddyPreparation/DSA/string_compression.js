/*
String Compression (LC 443)

============================================================
1. DATA STRUCTURE NEEDED & WHY (Simple Explanation)
============================================================
- DATA STRUCTURE:
    Two Pointers (`read` and `write`) in-place on `chars`.
- WHY WE NEED IT:
    O(1) extra space is required. Overwriting in-place is safe
    because `write` pointer never overtakes `read` pointer
    (`write <= read`).

============================================================
2. INTUITION (What I am thinking to tell interviewer)
============================================================
- "Two-pointer in-place rewrite: `read` scans consecutive
   matching characters, `write` places compressed output."
- "Inner loop counts sequence length: `count = readEnd - readStart`."
- "Write character at `chars[write++] = char`."
- "If `count > 1`, convert count to string and write each
   digit sequentially (`chars[write++] = digit`)."
- "Return `write` as the new compressed array length."

============================================================
3. STEPS TO SOLVE & ALGORITHM SKELETON (In Words)
============================================================
- Initialize `write = 0`, `read = 0`.
- Outer loop while `read < chars.length`:
    1. Save `char = chars[read]`, `start = read`.
    2. Inner loop: advance `read++` while `chars[read] === char`.
    3. Write character: `chars[write++] = char`.
    4. Calculate `count = read - start`.
    5. If `count > 1`, convert `count.toString()` and iterate
       through digits, writing `chars[write++] = digit`.
- Return `write`.

SHORT SYNTAX TRICKS:
  for (const c of String(count)) chars[write++] = c // Write digits
  const count = read - start                       // Group size

============================================================
4. TIME & SPACE COMPLEXITY
============================================================
- TIME COMPLEXITY:
    - O(N) where N is array length (`read` pointer visits
      each character exactly once).
- SPACE COMPLEXITY:
    - O(1) auxiliary space (modifies input array in-place).

============================================================
5. VISUAL DIAGRAM
============================================================
chars = ["a","a","b","b","c","c","c"]

  Group "a" (count 2): write 'a', '2' -> ["a","2", ...]
  Group "b" (count 2): write 'b', '2' -> ["a","2","b","2", ...]
  Group "c" (count 3): write 'c', '3' -> ["a","2","b","2","c","3"]

  Returns write index = 6.

============================================================
6. KEY GOTCHAS & THINGS TO SAY OUT LOUD
============================================================
- COUNT = 1 CASE: Do NOT write "1" for single chars ("a" -> "a").
- MULTI-DIGIT COUNTS: Count >= 10 takes multiple slots (e.g. 12 -> '1', '2').
- IN-PLACE SAFETY: Safe because compressed length <= original length.
*/

function compress(chars) {
  let write = 0;
  let read = 0;

  while (read < chars.length) {
    const char = chars[read];
    const start = read;

    // Advance read to end of current repeated character sequence
    while (read < chars.length && chars[read] === char) {
      read++;
    }

    // Write character
    chars[write++] = char;
    const count = read - start;

    // Write digits if count > 1
    if (count > 1) {
      for (const digit of String(count)) {
        chars[write++] = digit;
      }
    }
  }

  return write;
}

// Quick check
const chars1 = ["a", "a", "b", "b", "c", "c", "c"];
const len1 = compress(chars1);
console.log(len1, chars1.slice(0, len1)); // 6, ['a', '2', 'b', '2', 'c', '3']

const chars2 = ["a"];
const len2 = compress(chars2);
console.log(len2, chars2.slice(0, len2)); // 1, ['a']

const chars3 = ["a", "b", "b", "b", "b", "b", "b", "b", "b", "b", "b", "b", "b"];
const len3 = compress(chars3);
console.log(len3, chars3.slice(0, len3)); // 4, ['a', 'b', '1', '2']
