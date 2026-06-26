# Facade — Computer Boot Problem — Fix Hints
> `start()` should hide the freeze/load/jump/execute ritual.
## Wrong now
Client knows the exact boot order across CPU/Memory/HardDrive. Fragile, duplicated.
## Hints
- [ ] `ComputerFacade` holds CPU, memory, hard drive.
- [ ] Expose `start()` that runs the boot sequence internally.
- [ ] Client calls `computer.start()` only.
## Done-when
- [ ] Boot order is encapsulated; client can't sequence it wrong.
