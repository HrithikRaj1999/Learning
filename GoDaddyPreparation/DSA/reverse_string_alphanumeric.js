/*
Reverse a String, then Reverse only the Alphanumeric chars   [Q2.1.7]

Part A: reverse the whole thing.
  "abcd"      -> "dcba"

Part B: reverse ONLY letters and digits, every other character
stays exactly where it is.
  "a-bC-dEf-ghIj"  -> "j-Ih-gfE-dCba"
  "Test1ng-Leet=code-Q!"  -> "Qedocte-eLgn=1tse-T!"
  (careful: LC 917 reverses LETTERS only, so its answer keeps the
   digit 1 in place. Ask which rule they want.)
*/

// ============================================================
// 1) INTUITION
// ============================================================
/*
- Part A: two pointers, one at each end. Swap, move both inward,
  stop when they meet. n/2 swaps, no extra array.

- Part B: same two pointers, but each pointer must first WALK PAST
  any character that is not a letter or digit.
      left  moves right while chars[left]  is not alphanumeric
      right moves left  while chars[right] is not alphanumeric
  then swap those two, then move both by one.

- The specials never move, because we never swap them. That is the
  whole trick: skip, do not shift.

- Strings in JS are immutable, so split into an array, swap, join.
*/

// ============================================================
// 2) VISUAL EXAMPLE
// ============================================================
/*
Part A, s = "abcd"

  [a, b, c, d]     L=0 R=3  swap a,d
  [d, b, c, a]     L=1 R=2  swap b,c
  [d, c, b, a]     L=2 R=1  crossed, stop

Part B, s = "a-bC-dEf-ghIj"

  index  0 1 2 3 4 5 6 7 8 9 10 11 12
  char   a - b C - d E f - g  h  I  j

  L=0 (a), R=12 (j)          swap  -> j - b C - d E f - g h I a
  L=1 is '-'  -> skip to 2 (b)
  R=11 (I)                   swap  -> j - I C - d E f - g h b a
  L=3 (C), R=10 (h)          swap  -> j - I h - d E f - g C b a
  L=4 is '-'  -> skip to 5 (d)
  R=9 (g)                    swap  -> j - I h - g E f - d C b a
  L=6 (E), R=8 is '-' -> skip to 7 (f)
                             swap  -> j - I h - g f E - d C b a
  L=7, R=6 crossed -> stop

  result "j-Ih-gfE-dCba"   and every '-' is still at index 1,4,8
*/

// ============================================================
// 3) PART A - REVERSE THE WHOLE STRING
// ============================================================
/*
    Time : O(n)   Space : O(n) for the array in JS (O(1) in C++
    where a string is already a mutable char array).
*/
function reverseString(s) {
  const chars = s.split("");
  let left = 0;
  let right = chars.length - 1;

  while (left < right) {
    // swap the two ends
    const temp = chars[left];
    chars[left] = chars[right];
    chars[right] = temp;

    left++;
    right--;
  }

  return chars.join("");
}

// ============================================================
// 4) BRUTE FORCE FOR PART B - COLLECT, REVERSE, PUT BACK
// ============================================================
/*
- Pull all alphanumeric chars into a list, reverse that list, then
  walk the original and drop them back into the same slots.
- Correct and very easy to explain, but uses an extra array.
    Time  : O(n)   Space : O(n)
*/
function reverseOnlyLettersBrute(s) {
  const chars = s.split("");

  // 1) collect only the alphanumeric characters
  const letters = [];
  for (let i = 0; i < chars.length; i++) {
    if (isAlphanumeric(chars[i])) letters.push(chars[i]);
  }

  // 2) put them back from the end of that list
  let takeFrom = letters.length - 1;
  for (let i = 0; i < chars.length; i++) {
    if (isAlphanumeric(chars[i])) {
      chars[i] = letters[takeFrom];
      takeFrom--;
    }
  }

  return chars.join("");
}

// ============================================================
// 5) OPTIMAL FOR PART B - TWO POINTERS, SKIP IN PLACE
// ============================================================
/*
- STEP 1: left at 0, right at the end.
- STEP 2: inner while loops push each pointer past the specials.
    Both inner loops MUST also check left < right, otherwise a
    string of only specials runs off the array.
- STEP 3: swap, then move both pointers one step.
    Time  : O(n) - every index is visited by exactly one pointer.
    Space : O(1) extra (ignoring the array JS forces on us).
*/
function isAlphanumeric(char) {
  // one helper so the rule lives in a single place
  const code = char.charCodeAt(0);
  const isDigit = code >= 48 && code <= 57; // 0-9
  const isUpper = code >= 65 && code <= 90; // A-Z
  const isLower = code >= 97 && code <= 122; // a-z
  return isDigit || isUpper || isLower;
}

function reverseOnlyLetters(s) {
  const chars = s.split("");
  let left = 0;
  let right = chars.length - 1;

  while (left < right) {
    // walk left forward until it stands on a letter or digit
    while (left < right && !isAlphanumeric(chars[left])) {
      left++;
    }

    // walk right backward until it stands on a letter or digit
    while (left < right && !isAlphanumeric(chars[right])) {
      right--;
    }

    // both pointers are on real characters now, swap them
    const temp = chars[left];
    chars[left] = chars[right];
    chars[right] = temp;

    left++;
    right--;
  }

  return chars.join("");
}

// ============================================================
// QUICK CHECK
// ============================================================
console.log(reverseString("abcd")); // "dcba"
console.log(reverseString("a")); // "a"
console.log(reverseString("")); // ""

console.log(reverseOnlyLetters("a-bC-dEf-ghIj")); // "j-Ih-gfE-dCba"
console.log(reverseOnlyLetters("Test1ng-Leet=code-Q!")); // "Qedocte-eLgn=1tse-T!"
console.log(reverseOnlyLetters("ab-cd")); // "dc-ba"
console.log(reverseOnlyLetters("----")); // "----"
console.log(reverseOnlyLetters("")); // ""
console.log(reverseOnlyLettersBrute("a-bC-dEf-ghIj")); // "j-Ih-gfE-dCba"

/*
============================================================
6) SAY OUT LOUD
============================================================
- COMPLEXITY:
    Time  : O(n) for both parts. The inner while loops look scary
            but each pointer only ever moves forward, so the total
            work is still n steps, not n^2.
    Space : O(1) extra logic-wise. In JS the split into an array
            costs O(n) because strings are immutable - I would say
            that out loud, and note that in C++/Java char[] it is
            genuinely O(1).
- THE BUG THEY LOOK FOR:
    Forgetting `left < right` INSIDE the skip loops. On "----"
    the pointers run past each other and you read undefined.
- WHY NOT SHIFT THE SPECIALS:
    Shifting turns it into O(n^2) and changes their positions.
    Skipping keeps them frozen, which is exactly the requirement.
- DEFINITION QUESTION TO ASK THEM:
    Do digits move too? Here they do (alphanumeric). LC 917 moves
    LETTERS only and freezes digits - one line changes, the
    isAlphanumeric helper drops the isDigit part.
    Also: is "alphanumeric" ASCII only? Unicode letters, accents and
    emoji need a different check (regex \p{L} with the u flag).
    Asking this scores points.
- FOLLOW-UPS:
    Valid palindrome ignoring non-alphanumeric (LC 125 - same
    skip loops, compare instead of swap), reverse words in a
    string (LC 151), reverse vowels only (LC 345 - identical
    shape, different predicate).
*/
