# LSP — File Storage Problem — Fix Hints
> Capability (writable) shouldn't be faked through inheritance.
## Wrong now
`ReadOnlyCloudFile.save()` throws; the `backup` loop (typed `File[]`) aborts on
the first read-only file. Subtype broke `save()`'s contract.
## Hints
- [ ] Separate roles: `Readable { read() }` and `Writable { save() }`.
- [ ] A normal file implements both; a read-only file implements only `Readable`.
- [ ] `backup` should take `Writable[]` (or read from `Readable`, write to a
      separate `Writable` destination) — never assume every file is writable.
- [ ] Read-only files simply aren't `Writable`, so they can't be mis-passed.
## Done-when
- [ ] Backup can't receive a non-writable file by accident (compile error).
- [ ] No save()-throws override remains.
