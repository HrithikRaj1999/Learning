import * as q from '../db/db_queries.js';
import { badRequest, notFound } from '../errors.js';
import { toPage } from './shared.js';

// Rahul -> Priya: only a PENDING request; counts don't move until Priya accepts
export const follow = async (userId, targetId) => {
  if (userId === targetId) {
    throw badRequest('CANNOT_FOLLOW_SELF');
  }

  const exists = await q.userExists(targetId);
  if (!exists) {
    throw notFound();
  }

  await q.insertFollowRequest(userId, targetId); // already sent / already following: no-op
};

// Priya: who asked to follow me
export const followRequests = async (userId, { cursor, limit }) => {
  const rows = await q.pendingRequests(userId, cursor, limit);
  return toPage(rows, limit, 'createdat');
};

// Priya accepts Rahul; counts move only if the row really went PENDING -> ACCEPTED
export const acceptRequest = async (userId, followerId) => {
  const accepted = await q.acceptFollow(followerId, userId);
  if (!accepted) {
    throw notFound();
  }
  await q.addFollowCounts(followerId, userId, 1);
};

// Priya declines Rahul
export const declineRequest = (userId, followerId) => q.declineFollow(followerId, userId);

// Rahul unfollows (or cancels his request); counts drop only if it was ACCEPTED
export const unfollow = async (userId, targetId) => {
  const oldStatus = await q.deleteFollow(userId, targetId);
  if (oldStatus === q.ACCEPTED) {
    await q.addFollowCounts(userId, targetId, -1);
  }
};
