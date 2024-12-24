import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../db/schema';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    connectionString: process.env.MY_DATABASE_URL,
});

const db = drizzle(pool, { schema });

export default db;
