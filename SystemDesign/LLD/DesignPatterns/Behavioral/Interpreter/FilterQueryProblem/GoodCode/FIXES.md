# Interpreter — Filter Query — Fix Hints
> Build a composable predicate tree from user input.
## Wrong now
The filter predicate is hardcoded; users can't compose their own filters.
## Hints
- [ ] `Criteria` interface: `matches(item): boolean`.
- [ ] Terminals: `PriceLessThan(n)`, `InStock()`.
- [ ] Combinators: `AndCriteria`, `OrCriteria`, `NotCriteria`.
- [ ] Construct the tree from the UI/query and run `matches` over the list.
## Done-when
- [ ] New user query = compose existing criteria objects, no code change.
