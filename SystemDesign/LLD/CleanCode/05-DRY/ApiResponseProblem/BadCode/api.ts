// ❌ NOT DRY — every handler hand-builds the same response envelope; shape drifts.
export function getUser() {
  return { success: true, data: { id: 1 }, error: null, ts: Date.now() };
}
export function getOrder() {
  return { success: true, data: { id: 9 }, error: null, timestamp: Date.now() }; // 🐛 ts vs timestamp
}
export function failExample() {
  return { success: false, data: null, error: "nope" }; // 🐛 missing ts field
}
