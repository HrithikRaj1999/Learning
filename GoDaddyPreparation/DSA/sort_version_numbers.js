/*
Sort Version Number Strings   [Q2.5.1]  ** ASKED TWICE **

  ["4.5.1","10","0.99","4.5","1.0.0.1"]
  -> ["0.99","1.0.0.1","4.5","4.5.1","10"]

Related: LC 165 compareVersion.
The trap they feed you: "1.0" vs "1.0.0" (equal!) and "10" vs "9".
*/

// ============================================================
// 1) INTUITION
// ============================================================
/*
- Plain string sort is WRONG: "10" < "9" as text, because it
  compares '1' with '9'. Versions are NUMBERS separated by dots.

- So: split on '.', then compare part by part as numbers.
      "4.5.1" -> [4,5,1]
      "10"    -> [10]

- Different lengths? Treat the missing parts as 0.
      "1.0" vs "1.0.0" -> [1,0,0] vs [1,0,0] -> EQUAL, return 0.
  This is the trap. Never compare lengths first.

- First part where they differ decides everything, return
  immediately. If no part differs, they are equal.

- comparator contract: return negative if a comes first,
  positive if b comes first, 0 if equal.
*/

// ============================================================
// 2) VISUAL EXAMPLE
// ============================================================
/*
compare("4.5.1", "4.5")

  index :   0    1    2
  a     :   4    5    1
  b     :   4    5    0   <- missing part read as 0
  check : same same a>b   -> "4.5.1" is bigger, return +1

compare("1.0", "1.0.0")

  index :   0    1    2
  a     :   1    0    0   <- padded
  b     :   1    0    0
  all same -> return 0, EQUAL versions

compare("10", "9")

  index :   0
  a     :  10
  b     :   9   -> 10 > 9, return +1
  (string compare would have said "10" < "9" - the classic bug)

compare("0.99", "1.0.0.1")

  index :   0
  a     :   0
  b     :   1   -> 0 < 1, return -1, stop. Later parts do not
                   matter at all.

Full sort walk of the sample:
  0.99      [0,99]
  1.0.0.1   [1,0,0,1]
  4.5       [4,5]
  4.5.1     [4,5,1]
  10        [10]
*/

// ============================================================
// 3) BRUTE-ISH - PAD BOTH TO THE SAME LENGTH, THEN COMPARE
// ============================================================
/*
- Build both arrays, push zeros onto the shorter one, then walk.
- Same answer, one extra pass and extra memory. Easy to explain.
    Time  : O(p) per comparison, p = number of parts.
*/
function compareVersionPadded(a, b) {
  const partsA = a.split(".").map(Number);
  const partsB = b.split(".").map(Number);

  // pad the shorter one with zeros so both have equal length
  while (partsA.length < partsB.length) partsA.push(0);
  while (partsB.length < partsA.length) partsB.push(0);

  for (let i = 0; i < partsA.length; i++) {
    if (partsA[i] !== partsB[i]) {
      return partsA[i] < partsB[i] ? -1 : 1;
    }
  }

  return 0;
}

// ============================================================
// 4) OPTIMAL - COMPARE IN ONE PASS, MISSING PART READS AS 0
// ============================================================
/*
- STEP 1: split both on '.'.
- STEP 2: loop i to the LONGER length.
- STEP 3: read each part with a fallback of 0 when the index is
    past the end. This is the padding, done for free.
- STEP 4: first difference decides, return -1 or +1. No difference
    anywhere -> 0.
    Time  : O(p) per compare, so O(n log n * p) for the whole sort.
    Space : O(p) for the split parts.
*/
function compareVersion(a, b) {
  const partsA = a.split(".");
  const partsB = b.split(".");
  const longest = Math.max(partsA.length, partsB.length);

  for (let i = 0; i < longest; i++) {
    // a missing part counts as 0, so "1.0" === "1.0.0"
    const numberA = i < partsA.length ? Number(partsA[i]) : 0;
    const numberB = i < partsB.length ? Number(partsB[i]) : 0;

    // the first part that differs decides the whole comparison
    if (numberA < numberB) return -1;
    if (numberA > numberB) return 1;
  }

  // every part matched
  return 0;
}

