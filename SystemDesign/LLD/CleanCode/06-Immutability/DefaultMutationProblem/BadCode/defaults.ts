// ❌ MUTATION — a shared default object/array mutated by callers; the default
// itself gets corrupted (classic JS footgun).
const DEFAULT_OPTIONS = { retries: 3, tags: [] as string[] };

export function withTag(tag: string) {
  const opts = DEFAULT_OPTIONS;     // 🐛 same reference, not a copy
  opts.tags.push(tag);              // mutates the shared default forever
  return opts;
}
withTag("a"); withTag("b");
console.log(DEFAULT_OPTIONS.tags); // ["a","b"] -> default is polluted
