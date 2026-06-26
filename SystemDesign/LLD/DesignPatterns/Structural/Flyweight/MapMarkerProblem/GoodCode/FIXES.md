# Flyweight — Map Marker Problem — Fix Hints
> Markers of the same category share one icon.
## Wrong now
Each `Marker` copies icon bytes. Memory scales with marker count, not category count.
## Hints
- [ ] Intrinsic (shared): iconBytes, category. Extrinsic: lat, lng.
- [ ] `MarkerIcon` flyweight per category; a factory caches them.
- [ ] `Marker` stores coordinates + a reference to its shared `MarkerIcon`.
## Done-when
- [ ] 50k restaurant markers share one icon object.
