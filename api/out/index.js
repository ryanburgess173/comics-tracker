"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./db"));
const logger_1 = __importDefault(require("./utils/logger"));
const auth_1 = __importDefault(require("./controllers/auth"));
const app = (0, express_1.default)();
// app port number for listening
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
db_1.default.sync().then(() => {
    logger_1.default.info('Database synced');
}).catch((err) => {
    logger_1.default.error('Error syncing database: %o', err);
});
app.get('/', (req, res) => {
    logger_1.default.info('Root endpoint accessed');
    res.json({ status: 'API is running' });
});
app.use('/auth', auth_1.default);
app.listen(port, () => {
    logger_1.default.info(`Server is running at http://localhost:${port}`);
});
