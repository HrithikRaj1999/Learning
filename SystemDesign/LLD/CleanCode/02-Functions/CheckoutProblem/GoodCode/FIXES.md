# Clean Code — Functions Fix Hints
> A function should do ONE thing, at one level of abstraction, ideally < ~20 lines.
## Wrong now
`checkout` computes subtotal, applies discount, adds tax, logs, emails, AND
clears the cart. 7 params incl. 3 boolean flags. Mixes side effects with return.
Mutates its input.
## Hints
- [ ] Split into focused functions: `calculateSubtotal`, `applyDiscount`,
      `applyTax`, each pure and testable.
- [ ] Kill boolean flag args — a flag means the function does 2 things. Caller
      composes the steps it wants instead.
- [ ] Separate command (side effects: log, email) from query (compute total).
- [ ] Don't mutate inputs; `cart.items = []` should be the caller's explicit step
      (immutability).
- [ ] Bundle related params into an object/`Order` type; shrink the signature.
## Done-when
- [ ] Each function does one thing and reads top-down at one abstraction level.
- [ ] No boolean parameters steering behavior.
- [ ] Pure calc functions have no console/email/mutation.
