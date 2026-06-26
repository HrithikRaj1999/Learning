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
