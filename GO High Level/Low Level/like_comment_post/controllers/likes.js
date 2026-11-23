import * as likeService from "../services/likes.js";

// kind = "posts" or "comments" (fixed by the route, never from the user)
export const like = (kind) => async (req, res) => {
  await likeService.like(kind, req.params.id, req.userId);
  res.sendStatus(200);
};

export const unlike = (kind) => async (req, res) => {
  await likeService.unlike(kind, req.params.id, req.userId);
  res.sendStatus(204);
};

export const likers = async (req, res) => {
  const page = await likeService.likers(req.params.id, req.userId, req.page);
  res.json(page);
};
