import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/libs/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.MY_DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  },
  verbose: true,
  strict: true,
  tablesFilter: ['pg_stat_statements', 'pg_stat_statements_info']
});
