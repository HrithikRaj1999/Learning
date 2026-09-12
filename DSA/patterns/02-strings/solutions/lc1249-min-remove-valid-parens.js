/*
Minimum Remove to Make Valid Parentheses (LC 1249)

Delete the fewest parentheses so the string becomes valid. Letters stay.
Any valid answer is accepted.

  "lee(t(c)o)de)"    -> "lee(t(c)o)de"    (the last ')' is unmatched)
  "a)b(c)d"          -> "ab(c)d"
  "))(("             -> ""                (nothing can be saved)
*/

// ============================================================
// 1) INTUITION
// ============================================================
/*
- There are exactly two kinds of bad parenthesis:
      a ')' with no '(' waiting for it  - it is bad the moment I see it
      a '(' that is never closed        - I only learn this at the end
- So I do one left-to-right pass with a stack of the INDICES of unmatched
  '(' characters. A ')' either pops one (matched) or is marked for deletion
  immediately. Whatever is still on the stack at the end is also deleted.
- The stack holds indices, not characters, because I need to know WHERE to
  delete, not just how many.
- Marking then rebuilding is cleaner than splicing, which would shift every
  later index.

- The ladder:
    1. try removing every subset of parens, keep the valid    O(2^n)
       one with the fewest removals
    2. two passes with counters: strip surplus ')' going       O(n) time,
       right, then strip surplus '(' going left                O(n) space
    3. one pass, stack of unmatched '(' indices, delete        O(n) time,
       the marked positions                                    O(n) space

- Traps:
    - deleting while scanning shifts indices. Mark first, build second.
    - letters must be untouched, including letters between bad parens.
    - "))((" removes everything and returns "", not null.
*/

// ============================================================
// 2) VISUAL EXAMPLE
// ============================================================
/*
STACK OF INDICES view, s = "lee(t(c)o)de)"

  index    0  1  2  3  4  5  6  7  8  9 10 11 12
  char     l  e  e  (  t  (  c  )  o  )  d  e  )

  stack = []      remove = {}

  i=0..2  letters -> ignored
  i=3  '('  push 3            stack = [3]
  i=4  't'  letter
  i=5  '('  push 5            stack = [3,5]
  i=6  'c'  letter
  i=7  ')'  stack not empty -> pop 5      stack = [3]
            index 5 and 7 are a matched pair
  i=8  'o'  letter
  i=9  ')'  stack not empty -> pop 3      stack = []
            index 3 and 9 are a matched pair
  i=10 'd', i=11 'e'  letters
  i=12 ')'  stack is EMPTY -> nothing to match it, mark 12 for removal
            remove = {12}
                     ^
                     caught immediately, because a surplus ')' is bad the
                     instant it appears

  end of scan: stack is empty, so no unmatched '(' to add

  rebuild skipping index 12  ->  "lee(t(c)o)de"

  INVARIANT: the stack holds exactly the indices of '(' that are still
  waiting for a partner. If it is non-empty at the end, all of those are
  unmatched and must go.

UNMATCHED '(' case, s = "a)b(c)d("

  index    0  1  2  3  4  5  6  7
  char     a  )  b  (  c  )  d  (

  i=1  ')'  stack empty -> mark 1        remove = {1}
  i=3  '('  push 3                       stack = [3]
  i=5  ')'  pop 3                        stack = []
  i=7  '('  push 7                       stack = [7]

  end: stack = [7] is not empty -> mark 7 too   remove = {1, 7}
                                                        ^
                                                        only discovered
                                                        at the very end

  rebuild skipping 1 and 7  ->  "ab(c)d"

ALL BAD case, s = "))(("
  i=0 ')' stack empty -> mark 0
  i=1 ')' stack empty -> mark 1
  i=2 '(' push 2          stack = [2]
  i=3 '(' push 3          stack = [2,3]
  end: mark 2 and 3 too   remove = {0,1,2,3}
  rebuild -> ""

TWO COUNTER view (no stack), s = "lee(t(c)o)de)"

  pass 1, left to right, drop any ')' when open == 0:
      open: ( ->1, ( ->2, ) ->1, ) ->0, then ')' at 12 with open 0 -> DROP
      after pass 1: "lee(t(c)o)de", open ends at 0

  pass 2, right to left, drop any '(' when close == 0:
      nothing is unbalanced this time, so the string is unchanged
  answer "lee(t(c)o)de"
*/

// ============================================================
// 3) BRUTE FORCE - TRY EVERY SUBSET OF DELETIONS
// ============================================================
/*
- Remove k parentheses for k = 0, 1, 2, ... and stop at the first k where
  some choice is valid.
    Time  : O(2^n)   Space : O(n)
- Only worth naming. It does frame the problem as "minimum deletions",
  which is why the greedy answer needs a short justification.
*/
function minRemoveToMakeValidBrute(s) {
  if (s.length === 0) return "";

  // try shorter and shorter removals, first valid wins
  for (let keep = s.length; keep >= 0; keep--) {
    const found = search(s, 0, "", keep);
    if (found !== null) return found;
  }

  return "";
}

function search(s, index, built, keep) {
  if (built.length > keep) return null;

  if (index === s.length) {
    if (built.length === keep && isValid(built)) return built;
    return null;
  }

  // keep this character
  const withChar = search(s, index + 1, built + s[index], keep);
  if (withChar !== null) return withChar;

  // or drop it, but only parentheses may be dropped
  if (s[index] === "(" || s[index] === ")") {
    return search(s, index + 1, built, keep);
  }

  return null;
}

