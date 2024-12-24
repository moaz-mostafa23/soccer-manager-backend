import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    schema: './src/libs/db/schema.ts',
    out: './drizzle',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL!,
        ssl: {
            rejectUnauthorized: false,
        },
    },
    verbose: true,
    strict: true,
});
