import request from 'supertest';
import express from 'express';
import { Sequelize } from 'sequelize';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import authRouter from '../../controllers/auth';
import User from '../../models/User';

// Create a test app
const app = express();
app.use(express.json());
app.use('/auth', authRouter);

describe('Auth Controller', () => {
  let sequelize: Sequelize;

  beforeAll(async () => {
    // Create an in-memory SQLite database for testing
    sequelize = new Sequelize('sqlite::memory:', {
      logging: false,
    });

    // Define the User model with the test database
    User.init(User.getAttributes(), { sequelize, modelName: 'User' });

    // Sync the database
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  beforeEach(async () => {
    // Clear the database before each test
    await User.destroy({ where: {}, truncate: true });
  });

  describe('GET /auth/test', () => {
    it('should return success message', async () => {
      const response = await request(app).get('/auth/test').expect(200);

      expect(response.body).toHaveProperty('message');
      expect((response.body as { message: string }).message).toBe('Auth route works!');
    });
  });

  describe('POST /auth/register', () => {
    it('should register a new user successfully', async () => {
      const newUser = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      const response = await request(app).post('/auth/register').send(newUser).expect(201);

      expect(response.body).toHaveProperty('message');
      expect((response.body as { message: string }).message).toBe('User registered successfully.');

      // Verify user was created in database
      const user = await User.findOne({ where: { email: newUser.email } });
      expect(user).toBeDefined();
      expect(user?.username).toBe(newUser.username);
      expect(user?.email).toBe(newUser.email);
    });

    it('should not register a user with duplicate email', async () => {
      const newUser = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      // Register first user
      await request(app).post('/auth/register').send(newUser).expect(201);

      // Try to register with same email
      const duplicateUser = {
        username: 'testuser2',
        email: 'test@example.com',
        password: 'password456',
      };

      const response = await request(app).post('/auth/register').send(duplicateUser).expect(409);

      expect(response.body).toHaveProperty('message');
      expect((response.body as { message: string }).message).toBe('User already exists.');
    });

    it('should handle missing required fields', async () => {
      const incompleteUser = {
        email: 'test@example.com',
        // missing username and password
      };

      const response = await request(app).post('/auth/register').send(incompleteUser).expect(500);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      // Create a test user before each login test with hashed password
      const passwordHash = await bcrypt.hash('password123', 10);
      await User.create({
        username: 'testuser',
        email: 'test@example.com',
        passwordHash,
      });
    });

    it('should login successfully with correct credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const response = await request(app).post('/auth/login').send(loginData).expect(200);

      expect(response.body).toHaveProperty('message');
      expect((response.body as { message: string }).message).toBe('Logged in');
      expect(response.body).toHaveProperty('token');
      expect(typeof (response.body as { token: string }).token).toBe('string');

      // Check for cookie
      expect(response.headers['set-cookie']).toBeDefined();
    });

    it('should not login with incorrect password', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const response = await request(app).post('/auth/login').send(loginData).expect(401);

      expect(response.body).toHaveProperty('message');
      expect((response.body as { message: string }).message).toBe(
        'Authentication failed. Password is incorrect.'
      );
    });

    it('should not login with non-existent email', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      const response = await request(app).post('/auth/login').send(loginData).expect(401);

      expect(response.body).toHaveProperty('message');
      expect((response.body as { message: string }).message).toBe(
        'Authentication failed. User does not exist.'
      );
    });

    it('should handle missing credentials', async () => {
      const response = await request(app).post('/auth/login').send({});

      // Should return an error (either 401 or 500)
      expect(response.status).toBeGreaterThanOrEqual(400);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('JWT Token Validation', () => {
    it('should return a valid JWT token on login', async () => {
      // Create a test user with hashed password
      const passwordHash = await bcrypt.hash('password123', 10);
      await User.create({
        username: 'testuser',
        email: 'test@example.com',
        passwordHash,
      });

      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const response = await request(app).post('/auth/login').send(loginData).expect(200);

      const token = (response.body as { token: string }).token;
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });
  });

  describe('POST /auth/reset-password', () => {
    beforeEach(async () => {
      // Create a test user with hashed password
      const passwordHash = await bcrypt.hash('password123', 10);
      await User.create({
        username: 'testuser',
        email: 'test@example.com',
        passwordHash,
      });
    });

    it('should accept password reset request for existing user', async () => {
      const resetData = {
        email: 'test@example.com',
      };

      const response = await request(app).post('/auth/reset-password').send(resetData).expect(200);

      expect(response.body).toHaveProperty('message');
      expect((response.body as { message: string }).message).toBe(
        'If an account with that email exists, a password reset link has been sent.'
      );

      // Verify token was stored in database
      const user = await User.findOne({ where: { email: resetData.email } });
      expect(user?.resetPasswordToken).toBeDefined();
      expect(user?.resetPasswordToken).not.toBeNull();
      expect(user?.resetPasswordExpires).toBeDefined();
      expect(user?.resetPasswordExpires).toBeInstanceOf(Date);

      // Verify expiration is in the future
      if (user?.resetPasswordExpires) {
        expect(user.resetPasswordExpires.getTime()).toBeGreaterThan(Date.now());
      }
    });

    it('should return generic success message for non-existent user (security)', async () => {
      const resetData = {
        email: 'nonexistent@example.com',
      };

      const response = await request(app).post('/auth/reset-password').send(resetData).expect(200);

      expect(response.body).toHaveProperty('message');
      expect((response.body as { message: string }).message).toBe(
        'If an account with that email exists, a password reset link has been sent.'
      );
    });

    it('should handle missing email field', async () => {
      const response = await request(app).post('/auth/reset-password').send({}).expect(500);

      expect(response.body).toHaveProperty('message');
    });

    it('should generate unique tokens for multiple reset requests', async () => {
      const resetData = {
        email: 'test@example.com',
      };

      // First reset request
      await request(app).post('/auth/reset-password').send(resetData).expect(200);
      const user1 = await User.findOne({ where: { email: resetData.email } });
      const firstToken = user1?.resetPasswordToken;

      // Second reset request
      await request(app).post('/auth/reset-password').send(resetData).expect(200);
      const user2 = await User.findOne({ where: { email: resetData.email } });
      const secondToken = user2?.resetPasswordToken;

      expect(firstToken).toBeDefined();
      expect(secondToken).toBeDefined();
      expect(firstToken).not.toBe(secondToken);
    });
  });

  describe('POST /auth/reset-password/:token', () => {
    let resetToken: string;
    let hashedToken: string;

    beforeEach(async () => {
      // Create a test user with hashed password
      const passwordHash = await bcrypt.hash('password123', 10);

      // Generate a reset token
      resetToken = crypto.randomBytes(32).toString('hex');
      hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

      // Set expiration to 1 hour from now
      const expirationTime = new Date();
      expirationTime.setHours(expirationTime.getHours() + 1);

      await User.create({
        username: 'testuser',
        email: 'test@example.com',
        passwordHash,
        resetPasswordToken: hashedToken,
        resetPasswordExpires: expirationTime,
      });
    });

    it('should successfully reset password with valid token', async () => {
      const newPasswordData = {
        password: 'newPassword456',
      };

      const response = await request(app)
        .post(`/auth/reset-password/${resetToken}`)
        .send(newPasswordData)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect((response.body as { message: string }).message).toBe(
        'Password has been reset successfully.'
      );

      // Verify password was updated
      const user = await User.findOne({ where: { email: 'test@example.com' } });
      expect(user).toBeDefined();

      // Verify old password doesn't work
      const oldPasswordValid = await bcrypt.compare('password123', user!.passwordHash);
      expect(oldPasswordValid).toBe(false);

      // Verify new password works
      const newPasswordValid = await bcrypt.compare('newPassword456', user!.passwordHash);
      expect(newPasswordValid).toBe(true);

      // Verify reset token was cleared
      expect(user?.resetPasswordToken).toBeNull();
      expect(user?.resetPasswordExpires).toBeNull();
    });

    it('should reject invalid token', async () => {
      const newPasswordData = {
        password: 'newPassword456',
      };

      const invalidToken = 'invalid-token-12345';

      const response = await request(app)
        .post(`/auth/reset-password/${invalidToken}`)
        .send(newPasswordData)
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect((response.body as { message: string }).message).toBe(
        'Invalid or expired password reset token.'
      );
    });

    it('should reject expired token', async () => {
      const passwordHash = await bcrypt.hash('password123', 10);

      // Generate a new token with expired time
      const expiredToken = crypto.randomBytes(32).toString('hex');
      const expiredHashedToken = crypto.createHash('sha256').update(expiredToken).digest('hex');

      // Set expiration to 1 hour in the past
      const expiredTime = new Date();
      expiredTime.setHours(expiredTime.getHours() - 1);

      // Clear existing users and create one with expired token
      await User.destroy({ where: {}, truncate: true });
      await User.create({
        username: 'expireduser',
        email: 'expired@example.com',
        passwordHash,
        resetPasswordToken: expiredHashedToken,
        resetPasswordExpires: expiredTime,
      });

      const newPasswordData = {
        password: 'newPassword456',
      };

      const response = await request(app)
        .post(`/auth/reset-password/${expiredToken}`)
        .send(newPasswordData)
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect((response.body as { message: string }).message).toBe(
        'Invalid or expired password reset token.'
      );
    });

    it('should handle missing password field', async () => {
      const response = await request(app)
        .post(`/auth/reset-password/${resetToken}`)
        .send({})
        .expect(500);

      expect(response.body).toHaveProperty('message');
    });

    it('should allow login with new password after reset', async () => {
      // Reset the password
      const newPasswordData = {
        password: 'newPassword456',
      };

      await request(app)
        .post(`/auth/reset-password/${resetToken}`)
        .send(newPasswordData)
        .expect(200);

      // Try to login with new password
      const loginData = {
        email: 'test@example.com',
        password: 'newPassword456',
      };

      const response = await request(app).post('/auth/login').send(loginData).expect(200);

      expect(response.body).toHaveProperty('message');
      expect((response.body as { message: string }).message).toBe('Logged in');
      expect(response.body).toHaveProperty('token');
    });

    it('should not allow reusing the same reset token', async () => {
      const newPasswordData = {
        password: 'newPassword456',
      };

      // First reset should succeed
      await request(app)
        .post(`/auth/reset-password/${resetToken}`)
        .send(newPasswordData)
        .expect(200);

      // Second attempt with same token should fail
      const secondPasswordData = {
        password: 'anotherPassword789',
      };

      const response = await request(app)
        .post(`/auth/reset-password/${resetToken}`)
        .send(secondPasswordData)
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect((response.body as { message: string }).message).toBe(
        'Invalid or expired password reset token.'
      );
    });
  });
});
