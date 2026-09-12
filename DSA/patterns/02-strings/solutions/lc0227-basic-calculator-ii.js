/*
Basic Calculator II (LC 227)

Evaluate an expression with + - * / and spaces. No parentheses.
Integer division truncates toward zero. Follow normal precedence.

  "3+2*2"     -> 7    (2*2 first, then +3)
  " 3/2 "     -> 1    (truncated)
  "3+5 / 2"   -> 5    (5/2 = 2, then 3+2)
*/

// ============================================================
// 1) INTUITION
// ============================================================
/*
- Precedence is the only difficulty. Without it, a running total would do.
- The trick that removes all the difficulty: DELAY the addition.
  I keep a stack of numbers that are all waiting to be summed at the end.
      '+'  push  +number
      '-'  push  -number
      '*'  pop the top, multiply, push the result back
      '/'  pop the top, divide, push the result back
  Because * and / act on the top of the stack immediately, they bind
  tighter than + and - automatically. No precedence table needed.
- At the end, just add up the stack.
- The bookkeeping trick: remember the PREVIOUS operator, not the next one.
  When I finish reading a number, I apply the operator that came before it.
  The expression starts as if a '+' had just been read.

- The ladder:
    1. two passes: scan for * and / and collapse them,     O(n) time,
       then sum what is left                               O(n) space
    2. stack of pending terms, apply * and / on the fly    O(n) time, O(n)
    3. same idea with one variable instead of a stack:      O(n) time, O(1)
       keep `lastTerm` and fold into `total`

- Traps:
    - multi-digit numbers: "12+3" must read 12.
    - integer division truncates toward zero. In JavaScript Math.floor is
      WRONG for negatives (-3/2 must be -1, floor gives -2). Use trunc.
    - spaces can appear anywhere and must be ignored.
    - the last number has no trailing operator, so the final apply must
      happen after the loop (or the loop must include the last index).
*/

// ============================================================
// 2) VISUAL EXAMPLE
// ============================================================
/*
STACK view, s = "3+5/2"

  previousOp = '+' (as if the expression started with a plus)
  number = 0,  stack = []

  read '3'  -> number = 0*10 + 3 = 3
  hit '+'   -> apply previousOp '+' to number 3:  push +3
               stack = [3]
               previousOp = '+', number = 0
  read '5'  -> number = 5
  hit '/'   -> apply previousOp '+' to number 5:  push +5
               stack = [3, 5]
               previousOp = '/', number = 0
  read '2'  -> number = 2
  end       -> apply previousOp '/' to number 2:
               pop 5, compute trunc(5 / 2) = 2, push 2
               stack = [3, 2]

  sum the stack: 3 + 2 = 5

  answer 5

  INVARIANT: everything on the stack is waiting to be ADDED. * and / never
  leave a pending term because they consume the top immediately - that is
  precedence, enforced by the data structure instead of by rules.

PRECEDENCE view, s = "3+2*2"

  read 3, hit '+'  -> push +3            stack = [3]
                      previousOp = '+'
  read 2, hit '*'  -> apply '+': push +2 stack = [3, 2]
                      previousOp = '*'
  read 2, end      -> apply '*': pop 2, 2 * 2 = 4, push 4
                                         stack = [3, 4]
                                                    ^
                                 the 2 was replaced, not added separately
  sum = 3 + 4 = 7

SUBTRACTION IS A NEGATIVE PUSH, s = "10-4*2"

  read 10, hit '-' -> apply '+': push +10   stack = [10]
                      previousOp = '-'
  read 4,  hit '*' -> apply '-': push -4    stack = [10, -4]
                      previousOp = '*'
  read 2,  end     -> apply '*': pop -4, -4 * 2 = -8, push -8
                                            stack = [10, -8]
  sum = 10 + (-8) = 2      check: 10 - 8 = 2   OK

  Pushing -4 instead of 4 is what makes "subtract" work with a plain sum.

TRUNCATION TRAP, "-3/2"
    Math.floor(-1.5) = -2      WRONG for this problem
    Math.trunc(-1.5) = -1      correct - truncate toward zero
*/

// ============================================================
// 3) BRUTE FORCE - TWO PASSES OVER TOKENS
// ============================================================
/*
- Tokenise first, then collapse every * and / left to right, then sum the
  remaining + and - terms.
    Time  : O(n)   Space : O(n)
- Very easy to explain because it mirrors how precedence is taught. It just
  needs two loops instead of one.
*/
function calculateTwoPass(s) {
  if (s.length === 0) return 0;

  const tokens = tokenise(s);

  // pass 1: collapse * and /
  const collapsed = [];
  let i = 0;

  while (i < tokens.length) {
    if (tokens[i] === "*" || tokens[i] === "/") {
      const left = collapsed.pop();
      const right = tokens[i + 1];

      collapsed.push(tokens[i] === "*" ? left * right : Math.trunc(left / right));
      i = i + 2;
    } else {
      collapsed.push(tokens[i]);
      i++;
    }
  }

  // pass 2: sum the + and - chain left to right
  let total = collapsed[0];
  for (let j = 1; j < collapsed.length; j = j + 2) {
    if (collapsed[j] === "+") total = total + collapsed[j + 1];
    else total = total - collapsed[j + 1];
  }

  return total;
}

function tokenise(s) {
  const tokens = [];
  let i = 0;

  while (i < s.length) {
    if (s[i] === " ") {
      i++;
    } else if (isDigit(s[i])) {
      let number = 0;
      // multi-digit numbers must be read whole
      while (i < s.length && isDigit(s[i])) {
        number = number * 10 + Number(s[i]);
        i++;
      }
      tokens.push(number);
    } else {
      tokens.push(s[i]);
      i++;
    }
  }

  return tokens;
}

