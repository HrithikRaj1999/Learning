# Strings — Parsing & Simulation

Careful edge-case handling. Interviewers watch how you enumerate cases.

| LC# | Diff | Question | Pattern | Companies |
|---|---|---|---|---|
| 151 | Medium | Reverse Words in a String | Split/trim or in-place reverse | Amazon, Microsoft, Bloomberg |
| 8 | Medium | String to Integer (atoi) | State-machine edge cases | Amazon, Microsoft, Bloomberg |
| 28 | Easy | Find Index of First Occurrence (strStr) | Substring search / KMP | Amazon, Google, Meta |
| 165 | Medium | Compare Version Numbers | Split + two-pointer compare | Amazon, Microsoft, Apple |
| 43 | Medium | Multiply Strings | Grade-school multiplication | Amazon, Google, Microsoft |
| 6 | Medium | Zigzag Conversion | Row simulation | Amazon, PayPal |
| 12 | Medium | Integer to Roman | Greedy value mapping | Amazon, Microsoft, Adobe |

**Key skill**: for atoi, enumerate whitespace → sign → digits → overflow clamp, in that fixed order.
