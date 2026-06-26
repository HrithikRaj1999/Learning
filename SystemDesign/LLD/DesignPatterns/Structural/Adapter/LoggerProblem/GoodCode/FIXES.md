# Adapter — Logger Problem — Fix Hints
> Talk to YOUR logging interface; adapt the vendor behind it.
## Wrong now
App calls `writeLog(2, {msg})` everywhere — coupled to Winston's shape + magic
level numbers. New logger = edit every call site.
## Hints
- [ ] Define `Logger { info(msg); warn(msg); error(msg) }` (your contract).
- [ ] `WinstonAdapter implements Logger`, mapping `info→writeLog(2,...)` etc. in ONE place.
- [ ] App depends on `Logger`; inject the adapter.
- [ ] New lib = new adapter; call sites unchanged.
## Done-when
- [ ] Magic level numbers + payload shape live only in the adapter.
