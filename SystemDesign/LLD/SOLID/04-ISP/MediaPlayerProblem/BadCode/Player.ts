// =============================================================================
// WHAT IS WRONG — Interface Segregation Principle (ISP) violation
// =============================================================================
// ISP rule: no client should be forced to depend on methods it doesn't use.
// IMediaPlayer is a "fat" interface bundling playback + recording + casting +
// subtitles. A simple audio player needs only play/pause but is forced to
// implement record(), cast(), loadSubtitles().
//
// REAL SCENARIO: SimpleAudioPlayer can't record, so those methods throw. Now any
// UI that renders "an IMediaPlayer" shows a Record and Subtitles button that
// blow up when clicked. The interface lies about what the object can do, so
// every caller needs defensive try/catch or capability checks. (This also bleeds
// into LSP: throwing stubs aren't substitutable.)
//
// WHY BAD: one bloated interface couples unrelated capabilities; simple
// implementers carry dead, dangerous stubs; clients can't trust the contract.
//
// HOW TO FIX (no code): split into small role interfaces — Playable
// (play/pause), Recordable (record), Castable (cast), SubtitleAware
// (loadSubtitles). Each class implements ONLY what it truly supports;
// SimpleAudioPlayer implements Playable. Clients depend on the narrow interface
// they actually need.
// =============================================================================
// ❌ ISP — IMediaPlayer mixes playback + recording + casting. A basic audio
// player is forced to fake record()/cast()/subtitles().
export interface IMediaPlayer {
  play(file: string): string;
  pause(): string;
  record(): string;
  cast(device: string): string;
  loadSubtitles(file: string): string;
}
export class SimpleAudioPlayer implements IMediaPlayer {
  play(f: string) { return "playing " + f; }
  pause() { return "paused"; }
  // forced stubs -> UI shows a Record button that explodes
  record() { throw new Error("no recording"); }
  cast(_d: string) { throw new Error("no casting"); }
  loadSubtitles(_f: string) { throw new Error("audio has no subtitles"); }
}
