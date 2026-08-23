// =============================================================================
// WHAT IS WRONG — missing Interpreter pattern
// =============================================================================
// PATTERN IDEA: represent a grammar as a tree of expression objects (AND, OR,
// NOT, comparisons), each knowing how to interpret(context). Rules become data
// you compose and evaluate, not code.
//
// WHAT'S WRONG HERE: evalRule() hardcodes one fixed boolean expression in
// TypeScript. The rule "age > 18 AND country = US" is frozen in the source.
//
// REAL SCENARIO: business wants rules editable at runtime — admins defining
// "age > 21 OR (country = US AND verified)". Impossible: every rule change is a
// code edit + redeploy, and this flat expression can't express OR/NOT, grouping,
// or precedence.
//
// WHY BAD: rules can't be authored as data, composed, nested, or stored;
// expressiveness is capped at whatever was hardcoded.
//
// HOW TO FIX (no code): define Expression nodes — AndExpression, OrExpression,
// NotExpression, and terminal comparisons (GreaterThan, Equals) — each with
// interpret(facts). Build/parse rules into a tree and evaluate it. New operators
// = new node types; rules become composable, nestable data.
// =============================================================================
// ❌ NO INTERPRETER — boolean rule ("age > 18 AND country = US") evaluated with
// hardcoded, un-nestable parsing. Can't compose OR/NOT or nest groups.
export function evalRule(facts: Record<string, any>): boolean {
  // the rule is frozen in code; changing it = redeploy; no nesting/precedence
  return facts.age > 18 && facts.country === "US";
}
console.log(evalRule({ age: 20, country: "US" }));
