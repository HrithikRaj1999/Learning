/*
Valid Anagram (LC 242)

Return true if t is an anagram of s - same letters, same counts,
any order.

  s = "anagram", t = "nagaram" -> true
  s = "rat",     t = "car"     -> false  (r,a,t vs c,a,r)
  s = "a",       t = "ab"      -> false  (different lengths)
*/

// ============================================================
// 1) INTUITION
// ============================================================
/*
- Order does not matter, only HOW MANY of each letter.
- So I compare two multisets. Two ways to make a multiset comparable:
  sort it into one canonical string, or count it into a table.
- Different lengths can never be anagrams, so that check comes first
  and is free.

- The ladder:
    1. sort both strings and compare       O(n log n) time, O(n) space
    2. two count tables, compare tables    O(n) time, O(1) space (26 slots)
    3. ONE count table: add for s,         O(n) time, O(1) space
       subtract for t, everything must
       land back on zero

- Traps:
    - assume lowercase a-z for the 26-slot array; for unicode use a Map.
    - length check first, otherwise "ab" vs "a" can look balanced early.
*/

// ============================================================
// 2) VISUAL EXAMPLE
// ============================================================
/*
ONE TABLE view, s = "rat", t = "car"   (only a,c,r,t shown)

  start counts   a:0  c:0  r:0  t:0

  add s:  'r' -> r = 0 + 1 = 1
          'a' -> a = 0 + 1 = 1
          't' -> t = 0 + 1 = 1
          counts   a:1  c:0  r:1  t:1

  sub t:  'c' -> c = 0 - 1 = -1     already negative, letter t has a
                                    letter s never had -> return false

ANAGRAM case, s = "anagram", t = "nagaram"

  after adding s   a:3  n:1  g:1  r:1  m:1
  subtract t:
      'n' -> n = 1 - 1 = 0
      'a' -> a = 3 - 1 = 2
      'g' -> g = 1 - 1 = 0
      'a' -> a = 2 - 1 = 1
      'r' -> r = 1 - 1 = 0
      'a' -> a = 1 - 1 = 0
      'm' -> m = 1 - 1 = 0
  every slot 0 -> true

  INVARIANT: a count going below 0 means t used a letter s did not have.
  With equal lengths, "never negative" already forces "all zero".

SORT view:
  "rat"     -> "art"
  "car"     -> "acr"     "art" != "acr" -> false
*/

// ============================================================
// 3) BRUTE FORCE - SORT BOTH AND COMPARE
// ============================================================
/*
- Sorting turns a multiset into one canonical string.
    Time  : O(n log n)   Space : O(n)
- Shortest to write, and a perfectly good first answer.
*/
function isAnagramSort(s, t) {
  if (s.length !== t.length) return false;

  const a = s.split("").sort().join("");
  const b = t.split("").sort().join("");

  return a === b;
}

// ============================================================
// 4) BETTER - TWO COUNT TABLES
// ============================================================
/*
- Count each string separately, then compare the 26 slots.
    Time  : O(n)   Space : O(1)   (26 is a constant)
- Easy to explain, but it walks the alphabet a second time.
*/
const ALPHABET_SIZE = 26;
const CODE_A = "a".charCodeAt(0);

function isAnagramTwoTables(s, t) {
  if (s.length !== t.length) return false;

  const countS = new Array(ALPHABET_SIZE).fill(0);
  const countT = new Array(ALPHABET_SIZE).fill(0);

  for (let i = 0; i < s.length; i++) {
    countS[s.charCodeAt(i) - CODE_A]++;
    countT[t.charCodeAt(i) - CODE_A]++;
  }

  for (let i = 0; i < ALPHABET_SIZE; i++) {
    if (countS[i] !== countT[i]) return false;
  }

  return true;
}

// ============================================================
// 5) OPTIMAL - ONE TABLE, ADD THEN SUBTRACT (THE ONE TO WRITE)
// ============================================================
/*
- Add for s, subtract for t, in the SAME loop. Bail the instant a slot
  goes negative - that is proof t has a letter s lacks.
    Time  : O(n)   Space : O(1)
*/
function isAnagram(s, t) {
  if (s.length !== t.length) return false;

  const counts = new Array(ALPHABET_SIZE).fill(0);

  for (let i = 0; i < s.length; i++) {
    counts[s.charCodeAt(i) - CODE_A]++;
    counts[t.charCodeAt(i) - CODE_A]--;
  }

  for (let i = 0; i < ALPHABET_SIZE; i++) {
    // equal lengths mean a single non-zero slot breaks the anagram
    if (counts[i] !== 0) return false;
  }

  return true;
}

// ============================================================
// 6) FOLLOW-UP - UNICODE SAFE VERSION WITH A MAP
// ============================================================
/*
- The 26-slot array dies on emoji, accents, or capitals. A Map keyed by
  the character keeps the same add/subtract idea with no alphabet limit.
    Time  : O(n)   Space : O(k), k = number of distinct characters
*/
function isAnagramUnicode(s, t) {
  if (s.length !== t.length) return false;

  const counts = new Map();

  for (const ch of s) counts.set(ch, (counts.get(ch) || 0) + 1);

  for (const ch of t) {
    const left = counts.get(ch);
    // never seen, or already used up -> t has an extra of this character
    if (left === undefined || left === 0) return false;
    counts.set(ch, left - 1);
  }

  return true;
}

// ============================================================
// QUICK CHECK
// ============================================================
console.log(isAnagram("anagram", "nagaram")); // true
console.log(isAnagram("rat", "car")); // false
console.log(isAnagram("a", "ab")); // false  length guard
console.log(isAnagram("", "")); // true   empty
console.log(isAnagram("aacc", "ccac")); // false  counts differ

console.log(isAnagramSort("rat", "car")); // false
console.log(isAnagramTwoTables("anagram", "nagaram")); // true
console.log(isAnagramUnicode("héllo", "olléh")); // true
console.log(isAnagramUnicode("rat", "car")); // false

/*
============================================================
SAY OUT LOUD
============================================================
- COMPLEXITY LADDER:
    sort both     O(n log n) time, O(n) space
    two tables    O(n) time, O(1) space
    one table     O(n) time, O(1) space, single pass
- WHY COUNTING BEATS SORTING:
    an anagram is a multiset equality. Sorting computes a canonical form
    I do not need; counting measures the multiset directly.
- WHY ONE TABLE IS ENOUGH:
    with equal lengths, the counts sum to zero. So "some slot is positive"
    forces "some slot is negative" - one sweep for non-zero catches both.
- THE REAL TRAP:
    the follow-up "what about unicode?". The 26-slot array is an
    assumption, not a fact - say the assumption out loud, then offer the
    Map version.
- FOLLOW-UPS:
    Group Anagrams (LC 49, same canonical key used as a map key),
    Find All Anagrams in a String (LC 438, counts inside a sliding window),
    Ransom Note (LC 383, one-directional subtraction).
*/
