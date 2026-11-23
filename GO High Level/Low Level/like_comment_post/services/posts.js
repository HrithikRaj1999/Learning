import * as q from '../db/db_queries.js';
import { badRequest, notFound } from '../errors.js';
import { getVisiblePost, toPage } from './shared.js';

// DB keeps S3 keys only; the URL is built on read, so the CDN domain (or signed URLs) can change freely
const CDN = process.env.CDN_BASE_URL; // e.g. https://cdn.example.com

const withMedia = (post) => {
  const { mediakeys, ...rest } = post;
  const mediaUrls = (mediakeys ?? []).map((key) => `${CDN}/${key}`);
  return { ...rest, mediaUrls };
};

// a key is valid only if it sits inside the caller's own upload folder
const isOwnMediaKey = (key, userId) => !key.includes('..') && key.startsWith(`posts/${userId}/`);

export const createPost = async (userId, { content, mediaKeys }) => {
  const allOwn = mediaKeys.every((key) => isOwnMediaKey(key, userId));
  if (!allOwn) {
    throw badRequest('INVALID_MEDIA_KEY');
  }

  const post = await q.insertPost(userId, content, mediaKeys);
  return withMedia(post);
};

// my post, or I'm an accepted follower of the author; else 404
export const getPost = async (postId, userId) => {
  const post = await getVisiblePost(postId, userId);
  const likedByMe = await q.likedByMe(userId, q.POST, post.id);
  return { post: withMedia(post), likedByMe };
};

// owner only
export const updatePost = async (postId, userId, content) => {
  const post = await q.updatePost(postId, userId, content);
  if (!post) {
    throw notFound();
  }
  return withMedia(post);
};

// soft delete, owner only
export const deletePost = (postId, userId) => q.softDeletePost(postId, userId);

// Priya's posts: only for Priya herself or her accepted followers
export const userPosts = async (authorId, userId, { cursor, limit }) => {
  const isMe = authorId === userId;
  if (!isMe) {
    const follows = await q.isAcceptedFollower(userId, authorId);
    if (!follows) {
      throw notFound();
    }
  }

  const rows = await q.postsByAuthor(authorId, cursor, limit);
  return toPage(rows.map(withMedia), limit, 'id');
};
