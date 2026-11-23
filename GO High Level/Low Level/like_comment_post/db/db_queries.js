import db from './db.js';

const one = async (sql, params) => (await db.query(sql, params)).rows[0] ?? null;
const many = async (sql, params) => (await db.query(sql, params)).rows;
const count = async (sql, params) => (await db.query(sql, params)).rowCount;

export const POST = 'post', COMMENT = 'comment';         // likes.targetType
export const ACCEPTED = 'accepted';                       // follows.status: 'pending' | 'accepted'
const COUNTED = { [POST]: 'posts', [COMMENT]: 'comments' }; // fixed names, never from user input

// ---------- access: my own post, or I'm an ACCEPTED follower of its author ----------
const CAN_SEE = `(p.authorId = $2 OR EXISTS (
  SELECT 1 FROM follows f WHERE f.followerId = $2 AND f.followeeId = p.authorId AND f.status = 'accepted'))`;

export const visiblePost = (postId, userId) =>
  one(`SELECT p.* FROM posts p WHERE p.id = $1 AND p.status = 'active' AND ${CAN_SEE}`, [postId, userId]);

export const visibleComment = (commentId, userId) =>
  one(`SELECT c.* FROM comments c JOIN posts p ON p.id = c.postId
       WHERE c.id = $1 AND c.status = 'active' AND p.status = 'active' AND ${CAN_SEE}`, [commentId, userId]);

export const isAcceptedFollower = async (followerId, followeeId) =>
  await count(`SELECT 1 FROM follows WHERE followerId = $1 AND followeeId = $2 AND status = 'accepted'`,
    [followerId, followeeId]) > 0;

// ---------- posts ----------
export const insertPost = (authorId, content, mediaKeys) =>
  one('INSERT INTO posts (authorId, content, mediaKeys) VALUES ($1, $2, $3) RETURNING *', [authorId, content, mediaKeys]);

export const updatePost = (postId, authorId, content) =>
  one(`UPDATE posts SET content = $1, updatedAt = now()
       WHERE id = $2 AND authorId = $3 AND status = 'active' RETURNING *`, [content, postId, authorId]);

export const softDeletePost = (postId, authorId) =>
  count(`UPDATE posts SET status = 'deleted' WHERE id = $1 AND authorId = $2`, [postId, authorId]);

// cursor = last id seen (ids are time-sortable)
export const postsByAuthor = (authorId, cursor, limit) =>
  many(`SELECT * FROM posts WHERE authorId = $1 AND status = 'active'
        AND ($2::bigint IS NULL OR id < $2) ORDER BY id DESC LIMIT $3`, [authorId, cursor, limit]);

export const incCommentCount = (postId) =>
  count('UPDATE posts SET commentCount = commentCount + 1 WHERE id = $1', [postId]);

// ---------- comments ----------
export const findLiveComment = (commentId, postId) =>
  one(`SELECT parentId, authorId FROM comments WHERE id = $1 AND postId = $2 AND status = 'active'`, [commentId, postId]);

export const insertComment = (postId, authorId, parentId, replyToUserId, text) =>
  one(`INSERT INTO comments (postId, authorId, parentId, replyToUserId, text)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`, [postId, authorId, parentId, replyToUserId, text]);

export const incReplyCount = (commentId) =>
  count('UPDATE comments SET replyCount = replyCount + 1 WHERE id = $1', [commentId]);

// top-level comments + first 2 replies each
// shortcut: sort=top pages by id; needs a (likeCount, id) cursor for exact paging
export const topComments = (postId, cursor, limit, sortTop) =>
  many(`SELECT c.*, (SELECT json_agg(r) FROM
          (SELECT * FROM comments WHERE parentId = c.id AND status = 'active' ORDER BY id LIMIT 2) r) AS replies
        FROM comments c WHERE postId = $1 AND parentId IS NULL AND status = 'active'
        AND ($2::bigint IS NULL OR id < $2)
        ORDER BY ${sortTop ? 'likeCount DESC, id DESC' : 'id DESC'} LIMIT $3`, [postId, cursor, limit]);

