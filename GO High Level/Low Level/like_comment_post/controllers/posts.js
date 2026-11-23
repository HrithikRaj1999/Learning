import * as postService from "../services/posts.js";

// Controllers only: read the request -> call the service -> send the reply.
// Token check, input checks and paging are done by middleware before we get here.

export const createPost = async (req, res) => {
  const post = await postService.createPost(req.userId, req.body);
  res.status(201).json({ post });
};

export const getPost = async (req, res) => {
  const result = await postService.getPost(req.params.postId, req.userId);
  res.json(result);
};

export const updatePost = async (req, res) => {
  const post = await postService.updatePost(req.params.postId, req.userId, req.body.content);
  res.json({ post });
};

export const deletePost = async (req, res) => {
  await postService.deletePost(req.params.postId, req.userId);
  res.sendStatus(204);
};

export const userPosts = async (req, res) => {
  const page = await postService.userPosts(req.params.userId, req.userId, req.page);
  res.json(page);
};
