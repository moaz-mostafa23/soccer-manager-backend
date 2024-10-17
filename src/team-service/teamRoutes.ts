import { Router } from 'express';
import { generateTeam } from './teamController';
import { authMiddleware } from '../libs/common/middleware/auth';

const router = Router();

router.use(authMiddleware);

router.post('/generate', generateTeam);

export default router;