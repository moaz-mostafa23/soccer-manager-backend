import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
    user?: string | jwt.JwtPayload;
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    console.log("🚀 ~ authMiddleware ~ req:", req)
    // const token = req.header('Authorization');
    const token = req.header('Authorization')?.split(' ')[1];
    console.log("🚀 ~ authMiddleware ~ token (raw):", token);

    console.log("🚀 ~ authMiddleware ~ token:", token)

    if (!token) {
        res.status(401).json({ message: 'No token, no bueno senor' });
        return;
    }

    try {
        console.log("🚀 ~ authMiddleware ~ process.env.JWT_SECRET!:", process.env.JWT_SECRET!)
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        console.log("🚀 ~ authMiddleware ~ decoded:", decoded)
        req.user = decoded;
        console.log("🚀 ~ authMiddleware ~ req.user:", req.user)
        next();
    } catch (err) {
        res.status(401).json({ message: 'token is shit, try again' });
        return;
    }
};


