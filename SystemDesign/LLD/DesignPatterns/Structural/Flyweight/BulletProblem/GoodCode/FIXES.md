# Flyweight — Bullet Problem — Fix Hints
> Thousands of bullets share one sprite/sound.
## Wrong now
Each `Bullet` copies the sprite + sound. Memory + GC pressure explode with bullet count.
## Hints
- [ ] Intrinsic (shared): sprite, sound, damage (per bullet TYPE). Extrinsic: x, y, vx, vy.
- [ ] `BulletType` flyweight holds intrinsic state; a factory caches one per type.
- [ ] `Bullet` holds position/velocity + a reference to its `BulletType`.
## Done-when
- [ ] 10k bullets of one type share a single sprite object.
