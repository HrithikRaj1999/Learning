# Command — Order Queue — Fix Hints
> Turn each action into a command object you can queue/retry/log.
## Wrong now
`process` calls warehouse/billing directly. No queueing, no retry on failure, no
audit log, no replay after a crash.
## Hints
- [ ] `Command` interface: `execute()`.
- [ ] `ShipCommand`, `InvoiceCommand` hold their receiver + params.
- [ ] An invoker queue stores commands; a worker executes them (retry on failure,
      log each).
- [ ] Persist the queue → survive restarts (commands are serializable data).
## Done-when
- [ ] Actions can be deferred, retried, and logged uniformly.
