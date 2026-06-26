import { DiscountPolicy } from "../DiscountPolicy.js";

export class SeniorDiscount implements DiscountPolicy {
    apply(amount: number): number {
        return amount * 0.75; // 25% off
    }
}
