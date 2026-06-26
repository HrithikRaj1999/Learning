# ISP — Media Player Problem — Fix Hints
> One capability per interface; compose for rich devices.
## Wrong now
`IMediaPlayer` bundles play/pause + record + cast + subtitles. `SimpleAudioPlayer`
stubs three with throws; a UI bound to the fat interface shows dead buttons.
## Hints
- [ ] `Playable { play, pause }`, `Recordable { record }`, `Castable { cast }`,
      `Subtitleable { loadSubtitles }`.
- [ ] `SimpleAudioPlayer implements Playable` only.
- [ ] A smart TV player composes all four.
- [ ] UI enables a feature by checking which interface the player implements.
## Done-when
- [ ] No throwing stubs; capabilities are discoverable by type.
