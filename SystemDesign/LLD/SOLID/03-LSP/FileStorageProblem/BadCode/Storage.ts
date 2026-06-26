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
