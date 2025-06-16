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

router.post('/', authenticate, create);
router.post('/:groupId/join', authenticate, join);
router.delete('/:groupId', authenticate, deleteGroup);
router.post('/:groupId/members', authenticate, addMember);
router.delete('/:groupId/members/:userId', authenticate, removeMember);
router.get('/:groupId/posts', authenticate, getPosts);
router.get('/search', authenticate, search);

export default router;
