// ❌ NO INTERPRETER — grammar evaluation hardcoded as tangled string parsing.
// Only handles "a + b - c" shapes; impossible to extend (×, parentheses).

export function evaluate(expr: string): number {
  // brittle: splits on spaces, assumes left-to-right, no precedence, no nesting
  const tokens = expr.split(" ");
  let result = parseFloat(tokens[0]);
  for (let i = 1; i < tokens.length; i += 2) {
    const op = tokens[i];
    const val = parseFloat(tokens[i + 1]);
    if (op === "+") result += val;
    else if (op === "-") result -= val;
    // adding "*" with correct precedence => rewrite the whole thing
  }
  return result;
}
console.log(evaluate("10 + 5 - 3")); // 12