function isDigit(ch) {
  const code = ch.charCodeAt(0);
  return code >= 48 && code <= 57;
}

// ============================================================
// 4) OPTIMAL - STACK OF PENDING TERMS (THE ONE TO WRITE)
// ============================================================
/*
- One pass. Push for + and -, collapse the top for * and /, sum at the end.
    Time  : O(n)   Space : O(n)
- This is the version to write: it generalises straight into LC 224 by
  adding a case for parentheses.
*/
function calculate(s) {
  if (s.length === 0) return 0;

  const stack = [];
  let number = 0;
  // pretend the expression began with a '+', so the first number is pushed
  let previousOp = "+";

  for (let i = 0; i < s.length; i++) {
    const ch = s[i];

    if (isDigit(ch)) {
      number = number * 10 + Number(ch);
    }

    const isOperator = ch === "+" || ch === "-" || ch === "*" || ch === "/";
    const isLastCharacter = i === s.length - 1;

    // act when an operator arrives, or when the string runs out
    if (isOperator || isLastCharacter) {
      if (previousOp === "+") {
        stack.push(number);
      } else if (previousOp === "-") {
        // subtraction is just adding a negative, so the final sum works
        stack.push(-number);
      } else if (previousOp === "*") {
        // bind tighter: consume the pending term instead of adding one
        stack.push(stack.pop() * number);
      } else {
        // trunc, not floor - division truncates toward zero
        stack.push(Math.trunc(stack.pop() / number));
      }

      previousOp = ch;
      number = 0;
    }
  }

  let total = 0;
  for (let i = 0; i < stack.length; i++) total = total + stack[i];

  return total;
}

// ============================================================
// 5) BEST - O(1) SPACE, ONE PENDING TERM INSTEAD OF A STACK
// ============================================================
/*
- The stack only ever needs its TOP for * and /, and everything below is
  already committed. So I can keep a running `total` plus a single
  `lastTerm` that * and / are allowed to rewrite.
    Time  : O(n)   Space : O(1)
- Fold lastTerm into total whenever a + or - arrives.
*/
function calculateConstantSpace(s) {
  if (s.length === 0) return 0;

  let total = 0;
  let lastTerm = 0; // the term * and / are still allowed to modify
  let number = 0;
  let previousOp = "+";

  for (let i = 0; i < s.length; i++) {
    const ch = s[i];

    if (isDigit(ch)) number = number * 10 + Number(ch);

    const isOperator = ch === "+" || ch === "-" || ch === "*" || ch === "/";
    const isLastCharacter = i === s.length - 1;

    if (isOperator || isLastCharacter) {
      if (previousOp === "+" || previousOp === "-") {
        // the old term can never change again, so commit it
        total = total + lastTerm;
        lastTerm = previousOp === "+" ? number : -number;
      } else if (previousOp === "*") {
        lastTerm = lastTerm * number;
      } else {
        lastTerm = Math.trunc(lastTerm / number);
      }

      previousOp = ch;
      number = 0;
    }
  }

  return total + lastTerm;
}

// ============================================================
// QUICK CHECK
// ============================================================
console.log(calculate("3+2*2")); // 7    precedence
console.log(calculate(" 3/2 ")); // 1    truncation, spaces
console.log(calculate("3+5 / 2")); // 5
console.log(calculate("42")); // 42   single number
console.log(calculate("14-3/2")); // 13
console.log(calculate("1*2-3/4+5*6-7*8+9/10")); // -24
console.log(calculate("0-2147483647")); // -2147483647
console.log(calculate("100/3/3")); // 11   left to right

console.log(calculateConstantSpace("3+2*2")); // 7
console.log(calculateConstantSpace("1*2-3/4+5*6-7*8+9/10")); // -24
console.log(calculateConstantSpace("14-3/2")); // 13
console.log(calculateTwoPass("3+2*2")); // 7
console.log(calculateTwoPass("1*2-3/4+5*6-7*8+9/10")); // -24
console.log(calculateTwoPass("100/3/3")); // 11

/*
============================================================
SAY OUT LOUD
============================================================
- COMPLEXITY LADDER:
    two passes    O(n) time, O(n) space
    stack         O(n) time, O(n) space
    one variable  O(n) time, O(1) space
- HOW PRECEDENCE IS HANDLED WITHOUT ANY PRECEDENCE CODE:
    everything on the stack is waiting to be summed. + and - PUSH a new
    pending term; * and / REWRITE the top one. So multiplication binds to
    its neighbour automatically. That is the whole idea of the solution.
- THE "PREVIOUS OPERATOR" PATTERN:
    I act on the operator that came BEFORE the number I just finished
    reading, seeding it with '+'. This removes every special case for the
    first number, and the "or last character" test handles the last one.
- THE REAL TRAP:
    Math.floor for division. The problem truncates toward zero, so -3/2 is
    -1, but floor gives -2. Math.trunc is the correct choice, and this bug
    only shows up on a negative test case.
- THE SECOND TRAP:
    multi-digit numbers. number = number * 10 + digit, not a single parse.
- FOLLOW-UPS:
    Basic Calculator (LC 224, adds parentheses - push the context on a
    stack, same as this one), Basic Calculator III (LC 772, both together),
    Evaluate Reverse Polish Notation (LC 150, precedence already resolved),
    Expression Add Operators (LC 282).
*/
