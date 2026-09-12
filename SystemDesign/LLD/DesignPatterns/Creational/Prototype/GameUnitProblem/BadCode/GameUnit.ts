// =============================================================================
// WHAT IS WRONG — missing Prototype pattern (expensive build + broken copy)
// =============================================================================
// PATTERN IDEA: clone a prepared prototype instead of re-running expensive setup,
// and make the clone a DEEP, complete copy.
//
// WHAT'S WRONG HERE: GameUnit's constructor loads 3D meshes + textures every time,
// so spawning 100 orcs reloads assets 100 times. The "manual copy" also just
// shares stats by reference (copy.stats = base.stats) — not a real copy.
//
// REAL SCENARIO: a game spawning a wave of identical orcs stutters because each
// reloads meshes. And the shared-reference copy means editing one orc's stats
// changes another orc's — a gameplay bug. Add a new field (e.g. armor) and the
// hand copy silently omits it.
//
// WHY BAD: expensive identical setup repeats per instance (perf); hand copies
// share mutable references (aliasing bug) and miss new fields.
//
// HOW TO FIX (no code): build one prototype orc (load assets once) and clone() it
// per spawn, deep-copying stats and inventory. Cloning is cheap and complete;
// each unit is independent. New unit type = a registered prototype.
// =============================================================================
// ❌ NO PROTOTYPE — every unit rebuilt from scratch via an expensive setup, even
// when it's a near-copy of an existing one. Also manual field-by-field copying
// that silently breaks when a new field is added.

export class GameUnit {
  stats: { hp: number; mana: number };
  inventory: string[];
  constructor(public type: string) {
    console.log("Loading 3D mesh + textures for " + type + " (expensive)...");
    this.stats = { hp: 100, mana: 50 };
    this.inventory = [];
  }
}

// Spawning 100 identical orcs reloads meshes 100 times.
const orcs: GameUnit[] = [];
for (let i = 0; i < 3; i++) orcs.push(new GameUnit("orc")); // expensive each time

// Manual "copy" — shallow + forgotten fields = bugs
const base = new GameUnit("orc");
const copy = new GameUnit("orc"); // not actually a copy; re-runs setup
copy.stats = base.stats;          // 🐛 shared reference: mutating copy hits base
