/*
Decode String (LC 394)

Expand a string written as k[encoded], where the bracketed part repeats
k times. Brackets can nest.

  "3[a]2[bc]"    -> "aaabcbc"
  "3[a2[c]]"     -> "accaccacc"   (inner 2[c] expands first)
  "2[abc]3[cd]ef"-> "abcabccdcdcdef"
*/

// ============================================================
// 1) INTUITION
// ============================================================
/*
- Nesting means an inner group must finish before the outer one can repeat.
  "last opened, first finished" is exactly a STACK.
- I walk the string once, keeping two things "in progress":
      current   the text built since the last '['
      count     the number being read (digits can be multi-digit)
  On '[' I PUSH the outer context (its text and its repeat count) and start
  fresh. On ']' I POP that context back and glue current onto it, repeated.
- Two stacks (or one stack of pairs) is the whole solution.
- Recursion is the same algorithm with the call stack doing the pushing.

- The ladder:
    1. repeatedly find the innermost k[...] with a regex   O(n^2)-ish,
       expand it, and repeat until no brackets remain      allocates a lot
    2. recursion: parse a group, recurse on its body        O(output) time,
                                                            O(depth) stack
    3. one pass with an explicit stack of (text, count)     O(output) time,
                                                            O(depth) space

- Traps:
    - k can be multi-digit: "12[a]" is twelve a's, not 1 then 2.
    - on ']' the repeat count belongs to the group being CLOSED, so it must
      be popped from the stack, not read from the current variable.
    - text can sit before, between, and after groups: "2[abc]3[cd]ef".
*/

// ============================================================
// 2) VISUAL EXAMPLE
// ============================================================
/*
STACK view, s = "3[a2[c]]"

  index    0  1  2  3  4  5  6  7
  char     3  [  a  2  [  c  ]  ]

  current = "",  count = 0,  textStack = [],  countStack = []

  i=0 '3'  digit -> count = 0 * 10 + 3 = 3
  i=1 '['  push the OUTER context and reset
             textStack  = [""]        (nothing was built before this group)
             countStack = [3]
             current = "",  count = 0
  i=2 'a'  current = "a"
  i=3 '2'  count = 0 * 10 + 2 = 2
  i=4 '['  push again
             textStack  = ["", "a"]   ("a" is the text before the inner group)
             countStack = [3, 2]
             current = "",  count = 0
  i=5 'c'  current = "c"
  i=6 ']'  close the inner group
             pop repeat = 2, pop previous = "a"
             current = "a" + "c" repeated 2 = "a" + "cc" = "acc"
             textStack = [""],  countStack = [3]
  i=7 ']'  close the outer group
             pop repeat = 3, pop previous = ""
             current = "" + "acc" repeated 3 = "accaccacc"
             textStack = [],  countStack = []

  answer "accaccacc"

  INVARIANT: `current` always holds the fully expanded text of the group I
  am currently inside. The stacks hold every enclosing group's text and
  repeat count, waiting for their ']'.

MULTI-DIGIT AND TRAILING TEXT, s = "2[abc]3[cd]ef"

  i=0 '2'  count = 2
  i=1 '['  push ("", 2), reset
  i=2..4   current = "abc"
  i=5 ']'  pop 2 and "", current = "" + "abcabc" = "abcabc"
  i=6 '3'  count = 3
  i=7 '['  push ("abcabc", 3), reset -> current = ""
                 ^
                 the text built so far is parked on the stack, not lost
  i=8..9   current = "cd"
  i=10 ']' pop 3 and "abcabc"
           current = "abcabc" + "cdcdcd" = "abcabccdcdcd"
  i=11 'e' current = "abcabccdcdcde"
  i=12 'f' current = "abcabccdcdcdef"

  answer "abcabccdcdcdef"    trailing text needs no special case at all

WHY MULTI-DIGIT MATTERS, s = "12[a]"
    count = 0 -> '1' -> 1 -> '2' -> 1*10 + 2 = 12
  Reading one digit at a time would give 1[a] then a stray 2.
*/

// ============================================================
// 3) BRUTE FORCE - EXPAND THE INNERMOST GROUP REPEATEDLY
// ============================================================
/*
- Find a k[...] with no brackets inside, replace it with the expansion,
  and repeat until nothing is left to expand.
    Time  : O(n * output) with lots of string rebuilding
    Space : O(output)
- Correct and easy to explain, but every pass rebuilds the whole string.
*/
function decodeStringRepeated(s) {
  if (s.length === 0) return "";

  let text = s;

  // an innermost group has digits, '[', no brackets inside, then ']'
  const innermost = /(\d+)\[([a-zA-Z]*)\]/;

  while (innermost.test(text)) {
    text = text.replace(innermost, function (match, count, body) {
      return body.repeat(Number(count));
    });
  }

  return text;
}

