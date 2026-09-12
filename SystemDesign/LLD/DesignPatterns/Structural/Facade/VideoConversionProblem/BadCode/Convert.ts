// =============================================================================
// WHAT IS WRONG — missing Facade pattern
// =============================================================================
// PATTERN IDEA: a Facade exposes one simple operation over a complicated subsystem,
// hiding the low-level orchestration. (The classic GoF VideoConverter example.)
//
// WHAT'S WRONG HERE: convert() makes the client drive CodecFactory, BitrateReader,
// and AudioMixer in sequence. The low-level video pipeline leaks into the caller.
//
// REAL SCENARIO: every feature that converts video (upload, transcode job, export)
// repeats this codec/bitrate/audio orchestration. Change the pipeline (add subtitle
// handling, swap a codec library) and you edit every caller. Callers must
// understand internals they shouldn't care about.
//
// WHY BAD: complex subsystem orchestration is duplicated in clients; pipeline
// changes ripple everywhere; callers coupled to internals.
//
// HOW TO FIX (no code): a VideoConverterFacade with convert(file, format) that runs
// codec -> bitrate -> audio internally. Clients call one method and stay ignorant
// of the pipeline. Changes live behind the facade.
// =============================================================================
// ❌ NO FACADE — converting a video forces the client to drive codec, audio mux,
// and container subsystems directly (the classic GoF VideoConverter example).
class CodecFactory { extract(file: string) { return "codec of " + file; } }
class BitrateReader { read(codec: string) { return "stream from " + codec; } }
class AudioMixer { fix(stream: string) { return "audio-fixed " + stream; } }

export function convert(file: string, format: string): string {
  const codec = new CodecFactory().extract(file);   // low-level orchestration
  const stream = new BitrateReader().read(codec);    // leaked into the client
  const audio = new AudioMixer().fix(stream);
  return audio + " -> " + format;
}
console.log(convert("clip.mp4", "ogg"));
