import * as userService from "../services/users.js";

export const follow = async (req, res) => {
  await userService.follow(req.userId, req.params.userId);
  res.sendStatus(202); // request sent (or already sent / already following)
};

export const followRequests = async (req, res) => {
  const page = await userService.followRequests(req.userId, req.page);
  res.json(page);
};

export const acceptRequest = async (req, res) => {
  await userService.acceptRequest(req.userId, req.params.followerId);
  res.sendStatus(200);
};

export const declineRequest = async (req, res) => {
  await userService.declineRequest(req.userId, req.params.followerId);
  res.sendStatus(204);
};

export const unfollow = async (req, res) => {
  await userService.unfollow(req.userId, req.params.userId);
  res.sendStatus(204);
};
