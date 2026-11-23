import { badRequest } from '../errors.js';

// Checks the SHAPE of the request (types, required fields) and cleans it up,
// so services get tidy values. Rules that need the DB or the user (e.g. "is this
// media key yours?") stay in the service layer.

const isId = (value) => typeof value === 'string' && /^\d{1,19}$/.test(value);
const isText = (value) => typeof value === 'string' && value.trim() !== '';

// use with router.param: every :postId, :commentId, ... must be a number
export const checkId = (req, res, next, value) => (isId(value) ? next() : next(badRequest('INVALID_ID')));

// POST /posts  { content?, mediaKeys? }  ->  req.body = { content, mediaKeys }
export const newPost = (req, res, next) => {
  const { content = null, mediaKeys = [] } = req.body ?? {};

  if (content !== null && typeof content !== 'string') {
    return next(badRequest('INVALID_CONTENT'));
  }
  const keysOk = Array.isArray(mediaKeys) && mediaKeys.every((key) => typeof key === 'string');
  if (!keysOk) {
    return next(badRequest('INVALID_MEDIA_KEY'));
  }
  if (!isText(content) && mediaKeys.length === 0) {
    return next(badRequest('EMPTY_POST'));
  }

  req.body = { content, mediaKeys };
  next();
};

// PATCH /posts/:postId  { content }
export const editPost = (req, res, next) => {
  const content = req.body?.content;
  if (typeof content !== 'string') {
    return next(badRequest('INVALID_CONTENT'));
  }
  req.body = { content };
  next();
};

// POST /posts/:postId/comments  { text, parentId? }
export const newComment = (req, res, next) => {
  const { text, parentId = null } = req.body ?? {};

  if (!isText(text)) {
    return next(badRequest('INVALID_TEXT'));
  }
  const parent = parentId === null ? null : String(parentId);
  if (parent !== null && !isId(parent)) {
    return next(badRequest('INVALID_PARENT_ID'));
  }

  req.body = { text: text.trim(), parentId: parent };
  next();
};

// PATCH /comments/:commentId  { text }
export const editComment = (req, res, next) => {
  const text = req.body?.text;
  if (!isText(text)) {
    return next(badRequest('INVALID_TEXT'));
  }
  req.body = { text: text.trim() };
  next();
};
