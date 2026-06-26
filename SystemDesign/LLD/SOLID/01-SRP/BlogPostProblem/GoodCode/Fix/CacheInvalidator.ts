export class CacheInvalidator {
  invalidate(slug: string): void {
    console.log("redis DEL post:" + slug);
  }
}