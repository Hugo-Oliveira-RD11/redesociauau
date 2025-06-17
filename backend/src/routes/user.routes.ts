import express from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
  getProfile,
  updateProfile,
  uploadProfilePicture,
  follow,
  unfollow,
  search // ← Agora compatível com a tipagem do Express
} from '../controllers/user.controller';
import { upload } from '../utils/fileUpload';

const router = express.Router();

const asyncHandler = (fn: express.RequestHandler) =>
  (req: express.Request, res: express.Response, next: express.NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

router.get('/:userId', authenticate, getProfile);
router.put('/profile', authenticate, asyncHandler(updateProfile));
router.post('/profile/picture', authenticate, upload.single('image'), asyncHandler(uploadProfilePicture));
router.post('/:userId/follow', authenticate, follow);
router.delete('/:userId/follow', authenticate, unfollow);
router.get('/search', authenticate, search);

export default router;
