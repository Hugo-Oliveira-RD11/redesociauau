import express from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
  addTag,
  removeTag,
  getUserTagController,
  search,
  popular
} from '../controllers/tag.controller';

const router = express.Router();

const asyncHandler = (fn: express.RequestHandler) =>
  (req: express.Request, res: express.Response, next: express.NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

router.post('/', authenticate, addTag);
router.delete('/:tagId', authenticate, removeTag);
router.get('/user/:userId', authenticate, getUserTagController);
router.get('/search', authenticate, asyncHandler(search));
router.get('/popular', authenticate, popular);

export default router;
