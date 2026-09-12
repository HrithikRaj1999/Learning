// =============================================================================
// WHAT IS WRONG — missing Iterator pattern
// =============================================================================
// PATTERN IDEA: let clients traverse a collection through a stable iteration
// interface, independent of how the collection stores its items.
//
// WHAT'S WRONG HERE: Playlist.songs is a public array, and clients use index
// access (songs[i], songs.length). They're coupled to "it's an array."
//
// REAL SCENARIO: you switch storage to a Map (for fast lookup), a linked list
// (for cheap reordering), or a shuffled view. Every index-based loop in every
// client breaks. You also can't offer a shuffled or filtered traversal without
// each caller changing.
//
// WHY BAD: representation is exposed; clients depend on it; storage changes
// ripple out as breaking changes.
//
// HOW TO FIX (no code): keep songs private; make Playlist iterable (an iterator
// or [Symbol.iterator]) yielding songs in order. Clients iterate without knowing
// the structure; you can change storage or add shuffle/filter iterators freely.
// =============================================================================
// ❌ NO ITERATOR — client reaches into the collection's internal structure and
// depends on it. Change storage (array -> linked list -> tree) breaks all clients.

export class Playlist {
  public songs: string[] = []; // internals exposed
  add(s: string) { this.songs.push(s); }
}

const pl = new Playlist();
pl.add("a"); pl.add("b"); pl.add("c");

// Client knows it's an array, uses index access. Coupled to representation.
for (let i = 0; i < pl.songs.length; i++) {
  console.log(pl.songs[i]);
}
// If Playlist switches to a Map or tree, every loop like this breaks.
