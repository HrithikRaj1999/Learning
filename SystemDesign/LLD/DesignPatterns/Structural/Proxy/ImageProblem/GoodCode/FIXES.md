# Proxy — Fix Hints
> Intent: a stand-in that controls access to the real object (lazy / cache / guard).
## Wrong now
Every `HighResImage` loads eagerly at construction. You pay disk cost for images
never displayed; no caching, no access control.
## Hints
- [ ] Define an `Image` interface with `display()`.
- [ ] `HighResImage implements Image` = the real, heavy object.
- [ ] `ImageProxy implements Image` holds the filename, and only constructs the
      real image on the FIRST `display()` (virtual/lazy proxy). Cache it after.
- [ ] Client codes to `Image`; can't tell proxy from real (same interface).
- [ ] Variants to mention: protection proxy (auth check), remote proxy (network),
      caching proxy.
## vs Decorator
- Decorator adds behavior; Proxy controls access. Same wrapping shape, different intent.
