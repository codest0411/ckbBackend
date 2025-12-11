import { Router } from 'express';
import { uploadMedia, listMedia, deleteMedia } from '../controllers/mediaController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { handleUploadErrors, imageUpload, resumeUpload } from '../middleware/uploadMiddleware.js';

const router = Router();

router.get('/', authenticate, listMedia);
router.post('/image', authenticate, imageUpload, handleUploadErrors, uploadMedia);
router.post('/resume', authenticate, resumeUpload, handleUploadErrors, uploadMedia);
router.delete('/:id', authenticate, deleteMedia);

export default router;
