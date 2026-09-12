/*
String Shift   [Q2.7.6]  (Interview Query GoDaddy bank)

You get a string and a list of shift operations [direction, amount].
direction 0 = shift LEFT, 1 = shift RIGHT. Apply them all.

  s = "abc", shifts = [[0,1],[1,2]]
  left 1  -> "bca"
  right 2 -> "cab"

Related: LC 189 rotate array, LC 796 rotate string.
*/

// ============================================================
// 1) INTUITION
// ============================================================
/*
- THE KEY OBSERVATION: shifting left 1 then right 1 is doing
  nothing. So do NOT apply the shifts one by one - add them up
  into a single net shift, then rotate ONCE.

      net = sum of (right amounts) - sum of (left amounts)

- A rotation by the length is also nothing ("abc" shifted 3 = "abc"),
  so reduce with modulo:
      net = net % length
  and if net is negative, add length to make it positive.
  In JS, -1 % 3 is -1, not 2 - that is the trap.

- Right shift by k means the last k characters move to the front:
      result = s.slice(-k) + s.slice(0, -k)
  A left shift by k is the same as a right shift by (length - k).

- O(1) SPACE version (for an array): the REVERSAL trick.
      reverse the whole thing
      reverse the first k
      reverse the rest
  Three reversals, no extra array. This is LC 189's optimal.
*/

// ============================================================
// 2) VISUAL EXAMPLE
// ============================================================
/*
s = "abc", shifts = [[0,1],[1,2]]

  naive, one at a time:
      left 1  : "abc" -> "bca"
      right 2 : "bca" -> "cab"

  smart, add them first:
      left 1  = -1
      right 2 = +2
      net = +1  ->  right shift by 1
      "abc" -> "cab"      same answer, ONE rotation

RIGHT SHIFT BY 1, s = "abc"
      a b c
          ^ last 1 char moves to the front
      c a b

BIG SHIFT, s = "abcde" (length 5), net = 12
      12 % 5 = 2  ->  right 2
      "abcde" -> "deabc"
      applying 12 rotations one by one would be 12x the work

NEGATIVE NET, length 3, net = -1
      -1 % 3 in JS is -1  (NOT 2)
      fix: (-1 % 3 + 3) % 3 = 2  -> right 2 = left 1  ✓

REVERSAL TRICK, right shift [1,2,3,4,5] by 2

  reverse all        5 4 3 2 1
  reverse first 2    4 5 3 2 1
  reverse the rest   4 5 1 2 3   ✓
*/

// ============================================================
// 3) BRUTE FORCE - APPLY EVERY SHIFT ONE BY ONE
// ============================================================
/*
- Rebuild the string for every operation.
    Time  : O(shifts * n)   Space : O(n)
- Correct, and it is what most people write first. Then improve.
*/
function stringShiftBrute(s, shifts) {
  let current = s;

  for (const [direction, amount] of shifts) {
    // one full rotation changes nothing, so reduce first
    const steps = amount % current.length;
    if (steps === 0) continue;

    if (direction === 0) {
      // LEFT: the first `steps` characters move to the back
      current = current.slice(steps) + current.slice(0, steps);
    } else {
      // RIGHT: the last `steps` characters move to the front
      current = current.slice(current.length - steps) + current.slice(0, current.length - steps);
    }
  }

  return current;
}

// ============================================================
// 4) OPTIMAL - ADD THE SHIFTS, ROTATE ONCE
// ============================================================
/*
- STEP 1: net = sum, right positive, left negative.
- STEP 2: net %= length, then fix a negative net by adding length.
- STEP 3: one slice-and-join.
    Time  : O(shifts + n)   Space : O(n) for the new string.
*/
function stringShift(s, shifts) {
  if (s.length === 0) return s;

  // STEP 1 - collapse every operation into one number
  let net = 0;
  for (const [direction, amount] of shifts) {
    net = net + (direction === 1 ? amount : -amount);
  }

  // STEP 2 - full rotations do nothing; JS % can be negative,
  // so add length and take the modulo again
  net = ((net % s.length) + s.length) % s.length;

  if (net === 0) return s;

  // STEP 3 - a right shift by net: the tail moves to the front
  return s.slice(s.length - net) + s.slice(0, s.length - net);
}

// ============================================================
// 5) O(1) SPACE - THE THREE REVERSALS (LC 189 STYLE)
// ============================================================
/*
- Works on an array in place. Reverse everything, then reverse
  the two pieces back.
    Time  : O(n)   Space : O(1)
*/
function reverseRange(chars, start, end) {
  let left = start;
  let right = end;

  while (left < right) {
    const temp = chars[left];
    chars[left] = chars[right];
    chars[right] = temp;
    left++;
    right--;
  }
}

function rotateRight(chars, k) {
  const n = chars.length;
  if (n === 0) return chars;

  // same normalisation as above
  const steps = ((k % n) + n) % n;
  if (steps === 0) return chars;

  // whole thing, then the two halves back
  reverseRange(chars, 0, n - 1);
  reverseRange(chars, 0, steps - 1);
  reverseRange(chars, steps, n - 1);

  return chars;
}

function stringShiftInPlace(s, shifts) {
  let net = 0;
  for (const [direction, amount] of shifts) {
    net = net + (direction === 1 ? amount : -amount);
  }

  const chars = s.split("");
  rotateRight(chars, net);
  return chars.join("");
}

// ============================================================
// QUICK CHECK
// ============================================================
console.log(stringShift("abc", [[0, 1], [1, 2]])); // "cab"
console.log(stringShift("abcdefg", [[1, 1], [1, 1], [0, 2], [1, 3]])); // "efgabcd"
console.log(stringShift("abc", [[0, 1], [1, 1]])); // "abc"  (cancel out)
console.log(stringShift("abcde", [[1, 12]])); // "deabc" (12 % 5 = 2)
console.log(stringShift("abc", [])); // "abc"
console.log(stringShift("", [[0, 3]])); // ""

console.log(stringShiftBrute("abc", [[0, 1], [1, 2]])); // "cab"
console.log(stringShiftInPlace("abc", [[0, 1], [1, 2]])); // "cab"
console.log(rotateRight([1, 2, 3, 4, 5], 2)); // [4,5,1,2,3]
console.log(rotateRight([1, 2], 3)); // [2,1]

/*
============================================================
6) SAY OUT LOUD
============================================================
- THE OPTIMISATION IN ONE SENTENCE:
    Left and right shifts cancel, and a shift of `length` is a
    no-op, so I collapse every operation into one net rotation
    modulo the length and rotate exactly once.
- COMPLEXITY:
    Brute   : O(shifts * n) time.
    Optimal : O(shifts + n) time - one pass to add, one to build.
    In place: O(n) time, O(1) extra space with three reversals.
- THE JS TRAP:
    -1 % 3 === -1 in JavaScript (and Java, and C++). The fix is
    ((x % n) + n) % n. Python's % already returns 2, so the bug
    only shows up in some languages. Worth naming.
- EMPTY STRING: modulo by 0 gives NaN, so guard the length first.
- WHY THE REVERSAL TRICK WORKS:
    Reversing the whole array puts the tail at the front but
    backwards; reversing each of the two pieces fixes their
    internal order. Three O(n) passes, no extra memory.
- FOLLOW-UPS:
    Rotate array (LC 189), rotate string / is one a rotation of
    the other (LC 796 - check s2 is inside s1+s1), rotate a
    linked list (LC 61), rotate an image (LC 48).
*/
