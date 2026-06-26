import { BlogPost } from "./BlogPost.js";
import { CacheInvalidator } from "./CacheInvalidator.js";

export class PostRepository {
    constructor(private cache: CacheInvalidator) { }
    save(post: BlogPost, slug: string) {
        console.log("UPDATE DB", post);
        this.cache.invalidate(slug);
    }
}