import express from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
  addTag,
  removeTag,
  getUserTagsController, 
  search,
  popular
} from '../controllers/tag.controller';
import { wrap } from '../utils/wrap';

const router = express.Router();

router.post('/', authenticate, wrap(addTag));
router.delete('/:tagId', authenticate, wrap(removeTag));
router.get('/user/:userId', authenticate, wrap(getUserTagsController)); 
router.get('/search', authenticate, wrap(search));
router.get('/popular', authenticate, wrap(popular));

export default router;
