// ❌ NO DECORATOR — every add-on combination becomes its own subclass.
// Feature combinatorics explode; price logic duplicated across classes.

export class Coffee { cost() { return 2; } desc() { return "coffee"; } }
export class CoffeeWithMilk { cost() { return 2.5; } desc() { return "coffee+milk"; } }
export class CoffeeWithSugar { cost() { return 2.3; } desc() { return "coffee+sugar"; } }
export class CoffeeWithMilkAndSugar { cost() { return 2.8; } desc() { return "coffee+milk+sugar"; } }
// Add "whip" => double the classes again. N add-ons => 2^N classes.
console.log(new CoffeeWithMilkAndSugar().cost());
