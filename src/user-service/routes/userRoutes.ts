import { NextFunction, Request, Response, Router } from 'express';
import { registerUser, loginUser } from '../controllers/userController';

const router = Router();

router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await registerUser(req.body);
        res.status(201).json({ user });
    } catch (error) {
        next(error);
    }
});

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await loginUser(req.body);
        res.json({ user });
    } catch (error) {
        next(error);
    }
});

export default router;
