import { Request, Response, NextFunction } from 'express';
import UserService from './userService';

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await UserService.registerUser(req.body);
        res.status(201).json({ user });
    } catch (error) {
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await UserService.loginUser(req.body);
        res.json({ user });
    } catch (error) {
        next(error);
    }
};
