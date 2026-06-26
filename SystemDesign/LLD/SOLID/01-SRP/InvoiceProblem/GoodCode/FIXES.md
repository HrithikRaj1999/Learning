# SRP — Invoice Problem — Fix Hints
> Money math, presentation, and I/O are three separate jobs.
## Wrong now
`Invoice` does totals + HTML + text + disk write + printing. Also a real money
bug: raw float sum drifts (0.1 + 0.2 ≠ 0.3).
## Hints
- [ ] Keep `Invoice` as the money model. Fix the float bug: use integer cents (or
      a decimal/money type), round at boundaries — money math in one place.
- [ ] Extract a `InvoiceFormatter` interface with `HtmlFormatter`, `TextFormatter`.
- [ ] Extract an `InvoiceWriter` (disk) and a `Printer` behind interfaces.
- [ ] Now a formatting change can't touch the totals logic.
## Done-when
- [ ] Totals are correct + unit-tested with no I/O.
- [ ] Adding a PDF format = new formatter class, zero changes elsewhere.
