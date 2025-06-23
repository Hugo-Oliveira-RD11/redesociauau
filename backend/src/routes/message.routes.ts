import express from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
  send,
  conversation,
  conversations
} from '../controllers/message.controller';

const router = express.Router();

router.post('/:userId', authenticate, send);
router.get('/:userId', authenticate, conversation);
router.get('/', authenticate, conversations);

export default router;
