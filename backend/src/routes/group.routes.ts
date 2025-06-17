import express from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
  create,
  join,
  addMember,
  removeMember,
  deleteGroup,
  getPosts,
  search
} from '../controllers/group.controller';

const router = express.Router();

const asyncHandler = (fn: express.RequestHandler) =>
  (req: express.Request, res: express.Response, next: express.NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

router.post('/', authenticate, asyncHandler(create));
router.post('/:groupId/join', authenticate, asyncHandler(join));
router.delete('/:groupId', authenticate, asyncHandler(deleteGroup));
router.post('/:groupId/members', authenticate, asyncHandler(addMember));
router.delete('/:groupId/members/:userId', authenticate, asyncHandler(removeMember));
router.get('/:groupId/posts', authenticate, asyncHandler(getPosts));
router.get('/search', authenticate, asyncHandler(search));

export default router;
