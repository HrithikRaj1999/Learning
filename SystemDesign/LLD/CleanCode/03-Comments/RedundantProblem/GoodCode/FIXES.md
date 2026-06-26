# Clean Code — Comments Fix Hints
> Good code needs few comments. Comment WHY, never WHAT the code already says.
## Wrong now
"adds two numbers", "return the sum", "increment i by 1" restate the code.
There's commented-out dead code, a stale undated TODO, and a comment that LIES
about what `getUser` does.
## Hints
- [ ] Delete comments that restate code (`// return the sum`). The code says it.
- [ ] Delete commented-out code — git is your history, not the source file.
- [ ] Replace explanatory comments with better NAMES (a well-named function needs
      no header comment).
- [ ] Keep comments only for WHY: non-obvious decisions, trade-offs, warnings,
      links to a spec/bug.
- [ ] Fix or remove lying comments immediately — a wrong comment is worse than none.
- [ ] Make TODOs actionable + tracked (ticket ref), or delete them.
## Done-when
- [ ] Every remaining comment explains intent/why, not mechanics.
- [ ] Zero commented-out code blocks.
