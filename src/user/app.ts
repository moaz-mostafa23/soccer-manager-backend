import express, { Application } from 'express';
import dotenv from 'dotenv';
import userRoutes from './userRoutes';
import db from '../libs/config/drizzle.config';
import { UserTable } from '../libs/db/schema';
import { errorHandler } from '../libs/common/middleware/errorHandler';

dotenv.config();

const app: Application = express();

app.use(express.json());

// const testConnection = async () => {
//     try {
//         const result = await db.select().from(UserTable);
//         console.log('Database connected. Number of users:', result.length);
//     } catch (error) {
//         console.error('Database connection failed:', error);
//     }
// };

// testConnection();

app.use('/api/users', userRoutes);
app.use(errorHandler); //this shit should be placed after the routes to catch errors


// const PORT = process.env.USER_SERVICE_PORT || 5001;
// app.listen(PORT, () => {
//     console.log(`User Service running on port ${PORT}`);
// });

export default app;