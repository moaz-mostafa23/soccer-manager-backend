import { Router } from 'express';
import { getPlayerById, getPlayersByTeam, transferPlayer } from './playerController';
import { authMiddleware } from '../libs/common/middleware/auth';

const router = Router();

router.use(authMiddleware);

router.get('/:teamId', getPlayersByTeam);

router.get('/:playerId', getPlayerById);

export default router;
