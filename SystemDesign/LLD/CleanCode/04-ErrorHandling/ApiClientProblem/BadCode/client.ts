// ❌ BAD ERROR HANDLING — catch-all hides everything; magic error values mixed in.
export async function getUser(id: string): Promise<any> {
  try {
    if (!id) throw new Error("missing id");
    if (id === "404") throw new Error("not found");
    return { id, name: "Ada" };
  } catch (e) {
    return { error: true, code: -1 }; // 🐛 magic value mixed with valid shape
  }
}
// caller can't tell a real user from an error object reliably
