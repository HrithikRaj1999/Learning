# Interpreter — Fix Hints
> Intent: represent grammar rules as a class tree; evaluate by composing them.
## Wrong now
A single function string-parses one fixed shape. No precedence, no nesting,
not extensible.
## Hints
- [ ] Define an `Expression` interface with `interpret(): number`.
- [ ] Terminal expression: `NumberExpression` (a literal).
- [ ] Non-terminals: `AddExpression`, `SubtractExpression`, `MultiplyExpression`
      each holding left + right `Expression` and combining their `interpret()`.
- [ ] Build an Abstract Syntax Tree of these objects; evaluate by calling
      `interpret()` on the root (recursion handles nesting + precedence by structure).
- [ ] Parsing string→AST is a separate concern (don't tangle it in).
## Reality check
- Interpreter is niche; for real languages use a parser generator. Use it for
  small DSLs / rule engines.
