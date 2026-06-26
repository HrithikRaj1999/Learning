import { BlogPost } from "./BlogPost.js";
import { PostRepository } from "./PostRepository.js";
import { MarkDownRenderer } from "./MarkDownRenderer.js";
import { Slugifier } from "./Slugifier.js";


export class PublishPost {
    constructor(
        public renderer: MarkDownRenderer,
        public slugifier: Slugifier,
        public repo: PostRepository
    ) { }

    publish(post: BlogPost): { slug: string, html: string } {
        const slug = this.slugifier.slug(post.title);
        const html = this.renderer.render(post.body);
        this.repo.save(post, slug)
        return { slug, html }
    }

}