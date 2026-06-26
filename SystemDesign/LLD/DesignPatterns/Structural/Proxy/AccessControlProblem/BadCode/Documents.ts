// ❌ NO PROXY — access checks scattered into the real object + call sites. Easy
// to forget a check => unauthorized reads (real security bug).
export class DocumentStore {
  read(user: { role: string }, docId: string): string {
    // 🐛 some call sites call read() without checking role at all
    return "contents of " + docId;
  }
  delete(user: { role: string }, docId: string): string {
    if (user.role !== "admin") throw new Error("forbidden"); // check only here
    return "deleted " + docId;
  }
}
const store = new DocumentStore();
console.log(store.read({ role: "guest" }, "secret")); // leaks: no auth check
