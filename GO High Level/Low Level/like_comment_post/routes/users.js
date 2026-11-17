import express from 'express';
import * as posts from '../controllers/posts.js';
import * as users from '../controllers/users.js';

const router = express.Router();

router.get('/:userId/posts', posts.userPosts);
router.put('/:userId/follow', users.follow);
router.delete('/:userId/follow', users.unfollow);

export default router;
