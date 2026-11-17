import express from 'express';
import * as comments from '../controllers/comments.js';
import * as likes from '../controllers/likes.js';

const router = express.Router();

router.get('/:commentId/replies', comments.listReplies);
router.patch('/:commentId', comments.updateComment);
router.delete('/:commentId', comments.deleteComment);

router.put('/:id/like', likes.like('comments'));
router.delete('/:id/like', likes.unlike('comments'));

export default router;
