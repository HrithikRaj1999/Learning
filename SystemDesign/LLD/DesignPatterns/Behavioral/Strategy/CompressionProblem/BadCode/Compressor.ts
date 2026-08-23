// =============================================================================
// WHAT IS WRONG — missing Strategy pattern
// =============================================================================
// PATTERN IDEA: each interchangeable algorithm is its own object behind a common
// interface; the context holds a strategy and delegates, choosing/swapping it at
// runtime.
//
// WHAT'S WRONG HERE: Archiver.compress() if/else-selects the format and inlines
// each format's logic. The algorithms live inside the context.
//
// REAL SCENARIO: add Brotli or LZ4, or let the caller pass a custom compressor.
// Every new format edits Archiver, risking the existing ones, and the per-format
// code can't be reused or unit-tested in isolation. You also can't switch the
// algorithm at runtime based on file size/type without more branching.
//
// WHY BAD: algorithms are tangled into the context; adding one edits tested code
// (OCP break); no reuse, no runtime swap.
//
// HOW TO FIX (no code): define a Compression strategy interface (compress(files))
// with ZipStrategy, TarStrategy, GzipStrategy. Archiver receives a strategy and
// delegates. New format = a new strategy class; pick it at runtime.
// =============================================================================
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
