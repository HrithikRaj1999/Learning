import { DiscountCalculator } from "./DiscountCalculator.js";
import { CustomerType, PolicyRegistry } from "./PolicyRegistry.js";

// Composition root / edge: build the registry once.
const registry = new PolicyRegistry();

// Resolve type -> policy at the EDGE, then hand the policy to a tier-blind calculator.
function priceFor(type: CustomerType, amount: number): number {
    const policy = registry.get(type);
    const calculator = new DiscountCalculator(policy);
    return calculator.calculate(amount);
}

console.log(`regular     10000 ->`, priceFor("regular", 10000));
console.log(`premium     10000 ->`, priceFor("premium", 10000));
console.log(`vip         10000 ->`, priceFor("vip", 10000));
console.log(`student     10000 ->`, priceFor("student", 10000));
console.log(`handicapped 10000 ->`, priceFor("handicapped", 10000));
console.log(`senior      10000 ->`, priceFor("senior", 10000));