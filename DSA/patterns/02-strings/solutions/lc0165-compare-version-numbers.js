/*
Compare Version Numbers (LC 165)

Versions are dot separated numbers. Compare them chunk by chunk as
INTEGERS, ignoring leading zeros. A missing chunk counts as 0.
Return 1 if version1 is bigger, -1 if smaller, 0 if equal.

  "1.2"    vs "1.10"    -> -1   (2 < 10 as numbers, though "2" > "1" as text)
  "1.01"   vs "1.001"   ->  0   (01 and 001 are both the number 1)
  "1.0"    vs "1"       ->  0   (the missing chunk counts as 0)
*/

// ============================================================
// 1) INTUITION
// ============================================================
/*
- Two traps make this look harder than it is, and both are killed by one
  decision: compare NUMBERS, not strings.
      "1.10" vs "1.2"   text says "1" < "2", numbers say 10 > 2
      "1.01" vs "1.001" text says different, numbers say both are 1
- The third trap is different lengths. Instead of a special case, I treat
  a missing chunk as 0. "1.0.0" and "1" are then equal automatically.
- So: split on dots, walk to the LONGER length, and default each side to 0.

- The ladder:
    1. compare the strings directly       WRONG, fails "1.10" vs "1.2"
    2. split both, pad the shorter with    O(n + m) time, O(n + m) space
       zeros, compare numbers
    3. walk both strings with two pointers O(n + m) time, O(1) space,
       parsing each chunk on the fly       no arrays allocated

- Traps:
    - the loop must run to max(lengthA, lengthB), not min.
    - very long version strings can exceed 2^31 per chunk in Java/C++ -
      the problem caps them, but worth naming.
    - return exactly 1, -1, or 0, not the raw difference.
*/

// ============================================================
// 2) VISUAL EXAMPLE
// ============================================================
/*
PAD WITH ZEROS view, v1 = "1.2", v2 = "1.10"

  split      v1 -> ["1","2"]        v2 -> ["1","10"]
  length     2                       2

  chunk 0    Number("1") = 1   vs  Number("1") = 1    equal, keep going
  chunk 1    Number("2") = 2   vs  Number("10") = 10  2 < 10  -> return -1
                                                       ^
             as TEXT "2" > "10" because '2' > '1'. Comparing as numbers is
             the entire point of the problem.

DIFFERENT LENGTHS view, v1 = "1.0", v2 = "1"

  split      v1 -> ["1","0"]        v2 -> ["1"]
  compare to max length 2

  chunk 0    1 vs 1        equal
  chunk 1    0 vs MISSING -> treat as 0
             0 vs 0        equal
  loop ends  -> return 0

  Treating "missing" as 0 removes every length special case in one line.

LEADING ZEROS view, v1 = "1.01", v2 = "1.001"

  chunk 0    Number("1") = 1     vs Number("1") = 1     equal
  chunk 1    Number("01") = 1    vs Number("001") = 1   equal
                     ^                    ^
                     Number() strips leading zeros for free
  -> return 0

TWO POINTER view (no arrays), v1 = "1.2", v2 = "1.10"

  i = 0, j = 0
  read a chunk from v1 starting at i:
      i=0 '1' -> chunkA = 0*10 + 1 = 1, i = 1
      i=1 '.' -> stop, skip the dot, i = 2
  read a chunk from v2 starting at j:
      j=0 '1' -> chunkB = 1, j = 1
      j=1 '.' -> stop, skip, j = 2
  1 == 1, continue

  read from v1 at i=2:
      '2' -> chunkA = 2, i = 3 (end of string)
  read from v2 at j=2:
      '1' -> chunkB = 1
      '0' -> chunkB = 1*10 + 0 = 10, j = 4 (end)
  2 < 10 -> return -1

  INVARIANT: when a pointer is past the end of its string, its chunk reads
  as 0, which is exactly the padding rule with no extra code.
*/

// ============================================================
// 3) BRUTE FORCE - COMPARE THE STRINGS (AND WHY IT IS WRONG)
// ============================================================
/*
- Just compare the two strings lexicographically.
    Time  : O(n)   Space : O(1)
- WRONG. "1.10" sorts before "1.2" because character '1' < '2'. Naming
  this counter example immediately is worth more than the code.
*/
function compareVersionLexicographic(version1, version2) {
  if (version1 === version2) return 0;
  return version1 < version2 ? -1 : 1;
}

