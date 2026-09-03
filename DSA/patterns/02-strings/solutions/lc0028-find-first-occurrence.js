/*
Find the Index of the First Occurrence in a String / strStr (LC 28)

Return the index where needle first appears inside haystack, or -1.

  haystack = "sadbutsad", needle = "sad" -> 0   (also at 6, but 0 is first)
  haystack = "leetcode",  needle = "leeto" -> -1
  haystack = "abc",       needle = ""    -> 0   (empty matches at 0)
*/

// ============================================================
// 1) INTUITION
// ============================================================
/*
- The obvious method: line the needle up at every start position and
  compare character by character. That is O(n*m) and it is what almost
  everyone writes - and it is accepted.
- The waste in that method: after a partial match fails, it throws away
  everything it learned and restarts the needle from position 0.
- KMP fixes exactly that. It precomputes, for every prefix of the needle,
  the length of the longest proper prefix that is also a suffix. On a
  mismatch it jumps the needle forward by that amount instead of by one,
  and the haystack pointer NEVER moves backwards. That makes it O(n + m).

- The ladder:
    1. slice the haystack and compare strings     O(n*m) time, O(m) space
    2. compare in place, no slicing               O(n*m) time, O(1) space
    3. KMP with a failure table                   O(n+m) time, O(m) space

- Traps:
    - an empty needle returns 0 by definition.
    - the outer loop only needs to reach n - m, not n.
    - in the failure table, index 0 is always 0 - a string cannot be a
      proper prefix of itself.
*/

// ============================================================
// 2) VISUAL EXAMPLE
// ============================================================
/*
SLIDING COMPARE view, haystack = "sadbutsad", needle = "sad"

  start = 0     s a d b u t s a d
                s a d
                ^ ^ ^   all three match -> return 0

  If the needle had been "but":
  start = 0     s a d b u t s a d
                b            's' vs 'b' mismatch at offset 0, slide
  start = 1     s a d b u t s a d
                  b          'a' vs 'b' mismatch, slide
  start = 2     s a d b u t s a d
                    b        'd' vs 'b' mismatch, slide
  start = 3     s a d b u t s a d
                      b u t  all match -> return 3

  The outer loop stops at start = n - m = 9 - 3 = 6, because a needle of
  length 3 cannot fit past that.

KMP FAILURE TABLE, needle = "aabaaac"
failure[i] = length of the longest proper prefix of needle[0..i] that is
also a suffix of it.

  index      0    1    2    3    4    5    6
  char       a    a    b    a    a    a    c
  failure    0    1    0    1    2    2    0

  how index 4 got its 2:
      needle[0..4] = "aabaa"
      its proper prefixes: "a", "aa", "aab", "aaba"
      its suffixes:        "a", "aa", "baa", "abaa"
      longest match = "aa", length 2   ->  failure[4] = 2

  index 5:  needle[0..5] = "aabaaa"
      previous failure was 2, so compare needle[2] = 'b' with needle[5] = 'a'
      'b' != 'a' -> fall back to failure[1] = 1
      compare needle[1] = 'a' with needle[5] = 'a' -> match, so 1 + 1 = 2
      failure[5] = 2

WHY IT SAVES WORK, haystack = "aabaabaaac", needle = "aabaaac"

  align at 0:
      a a b a a b a a a c
      a a b a a a c
      ^ ^ ^ ^ ^ X          matched 5 characters, then 'b' vs 'a' fails at
                           haystack index 5

  Naive would restart at haystack index 1 and rescan.
  KMP says: I already matched 5 characters, failure[4] = 2, so the first 2
  characters of the needle are ALREADY matched by the text I just read.
  Jump the needle back to position 2 and keep the haystack pointer at 5.

      a a b a a b a a a c
            a a b a a a c
            ^ ^ (already known to match) then compare from here

  INVARIANT: the haystack index never decreases, so it advances at most n
  times overall. That is why KMP is linear.
*/

// ============================================================
// 3) BRUTE FORCE - SLICE AND COMPARE
// ============================================================
/*
- At each start, cut out a substring of the needle's length and compare.
    Time  : O(n * m)   Space : O(m) for each slice
- Shortest to write, and the slicing is the only thing to improve first.
*/
function strStrSlice(haystack, needle) {
  // an empty needle is defined to match at index 0
  if (needle.length === 0) return 0;
  if (needle.length > haystack.length) return -1;

  for (let start = 0; start + needle.length <= haystack.length; start++) {
    if (haystack.slice(start, start + needle.length) === needle) return start;
  }

  return -1;
}

