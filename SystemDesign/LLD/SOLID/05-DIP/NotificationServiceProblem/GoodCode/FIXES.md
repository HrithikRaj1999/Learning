# DIP — Fix Hints (Dependency Inversion Principle)

> Goal: high-level policy and low-level detail both depend on **abstractions**.
> Detail depends on policy's interface — the dependency arrow is inverted.

## What is wrong
`NotificationService` (high-level) does `new EmailSender()` and
`new MySqlUserRepo()` (low-level). It is welded to SMTP + MySQL. You cannot:
swap channel, swap DB, or unit-test without real infrastructure.

## Hints to fix (no code given)
- [ ] Define abstractions **owned by the high-level module**:
      `MessageChannel { send(to, msg) }` and `UserRepository { findEmail(id) }`.
- [ ] Make concretes implement them: `EmailSender implements MessageChannel`,
      `SmsSender implements MessageChannel`, `MySqlUserRepo implements UserRepository`.
- [ ] `NotificationService` receives both via **constructor injection** —
      it never calls `new` on a concrete.
- [ ] Wire concretes only at the **composition root** (app entry / main / DI container).
- [ ] In tests, inject fakes/mocks — no SMTP, no DB.

## Distinctions to keep straight
- DIP ≠ DI. DIP is the *principle* (depend on abstractions). Dependency
  Injection is one *technique* that achieves it.
- The interface belongs to the consumer (high-level), not the provider.

## Done-when checklist
- [ ] No `new ConcreteClass()` inside `NotificationService`.
- [ ] Switching email→SMS is a wiring change at the root, zero edits to the service.
- [ ] The service is unit-testable with injected fakes.
