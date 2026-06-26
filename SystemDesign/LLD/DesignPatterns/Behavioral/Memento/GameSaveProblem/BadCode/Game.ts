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
