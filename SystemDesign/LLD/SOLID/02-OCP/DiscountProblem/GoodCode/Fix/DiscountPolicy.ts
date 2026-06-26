// The contract every discount tier obeys — the Strategy interface.
// The calculator and registry depend on THIS abstraction, never on a concrete tier.
export interface DiscountPolicy {
    apply(amount: number): number;
}
