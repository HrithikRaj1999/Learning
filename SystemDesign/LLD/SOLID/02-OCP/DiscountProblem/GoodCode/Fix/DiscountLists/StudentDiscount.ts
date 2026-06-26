import { DiscountPolicy } from "../DiscountPolicy.js";

export class StudentDiscount implements DiscountPolicy {
    apply(amount: number): number {
        return amount * 0.7; // 30% off
    }
}