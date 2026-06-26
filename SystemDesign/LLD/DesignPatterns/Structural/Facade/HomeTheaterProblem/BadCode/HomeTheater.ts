// ❌ NO FACADE — client must know and orchestrate every subsystem in the right
// order. Complex startup sequence duplicated wherever you "watch a movie".

class Amplifier { on() { return "amp on"; } setVolume(v: number) { return "vol " + v; } }
class Projector { on() { return "proj on"; } wide() { return "widescreen"; } }
class Lights { dim(p: number) { return "lights " + p + "%"; } }
class StreamingPlayer { play(movie: string) { return "playing " + movie; } }

// Every caller must remember this exact sequence (and the teardown):
export function watchMovie(movie: string): string[] {
  const amp = new Amplifier();
  const proj = new Projector();
  const lights = new Lights();
  const player = new StreamingPlayer();
  return [lights.dim(10), proj.on(), proj.wide(), amp.on(), amp.setVolume(5), player.play(movie)];
}
console.log(watchMovie("Dune"));
