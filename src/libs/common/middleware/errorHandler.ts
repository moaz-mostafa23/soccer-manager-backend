import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, _next: NextFunction) => {
    const statusCode = err.status || 500;

    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
        stack: err.stack,
    });
};
