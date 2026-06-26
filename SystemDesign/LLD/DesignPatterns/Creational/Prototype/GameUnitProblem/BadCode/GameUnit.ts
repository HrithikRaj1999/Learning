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
