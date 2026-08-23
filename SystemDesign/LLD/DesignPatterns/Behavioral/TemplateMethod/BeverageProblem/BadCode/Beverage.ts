// =============================================================================
// WHAT IS WRONG — missing Template Method pattern
// =============================================================================
// PATTERN IDEA: a base class defines the fixed skeleton of an algorithm in one
// method, and subclasses override only the steps that vary. The shared structure
// lives in exactly one place.
//
// WHAT'S WRONG HERE: Tea and Coffee each repeat the whole brew sequence ("boil
// water", "pour in cup") and differ only in two steps. The skeleton is copy-
// pasted across both classes.
//
// REAL SCENARIO: you add a "let it cool" step to the recipe, or change ordering.
// You must edit Tea AND Coffee (and every future beverage) identically. Forget
// one and the recipes silently diverge. The common flow has no single owner.
//
// WHY BAD: duplicated algorithm skeleton; changes must be made in N places and
// drift; no shared structure to enforce the steps.
//
// HOW TO FIX (no code): a Beverage base class defines prepareRecipe() with the
// fixed steps, calling abstract brew() and addCondiments() hooks. Tea/Coffee
// override only those two. The skeleton changes once in the base.
// =============================================================================
// ❌ NO TEMPLATE METHOD — Tea and Coffee duplicate the same brew skeleton; only
// two steps differ. Change the skeleton => edit both.
export class Tea {
  prepare(): string[] {
    return ["boil water", "steep the tea", "pour in cup", "add lemon"]; // 2,4 vary
  }
}
export class Coffee {
  prepare(): string[] {
    return ["boil water", "brew the coffee", "pour in cup", "add sugar and milk"]; // 2,4 vary
  }
}
console.log(new Tea().prepare());
