import { serial, text, boolean, pgTable } from "drizzle-orm/pg-core";

export const UserTable = pgTable('users', {
    id: serial('id').primaryKey(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    isVerified: boolean('is_verified').notNull().default(false),
});
