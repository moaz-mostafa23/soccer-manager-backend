import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './user-service/userRoutes';
import playerRoutes from './player-service/playerRoutes' //TODO look into if default exports are better or not
import teamRoutes from './team-service/teamRoutes';
import transferRoutes from './transfer-market-service/transferRoutes'
import { errorHandler } from './libs/common/middleware/errorHandler';

dotenv.config();

const app: Application = express();

app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.path}`);
    next();
});

app.use(cors({
    origin: 'https://soccer-manager-frontend.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    preflightContinue: true,
}));

app.options('*', (req, res) => {
    console.log('Handling OPTIONS preflight request');
    res.header('Access-Control-Allow-Origin', 'https://soccer-manager-frontend.vercel.app');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(200);
});



app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/teams', teamRoutes); //TODO look into if this should be plural or singular
app.use('/api/transfer-market', transferRoutes);
app.use(errorHandler);

app.use((req, res, next) => {
    console.log(`Request reached undefined endpoint: ${req.method} ${req.path}`);
    res.status(404).json({ message: "Endpoint not found" });
});


const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});

export default app;
