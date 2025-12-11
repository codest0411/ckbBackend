import { Router } from 'express';
import { deleteMessage, listMessages } from '../controllers/contactController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', authenticate, listMessages);
router.delete('/:id', authenticate, deleteMessage);

export default router;