// ============================================================
// 4) BETTER - SPLIT AND PAD WITH ZEROS
// ============================================================
/*
- Split on dots, walk to the longer length, missing chunks read as 0.
    Time  : O(n + m)   Space : O(n + m) for the two arrays
- This is the version I would write first: short, obviously correct, and
  it makes the "missing is zero" rule explicit.
*/
function compareVersionSplit(version1, version2) {
  const partsA = version1.split(".");
  const partsB = version2.split(".");

  // walk to the LONGER of the two, so trailing ".0" chunks are considered
  const length = Math.max(partsA.length, partsB.length);

  for (let i = 0; i < length; i++) {
    // a chunk past the end of a version counts as 0
    const chunkA = i < partsA.length ? Number(partsA[i]) : 0;
    const chunkB = i < partsB.length ? Number(partsB[i]) : 0;

    if (chunkA < chunkB) return -1;
    if (chunkA > chunkB) return 1;
  }

  return 0;
}

// ============================================================
// 5) OPTIMAL - TWO POINTERS, PARSE CHUNKS IN PLACE
// ============================================================
/*
- Never allocate the arrays. Each side keeps a pointer and builds the next
  chunk digit by digit; a pointer past the end yields 0.
    Time  : O(n + m)   Space : O(1)
*/
const CODE_ZERO = "0".charCodeAt(0);
const DOT = ".";

function compareVersion(version1, version2) {
  let i = 0;
  let j = 0;

  // keep going while EITHER side still has chunks left
  while (i < version1.length || j < version2.length) {
    let chunkA = 0;
    // build the next number; if i is past the end this loop does nothing
    while (i < version1.length && version1[i] !== DOT) {
      chunkA = chunkA * 10 + (version1.charCodeAt(i) - CODE_ZERO);
      i++;
    }

    let chunkB = 0;
    while (j < version2.length && version2[j] !== DOT) {
      chunkB = chunkB * 10 + (version2.charCodeAt(j) - CODE_ZERO);
      j++;
    }

    if (chunkA < chunkB) return -1;
    if (chunkA > chunkB) return 1;

    // step over the dot that ended each chunk
    i++;
    j++;
  }

  return 0;
}

// ============================================================
// QUICK CHECK
// ============================================================
console.log(compareVersion("1.2", "1.10")); // -1   numeric, not text
console.log(compareVersion("1.01", "1.001")); // 0    leading zeros
console.log(compareVersion("1.0", "1")); // 0    missing chunk is 0
console.log(compareVersion("1.0.1", "1")); // 1
console.log(compareVersion("7.5.2.4", "7.5.3")); // -1
console.log(compareVersion("1", "1")); // 0    identical
console.log(compareVersion("0", "0.0.0")); // 0    all zeros
console.log(compareVersion("1.0.0.0.1", "1")); // 1    deep tail

console.log(compareVersionSplit("1.2", "1.10")); // -1
console.log(compareVersionSplit("1.01", "1.001")); // 0
console.log(compareVersionSplit("1.0", "1")); // 0
console.log(compareVersionLexicographic("1.2", "1.10")); // 1  <- the bug

/*
============================================================
SAY OUT LOUD
============================================================
- COMPLEXITY:
    split + pad     O(n + m) time, O(n + m) space
    two pointers    O(n + m) time, O(1) space
- THE THREE TRAPS, AND THE ONE FIX FOR EACH:
    "1.10" vs "1.2"    -> compare as NUMBERS, never as text
    "1.01" vs "1.001"  -> Number() strips leading zeros for free
    "1.0"  vs "1"      -> a missing chunk reads as 0, so no length case
- WHY "MISSING = 0" IS THE ELEGANT PART:
    it turns three different length scenarios into one uniform loop. I
    would say this rather than writing a special case for the tail.
- THE REAL TRAP IN A TYPED LANGUAGE:
    a chunk can exceed int32 if versions are unbounded. LeetCode caps them,
    but in production I would parse into a long, or compare digit strings
    after stripping leading zeros.
- FOLLOW-UPS:
    Sort version numbers (the same comparator plugged into a sort),
    String to Integer / atoi (LC 8), Add Strings (LC 415),
    Next Greater Numerically Balanced Number style chunk parsing.
*/
