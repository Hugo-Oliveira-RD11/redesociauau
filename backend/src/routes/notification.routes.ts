import express from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
  list,
  markAsRead
} from '../controllers/notification.controller';

const router = express.Router();

router.get('/', authenticate, list);
router.patch('/:notificationId/read', authenticate, markAsRead);

export default router;
