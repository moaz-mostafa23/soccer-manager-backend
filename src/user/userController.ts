import { Request, Response, NextFunction } from 'express';
import UserService from './userService';

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await UserService.registerUser(req.body);
        res.status(201).json({ user });
    } catch (error: any) {
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log('req.body', req.body);
        const user = await UserService.loginUser(req.body);
        res.json({ user });
    } catch (error: any) {
        next(error);
    }
};

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await UserService.verifyEmail(req.body.token as string);
        res.json({ message: 'Email verified successfully' });
    } catch (error: any) {
        next(error); // Ensure error is passed properly to middleware
    }
};

