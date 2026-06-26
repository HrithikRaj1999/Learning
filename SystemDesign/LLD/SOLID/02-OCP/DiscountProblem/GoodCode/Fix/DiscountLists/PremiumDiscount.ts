import { DiscountPolicy } from "../DiscountPolicy.js";

export class PremiumDiscount implements DiscountPolicy {
    apply(amount: number): number {
        return amount * 0.9; // 10% off
    }
}