/*
Basic Calculator (LC 224)

Evaluate an expression with + - ( ) and spaces. No * or /.
Unary minus is allowed: "-(2+3)" and "-2+1" are both legal.

  "1 + 1"              -> 2
  " 2-1 + 2 "          -> 3
  "(1+(4+5+2)-3)+(6+8)" -> 23
  "-(3+4)"             -> -7
*/

// ============================================================
// 1) INTUITION
// ============================================================
/*
- Without parentheses this is a running total: keep a sign of +1 or -1,
  add sign * number each time a number ends.
- Parentheses are the twist. When a '(' arrives, the total and the sign I
  am carrying belong to the OUTER expression, so I park both on a stack and
  start a fresh total. When ')' arrives, I pop them back and fold the inner
  result in.
- The key realisation: I never need to evaluate the bracket contents
  separately. A '(' just means "remember where I was".
- Because there is no * or /, precedence never comes up. Only grouping does.

- The ladder:
    1. recursive descent: on '(' recurse, on ')' return    O(n) time,
                                                           O(depth) stack
    2. stack of (total, sign) pairs, one pass               O(n) time,
                                                            O(depth) space
    3. flatten the signs: precompute the effective sign of  O(n) time,
       each term so no total ever needs stacking            O(depth) for
                                                            the sign stack

- Traps:
    - unary minus. "-2+1" starts with an operator, and "(-3)" has one right
      after a bracket. Seeding total = 0 and sign = +1 makes both work with
      no special case.
    - multi-digit numbers.
    - the last number has no trailing operator, so it must be folded in
      after the loop ends.
    - a ')' can immediately follow a number, so the number must be flushed
      before the pop.
*/

// ============================================================
// 2) VISUAL EXAMPLE
// ============================================================
/*
STACK OF CONTEXT view, s = "(1+(4+5+2)-3)+(6+8)"

  total = 0, sign = +1, stack = []

  '('   park the outer context and reset
          push total 0, push sign +1     stack = [0, 1]
          total = 0, sign = +1
  '1'   number = 1
  '+'   flush: total = 0 + (+1 * 1) = 1;  sign = +1
  '('   park again
          push total 1, push sign +1     stack = [0, 1, 1, 1]
          total = 0, sign = +1
  '4'   ... '+' -> total = 4
  '5'   ... '+' -> total = 9
  '2'   number = 2
  ')'   flush the pending number: total = 9 + 2 = 11
          pop sign  = +1
          pop outer = 1
          total = 1 + (+1 * 11) = 12       stack = [0, 1]
                      ^
                      the popped sign is the one that sat BEFORE the '('
  '-'   sign = -1
  '3'   number = 3
  ')'   flush: total = 12 + (-1 * 3) = 9
          pop sign = +1, pop outer = 0
          total = 0 + (+1 * 9) = 9         stack = []
  '+'   sign = +1
  '('   push total 9, push sign +1         stack = [9, 1]
          total = 0
  '6'   '+' -> total = 6
  '8'   number = 8
  ')'   flush: total = 6 + 8 = 14
          pop sign +1, pop outer 9
          total = 9 + 14 = 23
  end   nothing pending

  answer 23

  INVARIANT: `total` is always the fully evaluated value of the innermost
  bracket I am currently inside. The stack holds the partial totals of every
  enclosing bracket, plus the sign each one was entered with.

UNARY MINUS, s = "-(3+4)"

  total = 0, sign = +1
  '-'   sign = -1                (there was no number before it, and that
                                  is fine: total is already 0)
  '('   push total 0, push sign -1    stack = [0, -1]
        total = 0, sign = +1
  '3' '+' -> total = 3
  '4'   number = 4
  ')'   flush: total = 3 + 4 = 7
        pop sign = -1, pop outer = 0
        total = 0 + (-1 * 7) = -7
                     ^
                     the parked sign applies to the whole bracket
  answer -7

  Seeding total = 0 is what makes a leading '-' harmless - it just subtracts
  from zero.

SIMPLE case, s = " 2-1 + 2 "
  '2' then '-' -> total = 0 + 2 = 2, sign = -1
  '1' then '+' -> total = 2 - 1 = 1, sign = +1
  '2' then end -> total = 1 + 2 = 3
  answer 3
*/

// ============================================================
// 3) BRUTE FORCE - RECURSIVE DESCENT
// ============================================================
/*
- Evaluate one bracket per call: on '(' recurse for the inner value, on ')'
  return what has been built.
    Time  : O(n)   Space : O(depth) call stack
- Very readable, and it is how a real parser is written. The only awkward
  part is sharing the index across calls.
*/
function calculateRecursive(s) {
  if (s.length === 0) return 0;

  const cursor = { index: 0 };
  return evaluate(s, cursor);
}

function evaluate(s, cursor) {
  let total = 0;
  let sign = 1;
  let number = 0;

  while (cursor.index < s.length) {
    const ch = s[cursor.index];

    if (isDigit(ch)) {
      number = number * 10 + Number(ch);
      cursor.index++;
    } else if (ch === "+" || ch === "-") {
      // the previous number is complete - fold it in with its sign
      total = total + sign * number;
      number = 0;
      sign = ch === "+" ? 1 : -1;
      cursor.index++;
    } else if (ch === "(") {
      cursor.index++; // step over '('
      // the bracket's value takes the place of a number
      number = evaluate(s, cursor);
    } else if (ch === ")") {
      cursor.index++; // step over ')'
      return total + sign * number;
    } else {
      cursor.index++; // a space
    }
  }

  return total + sign * number;
}

function isDigit(ch) {
  const code = ch.charCodeAt(0);
  return code >= 48 && code <= 57;
}

