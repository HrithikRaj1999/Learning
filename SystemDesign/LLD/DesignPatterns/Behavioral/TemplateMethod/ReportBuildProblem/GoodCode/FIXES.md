# Template Method — Report Build — Fix Hints
> Fix the build pipeline once; vary only the body renderer.
## Wrong now
`PdfReport` and `ExcelReport` duplicate fetch/validate/footer/save; only the body
differs.
## Hints
- [ ] Abstract `Report` with `build()` running fetch → validate → renderBody →
      addFooter → save.
- [ ] Make shared steps concrete; make `renderBody()` abstract.
- [ ] `PdfReport`/`ExcelReport` override `renderBody()` only.
## Done-when
- [ ] A pipeline change is one edit; new format overrides one method.
