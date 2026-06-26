# Facade — Fix Hints
> Intent: one simple entry point over a complex subsystem.
## Wrong now
Client wires Amplifier+Projector+Lights+Player in a precise order. Sequence
duplicated and easy to get wrong; teardown likely forgotten.
## Hints
- [ ] Create a `HomeTheaterFacade` that holds the subsystems.
- [ ] Expose `watchMovie(movie)` and `endMovie()` that run the correct sequence
      internally.
- [ ] Client calls only the facade; it never touches subsystems directly.
- [ ] Subsystems stay usable on their own — facade is a convenience, not a wall.
## vs Adapter
- Facade simplifies a whole subsystem (new, simpler API). Adapter converts ONE
  interface to another expected one.
