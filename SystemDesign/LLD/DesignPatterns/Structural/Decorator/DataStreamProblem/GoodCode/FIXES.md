# Decorator — Data Stream Problem — Fix Hints
> Layer stream behaviors (compress, encrypt) by wrapping.
## Wrong now
Each compression/encryption combo is a class; ordering hardcoded; not composable.
## Hints
- [ ] `DataStream` interface: `write(data)`. `FileStream` is the base.
- [ ] `StreamDecorator` wraps an inner stream.
- [ ] `CompressionStream`, `EncryptionStream` transform then delegate to inner.
- [ ] Compose to control order: `new EncryptionStream(new CompressionStream(new FileStream()))`.
## Done-when
- [ ] New transform = one decorator; order is explicit via composition.
