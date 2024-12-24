import { defineConfig } from 'drizzle-kit';
export default defineConfig({
    schema: './src/user-service/db/schema.ts',
    out: './drizzle',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL || '',
        ssl: true,
    },
    verbose: true,
    strict: true,
});
