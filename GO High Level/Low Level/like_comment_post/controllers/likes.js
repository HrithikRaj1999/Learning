import db from '../db.js';

const TYPE = { posts: 1, comments: 2 };

// idempotent: PK blocks a 2nd like, counter moves only if a row was inserted
export const like = (table) => async (req, res) => {
  const { rowCount } = await db.query(
    'INSERT INTO likes (userId, targetType, targetId) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
    [req.user.sub, TYPE[table], req.params.id]);
  if (rowCount) await db.query(`UPDATE ${table} SET likeCount = likeCount + 1 WHERE id = $1`, [req.params.id]);
  res.sendStatus(200);
};

export const unlike = (table) => async (req, res) => {
  const { rowCount } = await db.query(
    'DELETE FROM likes WHERE userId = $1 AND targetType = $2 AND targetId = $3',
    [req.user.sub, TYPE[table], req.params.id]);
  if (rowCount) await db.query(`UPDATE ${table} SET likeCount = likeCount - 1 WHERE id = $1`, [req.params.id]);
  res.sendStatus(204);
};

// who liked a post; cursor = createdAt of the last like
export const likers = async (req, res) => {
  const { rows } = await db.query(
    `SELECT u.id, u.name, l.createdAt FROM likes l JOIN users u ON u.id = l.userId
     WHERE l.targetType = 1 AND l.targetId = $1 AND ($2::timestamptz IS NULL OR l.createdAt < $2)
     ORDER BY l.createdAt DESC LIMIT 20`,
    [req.params.id, req.query.cursor || null]);
  res.json({ items: rows, nextCursor: rows.at(-1)?.createdat ?? null });
};
