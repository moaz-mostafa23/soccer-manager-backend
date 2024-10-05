"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.checkUserExistence = exports.registerUser = void 0;
const schema_1 = require("../db/schema");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const drizzle_config_1 = __importDefault(require("../config/drizzle.config"));
const drizzle_orm_1 = require("drizzle-orm");
const http_errors_1 = require("http-errors");
const utils_1 = require("../utils");
const registerUser = async (input) => {
    const { email, password } = input;
    if (!email || !password) {
        throw new http_errors_1.BadRequest('Please provide email and password');
    }
    const userEmail = email.trim();
    const userPassword = password.trim();
    await (0, exports.checkUserExistence)(userEmail);
    const hashedPassword = await bcryptjs_1.default.hash(userPassword, 10);
    const insertedUsers = await drizzle_config_1.default
        .insert(schema_1.UserTable)
        .values({
        email: userEmail,
        password: hashedPassword,
    })
        .returning();
    const user = insertedUsers[0];
    return {
        ...user,
        token: (0, utils_1.generateToken)(user.id),
    };
};
exports.registerUser = registerUser;
const checkUserExistence = async (email) => {
    const existingUser = await drizzle_config_1.default
        .select()
        .from(schema_1.UserTable)
        .where((0, drizzle_orm_1.eq)(schema_1.UserTable.email, email));
    if (existingUser.length > 0) {
        throw new http_errors_1.UnprocessableEntity('User already exists');
    }
};
exports.checkUserExistence = checkUserExistence;
const loginUser = async (input) => {
    const { email, password } = input;
    if (!email || !password) {
        throw new http_errors_1.BadRequest('Please provide email and password');
    }
    const userEmail = email.trim();
    const userPassword = password.trim();
    const users = await drizzle_config_1.default
        .select()
        .from(schema_1.UserTable)
        .where((0, drizzle_orm_1.eq)(schema_1.UserTable.email, userEmail));
    const user = users[0];
    if (user) {
        const isMatch = await bcryptjs_1.default.compare(userPassword, user.password);
        if (isMatch) {
            return {
                email: user.email,
                token: (0, utils_1.generateToken)(user.id),
            };
        }
    }
    throw new http_errors_1.BadRequest('Invalid credentials');
};
exports.loginUser = loginUser;
