# SRP — Fix Hints (Single Responsibility Principle)

> Goal: each class has **one reason to change**. Do not write the solution from
> these hints alone — think first, then code, then compare.

## What is wrong
`Employee` mixes **4 axes of change** in one class:
1. Business rule — `calculatePay()`
2. Persistence — `save()`
3. Notification — `sendPayslip()`
4. Presentation — `printReport()`

Change the email provider → you touch the same file that holds payroll math.
That coupling is the smell.

## Hints to fix (no code given)
- [ ] Keep `Employee` as a **plain data model** (name, email, rate, hours). No I/O.
- [ ] Extract a `PayrollCalculator` (or `SalaryCalculator`) — owns pay math.
      Fix the real bug while you are there: overtime is computed wrong.
- [ ] Extract an `EmployeeRepository` — owns persistence. It depends on an
      interface, not a hardcoded connection string (foreshadows DIP).
- [ ] Extract a `PayslipNotifier` (email). It should **call the calculator**,
      not recompute pay — kill the duplicated formula.
- [ ] Extract a `ReportFormatter`. Better: one interface, three implementations
      (`HtmlReport`, `CsvReport`, `JsonReport`) — this also satisfies OCP.

## Smells to name out loud
- Duplicated pay formula in `calculatePay()` and `sendPayslip()` → DRY break.
- Hardcoded DB credentials → security + testability.
- `printReport(format: string)` with an `if/else` ladder → OCP violation hiding inside an SRP violation.

## Done-when checklist
- [ ] Each new class fits on one screen and has one job.
- [ ] You can unit-test pay math with **no DB and no SMTP**.
- [ ] Swapping HTML→PDF report touches zero payroll code.
- [ ] No formula is written in two places.
