import { InferSelectModel } from "drizzle-orm";
import { uuid, text, boolean, pgTable, timestamp, numeric, integer } from "drizzle-orm/pg-core";

// USER TABLE
export const UserTable = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    is_verified: boolean('is_verified').notNull().default(false),
    verification_token: text('verification_token'),
    verification_token_expires: timestamp('verification_token_expires'),
});

export type User = InferSelectModel<typeof UserTable>;

// TEAM TABLE
export const TeamTable = pgTable('teams', {
    id: uuid('id').primaryKey().defaultRandom(),
    user_id: uuid('user_id').notNull().references(() => UserTable.id, {
        onDelete: 'cascade',
    }),
    name: text('name').notNull(),
    country: text('country').notNull(),
    team_value: numeric('team_value').notNull().default('0'),
    additional_budget: numeric('additional_budget').notNull().default('5000000'),
});

export type Team = InferSelectModel<typeof TeamTable>;


// PLAYER TABLE
export const PlayerTable = pgTable('players', {
    id: uuid('id').primaryKey().defaultRandom(),
    team_id: uuid('team_id').notNull().references(() => TeamTable.id, {
        onDelete: 'cascade',
    }),
    first_name: text('first_name').notNull(),
    last_name: text('last_name').notNull(),
    country: text('country').notNull(),
    age: integer('age').notNull(),
    position: text('position').notNull(),
    market_value: numeric('market_value').notNull().default('1000000'),
});

export type Player = InferSelectModel<typeof PlayerTable>;

