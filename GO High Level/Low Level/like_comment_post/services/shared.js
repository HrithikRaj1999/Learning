import * as q from '../db/db_queries.js';
import { notFound } from '../errors.js';

// Can this user see it? (own post, or ACCEPTED follower of the author)
// If not, say 404 (not 403) so a stranger can't even tell the post exists.
export const getVisiblePost = async (postId, userId) => {
  const post = await q.visiblePost(postId, userId);
  if (!post) {
    throw notFound();
  }
  return post;
};

export const getVisibleComment = async (commentId, userId) => {
  const comment = await q.visibleComment(commentId, userId);
  if (!comment) {
    throw notFound();
  }
  return comment;
};

// rows -> { items, nextCursor }; a short page means there is nothing after it
export const toPage = (rows, limit, cursorField) => {
  const hasMore = rows.length === limit;
  const nextCursor = hasMore ? rows.at(-1)[cursorField] : null;
  return { items: rows, nextCursor };
};
