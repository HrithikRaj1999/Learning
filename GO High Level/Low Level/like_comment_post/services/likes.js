import * as q from '../db/db_queries.js';
import { getVisibleComment, getVisiblePost, toPage } from './shared.js';

const TARGET = {
  posts: { type: q.POST, getVisible: getVisiblePost },
  comments: { type: q.COMMENT, getVisible: getVisibleComment },
};

// check first: can I see it? else 404
// safe to repeat: the counter moves only if a new like row was saved
export const like = async (kind, targetId, userId) => {
  const { type, getVisible } = TARGET[kind];
  await getVisible(targetId, userId);

  const inserted = await q.insertLike(userId, type, targetId);
  if (inserted) {
    await q.addLikeCount(type, targetId, 1);
  }
};

// no access check needed: you can only remove your own like row
export const unlike = async (kind, targetId, userId) => {
  const { type } = TARGET[kind];

  const deleted = await q.deleteLike(userId, type, targetId);
  if (deleted) {
    await q.addLikeCount(type, targetId, -1);
  }
};

// who liked a post
export const likers = async (postId, userId, { cursor, limit }) => {
  await getVisiblePost(postId, userId);
  const rows = await q.likers(postId, cursor, limit);
  return toPage(rows, limit, 'createdat');
};
