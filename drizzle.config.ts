import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    schema: './src/libs/db/schema.ts',
    out: './drizzle',
    dialect: 'postgresql',
    dbCredentials: {
        url: `${process.env.DATABASE_URL!}?sslmode=require`,
        ssl: { rejectUnauthorized: false },
    },
    tablesFilter: ['players', 'teams', 'transfer_listings', 'users'],
    verbose: true,
    strict: true,
});
