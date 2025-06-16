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

const router = express.Router();

router.post('/', authenticate, create);
router.post('/upload', authenticate, upload.single('image'), uploadImagePost);
router.get('/', authenticate, list);
router.get('/feed', authenticate, feed);
router.post('/:postId/react', authenticate, react);
router.delete('/:postId', authenticate, remove);
router.put('/posts/:postId', authenticate, update);

export default router;
