"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const drizzle_config_1 = __importDefault(require("./config/drizzle.config"));
const schema_1 = require("./db/schema");
const errorHandler_1 = require("./libs/middleware/errorHandler");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(errorHandler_1.errorHandler);
const testConnection = async () => {
    try {
        const result = await drizzle_config_1.default.select().from(schema_1.UserTable);
        console.log('Database connected. Number of users:', result.length);
    }
    catch (error) {
        console.error('Database connection failed:', error);
    }
};
testConnection();
app.use('/api/users', userRoutes_1.default);
const PORT = process.env.USER_SERVICE_PORT || 5001;
app.listen(PORT, () => {
    console.log(`User Service running on port ${PORT}`);
});
