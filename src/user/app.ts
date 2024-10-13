import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './userRoutes';
import { errorHandler } from '../libs/common/middleware/errorHandler';

dotenv.config();

const app: Application = express();

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.options('*', cors());


app.use(express.json());
app.use('/api/users', userRoutes);
app.use(errorHandler);

const PORT = process.env.USER_SERVICE_PORT || 5001;
app.listen(PORT, () => {
    console.log(`User Service running on port ${PORT}`);
});

export default app;
