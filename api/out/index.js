"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./db"));
const auth_1 = __importDefault(require("./controllers/auth"));
const app = (0, express_1.default)();
const port = 3000;
db_1.default.sync().then(() => {
    console.log('Database synced');
}).catch((err) => {
    console.error('Error syncing database:', err);
});
app.get('/', (req, res) => {
    res.json({ status: 'API is running' });
});
app.use('/auth', auth_1.default);
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
