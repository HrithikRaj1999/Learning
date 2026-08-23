# Kadane's Algorithm

Running best-ending-here max. Foundation for 1D DP.

| LC# | Diff | Question | Pattern | Companies |
|---|---|---|---|---|
| 53 | Medium | Maximum Subarray | Kadane: reset when running < 0 | Google, Amazon, Microsoft, LinkedIn |
| 152 | Medium | Maximum Product Subarray | Track max AND min (negatives) | Amazon, Google, LinkedIn |
| 918 | Medium | Maximum Sum Circular Subarray | max(Kadane, total − minKadane) | Amazon, Google |

**Key skill**: for products, carry both max and min because a negative can flip the min into the max (LC 152).
