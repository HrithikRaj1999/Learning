// =============================================================================
// WHAT IS WRONG — missing Builder pattern
// =============================================================================
// PATTERN IDEA: a Builder assembles an object via named, chainable steps and
// validates at build(), instead of a long positional constructor.
//
// WHAT'S WRONG HERE: Pizza's constructor takes 8 positional args, most booleans.
// At the call site `("large", true, false, true, false, true, false, true)` is
// unreadable and any two flags are trivially swapped.
//
// REAL SCENARIO: a developer swaps the `olives` and `mushrooms` booleans and
// nobody notices — wrong pizza shipped. There's no validation, so illegal combos
// (stuffedCrust + glutenFree) are allowed. Adding a topping grows the param list
// and breaks every call site.
//
// WHY BAD: meaningless boolean soup at call sites; silent argument swaps; no combo
// validation; painful to extend.
//
// HOW TO FIX (no code): a PizzaBuilder with size(), addCheese(), addPepperoni()...
// chained, and build() that validates topping rules and returns an immutable
// Pizza. Each choice reads clearly; invalid combinations fail at build().
// =============================================================================
// ❌ NO BUILDER — telescoping constructor. Huge positional param list, booleans
// you can't read at call site, many invalid combinations possible.

export class Pizza {
  constructor(
    public size: string,
    public cheese: boolean,
    public pepperoni: boolean,
    public mushrooms: boolean,
    public olives: boolean,
    public extraSauce: boolean,
    public stuffedCrust: boolean,
    public glutenFree: boolean,
  ) {}
}

// What do these booleans mean? Unreadable, error-prone, easy to swap two flags.
const p = new Pizza("large", true, false, true, false, true, false, true);
// Also: no validation -> e.g. stuffedCrust + glutenFree may be illegal but allowed.
