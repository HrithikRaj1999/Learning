# Linked List — Basics & Reversal

| LC# | Diff | Question | Pattern | Companies |
|---|---|---|---|---|
| 206 | Easy | Reverse Linked List | prev/curr/next iterate | Google, Apple, Amazon, Meta |
| 21 | Easy | Merge Two Sorted Lists | Dummy head + splice | Amazon, Microsoft, Apple |
| 876 | Easy | Middle of the Linked List | Fast/slow | Google, Amazon, Meta |
| 83 | Easy | Remove Duplicates from Sorted List | Skip equal next | Amazon, Microsoft |

**Key skill**: reversal — cache `next` before rewiring `curr.next = prev`, then advance both.
