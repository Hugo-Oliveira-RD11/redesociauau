import express from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
  create,
  uploadImagePost,
  list,
  feed,
  react,
  remove,
  update
} from '../controllers/post.controller';
import { upload } from '../utils/fileUpload';

const router = express.Router();

const asyncHandler = (fn: express.RequestHandler) =>
  (req: express.Request, res: express.Response, next: express.NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

router.post('/', authenticate, asyncHandler(create));
router.post('/upload', authenticate, upload.single('image'), asyncHandler(uploadImagePost));
router.get('/', authenticate, asyncHandler(list));
router.get('/feed', authenticate, asyncHandler(feed));
router.post('/:postId/react', authenticate, asyncHandler(react));
router.delete('/:postId', authenticate, asyncHandler(remove));
router.put('/:postId', authenticate, asyncHandler(update)); // Fixed route to be consistent

export default router;
