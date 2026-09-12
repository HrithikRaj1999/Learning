/*
Valid Parenthesis String (LC 678)

The string has '(', ')' and '*'. Each '*' can become '(' or ')' or "".
Is there SOME choice that makes the string balanced?

  "()"     -> true
  "(*)"    -> true   (* becomes empty, or the pair still balances)
  "(*))"   -> true   (* becomes '(' so it reads "(())")
  ")("     -> false  (no choice can fix the order)
*/

// ============================================================
// 1) INTUITION
// ============================================================
/*
- Without '*' this is the classic counter problem: walk left to right,
  +1 for '(', -1 for ')', and it is valid if the counter never goes
  negative and ends at 0.
- The '*' makes the counter uncertain. But I do not need to try every
  combination - I only need to track the RANGE the counter could be in:
      low  = the count if every '*' so far became ')'   (most pessimistic)
      high = the count if every '*' so far became '('   (most optimistic)
- Rules:
      '('  -> low++, high++
      ')'  -> low--, high--
      '*'  -> low--, high++      (it could be either, or nothing)
- If `high` ever goes below 0, even the most generous choice has too many
  ')' - fail immediately.
- `low` may go below 0 harmlessly; it just means I chose badly. Clamp it
  back to 0, because an open count can never actually be negative.
- At the end, valid exactly when low == 0, i.e. 0 is still inside the range.

- The ladder:
    1. try all 3^k substitutions for the stars     O(3^k), exponential
    2. two stacks of INDICES: one for '(' and      O(n) time, O(n) space
       one for '*', match leftovers at the end
    3. greedy low/high range in one pass            O(n) time, O(1) space

- Traps:
    - clamping low at 0 is essential. Without it, "*)" style prefixes make
      low drift negative and the final low == 0 test fails wrongly.
    - the failure test is on HIGH, not low. high < 0 is unrecoverable.
    - in the two-stack version, a '*' can only cancel a '(' that appears
      BEFORE it, so index order must be checked.
*/

// ============================================================
// 2) VISUAL EXAMPLE
// ============================================================
/*
LOW / HIGH RANGE view, s = "(*))"

  index    0    1    2    3
  char     (    *    )    )

  start    low = 0, high = 0

  i=0 '('  low  = 0 + 1 = 1
           high = 0 + 1 = 1        range [1,1]
  i=1 '*'  low  = 1 - 1 = 0        (star acts as ')')
           high = 1 + 1 = 2        (star acts as '(')
                                   range [0,2]
  i=2 ')'  low  = 0 - 1 = -1  -> clamp to 0
           high = 2 - 1 = 1        range [0,1]
                  ^
                  clamping is what says "I could have made a better choice"
  i=3 ')'  low  = 0 - 1 = -1  -> clamp to 0
           high = 1 - 1 = 0        range [0,0]

  end: low == 0 -> TRUE
  (the witness is * = '(' giving "(())")

FAILURE case, s = ")("

  i=0 ')'  low = -1 -> clamp 0
           high = 0 - 1 = -1
                  ^
                  high < 0: even if EVERY star were '(', there are already
                  more ')' than '(' -> return false immediately

FAILURE case with stars, s = "*)("  -> also false
  i=0 '*'  low = -1 -> 0,  high = 1        range [0,1]
  i=1 ')'  low = -1 -> 0,  high = 0        range [0,0]
  i=2 '('  low = 1,        high = 1        range [1,1]
  end: low = 1 != 0 -> false   (one '(' is left unmatched)

  INVARIANT: [low, high] is exactly the set of open-paren counts still
  reachable. Valid at the end means 0 is still in that set, and low is the
  bottom of it.

TWO STACK view, s = "(*))"    (stacks hold INDICES)

  i=0 '('  open  = [0]
  i=1 '*'  stars = [1]
  i=2 ')'  pop from open -> open = []          matched index 0 with 2
  i=3 ')'  open is empty, so pop from stars -> stars = []
                                               the '*' at 1 became '('
  both stacks empty -> true

  A leftover check is needed too: any '(' left must be cancelled by a '*'
  that comes AFTER it. Here nothing is left, so it passes.
*/

// ============================================================
// 3) BRUTE FORCE - TRY EVERY SUBSTITUTION
// ============================================================
/*
- Each '*' has three choices, so recurse over all of them.
    Time  : O(3^k) where k = number of stars   Space : O(n) recursion
- Only worth saying as one sentence. It does show the problem is a search,
  which sets up why the range trick is such a big win.
*/
function checkValidStringBrute(s) {
  if (s.length === 0) return true;
  return explore(s, 0, 0);
}

