# Template Method — Fix Hints
> Intent: define the skeleton of an algorithm in a base class; let subclasses
> override only specific steps.
## Wrong now
`open/validate/close` duplicated in both exporters; only the "format body" step
differs. Changing the skeleton means editing every copy.
## Hints
- [ ] Create an abstract `DataExporter` with a concrete `export()` (the template
      method) that calls the fixed steps in order.
- [ ] Make the steps that are shared concrete (`openConnection`, `validate`,
      `closeConnection`).
- [ ] Make the varying step abstract: `formatBody(rows): string`.
- [ ] `CsvExporter` / `JsonExporter` override only `formatBody`.
- [ ] Optionally add "hooks" — overridable no-op steps for optional behavior.
## vs Strategy
- Template Method varies a step via INHERITANCE (compile time). Strategy varies
  the whole algorithm via COMPOSITION (runtime).
