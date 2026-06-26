# Mediator — Fix Hints
> Intent: components talk through a central mediator, not to each other directly.
## Wrong now
Every `User` holds refs to every other user → N*N wiring. Adding/removing a user
edits everyone. Classic spaghetti.
## Hints
- [ ] Define a `ChatMediator` interface: `register(user)`, `send(msg, from)`.
- [ ] A `ChatRoom implements ChatMediator` holds all users and routes messages.
- [ ] `User` holds ONE ref — the mediator — and calls `mediator.send(...)`.
- [ ] Users never reference each other. Add a user = register with mediator only.
- [ ] Routing rules (broadcast, private, mute) live in the mediator, one place.
## vs Observer
- Mediator centralizes many-to-many comms. Observer is one-to-many notification.
