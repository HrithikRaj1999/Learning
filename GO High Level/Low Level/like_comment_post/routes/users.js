import express from 'express';
import * as posts from '../controllers/posts.js';
import * as users from '../controllers/users.js';
import * as validate from '../middleware/validate.js';
import { paginate } from '../middleware/paginate.js';

const router = express.Router();

router.param('userId', validate.checkId);
router.param('followerId', validate.checkId);

// Priya side: her pending follow requests
router.get('/me/follow-requests', paginate('time'), users.followRequests);
router.post('/me/follow-requests/:followerId/accept', users.acceptRequest);
router.delete('/me/follow-requests/:followerId', users.declineRequest);

// Rahul side
router.put('/:userId/follow', users.follow);       // send request
router.delete('/:userId/follow', users.unfollow);  // unfollow / cancel request
router.get('/:userId/posts', paginate('id'), posts.userPosts);

export default router;
