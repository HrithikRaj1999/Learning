import db from '../db.js';

// one level only: a reply to a reply is stored under the top comment with replyToUserId
export const addComment = async (req, res) => {
  const { text, parentId } = req.body;
  const { postId } = req.params;
  let topId = null, replyTo = null;
  if (parentId) {
    const { rows: [parent] } = await db.query(
      'SELECT parentId, authorId FROM comments WHERE id = $1 AND postId = $2 AND status = 1', [parentId, postId]);
    if (!parent) return res.sendStatus(404);
    topId = parent.parentid ?? parentId;
    replyTo = parent.parentid ? parent.authorid : null;
  }
  const { rows: [comment] } = await db.query(
    `INSERT INTO comments (locationId, postId, authorId, parentId, replyToUserId, text)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [req.user.locationId, postId, req.user.sub, topId, replyTo, text]);
  await db.query('UPDATE posts SET commentCount = commentCount + 1 WHERE id = $1', [postId]);
  if (topId) await db.query('UPDATE comments SET replyCount = replyCount + 1 WHERE id = $1', [topId]);
  res.status(201).json({ comment });
};

// top-level comments + first 2 replies each (replyCount is a column)
// shortcut: sort=top pages by id; needs a (likeCount, id) cursor for exact paging
export const listComments = async (req, res) => {
  const order = req.query.sort === 'top' ? 'likeCount DESC, id DESC' : 'id DESC';
  const { rows } = await db.query(
    `SELECT c.*, (SELECT json_agg(r) FROM
       (SELECT * FROM comments WHERE parentId = c.id AND status = 1 ORDER BY id LIMIT 2) r) AS replies
     FROM comments c WHERE postId = $1 AND locationId = $3 AND parentId IS NULL AND status = 1
     AND ($2::bigint IS NULL OR id < $2) ORDER BY ${order} LIMIT 20`,
    [req.params.postId, req.query.cursor || null, req.user.locationId]);
  res.json({ items: rows, nextCursor: rows.at(-1)?.id ?? null });
};

// oldest first, continues after the 2 shown inline
export const listReplies = async (req, res) => {
  const { rows } = await db.query(
    `SELECT * FROM comments WHERE parentId = $1 AND locationId = $3 AND status = 1
     AND ($2::bigint IS NULL OR id > $2) ORDER BY id LIMIT 20`,
    [req.params.commentId, req.query.cursor || null, req.user.locationId]);
  res.json({ items: rows, nextCursor: rows.at(-1)?.id ?? null });
};

export const updateComment = async (req, res) => {
  const { rows: [comment] } = await db.query(
    'UPDATE comments SET text = $1 WHERE id = $2 AND authorId = $3 AND status = 1 RETURNING *',
    [req.body.text, req.params.commentId, req.user.sub]);
  if (!comment) return res.sendStatus(404);
  res.json({ comment });
};

export const deleteComment = async (req, res) => {
  await db.query('UPDATE comments SET status = 2 WHERE id = $1 AND authorId = $2', [req.params.commentId, req.user.sub]);
  res.sendStatus(204);
};
