// Services throw these; middleware/errorHandler.js turns them into the HTTP reply.
// So a service never touches req/res, it just says "this is a 404".
export class HttpError extends Error {
  constructor(status, code) {
    super(code ?? `HTTP ${status}`);
    this.status = status;
    this.code = code; // e.g. "INVALID_MEDIA_KEY"; optional
  }
}

export const notFound = () => new HttpError(404);
export const badRequest = (code) => new HttpError(400, code);
