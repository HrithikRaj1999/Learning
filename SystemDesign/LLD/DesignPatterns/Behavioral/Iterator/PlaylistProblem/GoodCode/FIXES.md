# Iterator — Fix Hints
> Intent: traverse a collection without exposing its internal representation.
## Wrong now
Client reads `pl.songs[i]` → coupled to "it's an array". Changing storage breaks
every loop.
## Hints
- [ ] Hide internals: make `songs` private.
- [ ] Expose iteration, not storage. In TS the idiomatic way is implementing the
      iterable protocol: a `[Symbol.iterator]()` generator → enables `for...of`.
- [ ] (Classic GoF form) provide a `createIterator()` returning an object with
      `hasNext()` / `next()`.
- [ ] Client iterates via the protocol; it never indexes internals.
- [ ] Now storage can change (array→Set→tree) with zero client changes.
## Done-when
- [ ] `for (const song of playlist)` works and `playlist.songs` is not public.