function isValid(s) {
  let open = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === "(") open++;
    else if (s[i] === ")") open--;
    if (open < 0) return false;
  }
  return open === 0;
}

// ============================================================
// 4) BETTER - TWO PASSES WITH A COUNTER, NO STACK
// ============================================================
/*
- Pass one strips surplus ')' scanning left to right.
- Pass two strips surplus '(' scanning right to left.
    Time  : O(n)   Space : O(n) for the output
- Same result, and it uses only a counter. Nice when memory matters or when
  the interviewer asks for a stack-free version.
*/
function minRemoveToMakeValidTwoPass(s) {
  if (s.length === 0) return "";

  const firstPass = [];
  let open = 0;

  for (let i = 0; i < s.length; i++) {
    if (s[i] === "(") {
      open++;
      firstPass.push(s[i]);
    } else if (s[i] === ")") {
      // no '(' is waiting, so this ')' can never be matched - drop it
      if (open === 0) continue;
      open--;
      firstPass.push(s[i]);
    } else {
      firstPass.push(s[i]);
    }
  }

  // `open` now counts the '(' that were never closed; remove that many
  // from the RIGHT, because the leftmost ones are the ones worth keeping
  const secondPass = [];
  let toRemove = open;

  for (let i = firstPass.length - 1; i >= 0; i--) {
    if (firstPass[i] === "(" && toRemove > 0) {
      toRemove--;
      continue;
    }
    secondPass.push(firstPass[i]);
  }

  return secondPass.reverse().join("");
}

// ============================================================
// 5) OPTIMAL - ONE PASS, STACK OF UNMATCHED '(' INDICES
// ============================================================
/*
- Stack the positions of open parens; a ')' pops one or is marked bad.
  Anything left on the stack at the end is also bad.
    Time  : O(n)   Space : O(n)
*/
function minRemoveToMakeValid(s) {
  if (s.length === 0) return "";

  // indices of '(' that have not found a partner yet
  const openIndices = [];
  const shouldRemove = new Set();

  for (let i = 0; i < s.length; i++) {
    if (s[i] === "(") {
      openIndices.push(i);
    } else if (s[i] === ")") {
      if (openIndices.length > 0) {
        // this ')' closes the most recent unmatched '('
        openIndices.pop();
      } else {
        // nothing is open, so this ')' is surplus
        shouldRemove.add(i);
      }
    }
  }

  // every '(' still waiting was never closed
  for (let i = 0; i < openIndices.length; i++) shouldRemove.add(openIndices[i]);

  // rebuild rather than splice, so indices never shift under me
  const kept = [];
  for (let i = 0; i < s.length; i++) {
    if (!shouldRemove.has(i)) kept.push(s[i]);
  }

  return kept.join("");
}

// ============================================================
// QUICK CHECK
// ============================================================
console.log(minRemoveToMakeValid("lee(t(c)o)de)")); // "lee(t(c)o)de"
console.log(minRemoveToMakeValid("a)b(c)d")); // "ab(c)d"
console.log(minRemoveToMakeValid("))((")); // ""
console.log(minRemoveToMakeValid("")); // ""      empty
console.log(minRemoveToMakeValid("abc")); // "abc"   no parens at all
console.log(minRemoveToMakeValid("(a(b(c)d)")); // "a(b(c)d)" or "(ab(c)d)"
console.log(minRemoveToMakeValid("()")); // "()"    already valid

console.log(minRemoveToMakeValidTwoPass("lee(t(c)o)de)")); // "lee(t(c)o)de"
console.log(minRemoveToMakeValidTwoPass("a)b(c)d")); // "ab(c)d"
console.log(minRemoveToMakeValidTwoPass("))((")); // ""
console.log(minRemoveToMakeValidBrute("a)b(c)d")); // "ab(c)d"
console.log(isValid(minRemoveToMakeValid("(a(b(c)d)"))); // true

/*
============================================================
SAY OUT LOUD
============================================================
- COMPLEXITY LADDER:
    every subset   O(2^n) time
    two passes     O(n) time, O(n) output
    one pass stack O(n) time, O(n) space
- THE TWO KINDS OF BAD PARENTHESIS:
    a ')' with nothing open is bad IMMEDIATELY.
    a '(' is only known to be bad at the END of the string.
    That asymmetry is the whole problem, and it is why one pass plus a
    final cleanup is enough.
- WHY THE STACK HOLDS INDICES:
    I need to know where to delete, not just how many. A counter alone
    tells me the count but not the positions, which is why the two-pass
    version needs a second scan from the right.
- WHY I MARK INSTEAD OF SPLICE:
    deleting during the scan shifts every later index, so any position I
    recorded becomes wrong. Mark in a Set, rebuild once at the end.
- WHY THE RESULT IS MINIMAL:
    every index I delete is provably impossible to match - a ')' with no
    open partner, or a '(' with no closer anywhere to its right. Deleting
    only forced characters means the count is minimal.
- FOLLOW-UPS:
    Valid Parentheses (LC 20), Remove Invalid Parentheses (LC 301, harder -
    it wants ALL minimal results, so it needs BFS),
    Valid Parenthesis String (LC 678), Longest Valid Parentheses (LC 32).
*/
