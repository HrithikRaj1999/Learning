import { DiscountPolicy } from "../DiscountPolicy.js";

export class HandicappedDiscount implements DiscountPolicy {
    apply(amount: number): number {
        return amount * 0.6; // 40% off
    }
}
