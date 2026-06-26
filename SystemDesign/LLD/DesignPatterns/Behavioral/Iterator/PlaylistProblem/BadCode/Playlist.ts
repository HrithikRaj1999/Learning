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
