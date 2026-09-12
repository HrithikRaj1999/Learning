// =============================================================================
// WHAT IS WRONG — missing Interpreter pattern
// =============================================================================
// PATTERN IDEA: represent a query as a tree of predicate expressions (And, Or,
// Not, field comparisons), each with interpret(item) -> boolean. Queries become
// composable data.
//
// WHAT'S WRONG HERE: filter() hardcodes one predicate ("price < 50 AND
// inStock"). The query lives in source.
//
// REAL SCENARIO: a product page lets users filter dynamically — "price < 100 AND
// (inStock OR onSale)". Impossible here: each new filter is a code change, and
// this single predicate can't be combined, negated, or nested from user input.
//
// WHY BAD: queries can't be authored at runtime, composed, or saved; every
// filter variation requires editing and redeploying code.
//
// HOW TO FIX (no code): define Specification/Expression nodes — AndSpec, OrSpec,
// NotSpec, and field predicates (PriceLessThan, InStock) — each implementing
// isSatisfiedBy(product). Build the query tree from user selections and evaluate
// it against each item. New criteria = new spec class; queries become data.
// =============================================================================
// ❌ NO INTERPRETER — list filtering driven by a hardcoded predicate. Users can't
// build their own "price < 50 AND inStock" queries.
type Product = { name: string; price: number; inStock: boolean };
export function filter(products: Product[]): Product[] {
  // the query is baked in; any new filter requires a code change
  return products.filter((p) => p.price < 50 && p.inStock);
}
console.log(filter([{ name: "a", price: 10, inStock: true }, { name: "b", price: 99, inStock: true }]));
