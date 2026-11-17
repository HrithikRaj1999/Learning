import express from 'express';
import * as posts from '../controllers/posts.js';
import * as comments from '../controllers/comments.js';
import * as likes from '../controllers/likes.js';

const router = express.Router();

router.post('/', posts.createPost);
router.get('/:postId', posts.getPost);
router.patch('/:postId', posts.updatePost);
router.delete('/:postId', posts.deletePost);

router.post('/:postId/comments', comments.addComment);
router.get('/:postId/comments', comments.listComments);

router.put('/:id/like', likes.like('posts'));
router.delete('/:id/like', likes.unlike('posts'));
router.get('/:id/likes', likes.likers);

export default router;
