# Strings — Stack-Based

Nesting and cleanup → push context, pop to resolve.

| LC# | Diff | Question | Pattern | Companies |
|---|---|---|---|---|
| 678 | Medium | Valid Parenthesis String | Greedy low/high range for `*` | Amazon, Bloomberg |
| 1249 | Medium | Minimum Remove to Make Valid Parentheses | Stack of indices | Meta, Amazon, Google |
| 394 | Medium | Decode String | Stack of (count, string) | Google, Amazon, Bloomberg |
| 71 | Medium | Simplify Path | Stack of path segments | Amazon, Microsoft, Bloomberg |

**Key skill**: push indices (not chars) when you must delete originals later (LC 1249).
