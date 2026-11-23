import * as commentService from "../services/comments.js";

export const addComment = async (req, res) => {
  const comment = await commentService.addComment(req.params.postId, req.userId, req.body);
  res.status(201).json({ comment });
};

// ?sort=top puts the most liked first
export const listComments = async (req, res) => {
  const sortTop = req.query.sort === "top";
  const page = await commentService.listComments(req.params.postId, req.userId, sortTop, req.page);
  res.json(page);
};

export const listReplies = async (req, res) => {
  const page = await commentService.listReplies(req.params.commentId, req.userId, req.page);
  res.json(page);
};

export const updateComment = async (req, res) => {
  const comment = await commentService.updateComment(req.params.commentId, req.userId, req.body.text);
  res.json({ comment });
};

export const deleteComment = async (req, res) => {
  await commentService.deleteComment(req.params.commentId, req.userId);
  res.sendStatus(204);
};
