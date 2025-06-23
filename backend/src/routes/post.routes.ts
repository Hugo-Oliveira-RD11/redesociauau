import express from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
  create,
  uploadImagePost,
  list,
  feed,
  react,
  remove
} from '../controllers/post.controller';
import { upload } from '../utils/fileUpload';
import { wrap } from '../utils/wrap';

const router = express.Router();

router.post('/', authenticate, wrap(create));
router.post('/upload', authenticate, upload.single('image'), wrap(uploadImagePost));
router.get('/', authenticate, wrap(list));
router.get('/feed', authenticate, wrap(feed));
router.post('/:postId/react', authenticate, wrap(react));
router.delete('/:postId', authenticate, wrap(remove));

export default router;
