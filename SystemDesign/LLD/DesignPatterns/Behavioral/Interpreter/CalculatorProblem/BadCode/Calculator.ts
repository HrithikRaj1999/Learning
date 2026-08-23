// =============================================================================
// WHAT IS WRONG — missing Interpreter pattern
// =============================================================================
// PATTERN IDEA: parse the expression into a tree of nodes (Number, Add,
// Subtract, Multiply...) and let each node interpret() itself. Structure carries
// precedence and nesting.
//
// WHAT'S WRONG HERE: evaluate() splits on spaces and folds left-to-right. It
// assumes a rigid "a op b op c" shape, no precedence, no parentheses.
//
// REAL SCENARIO: support "2 + 3 * 4" (should be 14, not 20) or "(2 + 3) * 4".
// This flat loop can't — multiplication precedence and grouping require a real
// parse tree. Adding "*" correctly means rewriting the whole parser.
//
// WHY BAD: no grammar structure, so precedence/nesting are impossible and any
// real extension is a rewrite; brittle token assumptions break on edge cases.
//
// HOW TO FIX (no code): tokenize, then build an Abstract Syntax Tree of
// expression nodes (NumberExpr, AddExpr, MulExpr...). Each node's interpret()
// computes its value, recursing into children — precedence and parentheses fall
// out of the tree shape. New operator = new node type.
// =============================================================================
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
