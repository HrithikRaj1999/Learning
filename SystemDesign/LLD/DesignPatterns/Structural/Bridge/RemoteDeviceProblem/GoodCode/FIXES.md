# Bridge — Remote/Device Problem — Fix Hints
> Two axes (remote type, device) should vary independently.
## Wrong now
Remote behavior and device are fused into class names → M*N classes; new device
doubles the count.
## Hints
- [ ] `Device` interface (implementation side): `on()`, `off()`, `setVolume()`.
- [ ] `TV`, `Radio` implement `Device`.
- [ ] `Remote` (abstraction) holds a `Device` and delegates; `AdvancedRemote`
      extends `Remote` adding `mute()`.
- [ ] Now remotes + devices compose: M+N classes.
## Done-when
- [ ] Adding a device adds ONE class, works with every remote.
