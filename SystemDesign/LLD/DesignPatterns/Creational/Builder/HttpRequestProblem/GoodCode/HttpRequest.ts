import { HttpRequestBuilder } from "./HttpRequestBuilder";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS";

export interface HttpRequestConfig {
  url: string;
  method: HttpMethod;
  headers: Record<string, string>;
  body: string | null;
  timeoutMs: number;
  retries: number;
  followRedirects: boolean;
}

export class HttpRequest {
  private readonly _url: string;
  private readonly _method: HttpMethod;
  private readonly _headers: Record<string, string>;
  private readonly _body: string | null;
  private readonly _timeoutMs: number;
  private readonly _retries: number;
  private readonly _followRedirects: boolean;

  private constructor(config: HttpRequestConfig) {
    this._url = config.url;
    this._method = config.method;
    this._headers = config.headers;
    this._body = config.body;
    this._timeoutMs = config.timeoutMs;
    this._retries = config.retries;
    this._followRedirects = config.followRedirects;
  }

  // ----- Getters (immutable request) -----
  get url(): string {
    return this._url;
  }

  get method(): HttpMethod {
    return this._method;
  }

  get headers(): Record<string, string> {
    // return a copy so callers can't mutate internal state
    return { ...this._headers };
  }

  get body(): string | null {
    return this._body;
  }

  get timeoutMs(): number {
    return this._timeoutMs;
  }

  get retries(): number {
    return this._retries;
  }

  get followRedirects(): boolean {
    return this._followRedirects;
  }

  static builder(): HttpRequestBuilder {
    return new HttpRequestBuilder();
  }

  /** Internal factory used by HttpRequestBuilder to bypass the private constructor. */
  static _create(config: HttpRequestConfig): HttpRequest {
    return new HttpRequest(config);
  }
}