function explore(s, index, open) {
  // more ')' than '(' at any point is unrecoverable
  if (open < 0) return false;

  if (index === s.length) return open === 0;

  if (s[index] === "(") return explore(s, index + 1, open + 1);
  if (s[index] === ")") return explore(s, index + 1, open - 1);

  // a star branches three ways
  return (
    explore(s, index + 1, open + 1) ||
    explore(s, index + 1, open - 1) ||
    explore(s, index + 1, open)
  );
}

// ============================================================
// 4) BETTER - TWO STACKS OF INDICES
// ============================================================
/*
- One stack of '(' positions, one of '*' positions. Close with a real '('
  first, fall back to a '*'. At the end, every leftover '(' must be paired
  with a '*' that sits to its RIGHT.
    Time  : O(n)   Space : O(n)
- Slower in memory, but it produces an actual witness, which is handy if
  the follow-up asks "show me the assignment".
*/
function checkValidStringStacks(s) {
  if (s.length === 0) return true;

  const openIndices = [];
  const starIndices = [];

  for (let i = 0; i < s.length; i++) {
    if (s[i] === "(") {
      openIndices.push(i);
    } else if (s[i] === "*") {
      starIndices.push(i);
    } else {
      // prefer closing a real '(' so stars stay available
      if (openIndices.length > 0) {
        openIndices.pop();
      } else if (starIndices.length > 0) {
        starIndices.pop();
      } else {
        // nothing at all to match this ')'
        return false;
      }
    }
  }

  // every leftover '(' needs a star strictly to its right
  while (openIndices.length > 0 && starIndices.length > 0) {
    if (openIndices[openIndices.length - 1] > starIndices[starIndices.length - 1]) {
      // the star is to the LEFT of the '(' - it cannot close it
      return false;
    }
    openIndices.pop();
    starIndices.pop();
  }

  return openIndices.length === 0;
}

// ============================================================
// 5) OPTIMAL - GREEDY LOW / HIGH RANGE (THE ONE TO WRITE)
// ============================================================
/*
- Track the smallest and largest possible open count in one pass.
    Time  : O(n)   Space : O(1)
*/
function checkValidString(s) {
  if (s.length === 0) return true;

  let low = 0; // open count if every '*' so far were ')'
  let high = 0; // open count if every '*' so far were '('

  for (let i = 0; i < s.length; i++) {
    if (s[i] === "(") {
      low++;
      high++;
    } else if (s[i] === ")") {
      low--;
      high--;
    } else {
      // a star pulls the range apart in both directions
      low--;
      high++;
    }

    // even the most generous reading has too many ')' - unrecoverable
    if (high < 0) return false;

    // an open count cannot really be negative; I just chose stars badly
    if (low < 0) low = 0;
  }

  // valid exactly when zero open parens is still a reachable outcome
  return low === 0;
}

// ============================================================
// QUICK CHECK
// ============================================================
console.log(checkValidString("()")); // true
console.log(checkValidString("(*)")); // true
console.log(checkValidString("(*))")); // true
console.log(checkValidString(")(")); // false  order is wrong
console.log(checkValidString("")); // true   empty
console.log(checkValidString("*")); // true   star becomes nothing
console.log(checkValidString("(((((")); // false  never closed
console.log(checkValidString("(*()")); // true   star becomes ')' -> "()()"
console.log(checkValidString("((*)")); // true
console.log(checkValidString("((*")); // false  two '(' left over

console.log(checkValidStringBrute("(*))")); // true
console.log(checkValidStringBrute("((*")); // false
console.log(checkValidStringStacks("(*))")); // true
console.log(checkValidStringStacks(")(")); // false
console.log(checkValidStringStacks("((*")); // false
console.log(checkValidStringStacks("((*)")); // true

/*
============================================================
SAY OUT LOUD
============================================================
- COMPLEXITY LADDER:
    try every star   O(3^k) time, O(n) recursion depth
    two stacks       O(n) time, O(n) space
    low/high range   O(n) time, O(1) space
- THE CORE IDEA:
    I do not need to know what each star became. I only need to know the
    RANGE of open counts still possible. Two numbers replace an exponential
    search.
- WHY high < 0 FAILS BUT low < 0 DOES NOT:
    high is the best case. If even the best case has surplus ')', nothing
    can save it. low is the worst case, and a worst case going negative
    just means that particular guess was bad - so I clamp it to 0.
- THE CLAMP IS THE WHOLE TRICK:
    forget it and "(*))" style inputs drift low negative and the final
    low == 0 test wrongly fails. I would call the clamp out explicitly.
- WHY low == 0 AT THE END:
    the reachable counts form the contiguous range [low, high]. Balanced
    means 0 is reachable, and since low is never negative after clamping,
    0 is in the range exactly when low is 0.
- FOLLOW-UPS:
    Valid Parentheses (LC 20, plain stack),
    Minimum Remove to Make Valid Parentheses (LC 1249),
    Minimum Add to Make Parentheses Valid (LC 921),
    Longest Valid Parentheses (LC 32).
*/
