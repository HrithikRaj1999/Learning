# Interpreter — Boolean Rule — Fix Hints
> Model rules as an expression tree you can compose at runtime.
## Wrong now
The rule is hardcoded in `evalRule`; you can't add OR/NOT, nest groups, or change
rules without redeploying.
## Hints
- [ ] `Expression` interface: `interpret(facts): boolean`.
- [ ] Terminals: `GreaterThan(field, n)`, `Equals(field, value)`.
- [ ] Non-terminals: `And(a, b)`, `Or(a, b)`, `Not(x)` combining sub-expressions.
- [ ] Build the AST (from config/UI) and call `interpret(facts)` on the root.
## Reality check
- Great for small rule engines / feature flags. For big grammars use a parser lib.
