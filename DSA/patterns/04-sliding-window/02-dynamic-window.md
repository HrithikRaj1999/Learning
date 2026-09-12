# Sliding Window — Dynamic Size

Grow `right`; while invalid, shrink `left`.

| LC# | Diff | Question | Pattern | Companies |
|---|---|---|---|---|
| 3 | Medium | Longest Substring Without Repeating Chars | Set/map, shrink on dup | Google, Amazon, Microsoft, Bloomberg |
| 424 | Medium | Longest Repeating Character Replacement | Window − maxFreq ≤ k | Google, Amazon |
| 209 | Medium | Minimum Size Subarray Sum | Shrink while sum ≥ target | Amazon, Google, Facebook |
| 1004 | Medium | Max Consecutive Ones III | At most k zeros in window | Amazon, Google, Facebook |
| 904 | Medium | Fruit Into Baskets | At most 2 distinct | Google, Amazon |
| 340 | Medium | Longest Substring with At Most K Distinct | Map of counts, shrink >k | Amazon, Google, Bloomberg |

**Key skill**: LC 424 — window is valid while `(windowLen − maxFreqInWindow) ≤ k`.
