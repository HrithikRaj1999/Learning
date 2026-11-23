import express from 'express';
import * as posts from '../controllers/posts.js';
import * as comments from '../controllers/comments.js';
import * as likes from '../controllers/likes.js';
import * as validate from '../middleware/validate.js';
import { paginate } from '../middleware/paginate.js';

const router = express.Router();

router.param('postId', validate.checkId);
router.param('id', validate.checkId);

router.post('/', validate.newPost, posts.createPost);
router.get('/:postId', posts.getPost);
router.patch('/:postId', validate.editPost, posts.updatePost);
router.delete('/:postId', posts.deletePost);

router.post('/:postId/comments', validate.newComment, comments.addComment);
router.get('/:postId/comments', paginate('id'), comments.listComments);

router.put('/:id/like', likes.like('posts'));
router.delete('/:id/like', likes.unlike('posts'));
router.get('/:id/likes', paginate('time'), likes.likers);

export default router;
