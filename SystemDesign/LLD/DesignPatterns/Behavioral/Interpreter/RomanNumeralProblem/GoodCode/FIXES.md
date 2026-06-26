# Interpreter — Roman Numeral — Fix Hints
> Each symbol becomes a small expression; the number is a composition.
## Wrong now
All rules are crammed into parallel arrays + a while loop; per-symbol logic isn't
separable or testable.
## Hints
- [ ] `RomanExpression` interface: `interpret(context): void` (mutates remaining n + output).
- [ ] One expression per symbol group (Thousand, Hundred, Ten, One) that knows its
      one/four/five/nine forms.
- [ ] A context holds the running number + built string; expressions run in order.
## Note
- This is the classic GoF Interpreter exercise; keep each symbol's rule isolated.
