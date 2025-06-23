import express from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
  getProfile,
  updateProfile,
  uploadProfilePicture,
  follow,
  unfollow,
  search
} from '../controllers/user.controller';
import { upload } from '../utils/fileUpload';
import { wrap } from '../utils/wrap';

const router = express.Router();

router.get('/:userId', authenticate, wrap(getProfile));
router.put('/profile', authenticate, wrap(updateProfile));
router.post('/profile/picture', authenticate, upload.single('image'), wrap(uploadProfilePicture));
router.post('/:userId/follow', authenticate, wrap(follow));
router.delete('/:userId/follow', authenticate, wrap(unfollow));
router.get('/search', authenticate, wrap(search));

export default router;
