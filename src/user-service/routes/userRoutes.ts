import { NextFunction, Request, Response, Router } from 'express';
import { registerUser, loginUser } from '../controllers/userController'; // Import the controller functions

const router = Router();

router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await registerUser({ ...req.body.user });
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
