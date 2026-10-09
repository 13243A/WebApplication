import express from 'express';
import { getMessagesByRoom, sendMessageToRoom, getInboxThreads } from '../controllers/chatController.js';

const router = express.Router();

router.get('/room/:roomId', getMessagesByRoom);
router.post('/room/:roomId', sendMessageToRoom);
router.post('/inbox-threads', getInboxThreads);

export default router;