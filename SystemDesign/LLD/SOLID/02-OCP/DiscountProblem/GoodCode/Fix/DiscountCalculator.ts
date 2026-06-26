import { DiscountPolicy } from "./DiscountPolicy.js";

// Tier-blind AND registry-blind: it only knows the DiscountPolicy contract.
// Adding or removing tiers never touches this class.
export class DiscountCalculator {
    constructor(private policy: DiscountPolicy) { }

    calculate(amount: number): number {
        return this.policy.apply(amount);
    }
}
