# Visitor — AST Node — Fix Hints
> Add operations (eval, print, optimize) without touching node classes.
## Wrong now
`evaluate`, and later `print`/`optimize`, are separate `instanceof` ladders.
Operations scattered; forgetting a node type is a silent gap.
## Hints
- [ ] `NodeVisitor` interface: `visitNumber(n)`, `visitAdd(n)`, `visitMul(n)`.
- [ ] Each node implements `accept(visitor)` calling the matching visit (double dispatch).
- [ ] New op = new visitor (`EvalVisitor`, `PrintVisitor`); node classes untouched.
- [ ] Compiler forces each visitor to handle every node type.
## Trade-off
- Easy to add operations, hard to add a node type (touches every visitor).
  Use when node set is stable.
