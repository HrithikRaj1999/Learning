// ❌ NO DECORATOR — combos of compression + encryption become bespoke classes.
export class FileStream { write(d: string) { return "raw:" + d; } }
export class CompressedFileStream { write(d: string) { return "gzip(raw:" + d + ")"; } }
export class EncryptedFileStream { write(d: string) { return "aes(raw:" + d + ")"; } }
export class CompressedEncryptedFileStream { write(d: string) { return "aes(gzip(raw:" + d + "))"; } }
// order matters (compress-then-encrypt) and every combo is hardcoded
console.log(new CompressedEncryptedFileStream().write("data"));
