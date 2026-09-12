# Two Pointers — Linked List (Floyd)

Fast moves 2×, slow moves 1×. Detects cycles, finds middle, gaps.

| LC# | Diff | Question | Pattern | Companies |
|---|---|---|---|---|
| 141 | Easy | Linked List Cycle | Floyd fast/slow meet | Amazon, Microsoft, Bloomberg |
| 876 | Easy | Middle of the Linked List | Fast 2× → slow at middle | Google, Amazon, Meta |
| 234 | Easy | Palindrome Linked List | Find middle + reverse half | Amazon, Meta, Google |
| 19 | Medium | Remove Nth Node From End | Gap of n between pointers | Amazon, Meta, Microsoft |
| 287 | Medium | Find the Duplicate Number | Floyd cycle on value graph | Amazon, Google, Bloomberg |

**Key skill**: treat `nums[i]` as a "next pointer" to reuse cycle detection on an array (LC 287).