function sortVersions(versions) {
  // copy, so the caller's array is not mutated by sort
  return [...versions].sort(compareVersion);
}

// ============================================================
// 5) IF THEY BAN split() / SIMULATE THE PARSE BY HAND
// ============================================================
/*
- Two index pointers, build each number digit by digit until the
  next '.' or the end of the string.
    Time  : O(len(a) + len(b))   Space : O(1) - no arrays at all.
- This is the version that impresses, and it is also the one that
  never overflows in Java because you can cap while parsing.
*/
function compareVersionNoSplit(a, b) {
  let i = 0;
  let j = 0;

  while (i < a.length || j < b.length) {
    let numberA = 0;
    // read digits until the dot or the end
    while (i < a.length && a[i] !== ".") {
      numberA = numberA * 10 + Number(a[i]);
      i++;
    }

    let numberB = 0;
    while (j < b.length && b[j] !== ".") {
      numberB = numberB * 10 + Number(b[j]);
      j++;
    }

    if (numberA < numberB) return -1;
    if (numberA > numberB) return 1;

    // step over the dot; if we are at the end this does nothing,
    // and the next round reads 0, which is the padding rule
    i++;
    j++;
  }

  return 0;
}

// ============================================================
// QUICK CHECK
// ============================================================
console.log(sortVersions(["4.5.1", "10", "0.99", "4.5", "1.0.0.1"]));
// [ '0.99', '1.0.0.1', '4.5', '4.5.1', '10' ]

console.log(compareVersion("1.0", "1.0.0")); // 0   the trap
console.log(compareVersion("1.01", "1.001")); // 0   leading zeros
console.log(compareVersion("10", "9")); // 1
console.log(compareVersion("4.5.1", "4.5")); // 1
console.log(compareVersion("0.99", "1.0.0.1")); // -1
console.log(compareVersion("1.2", "1.10")); // -1  2 < 10

console.log(compareVersionPadded("1.0", "1.0.0")); // 0
console.log(compareVersionNoSplit("1.0", "1.0.0")); // 0
console.log(compareVersionNoSplit("10", "9")); // 1
console.log(compareVersionNoSplit("1.2", "1.10")); // -1

console.log(sortVersions(["1.0", "1.0.0", "1"])); // all equal, order kept
console.log(sortVersions([])); // []

/*
============================================================
6) SAY OUT LOUD
============================================================
- COMPLEXITY:
    One comparison : O(p) where p = number of parts.
    Full sort      : O(n log n * p), plus O(p) space per compare.
    If I precompute the parsed arrays once (a Schwartzian
    transform / decorate-sort-undecorate) the parsing happens n
    times instead of n log n times. Worth mentioning.
- THE FOUR TRAPS:
    1. "10" vs "9"    - never compare as strings.
    2. "1.0" vs "1.0.0" - EQUAL. Missing parts are 0, not smaller.
    3. "1.01" vs "1.001" - EQUAL. Number() kills leading zeros.
    4. "1.2" vs "1.10" - 1.10 is BIGGER. These are not decimals,
       each part is its own integer.
- SORT STABILITY:
    Equal versions keep their input order because JS sort is
    stable (spec guaranteed since ES2019).
- OVERFLOW:
    In Java, a part like "2147483648" breaks Integer.parseInt.
    Use long, or the no-split version with an early cap.
- REAL WORLD:
    Semantic versioning also has pre-release tags: "1.0.0-alpha"
    sorts BEFORE "1.0.0". If the input can have those, I would
    split on '-' first and compare the tag by the semver rules.
- FOLLOW-UPS:
    LC 165 compareVersion, natural sort of filenames
    ("file2" before "file10"), sorting IP addresses (same idea,
    split on '.', 4 fixed parts).
*/
