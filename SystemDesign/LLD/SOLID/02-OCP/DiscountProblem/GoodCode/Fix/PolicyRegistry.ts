import { DiscountPolicy } from "./DiscountPolicy.js";
import { RegularDiscount } from "./DiscountLists/RegularDiscount.js";
import { PremiumDiscount } from "./DiscountLists/PremiumDiscount.js";
import { VipDiscount } from "./DiscountLists/VipDiscount.js";
import { StudentDiscount } from "./DiscountLists/StudentDiscount.js";
import { HandicappedDiscount } from "./DiscountLists/HandicappedDiscount.js";
import { SeniorDiscount } from "./DiscountLists/SeniorDiscount.js";

// The known customer tiers. Typed keys make a typo a COMPILE error, not a runtime one.
export type CustomerType =
    | "regular"
    | "premium"
    | "vip"
    | "student"
    | "handicapped"
    | "senior";

// Resolves a customer type -> its policy, at the edge.
// Injectable: pass a different Map in tests to swap the whole policy set.
export class PolicyRegistry {
    constructor(
        private policies: Map<CustomerType, DiscountPolicy> = new Map<CustomerType, DiscountPolicy>([
            ["regular", new RegularDiscount()],
            ["premium", new PremiumDiscount()],
            ["vip", new VipDiscount()],
            ["student", new StudentDiscount()],
            ["handicapped", new HandicappedDiscount()],
            ["senior", new SeniorDiscount()],
        ])
    ) { }

    get(type: CustomerType): DiscountPolicy {
        const policy = this.policies.get(type);
        if (!policy) {
            // Fail loud — never silently return full price for an unknown tier.
            throw new Error(`No discount policy for customer type: ${type}`);
        }
        return policy;
    }
}
