import { Request, Response, NextFunction } from 'express';
import UserService from './userService';
import { BadRequest } from 'http-errors';

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new BadRequest('Please provide both email and password');
        }

        const user = await UserService.registerUser(req.body);
        res.status(201).json({ user });
    } catch (error: any) {
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new BadRequest('Please provide both email and password');
        }

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
        next(error);
    }
};

