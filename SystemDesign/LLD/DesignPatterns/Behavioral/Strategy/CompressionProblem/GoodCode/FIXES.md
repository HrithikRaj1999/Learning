# Strategy — Compression — Fix Hints
> Each compression format is a strategy.
## Wrong now
`compress()` if/else over format with logic inline; new format edits the archiver.
## Hints
- [ ] `CompressionStrategy` interface: `compress(files): string`.
- [ ] `ZipStrategy`, `TarStrategy`, `GzipStrategy` implement it.
- [ ] `Archiver` holds a strategy and delegates.
- [ ] New format = new strategy; archiver untouched.
## Done-when
- [ ] No format branch in the archiver.
