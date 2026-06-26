# Iterator — Pagination — Fix Hints
> Hide paging behind an iterator that fetches pages lazily.
## Wrong now
Callers track `offset`/`limit` and the do/while paging loop — off-by-one and
non-termination bugs; paging detail leaks everywhere.
## Hints
- [ ] Provide an iterator (generator) that internally advances pages and yields
      items one by one (or page by page).
- [ ] The fetch-next-page logic lives in the iterator, not the caller.
- [ ] Client writes `for (const user of repo.all())` — no offset math.
- [ ] Lazy fetch keeps memory bounded for large datasets.
## Done-when
- [ ] No caller manages offsets; iteration terminates correctly.
