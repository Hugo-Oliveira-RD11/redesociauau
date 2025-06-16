import express from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
  create,
  list,
  react
} from '../controllers/comment.controller';

const router = express.Router();

router.post('/:postId', authenticate, create);
router.get('/:postId', authenticate, list);
router.post('/:commentId/react', authenticate, react);
router.put('/comments/:commentId', authenticate, update);

export default router;
