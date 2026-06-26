import { BlogPost } from "./BlogPost.js";
import { CacheInvalidator } from "./CacheInvalidator.js";
import { MarkDownRenderer } from "./MarkDownRenderer.js";
import { PostRepository } from "./PostRepository.js";
import { PublishPost } from "./PublishPost.js";
import { Slugifier } from "./Slugifier.js";
/**
 * new CacheInvalidator() → make the cache tool.
 * new PostRepository(cache) → repo needs a cache, so you pass it in.
 * new PublishPostService(renderer, slugifier, repo) → boss needs all 3 tools, so you pass them in.
 * This passing-in is called dependency injection.
 *  The boss(PublishPostService) does not make its own tools; you give them from outside
 */
//has a (composition)
const serviceInstance = new PublishPost(
    new MarkDownRenderer(),
    new Slugifier(),
    new PostRepository(new CacheInvalidator())
)

const { slug, html } = serviceInstance.publish(new BlogPost("Hello World", "****Hi****"))
console.log(slug, html)