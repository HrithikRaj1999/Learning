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
