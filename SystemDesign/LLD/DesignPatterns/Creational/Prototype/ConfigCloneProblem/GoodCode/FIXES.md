# Prototype — Config Clone Problem — Fix Hints
> A clone must be INDEPENDENT, including nested state.
## Wrong now
`{ ...defaultSettings }` is shallow; `features` and `limits` are shared
references. Editing the "copy" corrupts the global default.
## Hints
- [ ] Implement a proper deep clone of the prototype (nested arrays/objects copied).
- [ ] `structuredClone(defaultSettings)` is the easy modern route — note caveats
      (no functions/class identity).
- [ ] Or give the prototype a `clone()` that rebuilds nested structures explicitly.
- [ ] Freeze the default so accidental mutation is caught.
## Done-when
- [ ] Mutating a clone never touches the default or sibling clones.
