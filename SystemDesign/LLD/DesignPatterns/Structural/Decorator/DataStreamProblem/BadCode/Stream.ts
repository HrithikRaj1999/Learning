// =============================================================================
// WHAT IS WRONG — missing Decorator pattern
// =============================================================================
// PATTERN IDEA: wrap a stream with decorators that each add one transformation,
// sharing the stream interface; stack them in any order at runtime.
//
// WHAT'S WRONG HERE: each combination of compression + encryption is its own class
// (CompressedFileStream, CompressedEncryptedFileStream...). The transformations are
// hardcoded into bespoke classes.
//
// REAL SCENARIO: add a "buffered" or "base64" transform and the combinations
// multiply (2^N classes). Order matters (compress-then-encrypt vs the reverse) and
// each ordering needs its own class. You can't choose transforms based on runtime
// config without a giant switch over class names.
//
// WHY BAD: combinatorial class explosion; ordering hardcoded; transforms can't be
// composed dynamically.
//
// HOW TO FIX (no code): a Stream interface (write()); a base FileStream, plus
// CompressionDecorator and EncryptionDecorator that wrap a Stream and transform
// before delegating. Compose at runtime: Encryption(Compression(FileStream)). New
// transform = one decorator; any order by composition.
// =============================================================================
// ❌ NO DECORATOR — combos of compression + encryption become bespoke classes.
export class FileStream { write(d: string) { return "raw:" + d; } }
export class CompressedFileStream { write(d: string) { return "gzip(raw:" + d + ")"; } }
export class EncryptedFileStream { write(d: string) { return "aes(raw:" + d + ")"; } }
export class CompressedEncryptedFileStream { write(d: string) { return "aes(gzip(raw:" + d + "))"; } }
// order matters (compress-then-encrypt) and every combo is hardcoded
console.log(new CompressedEncryptedFileStream().write("data"));
