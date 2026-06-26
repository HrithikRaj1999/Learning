import { DiscountPolicy } from "../DiscountPolicy.js";

export class VipDiscount implements DiscountPolicy {
    apply(amount: number): number {
        return amount * 0.8; // 20% off
    }
}