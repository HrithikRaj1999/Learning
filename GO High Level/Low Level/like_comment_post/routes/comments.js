import express from 'express';
import * as comments from '../controllers/comments.js';
import * as likes from '../controllers/likes.js';
import * as validate from '../middleware/validate.js';
import { paginate } from '../middleware/paginate.js';

const router = express.Router();

router.param('commentId', validate.checkId);
router.param('id', validate.checkId);

router.get('/:commentId/replies', paginate('id'), comments.listReplies);
router.patch('/:commentId', validate.editComment, comments.updateComment);
router.delete('/:commentId', comments.deleteComment);

router.put('/:id/like', likes.like('comments'));
router.delete('/:id/like', likes.unlike('comments'));

export default router;
