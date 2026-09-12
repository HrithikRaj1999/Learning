// =============================================================================
// WHAT IS WRONG — missing Memento pattern
// =============================================================================
// PATTERN IDEA: the object produces a self-contained snapshot (memento) of its
// state and restores from it. The snapshot is a DEEP, independent copy.
//
// WHAT'S WRONG HERE: external save code grabs fields by hand AND stores the
// inventory array BY REFERENCE. Mutating the live inventory later also mutates
// the "saved" one — the save is corrupted.
//
// REAL SCENARIO: player saves with a sword, then picks up a shield. Because the
// save shares the same array reference, the save now also contains the shield —
// load and you get the wrong state. Add a new field (mana, quests) and the
// hand-written save silently omits it too.
//
// WHY BAD: shallow, hand-rolled snapshots share mutable references (aliasing bug)
// and miss new fields; saves are silently wrong; encapsulation broken.
//
// HOW TO FIX (no code): GameState creates a memento that DEEP-copies its state
// (inventory included) and restores from it. A SaveManager caretaker holds
// mementos. Because the object owns the snapshot, it's complete and isolated from
// later mutations.
// =============================================================================
// ❌ NO MEMENTO — save/load pokes at the game's internal fields from outside.
// Encapsulation broken; add a field and saves silently miss it.
export class GameState {
  public level = 1;
  public hp = 100;
  public inventory: string[] = [];
}
const game = new GameState();
game.level = 5; game.hp = 80; game.inventory.push("sword");

// external save grabs fields by hand (and shares the inventory array by ref!)
const save = { level: game.level, hp: game.hp, inventory: game.inventory };
game.inventory.push("shield"); // 🐛 mutates the "saved" inventory too
console.log(save.inventory); // ["sword","shield"] -> corrupted save
