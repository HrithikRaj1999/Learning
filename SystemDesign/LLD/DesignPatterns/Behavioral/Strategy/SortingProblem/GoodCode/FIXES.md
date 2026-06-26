# Strategy — Sorting — Fix Hints
> Algorithms are interchangeable objects injected at runtime.
## Wrong now
`sort()` switches on `algo` and inlines each algorithm; not reusable, not testable
in isolation, new algo edits the context.
## Hints
- [ ] `SortStrategy` interface: `sort(data): number[]`.
- [ ] `BubbleSort`, `QuickSort`, `NativeSort` implement it.
- [ ] `Sorter` receives a strategy and calls `strategy.sort(data)`.
- [ ] Swap algorithm = inject a different strategy; new algo = new class.
## Done-when
- [ ] No algorithm switch; each algorithm is independently testable.
