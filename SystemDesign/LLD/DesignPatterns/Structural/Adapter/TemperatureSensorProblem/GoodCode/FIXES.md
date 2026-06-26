# Adapter — Temperature Sensor Problem — Fix Hints
> Adapt the unit once; never let raw vendor units leak.
## Wrong now
App threshold is Celsius but `readFahrenheit()` is compared directly — unit bug.
Conversion is ad hoc and forgettable.
## Hints
- [ ] Define `TemperatureSensor { readCelsius(): number }`.
- [ ] `VendorSensorAdapter implements TemperatureSensor`, converting F→C in one place.
- [ ] App uses Celsius everywhere; the Fahrenheit source is hidden.
## Done-when
- [ ] No unit conversion at call sites; the bug is structurally impossible.
