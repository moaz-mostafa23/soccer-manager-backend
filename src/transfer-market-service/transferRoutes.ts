import { Router } from 'express';
import { authMiddleware } from '../libs/common/middleware/auth';
import { listOnMarket, getTransferList, buyPlayer } from './transferController';

const router = Router();

router.use(authMiddleware);

router.post('/list', listOnMarket);

router.get('/list', getTransferList);

router.post('/buy', buyPlayer);

export default router;