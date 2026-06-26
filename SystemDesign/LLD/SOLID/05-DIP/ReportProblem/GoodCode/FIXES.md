# DIP — Report Problem — Fix Hints
> Don't bind high-level logic to a concrete I/O mechanism.
## Wrong now
`ReportService` calls `fs.writeFileSync` directly and `new`s a CSV formatter.
Can't target S3, can't test without touching disk.
## Hints
- [ ] Define `ReportSink { write(name, content) }` and `ReportFormatter { format(rows) }`.
- [ ] `FileSink` (wraps fs), `S3Sink`, and a test `InMemorySink` implement the sink.
- [ ] Inject sink + formatter into `ReportService`.
- [ ] The service never imports `fs`; it depends on the abstraction.
## Done-when
- [ ] Tests assert output via `InMemorySink`, no disk writes.
- [ ] Switching disk→S3 = inject a different sink.