// ============================================================
// 4) BETTER - RECURSION, LET THE CALL STACK DO THE WORK
// ============================================================
/*
- Parse characters until a ']' ends the current group; on '[' recurse to
  build the body, then repeat it.
    Time  : O(total output)   Space : O(nesting depth) call stack
- Very readable. The index has to be shared across calls, so I carry it in
  a small holder object.
*/
function decodeStringRecursive(s) {
  if (s.length === 0) return "";

  const cursor = { index: 0 };
  return parseGroup(s, cursor);
}

function parseGroup(s, cursor) {
  const pieces = [];

  while (cursor.index < s.length && s[cursor.index] !== "]") {
    if (isDigit(s[cursor.index])) {
      // read the whole multi-digit number
      let count = 0;
      while (isDigit(s[cursor.index])) {
        count = count * 10 + Number(s[cursor.index]);
        cursor.index++;
      }

      cursor.index++; // step over the '['
      const body = parseGroup(s, cursor); // recurse for the body
      cursor.index++; // step over the ']'

      pieces.push(body.repeat(count));
    } else {
      pieces.push(s[cursor.index]);
      cursor.index++;
    }
  }

  return pieces.join("");
}

function isDigit(ch) {
  const code = ch.charCodeAt(0);
  return code >= 48 && code <= 57;
}

// ============================================================
// 5) OPTIMAL - ONE PASS WITH AN EXPLICIT STACK (THE ONE TO WRITE)
// ============================================================
/*
- Two stacks: the text before each open bracket, and its repeat count.
    Time  : O(total output)   Space : O(nesting depth)
- One pass, no recursion depth limit, and it is the version that reads
  most clearly on a whiteboard.
*/
function decodeString(s) {
  if (s.length === 0) return "";

  const textStack = []; // text built before each unclosed '['
  const countStack = []; // repeat count for each unclosed '['

  let current = "";
  let count = 0;

  for (let i = 0; i < s.length; i++) {
    const ch = s[i];

    if (isDigit(ch)) {
      // build up multi-digit numbers like the 12 in "12[a]"
      count = count * 10 + Number(ch);
    } else if (ch === "[") {
      // park the outer context and start the inner group fresh
      textStack.push(current);
      countStack.push(count);
      current = "";
      count = 0;
    } else if (ch === "]") {
      // the repeat count belongs to the group being closed, so pop it
      const repeat = countStack.pop();
      const previous = textStack.pop();
      current = previous + current.repeat(repeat);
    } else {
      current = current + ch;
    }
  }

  return current;
}

// ============================================================
// QUICK CHECK
// ============================================================
console.log(decodeString("3[a]2[bc]")); // "aaabcbc"
console.log(decodeString("3[a2[c]]")); // "accaccacc"   nested
console.log(decodeString("2[abc]3[cd]ef")); // "abcabccdcdcdef"
console.log(decodeString("abc")); // "abc"    no brackets
console.log(decodeString("")); // ""      empty
console.log(decodeString("12[a]")); // 12 a's  multi-digit
console.log(decodeString("2[]")); // ""      empty body
console.log(decodeString("3[a2[c]]").length); // 9

console.log(decodeStringRecursive("3[a2[c]]")); // "accaccacc"
console.log(decodeStringRecursive("2[abc]3[cd]ef")); // "abcabccdcdcdef"
console.log(decodeStringRepeated("3[a2[c]]")); // "accaccacc"
console.log(decodeStringRepeated("2[abc]3[cd]ef")); // "abcabccdcdcdef"

/*
============================================================
SAY OUT LOUD
============================================================
- COMPLEXITY:
    repeated expansion   O(n * output), heavy string rebuilding
    recursion            O(output) time, O(depth) call stack
    explicit stack       O(output) time, O(depth) space
  The output can be exponentially larger than the input ("10[10[10[a]]]"),
  so O(output) is the honest bound, not O(n).
- WHY A STACK:
    brackets nest, and the innermost group must be finished before the one
    around it can repeat. Last opened, first completed - that IS a stack.
- THE TWO THINGS I PUSH:
    the text built so far, and the repeat count. Both belong to the OUTER
    group and must survive while I work on the inner one.
- THE REAL TRAP:
    multi-digit counts. "12[a]" must read 12, not 1 then 2. The line
    count = count * 10 + digit handles it, and it is easy to forget.
- THE SECOND TRAP:
    on ']' the repeat count comes off the STACK, not from the current
    variable - the current count belongs to a group not yet opened.
- FOLLOW-UPS:
    Basic Calculator (LC 224, stack for nested parentheses),
    Number of Atoms (LC 726, same nesting with counts),
    Valid Parentheses (LC 20), Flatten Nested List Iterator (LC 341).
*/
