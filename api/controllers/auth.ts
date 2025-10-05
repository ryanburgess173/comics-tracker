import { Router, Request, Response } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger';

const router = Router();
const secret_key = process.env.JWT_SECRET as string;
if (!secret_key) {
    throw new Error('JWT_SECRET environment variable is not defined');
}

// Example route: GET /auth/test
router.get('/test', (req: Request, res: Response) => {
    logger.info('Auth test endpoint accessed');
    res.json({ message: 'Auth route works!' });
});

// login endpoint
router.post('/login', (req: Request, res: Response) => {
    const { email, password } = req.body;

    logger.info('Login attempt for email: %s', email);

    // Checks if the user exists in the database
    User.findOne({ where: { email } }).then((user) => {
        if (!user) {
            logger.warn('Authentication failed: User does not exist for email: %s', email);
            return res.status(401).json({ message: 'Authentication failed. User does not exist.' });
        }

        // Here you should verify the password with the stored hash
        // For simplicity, we assume the password is correct if it matches the passwordHash directly
        if (user.passwordHash !== password) {
            logger.warn('Authentication failed: Incorrect password for email: %s', email);
            return res.status(401).json({ message: 'Authentication failed. Password is incorrect.' });
        }

        const payload = { id: user.id, email: user.email };
        const token = jwt.sign(payload, secret_key, { expiresIn: '30d' });

        res.cookie('access_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });

        logger.info('User logged in: %s', email);
        res.json({ message: 'Logged in', token });

    }).catch((err) => {
        logger.error('Internal server error during login: %o', err);
        res.status(500).json({ message: 'Internal server error: ' + err.message });
    });
});

// register endpoint
router.post('/register', async (req: Request, res: Response) => {
    const { username, email, password } = req.body;
    logger.info('Register attempt for email: %s', email);

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            logger.warn('Registration failed: User already exists for email: %s', email);
            return res.status(409).json({ message: 'User already exists.' });
        }

        // Create new user
        const newUser = await User.create({
            username,
            email,
            passwordHash: password
        });
        logger.info('User registered: %s', email);
        res.status(201).json({ message: 'User registered successfully.' });
    } catch (err) {
        logger.error('Internal server error during registration: %o', err);
        res.status(500).json({ message: 'Internal server error: ' + (err as Error).message });
    }
});

export default router;