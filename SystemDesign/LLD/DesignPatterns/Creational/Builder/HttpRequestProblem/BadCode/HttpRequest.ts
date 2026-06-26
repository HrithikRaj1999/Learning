// ❌ NO BUILDER — telescoping constructor for an HTTP request. Unreadable call
// site; optional args become a sea of undefined/positional guesses.
export class HttpRequest {
  constructor(
    public url: string,
    public method: string = "GET",
    public headers: Record<string, string> = {},
    public body: string | null = null,
    public timeoutMs: number = 0,
    public retries: number = 0,
    public followRedirects: boolean = true,
  ) {}
}
// What is `3`? what is `true`? easy to swap timeout and retries:
const r = new HttpRequest("/api", "POST", { "x": "1" }, "{}", 5000, 3, true);
// also: no validation -> retries with GET+body that some servers reject
