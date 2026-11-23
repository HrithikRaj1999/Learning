import { badRequest } from '../errors.js';

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

// what a valid ?cursor looks like for each list
const CURSOR_CHECK = {
  id: (cursor) => /^\d{1,19}$/.test(cursor),             // last id seen (posts, comments)
  time: (cursor) => !Number.isNaN(Date.parse(cursor)),   // last createdAt seen (likes, follow requests)
};

// ?cursor=...&limit=...  ->  req.page = { cursor, limit }
export const paginate = (cursorType) => (req, res, next) => {
  const { cursor, limit } = req.query;

  if (cursor !== undefined) {
    const cursorOk = typeof cursor === 'string' && CURSOR_CHECK[cursorType](cursor);
    if (!cursorOk) {
      return next(badRequest('INVALID_CURSOR'));
    }
  }

  const size = limit === undefined ? DEFAULT_LIMIT : Number(limit);
  if (!Number.isInteger(size) || size < 1) {
    return next(badRequest('INVALID_LIMIT'));
  }

  req.page = { cursor: cursor ?? null, limit: Math.min(size, MAX_LIMIT) };
  next();
};
