# Strings — Calculator & Hard

Expression evaluation. Classic senior-level string problems.

| LC# | Diff | Question | Pattern | Companies |
|---|---|---|---|---|
| 227 | Medium | Basic Calculator II | Stack, `+ - * /` no parens | Amazon, Microsoft, Facebook |
| 224 | Hard | Basic Calculator | Stack + sign, with parentheses | Google, Amazon, Microsoft |
| 68 | Hard | Text Justification | Greedy line packing + spacing | Google, Amazon, LinkedIn |

**Key skill**: keep a running `sign`/`lastNum` and only push to stack on operator change. Parens → recurse or push current state.
