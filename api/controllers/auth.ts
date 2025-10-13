import { Router, Request, Response } from 'express';
import User from '../models/User';
import UserRoleXRef from '../models/UserRoleXRef';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import logger from '../utils/logger';
import { sendPasswordResetEmail } from '../utils/email';

const router = Router();
const secret_key = process.env.JWT_SECRET as string;
if (!secret_key) {
  throw new Error('JWT_SECRET environment variable is not defined');
}

// Number of bcrypt salt rounds (10 is a good balance between security and performance)
const SALT_ROUNDS = 10;

/**
 * @swagger
 * /auth/test:
 *   get:
 *     summary: Test auth endpoint
 *     description: Simple test endpoint to verify auth routes are working
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Auth route is working
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Auth route works!
 */
router.get('/test', (req: Request, res: Response) => {
  logger.info('Auth test endpoint accessed');
  res.json({ message: 'Auth route works!' });
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticate a user and return a JWT token
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           example:
 *             email: user@example.com
 *             password: password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: access_token=abcde12345; Path=/; HttpOnly
 *       401:
 *         description: Authentication failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };

  logger.info('Login attempt for email: %s', email);

  try {
    // Checks if the user exists in the database
    const user = await User.findOne({ where: { email } });

    if (!user) {
      logger.warn('Authentication failed: User does not exist for email: %s', email);
      return res.status(401).json({ message: 'Authentication failed. User does not exist.' });
    }

    // Verify password using bcrypt (constant-time comparison, prevents timing attacks)
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      logger.warn('Authentication failed: Incorrect password for email: %s', email);
      return res.status(401).json({ message: 'Authentication failed. Password is incorrect.' });
    }

    // Find user's role objects with role IDs
    const roleIds = await UserRoleXRef.findAll({
      where: { userId: user.id },
      attributes: ['roleId'],
    });

    // Seperate out the user role IDs from the objects
    const userRoleIds = roleIds.map((r) => r.roleId);

    // Setup JWT payload, including custom roles claim
    const payload = {
      id: user.id,
      email: user.email,
      roles: userRoleIds,
    };

    // Sign token with 30 day expiration
    const token = jwt.sign(payload, secret_key, { expiresIn: '30d' });

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    logger.info('User logged in: %s', email);
    res.json({ message: 'Logged in', token });
  } catch (err) {
    logger.error('Internal server error during login: %o', err);
    res.status(500).json({ message: 'Internal server error: ' + (err as Error).message });
  }
});

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: User registration
 *     description: Register a new user account
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *           example:
 *             username: johndoe
 *             email: john@example.com
 *             password: password123
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully.
 *       409:
 *         description: User already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/register', async (req: Request, res: Response) => {
  const { username, email, password } = req.body as {
    username: string;
    email: string;
    password: string;
  };
  logger.info('Register attempt for email: %s', email);

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      logger.warn('Registration failed: User already exists for email: %s', email);
      return res.status(409).json({ message: 'User already exists.' });
    }

    // Hash the password before storing
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Create new user with hashed password
    await User.create({
      username,
      email,
      passwordHash,
    });
    logger.info('User registered: %s', email);
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    logger.error('Internal server error during registration: %o', err);
    res.status(500).json({ message: 'Internal server error: ' + (err as Error).message });
  }
});

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Request password reset
 *     description: |
 *       Request a password reset for a user account. An email will be sent with a reset link
 *       that expires in 1 hour. For security reasons, this endpoint always returns success
 *       regardless of whether the email exists in the system.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the account to reset
 *           example:
 *             email: user@example.com
 *     responses:
 *       200:
 *         description: Password reset request processed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: If an account with that email exists, a password reset link has been sent.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/reset-password', async (req: Request, res: Response) => {
  const { email } = req.body as {
    email: string;
  };
  logger.info('Password reset requested for email: %s', email);

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      // For security, don't reveal if user exists or not
      logger.warn('Password reset requested for non-existent email: %s', email);
      return res.status(200).json({
        message: 'If an account with that email exists, a password reset link has been sent.',
      });
    }

    // Generate a secure random token (32 bytes = 64 hex characters)
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Hash the token before storing in database (for security)
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Set token expiration to 1 hour from now
    const expirationTime = new Date();
    expirationTime.setHours(expirationTime.getHours() + 1);

    // Save hashed token and expiration to database
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = expirationTime;
    await user.save();

    // Send email with the unhashed token (this is the link the user will click)
    await sendPasswordResetEmail(email, resetToken, user.username);

    logger.info('Password reset token generated and email sent to: %s', email);
    return res.status(200).json({
      message: 'If an account with that email exists, a password reset link has been sent.',
    });
  } catch (err) {
    logger.error('Internal server error during password reset: %o', err);
    res.status(500).json({ message: 'Internal server error: ' + (err as Error).message });
  }
});

/**
 * @swagger
 * /auth/reset-password/{token}:
 *   post:
 *     summary: Confirm password reset
 *     description: Verify reset token and set a new password
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Password reset token from email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 description: New password for the account
 *                 minLength: 8
 *           example:
 *             password: newSecurePassword123
 *     responses:
 *       200:
 *         description: Password reset successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password has been reset successfully.
 *       400:
 *         description: Invalid or expired token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/reset-password/:token', async (req: Request, res: Response) => {
  const { token } = req.params;
  const { password } = req.body as { password: string };

  logger.info('Password reset confirmation attempt with token');

  try {
    // Hash the provided token to match against database
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with matching token that hasn't expired
    const user = await User.findOne({
      where: {
        resetPasswordToken: hashedToken,
      },
    });

    if (!user) {
      logger.warn('Password reset failed: Invalid token');
      return res.status(400).json({ message: 'Invalid or expired password reset token.' });
    }

    // Check if token has expired
    if (!user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
      logger.warn('Password reset failed: Expired token for user: %s', user.email);
      return res.status(400).json({ message: 'Invalid or expired password reset token.' });
    }

    // Hash the new password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Update password and clear reset token fields
    await user.update({
      passwordHash,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });

    logger.info('Password reset successful for user: %s', user.email);
    res.status(200).json({ message: 'Password has been reset successfully.' });
  } catch (err) {
    logger.error('Internal server error during password reset confirmation: %o', err);
    res.status(500).json({ message: 'Internal server error: ' + (err as Error).message });
  }
});

export default router;
