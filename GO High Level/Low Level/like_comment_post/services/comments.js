import * as q from '../db/db_queries.js';
import { notFound } from '../errors.js';
import { getVisibleComment, getVisiblePost, toPage } from './shared.js';

// one level only: a reply to a reply is stored under the top comment with replyToUserId
export const addComment = async (postId, userId, { text, parentId }) => {
  await getVisiblePost(postId, userId);

  let topId = null;
  let replyToUserId = null;

  if (parentId) {
    const parent = await q.findLiveComment(parentId, postId);
    if (!parent) {
      throw notFound();
    }

    const parentIsReply = parent.parentid !== null;
    if (parentIsReply) {
      // reply to a reply: attach under the top comment, and "@mention" the reply's author
      topId = parent.parentid;
      replyToUserId = parent.authorid;
    } else {
      topId = parentId;
    }
  }

  const comment = await q.insertComment(postId, userId, topId, replyToUserId, text);

  await q.incCommentCount(postId);
  if (topId) {
    await q.incReplyCount(topId);
  }

  return comment;
};

// top-level comments + first 2 replies each
export const listComments = async (postId, userId, sortTop, { cursor, limit }) => {
  await getVisiblePost(postId, userId);
  const rows = await q.topComments(postId, cursor, limit, sortTop);
  return toPage(rows, limit, 'id');
};

// oldest first, continues after the 2 shown inline
export const listReplies = async (commentId, userId, { cursor, limit }) => {
  await getVisibleComment(commentId, userId);
  const rows = await q.replies(commentId, cursor, limit);
  return toPage(rows, limit, 'id');
};

// owner only
export const updateComment = async (commentId, userId, text) => {
  const comment = await q.updateComment(commentId, userId, text);
  if (!comment) {
    throw notFound();
  }
  return comment;
};

// soft delete, owner only
export const deleteComment = (commentId, userId) => q.softDeleteComment(commentId, userId);