// oldest first, continues after the 2 shown inline
export const replies = (commentId, cursor, limit) =>
  many(`SELECT * FROM comments WHERE parentId = $1 AND status = 'active'
        AND ($2::bigint IS NULL OR id > $2) ORDER BY id LIMIT $3`, [commentId, cursor, limit]);

export const updateComment = (commentId, authorId, text) =>
  one(`UPDATE comments SET text = $1 WHERE id = $2 AND authorId = $3 AND status = 'active' RETURNING *`,
    [text, commentId, authorId]);

export const softDeleteComment = (commentId, authorId) =>
  count(`UPDATE comments SET status = 'deleted' WHERE id = $1 AND authorId = $2`, [commentId, authorId]);

// ---------- likes ----------
// returns 1 if a new like row was saved, 0 if it already existed (PK blocks a 2nd like)
export const insertLike = (userId, targetType, targetId) =>
  count('INSERT INTO likes (userId, targetType, targetId) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
    [userId, targetType, targetId]);

export const deleteLike = (userId, targetType, targetId) =>
  count('DELETE FROM likes WHERE userId = $1 AND targetType = $2 AND targetId = $3', [userId, targetType, targetId]);

export const addLikeCount = (targetType, targetId, delta) =>
  count(`UPDATE ${COUNTED[targetType]} SET likeCount = likeCount + $2 WHERE id = $1`, [targetId, delta]);

export const likedByMe = async (userId, targetType, targetId) =>
  await count('SELECT 1 FROM likes WHERE userId = $1 AND targetType = $2 AND targetId = $3',
    [userId, targetType, targetId]) > 0;

// who liked a post; cursor = createdAt of the last like
export const likers = (postId, cursor, limit) =>
  many(`SELECT u.id, u.name, l.createdAt FROM likes l JOIN users u ON u.id = l.userId
        WHERE l.targetType = 'post' AND l.targetId = $1 AND ($2::timestamptz IS NULL OR l.createdAt < $2)
        ORDER BY l.createdAt DESC LIMIT $3`, [postId, cursor, limit]);

// ---------- users & follows ----------
export const userExists = async (userId) => await count('SELECT 1 FROM users WHERE id = $1', [userId]) > 0;

export const insertFollowRequest = (followerId, followeeId) =>
  count(`INSERT INTO follows (followerId, followeeId, status) VALUES ($1, $2, 'pending') ON CONFLICT DO NOTHING`,
    [followerId, followeeId]);

// newest first; cursor = createdAt of the last one
export const pendingRequests = (followeeId, cursor, limit) =>
  many(`SELECT u.id, u.name, f.createdAt FROM follows f JOIN users u ON u.id = f.followerId
        WHERE f.followeeId = $1 AND f.status = 'pending' AND ($2::timestamptz IS NULL OR f.createdAt < $2)
        ORDER BY f.createdAt DESC LIMIT $3`, [followeeId, cursor, limit]);

// returns 1 only if the row really went PENDING -> ACCEPTED
export const acceptFollow = (followerId, followeeId) =>
  count(`UPDATE follows SET status = 'accepted'
         WHERE followerId = $1 AND followeeId = $2 AND status = 'pending'`, [followerId, followeeId]);

export const declineFollow = (followerId, followeeId) =>
  count(`DELETE FROM follows WHERE followerId = $1 AND followeeId = $2 AND status = 'pending'`,
    [followerId, followeeId]);

// returns the deleted row's status (or null if there was none)
export const deleteFollow = async (followerId, followeeId) =>
  (await one('DELETE FROM follows WHERE followerId = $1 AND followeeId = $2 RETURNING status',
    [followerId, followeeId]))?.status ?? null;

export const addFollowCounts = async (followerId, followeeId, delta) => {
  await db.query('UPDATE users SET followingCount = followingCount + $2 WHERE id = $1', [followerId, delta]);
  await db.query('UPDATE users SET followerCount = followerCount + $2 WHERE id = $1', [followeeId, delta]);
};
