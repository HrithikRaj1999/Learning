# Clean Code — Naming Fix Hints
> Names should reveal intent. Reading code should not require decoding.
## Wrong now
`calc`, `d`, `t`, `r`, `x.s`, `x.f === 1`, `flag`, `data2` — none reveal intent;
`1` is a magic number; `flag` says nothing about what it flags.
## Hints
- [ ] Rename the function for what it returns: e.g. `findPassingActiveStudents`.
- [ ] Parameters: `d` → `students`, `t` → `minScore`.
- [ ] Fields: `s` → `score`, `f` → `status`; replace `=== 1` with a named
      enum/constant like `Status.Active`.
- [ ] Result var `r` → `passing`. Drop `data2`, `tmp`, `flag`, `manager`, `helper`.
- [ ] Booleans read as predicates: `isActive`, not `flag`.
- [ ] Avoid encodings/abbreviations; searchable full words beat `usr`, `cnt`.
## Done-when
- [ ] A new reader understands each line without comments.
- [ ] No magic numbers; thresholds/codes are named constants.
