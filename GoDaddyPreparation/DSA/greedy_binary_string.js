/*
Greedy on a Binary String   [Q2.8 OA pattern, Sept 2025]

Four classic OA shapes on a string of 0s and 1s:

  A) minimum flips to make the string MONOTONE (all 0s then all 1s)
     "00110" -> 1        | LC 926
  B) minimum swaps to group all 1s together
     "010101" -> ?       | LC 1151 / 2134 (window of size = count of 1s)
  C) minimum flips so that no two neighbours are equal (alternating)
     "0100" -> 1         | LC 1758
  D) maximum score = zeros on the left + ones on the right
     "011101" -> 5       | LC 1422
*/

// ============================================================
// 1) INTUITION
// ============================================================
/*
- A binary string has only two symbols, so "the best answer" is
  almost always one of a SMALL number of shapes. Try each shape
  cheaply instead of searching all 2^n strings.

A) MONOTONE ("000111")
   Every valid answer has ONE cut point: zeros before it, ones
   after it. So for each cut, cost = (ones before) + (zeros after).
   Prefix counts make each cut O(1). Try all n+1 cuts.

B) GROUP THE ONES
   The ones end up in ONE block of size k = total number of ones.
   So slide a window of size k and find the window holding the
   MOST ones; the zeros inside it are the swaps needed.
   answer = k - maxOnesInAnyWindow.

C) ALTERNATING
   Only TWO valid strings exist: "0101..." and "1010...". Count
   the mismatches against the first one; the mismatches against
   the other are (n - that). Take the min. One pass.

D) SPLIT SCORE
   Same one-cut idea as A, but maximise instead of minimise.
   Running zeros on the left, ones on the right from a total.

- The shared trick: replace "try every string" with "try every
  cut / window", which is n options instead of 2^n.
*/

// ============================================================
// 2) VISUAL EXAMPLE
// ============================================================
/*
A) MONOTONE, s = "00110"

  cut position (| = the cut), cost = ones on the left + zeros on right

   |00110   ones left 0, zeros right 3  -> 3
   0|0110   0 + 2 -> 2
   00|110   0 + 1 -> 1     <- best
   001|10   1 + 1 -> 2
   0011|0   2 + 1 -> 3
   00110|   2 + 0 -> 2

  answer 1  (flip the last 0 to a 1, giving "00111")

B) GROUP ONES, s = "010101", total ones k = 3

  windows of size 3:
    [010]101  ones inside 1 -> swaps 3-1 = 2
    0[101]01  ones inside 2 -> swaps 1
    01[010]1  ones inside 1 -> swaps 2
    010[101]  ones inside 2 -> swaps 1
  answer 1

C) ALTERNATING, s = "0100"

  target A "0101" :  0100
                     ...^  1 mismatch
  target B "1010" :  0100
                     ^^ ^  3 mismatches
  answer min(1,3) = 1

D) SPLIT SCORE, s = "011101"
   score(cut) = zeros in the left part + ones in the right part

   0|11101   zeros left 1, ones right 4 -> 5   <- best
   01|1101   1 + 3 -> 4
   011|101   1 + 2 -> 3
   0111|01   1 + 1 -> 2
   01110|1   2 + 1 -> 3
   answer 5
   (the cut must leave both sides non-empty)
*/

// ============================================================
// 3) A) MINIMUM FLIPS TO MAKE IT MONOTONE (LC 926)
// ============================================================
/*
- BRUTE: for every cut, count ones on the left and zeros on the
  right by scanning -> O(n^2).
- OPTIMAL: keep the counts running as the cut moves right.
    Time  : O(n)   Space : O(1)
*/
function minFlipsMonotoneBrute(s) {
  let best = Infinity;

  for (let cut = 0; cut <= s.length; cut++) {
    let cost = 0;
    // every 1 before the cut must become 0
    for (let i = 0; i < cut; i++) if (s[i] === "1") cost++;
    // every 0 after the cut must become 1
    for (let i = cut; i < s.length; i++) if (s[i] === "0") cost++;
    if (cost < best) best = cost;
  }

  return best;
}

function minFlipsMonotone(s) {
  // zeros that would have to be flipped if everything became 1
  let zerosAfter = 0;
  for (const char of s) if (char === "0") zerosAfter++;

  let onesBefore = 0;
  // cut at position 0: flip every zero
  let best = zerosAfter;

  for (let i = 0; i < s.length; i++) {
    if (s[i] === "0") {
      // this zero is now on the LEFT side, where zeros are free
      zerosAfter--;
    } else {
      // this one is now on the LEFT side, where it costs a flip
      onesBefore++;
    }

    const cost = onesBefore + zerosAfter;
    if (cost < best) best = cost;
  }

  return best;
}

