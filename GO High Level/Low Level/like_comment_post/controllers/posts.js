import db from '../db.js';

// DB keeps S3 keys only; the URL is built on read, so the CDN domain (or signed URLs) can change freely
const CDN = process.env.CDN_BASE_URL; // e.g. https://cdn.example.com
const withMedia = ({ mediakeys, ...post }) => ({ ...post, mediaUrls: (mediakeys ?? []).map(k => `${CDN}/${k}`) });

export const createPost = async (req, res) => {
  const { content, mediaKeys = [] } = req.body;
  // only keys inside the caller's own upload folder, never a URL from the client
  const prefix = `posts/${req.user.sub}/`;
  if (!Array.isArray(mediaKeys) || mediaKeys.some(k => typeof k !== 'string' || !k.startsWith(prefix) || k.includes('..'))) {
    return res.status(400).json({ error: 'INVALID_MEDIA_KEY' });
  }
  const { rows: [post] } = await db.query(
    'INSERT INTO posts (locationId, authorId, content, mediaKeys) VALUES ($1, $2, $3, $4) RETURNING *',
    [req.user.locationId, req.user.sub, content, mediaKeys]);
  res.status(201).json({ post: withMedia(post) });
};

export const getPost = async (req, res) => {
  const { rows: [post] } = await db.query(
    'SELECT * FROM posts WHERE id = $1 AND locationId = $2 AND status = 1', [req.params.postId, req.user.locationId]);
  if (!post) return res.sendStatus(404);
  const { rowCount } = await db.query(
    'SELECT 1 FROM likes WHERE userId = $1 AND targetType = 1 AND targetId = $2', [req.user.sub, post.id]);
  res.json({ post: withMedia(post), likedByMe: rowCount > 0 });
};

// owner only: authorId in WHERE
export const updatePost = async (req, res) => {
  const { rows: [post] } = await db.query(
    'UPDATE posts SET content = $1, updatedAt = now() WHERE id = $2 AND authorId = $3 AND status = 1 RETURNING *',
    [req.body.content, req.params.postId, req.user.sub]);
  if (!post) return res.sendStatus(404);
  res.json({ post: withMedia(post) });
};

// soft delete
export const deletePost = async (req, res) => {
  await db.query('UPDATE posts SET status = 2 WHERE id = $1 AND authorId = $2', [req.params.postId, req.user.sub]);
  res.sendStatus(204);
};

// cursor = last id seen
export const userPosts = async (req, res) => {
  const { rows } = await db.query(
    `SELECT * FROM posts WHERE locationId = $1 AND authorId = $2 AND status = 1
     AND ($3::bigint IS NULL OR id < $3) ORDER BY id DESC LIMIT $4`,
    [req.user.locationId, req.params.userId, req.query.cursor || null, Math.min(req.query.limit || 20, 50)]);
  res.json({ items: rows.map(withMedia), nextCursor: rows.at(-1)?.id ?? null });
};
