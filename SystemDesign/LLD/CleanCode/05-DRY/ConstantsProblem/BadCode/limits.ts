// ❌ NOT DRY — the same magic number 30 (free-tier limit) is repeated everywhere.
// Change the limit and you must hunt down every copy.
export function canUpload(count: number) { return count < 30; }       // 30
export function remaining(count: number) { return 30 - count; }       // 30
export function warnNearLimit(count: number) { return count >= 30 * 0.9; } // 30
export function planLabel() { return "Free (up to 30 files)"; }       // 30
