import { HttpMethod, HttpRequest } from "./HttpRequest";

export class HttpRequestBuilder {
  private _url?: string;
  private _method: HttpMethod = "GET";
  private _headers: Record<string, string> = {};
  private _body: string | null = null;
  private _timeoutMs: number = 0;
  private _retries: number = 0;
  private _followRedirects: boolean = true;

  setUrl(url: string): this {
    this._url = url;
    return this;
  }

  setMethod(method: HttpMethod): this {
    this._method = method;
    return this;
  }

  setHeader(key: string, value: string): this {
    this._headers[key] = value;
    return this;
  }

  setBody(body: string | null): this {
    this._body = body;
    return this;
  }

  setTimeout(timeoutMs: number): this {
    this._timeoutMs = timeoutMs;
    return this;
  }

  setRetries(retries: number): this {
    this._retries = retries;
    return this;
  }

  setFollowRedirects(followRedirects: boolean): this {
    this._followRedirects = followRedirects;
    return this;
  }

  build(): HttpRequest {
    if (!this._url || this._url.trim() === "") {
      throw new Error("HttpRequest requires a non-empty url.");
    }

    const methodsWithoutBody: HttpMethod[] = ["GET", "HEAD"];
    if (this._body !== null && methodsWithoutBody.includes(this._method)) {
      throw new Error(`A ${this._method} request cannot have a body.`);
    }

    if (this._timeoutMs < 0) {
      throw new Error("timeoutMs must be >= 0.");
    }

    if (this._retries < 0) {
      throw new Error("retries must be >= 0.");
    }

    return HttpRequest._create({
      url: this._url,
      method: this._method,
      headers: { ...this._headers },
      body: this._body,
      timeoutMs: this._timeoutMs,
      retries: this._retries,
      followRedirects: this._followRedirects,
    });
  }
}