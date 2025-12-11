import { Router } from 'express';
import { login, refresh } from '../controllers/authController.js';
import { validateBody } from '../middleware/validate.js';
import { loginSchema, refreshSchema } from '../validators/authSchemas.js';

const router = Router();

router.post('/login', validateBody(loginSchema), login);
router.post('/refresh', validateBody(refreshSchema), refresh);

export default router;
