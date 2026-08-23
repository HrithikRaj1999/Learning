// =============================================================================
// WHAT IS WRONG — Liskov Substitution Principle (LSP) violation
// =============================================================================
// LSP rule: a subtype must honour every promise the base made. File.save()
// promises "this persists your content." ReadOnlyCloudFile extends File but its
// save() always throws — it broke the promise. So it is NOT substitutable.
//
// REAL SCENARIO: backup() is written against File and loops saving copies. It
// has no idea read-only files exist. The moment a ReadOnlyCloudFile appears,
// save() throws and the ENTIRE backup aborts mid-way — earlier files maybe
// saved, later ones not, state half-done. The bug isn't in backup(); it's that
// a read-only thing pretended to be a writable File.
//
// WHY BAD: "weakened postcondition" — the subtype delivers less than the base
// guaranteed. Every caller of save() now needs defensive instanceof checks, and
// failures surface at runtime deep inside loops instead of at the type level.
//
// HOW TO FIX (no code): split the capability. A Readable base (read()) that ALL
// files share, and a Writable/Saveable interface only writable files implement.
// backup() should accept Writable, so a read-only file simply can't be handed
// to it — the mistake is caught at compile time, not as a runtime explosion.
// If read-only files must coexist in a list, filter by capability first.
// RULE OF THUMB: override-only-to-throw = the method doesn't belong on the base.
// =============================================================================
// ❌ LSP — ReadOnlyCloudFile extends File but save() throws. Backup routine
// written against File corrupts/aborts when it meets a read-only file.
export class File {
  constructor(public path: string, protected data: string = "") {}
  read(): string { return this.data; }
  save(content: string): void { this.data = content; }
}
export class ReadOnlyCloudFile extends File {
  // weakened postcondition: save() promised to persist; this breaks it
  save(_content: string): void {
    throw new Error("read-only file");
  }
}
function backup(files: File[]): void {
  for (const f of files) {
    const copy = f.read();
    f.save(copy + " [backed up]"); // throws for read-only -> whole backup aborts
  }
}
backup([new File("a.txt"), new ReadOnlyCloudFile("b.txt")]); // 💥
