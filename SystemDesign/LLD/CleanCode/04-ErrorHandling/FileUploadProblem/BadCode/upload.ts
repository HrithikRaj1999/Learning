// ❌ BAD ERROR HANDLING — empty catch swallows failures; user sees "success".
export async function upload(file: { name: string; bytes: number }): Promise<string> {
  try {
    if (file.bytes > 1_000_000) throw new Error("file too large");
    console.log("uploading " + file.name);
    return "uploaded";
  } catch (e) {
    // 🐛 swallowed: returns success even when upload failed
  }
  return "uploaded"; // always reports success
}
