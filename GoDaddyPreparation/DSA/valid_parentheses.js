/*
Valid Parentheses (LC 20)   [Q2.1.8]

Given a string of only ( ) { } [ ], return true if every bracket is
closed by the same type, in the correct order.

  "()[]{}" -> true
  "(]"     -> false
  "([)]"   -> false     <- crossing, this is the real test case
  "([{}])" -> true
*/

// ============================================================
// 1) INTUITION
// ============================================================
/*
- The bracket that opened LAST must close FIRST. Last in, first out.
  That sentence IS a stack. So use a stack.

- Walk the string:
      opening bracket -> push it
      closing bracket -> the stack top must be its partner
                         match  -> pop and continue
                         no top or wrong type -> return false

- At the end the stack must be EMPTY. Left over "(((" means
  brackets were opened and never closed.

- Store the pairs in a map so the check is one lookup, not a
  chain of if-else.
*/

// ============================================================
// 2) VISUAL EXAMPLE
// ============================================================
/*
s = "([{}])"                  stack (top on the right)

  (   push                    [ ( ]
  [   push                    [ (, [ ]
  {   push                    [ (, [, { ]
  }   top is { -> pop         [ (, [ ]
  ]   top is [ -> pop         [ ( ]
  )   top is ( -> pop         [ ]
  end, stack empty -> true

s = "([)]"

  (   push                    [ ( ]
  [   push                    [ (, [ ]
  )   top is [ , needs (      -> MISMATCH, return false
      this is why a plain counter of "how many open" fails:
      the counts are fine, the ORDER is not.

s = "("
  (   push                    [ ( ]
  end, stack NOT empty -> false
*/

// ============================================================
// 3) BRUTE FORCE - KEEP DELETING "()" PAIRS
// ============================================================
/*
- Repeatedly remove every "()", "[]", "{}" from the string.
  If the string becomes empty it was valid.
- Easy to say, slow: each pass rebuilds the whole string.
    Time  : O(n^2)   Space : O(n)
*/
function isValidBrute(s) {
  let current = s;
  let previous = "";

  // keep shrinking until nothing changes any more
  while (current !== previous) {
    previous = current;
    current = current.split("()").join("");
    current = current.split("[]").join("");
    current = current.split("{}").join("");
  }

  return current.length === 0;
}

// ============================================================
// 4) OPTIMAL - STACK, ONE PASS
// ============================================================
/*
- STEP 1: map closing -> opening, so a closer knows its partner.
- STEP 2: not a closer means it is an opener -> push.
- STEP 3: closer -> pop and compare. Empty stack = closer with no
    opener, so false immediately.
- STEP 4: after the loop the stack must be empty.
    Time  : O(n) - each character pushed and popped at most once.
    Space : O(n) - worst case "(((((((" is all on the stack.
*/
const CLOSER_TO_OPENER = {
  ")": "(",
  "]": "[",
  "}": "{",
};

function isValid(s) {
  // holds the openers we have seen but not closed yet
  const stack = [];

  for (let i = 0; i < s.length; i++) {
    const char = s[i];

    // an opener just waits on the stack
    if (char === "(" || char === "[" || char === "{") {
      stack.push(char);
      continue;
    }

    // a closer with nothing open before it is invalid: ")("
    if (stack.length === 0) return false;

    const top = stack.pop();

    // the popped opener must be the exact partner of this closer
    if (top !== CLOSER_TO_OPENER[char]) return false;
  }

  // anything still open was never closed
  return stack.length === 0;
}

// ============================================================
// QUICK CHECK
// ============================================================
console.log(isValid("()")); // true
console.log(isValid("()[]{}")); // true
console.log(isValid("([{}])")); // true
console.log(isValid("(]")); // false
console.log(isValid("([)]")); // false
console.log(isValid("(")); // false
console.log(isValid(")")); // false
console.log(isValid("")); // true
console.log(isValidBrute("([)]")); // false
console.log(isValidBrute("([{}])")); // true

/*
============================================================
5) SAY OUT LOUD
============================================================
- COMPLEXITY:
    Time  : O(n), one pass.
    Space : O(n) for the stack. O(1) is impossible in general -
            "((((...(" really does need to remember n openers.
- WHY A COUNTER DOES NOT WORK:
    With ONE bracket type a counter is enough (+1 open, -1 close,
    never go negative, end at 0). With THREE types the order
    matters, and "([)]" has perfect counts but crossing order.
    Say this out loud - it is the point of the question.
- THE TWO EASY-TO-MISS CASES:
    Closer arriving on an empty stack  -> ")(" is false.
    Stack not empty at the end         -> "((" is false.
- FOLLOW-UPS:
    Min add to make valid (LC 921), longest valid parentheses
    (LC 32, stack of indexes or DP), generate parentheses
    (LC 22, backtracking), remove invalid parentheses (LC 301),
    and the real-world version: matching tags in an HTML parser.
*/