// ============================================================
// 4) BETTER - COMPARE IN PLACE, NO SLICING
// ============================================================
/*
- Same alignments, but compare character by character and bail on the
  first mismatch, so nothing is allocated.
    Time  : O(n * m) worst case   Space : O(1)
- This is the version I would actually write in an interview unless KMP is
  specifically asked for. Typical inputs mismatch almost immediately.
*/
function strStr(haystack, needle) {
  if (needle.length === 0) return 0;
  if (needle.length > haystack.length) return -1;

  // a needle of length m cannot start later than n - m
  for (let start = 0; start + needle.length <= haystack.length; start++) {
    let offset = 0;

    // extend the match as far as it goes
    while (offset < needle.length && haystack[start + offset] === needle[offset]) {
      offset++;
    }

    // ran the whole needle without a mismatch
    if (offset === needle.length) return start;
  }

  return -1;
}

// ============================================================
// 5) OPTIMAL - KMP WITH A FAILURE TABLE
// ============================================================
/*
- Precompute how far the needle can slide on a mismatch, then scan the
  haystack once without ever backing up.
    Time  : O(n + m)   Space : O(m)
- Worth writing when the haystack is huge or highly repetitive, which is
  exactly where the naive version degrades to n*m.
*/
function strStrKMP(haystack, needle) {
  if (needle.length === 0) return 0;
  if (needle.length > haystack.length) return -1;

  const failure = buildFailureTable(needle);

  let matched = 0; // how many needle characters are currently matched

  for (let i = 0; i < haystack.length; i++) {
    // on a mismatch, slide the needle instead of restarting it
    while (matched > 0 && haystack[i] !== needle[matched]) {
      matched = failure[matched - 1];
    }

    if (haystack[i] === needle[matched]) matched++;

    // the whole needle matched, and it ended at index i
    if (matched === needle.length) return i - needle.length + 1;
  }

  return -1;
}

function buildFailureTable(needle) {
  const failure = new Array(needle.length).fill(0);

  // length of the current longest prefix that is also a suffix
  let length = 0;

  // index 0 is always 0, so start at 1
  for (let i = 1; i < needle.length; i++) {
    // shrink the candidate until it can be extended, or hits zero
    while (length > 0 && needle[i] !== needle[length]) {
      length = failure[length - 1];
    }

    if (needle[i] === needle[length]) length++;

    failure[i] = length;
  }

  return failure;
}

// ============================================================
// QUICK CHECK
// ============================================================
console.log(strStr("sadbutsad", "sad")); // 0
console.log(strStr("leetcode", "leeto")); // -1
console.log(strStr("abc", "")); // 0    empty needle
console.log(strStr("", "a")); // -1   empty haystack
console.log(strStr("a", "a")); // 0    exact match
console.log(strStr("mississippi", "issip")); // 4

console.log(strStrSlice("sadbutsad", "sad")); // 0
console.log(strStrKMP("sadbutsad", "sad")); // 0
console.log(strStrKMP("mississippi", "issip")); // 4
console.log(strStrKMP("leetcode", "leeto")); // -1
console.log(strStrKMP("aabaabaaac", "aabaaac")); // 3    the repetitive case
console.log(buildFailureTable("aabaaac")); // [0,1,0,1,2,2,0]

// the worst case for the naive scan, where KMP earns its keep
const worstHay = "a".repeat(20000) + "b";
const worstNeedle = "a".repeat(500) + "b";
console.log(strStrKMP(worstHay, worstNeedle)); // 19500
console.log(strStr(worstHay, worstNeedle)); // 19500 (same answer, slower)

/*
============================================================
SAY OUT LOUD
============================================================
- COMPLEXITY LADDER (n = haystack, m = needle):
    slice + compare   O(n*m) time, O(m) space per slice
    in-place compare  O(n*m) time, O(1) space
    KMP               O(n+m) time, O(m) space
- WHAT THE NAIVE VERSION WASTES:
    after matching k characters and failing, it throws away all k and
    restarts. But those k characters are part of the needle, so I already
    know what they are - that knowledge is what KMP stores.
- WHAT THE FAILURE TABLE MEANS:
    failure[i] = the longest proper prefix of needle[0..i] that is also its
    suffix. On a mismatch after i+1 matches, that many characters are
    already aligned, so the needle slides by (i+1) - failure[i].
- WHY KMP IS LINEAR:
    the haystack pointer only ever moves forward. The inner while shrinks
    `matched`, and `matched` only grows once per haystack character, so the
    total shrinking is bounded by the total growing.
- WHICH ONE I WOULD WRITE:
    the in-place scan, unless the interviewer names KMP or the input is
    described as long and repetitive. I would name KMP either way.
- FOLLOW-UPS:
    Repeated Substring Pattern (LC 459, solvable straight from the failure
    table), Shortest Palindrome (LC 214, KMP on s + reverse(s)),
    Longest Happy Prefix (LC 1392, literally the failure table).
*/
