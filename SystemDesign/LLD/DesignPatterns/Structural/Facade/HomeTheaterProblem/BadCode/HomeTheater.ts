// =============================================================================
// WHAT IS WRONG — missing Facade pattern
// =============================================================================
// PATTERN IDEA: a Facade wraps a complex subsystem behind one simple call, hiding
// the multi-step orchestration.
//
// WHAT'S WRONG HERE: watchMovie() forces the client to turn on and configure
// Amplifier, Projector, Lights, and StreamingPlayer in an exact order. All the
// subsystem steps are exposed at the call site.
//
// REAL SCENARIO: every place that "watches a movie" must repeat this sequence (and
// the matching teardown to stop). Add a popcorn maker or change volume defaults and
// you edit every caller. Forget a step (projector not set to widescreen) and the
// experience breaks.
//
// WHY BAD: the startup/teardown choreography is duplicated across callers; easy to
// get wrong; subsystem changes touch everyone.
//
// HOW TO FIX (no code): a HomeTheaterFacade with watchMovie(film) and endMovie()
// that orchestrate the subsystems internally. Clients call one method; the device
// sequence is encapsulated and changed in one place.
// =============================================================================
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
