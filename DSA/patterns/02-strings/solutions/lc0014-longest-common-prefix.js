/*
Longest Common Prefix (LC 14)

Return the longest string that every input starts with. "" if there is none.

  ["flower","flow","flight"] -> "fl"
  ["dog","racecar","car"]    -> ""     (nothing shared at position 0)
  ["a"]                      -> "a"
*/

// ============================================================
// 1) INTUITION
// ============================================================
/*
- The answer can never be longer than the SHORTEST string, so that is a
  free upper bound.
- Best mental picture: stack the words on top of each other and read down
  COLUMN by column. The first column where the letters disagree, or where
  a word runs out, is where the prefix stops. That is the vertical scan.
- I can stop the instant one column disagrees - no need to look further.

- The ladder:
    1. take word[0] as the answer, shrink it against    O(n * m)
       every other word
    2. vertical scan column by column, stop on the      O(n * m) but exits
       first mismatch                                   early in practice
    3. sort the array and compare only the FIRST and    O(n log n * m)
       LAST word (they are the most different)

- Traps:
    - empty input array -> return "".
    - a word shorter than the current column ends the prefix.
    - the answer is a PREFIX, so it must be contiguous from index 0.
*/

// ============================================================
// 2) VISUAL EXAMPLE
// ============================================================
/*
VERTICAL SCAN view, strs = ["flower","flow","flight"]

  column      0    1    2    3    4    5
  flower      f    l    o    w    e    r
  flow        f    l    o    w    -    -
  flight      f    l    i    g    h    t
              ^    ^    ^
              ok   ok   MISMATCH

  column 0: 'f','f','f'  all equal    prefix so far "f"
  column 1: 'l','l','l'  all equal    prefix so far "fl"
  column 2: 'o','o','i'  'i' != 'o'   STOP

  answer "fl"

  INVARIANT: after finishing column c, every word agrees on positions
  0..c, so the prefix is exactly strs[0].slice(0, c+1).

RUN OUT case, strs = ["ab","a"]

  column      0    1
  ab          a    b
  a           a    -      <- "a" has no column 1

  column 0: both 'a'   prefix "a"
  column 1: word "a" has length 1, so index 1 is past its end -> STOP
  answer "a"

SORT TRICK view, strs = ["flower","flow","flight"] -> sorted
  ["flight","flow","flower"]
                 first             last
                 "flight"          "flower"
                  f l i             f l o
                  ^ ^ ^             ^ ^ ^
                  match match  mismatch at index 2

  answer "fl"
  Why only two words matter: sorting puts the most different words at the
  two ends, so any prefix they share is shared by everything in between.
*/

// ============================================================
// 3) BRUTE FORCE - SHRINK A CANDIDATE
// ============================================================
/*
- Start with the whole first word, then chop it down until every other
  word starts with it.
    Time  : O(n * m)   Space : O(m)
- Easy to say, but it may re-check the same characters many times.
*/
function longestCommonPrefixShrink(strs) {
  if (strs.length === 0) return "";

  let prefix = strs[0];

  for (let i = 1; i < strs.length; i++) {
    // chop one character off the end until this word starts with it
    while (prefix.length > 0 && strs[i].slice(0, prefix.length) !== prefix) {
      prefix = prefix.slice(0, prefix.length - 1);
    }

    // nothing left to share - stop early
    if (prefix.length === 0) return "";
  }

  return prefix;
}

// ============================================================
// 4) BETTER - SORT, THEN COMPARE FIRST AND LAST
// ============================================================
/*
- Sorting groups similar words together, so the two extremes bound
  everything in between.
    Time  : O(n * m log n)   Space : O(n)
- Fewer comparisons in the loop, but sorting costs more than it saves.
  Worth knowing as a neat observation, not as the answer.
*/
function longestCommonPrefixSorted(strs) {
  if (strs.length === 0) return "";

  const sorted = strs.slice().sort();
  const first = sorted[0];
  const last = sorted[sorted.length - 1];

  let i = 0;
  // anything these two agree on, every word in between also agrees on
  while (i < first.length && i < last.length && first[i] === last[i]) i++;

  return first.slice(0, i);
}

// ============================================================
// 5) OPTIMAL - VERTICAL SCAN, COLUMN BY COLUMN (THE ONE TO WRITE)
// ============================================================
/*
- Walk column 0, 1, 2... and stop at the first disagreement or short word.
    Time  : O(total characters) worst case, but it exits at the first
            mismatch, which is usually immediate
    Space : O(1) extra
*/
function longestCommonPrefix(strs) {
  if (strs.length === 0) return "";

  const first = strs[0];

  for (let column = 0; column < first.length; column++) {
    const expected = first[column];

    for (let word = 1; word < strs.length; word++) {
      // this word ended, or it disagrees - either way the prefix stops here
      if (column >= strs[word].length || strs[word][column] !== expected) {
        return first.slice(0, column);
      }
    }
  }

  // never mismatched, so the whole first word is the prefix
  return first;
}

// ============================================================
// QUICK CHECK
// ============================================================
console.log(longestCommonPrefix(["flower", "flow", "flight"])); // "fl"
console.log(longestCommonPrefix(["dog", "racecar", "car"])); // ""
console.log(longestCommonPrefix(["a"])); // "a"
console.log(longestCommonPrefix([])); // ""      empty input
console.log(longestCommonPrefix(["ab", "a"])); // "a"     word runs out
console.log(longestCommonPrefix(["", "abc"])); // ""      empty word

console.log(longestCommonPrefixShrink(["flower", "flow", "flight"])); // "fl"
console.log(longestCommonPrefixSorted(["flower", "flow", "flight"])); // "fl"
console.log(longestCommonPrefixSorted(["dog", "racecar", "car"])); // ""

/*
============================================================
SAY OUT LOUD
============================================================
- COMPLEXITY LADDER (n words, m = shortest length):
    shrink candidate  O(n * m) time, O(m) space
    sort + two ends   O(n * m log n) time, O(n) space
    vertical scan     O(n * m) worst case, O(1) extra, exits early
- WHY VERTICAL BEATS HORIZONTAL:
    the vertical scan stops at the first bad column. The shrink version may
    fully compare several words before discovering the prefix is short.
    Same worst case, much better typical case.
- WHY SORTING WOULD WORK:
    lexicographic order puts the two most dissimilar words at the ends, so
    their shared prefix bounds everyone. Nice observation, but the log n
    factor costs more than the comparisons it removes.
- THE REAL TRAP:
    a word shorter than the current column. The bounds check must come
    BEFORE the character comparison, or it reads undefined.
- FOLLOW-UPS:
    Implement Trie (LC 208 - a trie answers this by walking down while each
    node has exactly one child), Longest Common Suffix (reverse everything),
    Longest Common Subsequence (LC 1143, a completely different DP problem).
*/
