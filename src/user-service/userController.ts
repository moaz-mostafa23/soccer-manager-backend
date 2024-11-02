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
    } catch (error) {
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
    } catch (error) {
        next(error);
    }

};

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    // TODO: Add validation for token
    try {
        const { token } = req.body;
        await UserService.verifyEmail(token);
        res.json({ message: 'Email verified successfully' });
    } catch (error) {
        next(error);
    }
};

