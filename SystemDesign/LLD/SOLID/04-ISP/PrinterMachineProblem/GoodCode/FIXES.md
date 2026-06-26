# ISP — Fix Hints (Interface Segregation Principle)

> Goal: many small, role-focused interfaces beat one fat interface.

## What is wrong
`IMultiFunctionDevice` bundles print + scan + fax + staple. `CheapPrinter` only
prints, so it is forced to implement three methods it can't honor — it throws in
the stubs. Clients can't trust the interface anymore.

## Hints to fix (no code given)
- [ ] Split the fat interface by **role/capability**: `Printer`, `Scanner`,
      `Fax`, `Stapler` — each with just its own method(s).
- [ ] `CheapPrinter implements Printer` only. It can no longer be asked to scan,
      so no stub, no throw.
- [ ] `OfficeAllInOne implements Printer, Scanner, Fax, Stapler` — composition of
      small contracts. (TS supports `implements A, B, C`.)
- [ ] Client functions depend on the **narrowest** interface they need
      (`function archive(s: Scanner)`), not the whole device.

## Relationship to other principles
- Forced throwing stubs were also an LSP violation — fixing ISP fixes both.
- Small interfaces make DIP easy: high-level code depends on a tiny role.

## Done-when checklist
- [ ] No class implements a method it has to stub/throw on.
- [ ] Each interface would be hard to split further without losing cohesion.
- [ ] Callers ask only for the capability they use.
