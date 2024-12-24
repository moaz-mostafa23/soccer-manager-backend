import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../db/schema';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    connectionString: `${process.env.DATABASE_URL}?sslmode=no-verify`,
});

const db = drizzle(pool, { schema });

export default db;
