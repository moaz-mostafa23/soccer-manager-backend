import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import * as schema from '../db/schema';

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Initialize Drizzle with schema
const db = drizzle(pool, { schema });

export default db;
