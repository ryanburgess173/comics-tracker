"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = __importDefault(require("../utils/logger"));
const router = (0, express_1.Router)();
const secret_key = process.env.JWT_SECRET;
if (!secret_key) {
    throw new Error('JWT_SECRET environment variable is not defined');
}
// Example route: GET /auth/test
router.get('/test', (req, res) => {
    logger_1.default.info('Auth test endpoint accessed');
    res.json({ message: 'Auth route works!' });
});
// login endpoint
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    logger_1.default.info('Login attempt for email: %s', email);
    // Checks if the user exists in the database
    User_1.default.findOne({ where: { email } }).then((user) => {
        if (!user) {
            logger_1.default.warn('Authentication failed: User does not exist for email: %s', email);
            return res.status(401).json({ message: 'Authentication failed. User does not exist.' });
        }
        // Here you should verify the password with the stored hash
        // For simplicity, we assume the password is correct if it matches the passwordHash directly
        if (user.passwordHash !== password) {
            logger_1.default.warn('Authentication failed: Incorrect password for email: %s', email);
            return res.status(401).json({ message: 'Authentication failed. Password is incorrect.' });
        }
        const payload = { id: user.id, email: user.email };
        const token = jsonwebtoken_1.default.sign(payload, secret_key, { expiresIn: '30d' });
        res.cookie('access_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });
        logger_1.default.info('User logged in: %s', email);
        res.json({ message: 'Logged in', token });
    }).catch((err) => {
        logger_1.default.error('Internal server error during login: %o', err);
        res.status(500).json({ message: 'Internal server error: ' + err.message });
    });
});
// register endpoint
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    logger_1.default.info('Register attempt for email: %s', email);
    try {
        // Check if user already exists
        const existingUser = yield User_1.default.findOne({ where: { email } });
        if (existingUser) {
            logger_1.default.warn('Registration failed: User already exists for email: %s', email);
            return res.status(409).json({ message: 'User already exists.' });
        }
        // Create new user
        const newUser = yield User_1.default.create({
            username,
            email,
            passwordHash: password
        });
        logger_1.default.info('User registered: %s', email);
        res.status(201).json({ message: 'User registered successfully.' });
    }
    catch (err) {
        logger_1.default.error('Internal server error during registration: %o', err);
        res.status(500).json({ message: 'Internal server error: ' + err.message });
    }
}));
exports.default = router;
