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
