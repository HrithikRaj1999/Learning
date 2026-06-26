export class Slugifier {
    slug(title: string): string {
        return title
            .normalize("NFKD")                // split accents (é -> e + ´)
            .replace(/[\u0300-\u036f]/g, "")  // drop accent marks
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")     // drop punctuation
            .trim()
            .replace(/\s+/g, "-")             // space -> dash
            .replace(/-+/g, "-");             // collapse dashes
    }
}