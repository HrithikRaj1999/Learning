/*
First Unique Character in a String (LC 387)   [Q2.1.10]

Return the INDEX of the first character that appears exactly once.
If there is none, return -1.

  "leetcode"   -> 0   ('l')
  "loveleetcode" -> 2 ('v')
  "aabb"       -> -1
*/

// ============================================================
// 1) INTUITION
// ============================================================
/*
- I cannot decide at the first character, because a repeat may
  come much later. So I must see the WHOLE string first.

- So: two passes.
      pass 1 - count how many times each character appears
      pass 2 - walk the string again in order, return the first
               index whose count is 1

- Pass 2 must walk the STRING, not the count table. The table has
  no idea which character came first.

- Storage: lowercase a-z only -> a 26 slot array, index = code - 97.
  Unicode or mixed case -> a Map instead. Same two passes.
*/

// ============================================================
// 2) VISUAL EXAMPLE
// ============================================================
/*
s = "loveleetcode"
     0123456789..

PASS 1 - counts

  c d e l o t v
  1 1 4 2 2 1 1

PASS 2 - walk the string in order

  i=0  'l' count 2 -> no
  i=1  'o' count 2 -> no
  i=2  'v' count 1 -> YES, return 2

Why not scan the count table instead?
  The table sorted by letter would hand back 'c' (index 8) first,
  which is wrong. String order is the question, not letter order.

s = "aabb"
  counts a=2 b=2, pass 2 finds nothing -> -1
*/

// ============================================================
// 3) BRUTE FORCE - CHECK EACH CHAR AGAINST ALL OTHERS
// ============================================================
/*
- For every index, scan the rest of the string for a twin.
    Time  : O(n^2)   Space : O(1)
- Say this first in the interview, then improve it.
*/
function firstUniqCharBrute(s) {
  for (let i = 0; i < s.length; i++) {
    let isUnique = true;

    for (let j = 0; j < s.length; j++) {
      // same character at a different position -> not unique
      if (i !== j && s[i] === s[j]) {
        isUnique = false;
        break;
      }
    }

    if (isUnique) return i;
  }

  return -1;
}

// ============================================================
// 4) OPTIMAL - COUNT ARRAY, TWO PASSES
// ============================================================
/*
- STEP 1: freq[26], index = charCode - 97 ('a' is 97).
- STEP 2: pass 1 fills the counts.
- STEP 3: pass 2 walks the string IN ORDER and returns the first
    index whose count is 1.
    Time  : O(n) - two separate passes, still linear.
    Space : O(1) - 26 slots no matter how long the string is.
*/
function firstUniqChar(s) {
  // one slot per lowercase letter
  const freq = Array.from({ length: 26 }, () => 0);

  // PASS 1 - how many times does each letter appear
  for (const char of s) {
    const ascii = char.charCodeAt(0) - 97;
    freq[ascii] = freq[ascii] + 1;
  }

  // PASS 2 - walk the STRING so the original order is kept
  for (let i = 0; i < s.length; i++) {
    const ascii = s[i].charCodeAt(0) - 97;
    if (freq[ascii] === 1) {
      return i;
    }
  }

  return -1;
}

// ============================================================
// 5) VARIANT - MAP VERSION (ANY CHARACTER, NOT JUST a-z)
// ============================================================
/*
- Same two passes, but a Map handles uppercase, digits, spaces
  and unicode without changing the logic.
    Time  : O(n)   Space : O(k) where k = distinct characters.
*/
function firstUniqCharMap(s) {
  const counts = new Map();

  for (const char of s) {
    counts.set(char, (counts.get(char) || 0) + 1);
  }

  for (let i = 0; i < s.length; i++) {
    if (counts.get(s[i]) === 1) return i;
  }

  return -1;
}

// ============================================================
// QUICK CHECK
// ============================================================
console.log(firstUniqChar("leetcode")); // 0
console.log(firstUniqChar("loveleetcode")); // 2
console.log(firstUniqChar("aabb")); // -1
console.log(firstUniqChar("z")); // 0
console.log(firstUniqChar("")); // -1
console.log(firstUniqCharBrute("loveleetcode")); // 2
console.log(firstUniqCharMap("Aa bB c")); // 0  (capital A is unique)

/*
============================================================
6) SAY OUT LOUD
============================================================
- COMPLEXITY:
    Brute   : O(n^2) time, O(1) space.
    Optimal : O(n) time, O(1) space (26 fixed slots).
    Two passes are still O(n) - do not let them push you into
    thinking a single pass is required.
- CAN IT BE ONE PASS?
    Not for the INDEX, because a later duplicate can cancel an
    earlier candidate. A LinkedHashMap / Map of index + count
    lets you answer in one pass over the map afterwards, but the
    string still has to be read fully first.
- WHY ARRAY OVER MAP HERE:
    The constraint says lowercase English letters, so 26 slots
    with O(1) integer indexing beats hashing. If the input can be
    unicode I switch to a Map - I would state that trade-off.
- STREAMING FOLLOW-UP (they like this one):
    "First unique character in a STREAM" - keep a queue of
    candidates plus a count map; pop from the front while the
    front's count is above 1. O(1) amortised per character.
- FOLLOW-UPS:
    First repeating character, ransom note (LC 383), valid
    anagram (LC 242), group anagrams (LC 49) - all counting.
*/
