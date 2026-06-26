# Mediator — Air Traffic — Fix Hints
> Planes talk to the tower, never to each other.
## Wrong now
Each `Plane` checks every other plane to decide landing → N*N coupling, races.
## Hints
- [ ] `ControlTower` mediator with `requestLanding(plane)` / `notifyLanded(plane)`.
- [ ] The tower owns runway state and grants/queues clearance.
- [ ] Planes hold only the tower ref; they never see each other.
## Done-when
- [ ] Coordination logic is centralized; planes are mutually unaware.
