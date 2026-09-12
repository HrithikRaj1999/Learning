// =============================================================================
// WHAT IS WRONG — Single Responsibility Principle (SRP) violation
// =============================================================================
// SRP rule: a class should have ONE reason to change. This BlogPost has FIVE:
// it holds data, renders markdown->HTML, builds the URL slug, persists to DB,
// and invalidates the cache. Five separate teams/concerns, one tangled class.
//
// REAL SCENARIO: marketing asks to change the slug format. You edit BlogPost.
// Same edit window also touches save() and renderHtml() because they live in
// the same file/class — one careless change to money/persistence/security can
// ride along. renderHtml() also builds HTML by string-replace = XSS hole; that
// is a security concern that should NOT sit next to URL logic.
//
// WHY BAD: every unrelated reason to change collides in one place. Hard to
// test (cannot test slug without dragging DB + cache), hard to reuse (cannot
// render without the persistence baggage), changes ripple unpredictably.
//
// HOW TO FIX (no code): split by responsibility —
//   - BlogPost = plain data (title, body) only.
//   - A Renderer/MarkdownService turns body into safe HTML (sanitize there).
//   - A Slugger builds URL slugs (and fix the punctuation/unicode bug there).
//   - A Repository handles DB persistence.
//   - A Cache service handles invalidation.
// Each has one reason to change; wire them together at a higher layer.
// =============================================================================
// ❌ SRP — BlogPost holds content AND renders markdown AND builds the URL slug
// AND saves to DB AND invalidates cache. Five responsibilities, brittle.
export class BlogPost {
  constructor(public title: string, public body: string) {}

  renderHtml(): string {
    // naive markdown -> XSS risk + a reason to change when rendering changes
    return this.body.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
  }
  slug(): string {
    // 🐛 bug: doesn't strip punctuation/unicode -> broken URLs
    return this.title.toLowerCase().replace(/ /g, "-");
  }
  save(): void {
    console.log("UPDATE posts SET body=? ..."); // persistence
    this.invalidateCache();                      // cache concern leaks in
  }
  invalidateCache(): void {
    console.log("redis DEL post:" + this.slug()); // caching
  }
}
const p = new BlogPost("Hello, World!", "**hi**");
console.log(p.slug()); // "hello,-world!" — broken
