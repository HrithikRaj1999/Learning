// =============================================================================
// WHAT IS WRONG — missing Decorator pattern
// =============================================================================
// PATTERN IDEA: a Decorator wraps an object and adds behavior, sharing the same
// interface. You stack wrappers at runtime to combine features — instead of a
// class per combination.
//
// WHAT'S WRONG HERE: every add-on combo is its own subclass (CoffeeWithMilk,
// CoffeeWithMilkAndSugar...). cost()/desc() logic is duplicated across them.
//
// REAL SCENARIO: add "whip" and you must add a class for every existing combo plus
// whip. N add-ons = 2^N classes — unmanageable. A customer wanting milk+whip+sugar
// needs a class that may not exist, and prices drift between the duplicated combos.
//
// WHY BAD: combinatorial subclass explosion; add-on price logic duplicated and
// drift-prone; combinations are fixed at compile time.
//
// HOW TO FIX (no code): a Coffee/Beverage interface (cost(), desc()); a base
// SimpleCoffee, plus decorators MilkDecorator/SugarDecorator/WhipDecorator that
// each wrap a beverage and add to cost()/desc(). Compose at runtime: Whip(Milk(
// Coffee)). New add-on = one decorator; any combination works.
// =============================================================================
// ❌ NO DECORATOR — every add-on combination becomes its own subclass.
// Feature combinatorics explode; price logic duplicated across classes.

export class Coffee { cost() { return 2; } desc() { return "coffee"; } }
export class CoffeeWithMilk { cost() { return 2.5; } desc() { return "coffee+milk"; } }
export class CoffeeWithSugar { cost() { return 2.3; } desc() { return "coffee+sugar"; } }
export class CoffeeWithMilkAndSugar { cost() { return 2.8; } desc() { return "coffee+milk+sugar"; } }
// Add "whip" => double the classes again. N add-ons => 2^N classes.
console.log(new CoffeeWithMilkAndSugar().cost());
