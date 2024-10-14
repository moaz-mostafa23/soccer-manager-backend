import { InferSelectModel } from "drizzle-orm";
import { uuid, text, boolean, pgTable, timestamp } from "drizzle-orm/pg-core";

export const UserTable = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    is_verified: boolean('is_verified').notNull().default(false),
    verification_token: text('verification_token'),
    verification_token_expires: timestamp('verification_token_expires'),
});

export type User = InferSelectModel<typeof UserTable>;
