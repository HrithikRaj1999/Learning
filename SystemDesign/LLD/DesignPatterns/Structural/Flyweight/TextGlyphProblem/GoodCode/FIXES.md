# Flyweight — Text Glyph Problem — Fix Hints
> Share font/glyph data across identical characters.
## Wrong now
Each `Character` copies font + size + metrics. Memory scales with character count.
## Hints
- [ ] Intrinsic (shared): char + font + size + metrics. Extrinsic (per-instance): x, y.
- [ ] A `Glyph` flyweight holds intrinsic state (immutable).
- [ ] A `GlyphFactory` caches one `Glyph` per (char, font, size) key.
- [ ] `Character` keeps x, y + a reference to the shared `Glyph`.
## Done-when
- [ ] Memory scales with #distinct glyphs, not #characters.
