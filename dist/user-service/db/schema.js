"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.UserTable = (0, pg_core_1.pgTable)('users', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    email: (0, pg_core_1.text)('email').notNull().unique(),
    password: (0, pg_core_1.text)('password').notNull(),
    isVerified: (0, pg_core_1.boolean)('is_verified').notNull().default(false),
});
