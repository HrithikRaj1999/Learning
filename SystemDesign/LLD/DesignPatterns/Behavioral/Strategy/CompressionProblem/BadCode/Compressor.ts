// ❌ NO STRATEGY — compression format selected via if/else; format logic baked
// into the archiver class.
export class Archiver {
  compress(files: string[], format: string): string {
    if (format === "zip") return "zip(" + files.join(",") + ")";
    else if (format === "tar") return "tar(" + files.join(",") + ")";
    else if (format === "gzip") return "gzip(" + files.join(",") + ")";
    else throw new Error("unknown format"); // new format edits this class
  }
}
console.log(new Archiver().compress(["a", "b"], "zip"));