// ============================================================
// 4) OPTIMAL - ONE PASS, STACK OF (TOTAL, SIGN) (THE ONE TO WRITE)
// ============================================================
/*
- On '(' push the running total and the current sign, then reset.
  On ')' pop them and fold the inner total in.
    Time  : O(n)   Space : O(depth)
- No recursion depth limit, and every rule is one branch.
*/
function calculate(s) {
  if (s.length === 0) return 0;

  const stack = [];
  let total = 0; // value of the bracket I am currently inside
  let sign = 1; // sign that applies to the NEXT number
  let number = 0;

  for (let i = 0; i < s.length; i++) {
    const ch = s[i];

    if (isDigit(ch)) {
      number = number * 10 + Number(ch);
    } else if (ch === "+") {
      // the number just read is finished, so commit it
      total = total + sign * number;
      number = 0;
      sign = 1;
    } else if (ch === "-") {
      total = total + sign * number;
      number = 0;
      sign = -1;
    } else if (ch === "(") {
      // park the outer context; total 0 makes a leading '-' safe
      stack.push(total);
      stack.push(sign);
      total = 0;
      sign = 1;
    } else if (ch === ")") {
      // a ')' can follow a number directly, so flush it first
      total = total + sign * number;
      number = 0;

      // the sign that sat before the '(' applies to the whole bracket
      const bracketSign = stack.pop();
      const outerTotal = stack.pop();
      total = outerTotal + bracketSign * total;
    }
    // spaces need no branch at all
  }

  // the final number has no operator after it
  return total + sign * number;
}

// ============================================================
// 5) BEST - FLATTEN THE SIGNS, NO TOTAL EVER STACKED
// ============================================================
/*
- Instead of stacking totals, stack only the EFFECTIVE SIGN of the bracket
  I am inside. Then every number can be added straight into one grand total.
      "1-(2+3)"  ->  +1 -2 -3
    Time  : O(n)   Space : O(depth) for the sign stack
- Slightly slimmer, and it makes clear that parentheses without * or / do
  nothing except flip signs.
*/
function calculateSignFlattening(s) {
  if (s.length === 0) return 0;

  let total = 0;
  let sign = 1; // sign for the next number, already combined with the
  // enclosing brackets
  let number = 0;

  // the effective sign in force for each enclosing bracket
  const signStack = [1];

  for (let i = 0; i < s.length; i++) {
    const ch = s[i];

    if (isDigit(ch)) {
      number = number * 10 + Number(ch);
    } else if (ch === "+" || ch === "-") {
      total = total + sign * number;
      number = 0;
      // combine the local sign with whatever the enclosing bracket imposes
      const outer = signStack[signStack.length - 1];
      sign = ch === "+" ? outer : -outer;
    } else if (ch === "(") {
      // everything inside inherits the sign that led into the bracket
      signStack.push(sign);
    } else if (ch === ")") {
      total = total + sign * number;
      number = 0;
      signStack.pop();
      // restore the sign in force outside the bracket
      sign = signStack[signStack.length - 1];
    }
  }

  return total + sign * number;
}

// ============================================================
// QUICK CHECK
// ============================================================
console.log(calculate("1 + 1")); // 2
console.log(calculate(" 2-1 + 2 ")); // 3
console.log(calculate("(1+(4+5+2)-3)+(6+8)")); // 23
console.log(calculate("-(3+4)")); // -7    unary minus on a bracket
console.log(calculate("-2+1")); // -1    leading minus
console.log(calculate("2-(5-6)")); // 3     minus flips the bracket
console.log(calculate("0")); // 0
console.log(calculate("")); // 0     empty
console.log(calculate("1-(2+3-(4+5))")); // 5
console.log(calculate("2147483647")); // 2147483647

console.log(calculateRecursive("(1+(4+5+2)-3)+(6+8)")); // 23
console.log(calculateRecursive("-(3+4)")); // -7
console.log(calculateRecursive("1-(2+3-(4+5))")); // 5
console.log(calculateSignFlattening("(1+(4+5+2)-3)+(6+8)")); // 23
console.log(calculateSignFlattening("1-(2+3-(4+5))")); // 5
console.log(calculateSignFlattening("2-(5-6)")); // 3

/*
============================================================
SAY OUT LOUD
============================================================
- COMPLEXITY:
    recursive descent  O(n) time, O(depth) call stack
    stack of context   O(n) time, O(depth) space
    sign flattening    O(n) time, O(depth) space
- WHAT THE STACK IS ACTUALLY STORING:
    a '(' means "pause, I will come back". So I park the two things that
    describe where I was: the running total, and the sign waiting to be
    applied to the bracket. Nothing else is needed.
- HOW UNARY MINUS FALLS OUT FOR FREE:
    total starts at 0 and sign at +1. A leading '-' just sets sign = -1 and
    subtracts from zero. "(-3)" works the same way after the reset. No
    special case anywhere.
- THE DIFFERENCE FROM LC 227:
    227 has * and / but no brackets, so the stack holds PENDING TERMS to be
    summed. 224 has brackets but no * or /, so the stack holds SUSPENDED
    CONTEXT. LC 772 needs both at once.
- THE REAL TRAP:
    forgetting to flush the pending number before handling ')'. A number
    can sit directly against the closing bracket, as in "(1+2)".
- THE SECOND TRAP:
    the final number, which has no operator after it. The return statement
    must fold it in.
- FOLLOW-UPS:
    Basic Calculator II (LC 227, precedence), Basic Calculator III (LC 772,
    both), Evaluate Reverse Polish Notation (LC 150),
    Decode String (LC 394, same "park the context" stack).
*/
