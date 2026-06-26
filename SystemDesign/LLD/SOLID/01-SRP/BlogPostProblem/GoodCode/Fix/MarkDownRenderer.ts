export class MarkDownRenderer {
    render(body: string): string {
        const html = body.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
        return this.sanitize(html);
    }
    private sanitize(html: string): string {
        // toy version. In prod use DOMPurify to kill XSS.
        return html.replace(/<script[\s\S]*?<\/script>/gi, "");
    }
}