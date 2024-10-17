import { Router } from 'express';
import { getPlayerById, getPlayersByTeam, placePlayerOnTransferList, transferPlayer } from './playerController';
import { authMiddleware } from '../libs/common/middleware/auth';

const router = Router();

router.use(authMiddleware);

router.get('/:teamId', getPlayersByTeam);

router.post('/transfer-list', placePlayerOnTransferList);

router.post('/transfer', transferPlayer);

router.get('/:playerId', getPlayerById);

export default router;
