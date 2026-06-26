# ISP — Repository Problem — Fix Hints
> Read-only consumers should not even see write methods.
## Wrong now
`ICrudRepository` forces `ReportingView` to implement create/update/delete as
throwing stubs — a single mis-call could hit "delete" on a reporting object.
## Hints
- [ ] Split into `ReadRepository<T>` (findById, findAll) and `WriteRepository<T>`
      (create, update, delete).
- [ ] A full repo `implements ReadRepository, WriteRepository`.
- [ ] `ReportingView implements ReadRepository` only — writes are unrepresentable.
- [ ] Inject the narrowest interface each caller needs (CQRS-friendly).
## Done-when
- [ ] Reporting code literally cannot call delete (won't compile).
