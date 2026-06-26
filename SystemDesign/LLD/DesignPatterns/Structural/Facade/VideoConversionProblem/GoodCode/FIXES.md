# Facade — Video Conversion Problem — Fix Hints
> Hide codec/bitrate/audio plumbing behind one convert() call.
## Wrong now
Client drives `CodecFactory`, `BitrateReader`, `AudioMixer` in sequence — complex
subsystem knowledge leaks everywhere a conversion happens.
## Hints
- [ ] `VideoConverterFacade` with `convert(file, format)`.
- [ ] Inside: orchestrate codec → bitrate → audio → container.
- [ ] Client just calls `facade.convert(...)`.
- [ ] Subsystems stay available for advanced users.
## Done-when
- [ ] No subsystem orchestration appears in client code.
