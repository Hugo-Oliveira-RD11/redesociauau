import express, { Request, Response, NextFunction } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import * as groupController from '../controllers/group.controller';

const router = express.Router();

const wrap = (fn: any) => (req: Request, res: Response, next: NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.post('/', authenticate, wrap(groupController.create));
router.post('/:groupId/members', authenticate, wrap(groupController.addMember));
router.delete('/:groupId/members/:userId', authenticate, wrap(groupController.removeMember));
router.get('/:groupId/posts', authenticate, wrap(groupController.getPosts));
router.get('/search', authenticate, wrap(groupController.search));

export default router;
