import db from '../db.js';

export const follow = async (req, res) => {
  const { rowCount } = await db.query(
    'INSERT INTO follows (followerId, followeeId) VALUES ($1, $2) ON CONFLICT DO NOTHING', [req.user.sub, req.params.userId]);
  if (rowCount) {
    await db.query('UPDATE users SET followingCount = followingCount + 1 WHERE id = $1', [req.user.sub]);
    await db.query('UPDATE users SET followerCount = followerCount + 1 WHERE id = $1', [req.params.userId]);
  }
  res.sendStatus(200);
};

export const unfollow = async (req, res) => {
  const { rowCount } = await db.query(
    'DELETE FROM follows WHERE followerId = $1 AND followeeId = $2', [req.user.sub, req.params.userId]);
  if (rowCount) {
    await db.query('UPDATE users SET followingCount = followingCount - 1 WHERE id = $1', [req.user.sub]);
    await db.query('UPDATE users SET followerCount = followerCount - 1 WHERE id = $1', [req.params.userId]);
  }
  res.sendStatus(204);
};
