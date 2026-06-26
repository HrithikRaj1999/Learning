import { DiscountPolicy } from "../DiscountPolicy.js";

export class RegularDiscount implements DiscountPolicy {
    apply(amount: number): number {
        return amount; // no discount
    }
}