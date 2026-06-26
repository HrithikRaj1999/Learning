// ❌ NO INTERPRETER — boolean rule ("age > 18 AND country = US") evaluated with
// hardcoded, un-nestable parsing. Can't compose OR/NOT or nest groups.
export function evalRule(facts: Record<string, any>): boolean {
  // the rule is frozen in code; changing it = redeploy; no nesting/precedence
  return facts.age > 18 && facts.country === "US";
}
console.log(evalRule({ age: 20, country: "US" }));
