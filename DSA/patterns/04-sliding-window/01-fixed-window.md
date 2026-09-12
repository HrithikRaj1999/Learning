# Sliding Window — Fixed Size

Window width is constant; slide and update the delta.

| LC# | Diff | Question | Pattern | Companies |
|---|---|---|---|---|
| 121 | Easy | Best Time to Buy and Sell Stock | Track running min, max profit | Amazon, Google, Meta, Bloomberg |
| 643 | Easy | Maximum Average Subarray I | Fixed window sum | Google, Amazon |
| 438 | Medium | Find All Anagrams in a String | Fixed window + freq match | Amazon, Google, Meta |
| 567 | Medium | Permutation in String | Fixed window + freq match | Microsoft, Amazon, Meta |

**Key skill**: compare two frequency arrays with a single `matches` counter, not a full 26-length compare each step.
