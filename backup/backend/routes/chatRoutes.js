import express from 'express';
import { getMessagesByItem, sendMessage } from '../controllers/chatController.js';

const router = express.Router();

router.get('/:itemId', getMessagesByItem);
router.post('/:itemId', sendMessage);

export default router;