// ============================================================
// 4) B) MINIMUM SWAPS TO GROUP ALL ONES (LC 1151 / 2134)
// ============================================================
/*
- Window of size k = total ones. Slide it, track ones inside.
    Time  : O(n)   Space : O(1)
*/
function minSwapsToGroupOnes(s) {
  let totalOnes = 0;
  for (const char of s) if (char === "1") totalOnes++;

  // nothing to group
  if (totalOnes <= 1) return 0;

  // first window
  let onesInWindow = 0;
  for (let i = 0; i < totalOnes; i++) {
    if (s[i] === "1") onesInWindow++;
  }

  let bestOnes = onesInWindow;

  // slide: add the new right char, drop the old left char
  for (let right = totalOnes; right < s.length; right++) {
    if (s[right] === "1") onesInWindow++;
    if (s[right - totalOnes] === "1") onesInWindow--;
    if (onesInWindow > bestOnes) bestOnes = onesInWindow;
  }

  // the zeros left inside the best window are the swaps
  return totalOnes - bestOnes;
}

// ============================================================
// 5) C) MINIMUM FLIPS TO MAKE IT ALTERNATING (LC 1758)
// ============================================================
/*
- Only two targets exist, and they are complements, so one pass
  is enough.
    Time  : O(n)   Space : O(1)
*/
function minFlipsAlternating(s) {
  let mismatchesWithZeroFirst = 0;

  for (let i = 0; i < s.length; i++) {
    // target "0101..." wants '0' at even indexes, '1' at odd
    const expected = i % 2 === 0 ? "0" : "1";
    if (s[i] !== expected) mismatchesWithZeroFirst++;
  }

  // the other target is the exact complement
  const mismatchesWithOneFirst = s.length - mismatchesWithZeroFirst;

  return Math.min(mismatchesWithZeroFirst, mismatchesWithOneFirst);
}

// ============================================================
// 6) D) MAXIMUM SPLIT SCORE (LC 1422)
// ============================================================
/*
- Same single-cut idea, maximising. Both sides must be non-empty,
  so the cut runs from 1 to n-1.
    Time  : O(n)   Space : O(1)
*/
function maxSplitScore(s) {
  let onesRight = 0;
  for (const char of s) if (char === "1") onesRight++;

  let zerosLeft = 0;
  let best = -Infinity;

  // cut AFTER index i, so i stops at length-2 (right side non-empty)
  for (let i = 0; i < s.length - 1; i++) {
    if (s[i] === "0") {
      zerosLeft++;
    } else {
      onesRight--;
    }

    const score = zerosLeft + onesRight;
    if (score > best) best = score;
  }

  return best;
}

// ============================================================
// QUICK CHECK
// ============================================================
console.log(minFlipsMonotone("00110")); // 1
console.log(minFlipsMonotone("010110")); // 2
console.log(minFlipsMonotone("00011000")); // 2
console.log(minFlipsMonotone("0")); // 0
console.log(minFlipsMonotoneBrute("010110")); // 2

console.log(minSwapsToGroupOnes("010101")); // 1
console.log(minSwapsToGroupOnes("1110")); // 0
console.log(minSwapsToGroupOnes("0")); // 0
console.log(minSwapsToGroupOnes("1001100")); // 1

console.log(minFlipsAlternating("0100")); // 1
console.log(minFlipsAlternating("010")); // 0
console.log(minFlipsAlternating("1111")); // 2

console.log(maxSplitScore("011101")); // 5
console.log(maxSplitScore("00111")); // 5
console.log(maxSplitScore("1111")); // 3

/*
============================================================
7) SAY OUT LOUD
============================================================
- THE COMMON IDEA:
    A binary string only has a handful of possible ANSWER SHAPES -
    one cut point, one window, or two fixed patterns. So instead
    of searching 2^n strings I try n candidates and score each in
    O(1) using running counts.
- COMPLEXITY: all four are O(n) time and O(1) space, after an
  O(n^2) brute force that scores each cut by rescanning.
- WHY THIS IS "GREEDY" AND STILL EXACT:
    I am not guessing - I enumerate every candidate shape and take
    the best. The greedy part is realising the answer must HAVE
    that shape, which is the sentence to say out loud.
- THE OFF-BY-ONE THEY TEST:
    Cut positions run 0..n for the monotone version (both empty
    sides allowed) but only 1..n-1 for the split score (both sides
    must be non-empty). Read the statement carefully.
- OA REMINDER: these are auto-graded, so run the edge cases -
  all zeros, all ones, length 1 - before submitting.
- FOLLOW-UPS:
    Max consecutive ones 3 (LC 1004 - sliding window with at most
    k flips), longest subarray of 1s after deleting one element
    (LC 1493), minimum deletions to make a string balanced
    (LC 1653 - the same monotone DP).
*/
