# Abstract Factory — Theme Problem — Fix Hints
> A theme is a family; one factory produces a coherent set.
## Wrong now
Each widget chooses its theme independently; the code mixes a dark button with a
light input. No guarantee of a consistent look.
## Hints
- [ ] Product interfaces: `Button`, `Input` (have `css()`).
- [ ] `ThemeFactory`: `createButton()`, `createInput()`.
- [ ] `LightTheme`/`DarkTheme` factories return only their family.
- [ ] Resolve the theme once; pass the factory down. Widgets can't mismatch.
## Done-when
- [ ] Switching theme = swap one factory; whole screen stays consistent.
