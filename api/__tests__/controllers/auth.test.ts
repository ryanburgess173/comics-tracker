import request from 'supertest';
import express from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import authRouter from '../../controllers/auth';
import User from '../../models/User';
import UserRoleXRef from '../../models/UserRoleXRef';

// Mock the models
jest.mock('../../models/User');
jest.mock('../../models/UserRoleXRef');

// Create a test app
const app = express();
app.use(express.json());
app.use('/auth', authRouter);

describe('Auth Controller', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
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

      // Mock User.findOne to return null (user doesn't exist)
      (User.findOne as jest.Mock).mockResolvedValue(null);

      // Mock User.create to return a new user
      const mockCreatedUser = {
        id: 1,
        username: newUser.username,
        email: newUser.email,
        passwordHash: 'hashed_password',
      };
      (User.create as jest.Mock).mockResolvedValue(mockCreatedUser);

      const response = await request(app).post('/auth/register').send(newUser).expect(201);

      expect(response.body).toHaveProperty('message');
      expect((response.body as { message: string }).message).toBe('User registered successfully.');

      // Verify User.findOne was called to check for existing user
      expect(User.findOne).toHaveBeenCalledWith({ where: { email: newUser.email } });

      // Verify User.create was called
      expect(User.create).toHaveBeenCalled();
    });

    it('should not register a user with duplicate email', async () => {
      const newUser = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      // Mock User.findOne to return an existing user
      const mockExistingUser = {
        id: 1,
        username: 'existinguser',
        email: newUser.email,
        passwordHash: 'hashed_password',
      };
      (User.findOne as jest.Mock).mockResolvedValue(mockExistingUser);

      const response = await request(app).post('/auth/register').send(newUser).expect(409);

      expect(response.body).toHaveProperty('message');
      expect((response.body as { message: string }).message).toBe('User already exists.');

      // Verify User.create was not called
      expect(User.create).not.toHaveBeenCalled();
    });

    it('should handle missing required fields', async () => {
      const incompleteUser = {
        email: 'test@example.com',
        // missing username and password
      };

      // Mock User.findOne to return null (user doesn't exist)
      (User.findOne as jest.Mock).mockResolvedValue(null);

      // Mock User.create to throw an error (missing fields)
      (User.create as jest.Mock).mockRejectedValue(new Error('notNull Violation'));

      const response = await request(app).post('/auth/register').send(incompleteUser).expect(500);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /auth/login', () => {
    it('should login successfully with correct credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const passwordHash = await bcrypt.hash('password123', 10);
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        passwordHash,
      };

      // Mock User.findOne to return the user
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      // Mock UserRoleXRef.findAll to return empty roles array
      (UserRoleXRef.findAll as jest.Mock).mockResolvedValue([]);

      const response = await request(app).post('/auth/login').send(loginData).expect(200);

      expect(response.body).toHaveProperty('message');
      expect((response.body as { message: string }).message).toBe('Logged in');
      expect(response.body).toHaveProperty('token');
      expect(typeof (response.body as { token: string }).token).toBe('string');

      // Check for cookie
      expect(response.headers['set-cookie']).toBeDefined();

      // Verify UserRoleXRef.findAll was called
      expect(UserRoleXRef.findAll).toHaveBeenCalledWith({
        where: { userId: mockUser.id },
        attributes: ['roleId'],
      });
    });

    it('should not login with incorrect password', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const passwordHash = await bcrypt.hash('password123', 10);
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        passwordHash,
      };

      // Mock User.findOne to return the user
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

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

      // Mock User.findOne to return null
      (User.findOne as jest.Mock).mockResolvedValue(null);

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
      const passwordHash = await bcrypt.hash('password123', 10);
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        passwordHash,
      };

      // Mock User.findOne to return the user
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      // Mock UserRoleXRef.findAll to return empty roles array
      (UserRoleXRef.findAll as jest.Mock).mockResolvedValue([]);

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
    it('should accept password reset request for existing user', async () => {
      const resetData = {
        email: 'test@example.com',
      };

      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        passwordHash: 'hashed_password',
        resetPasswordToken: null,
        resetPasswordExpires: null,
        save: jest.fn().mockResolvedValue(true),
      };

      // Mock User.findOne to return the user
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app).post('/auth/reset-password').send(resetData).expect(200);

      expect(response.body).toHaveProperty('message');
      expect((response.body as { message: string }).message).toBe(
        'If an account with that email exists, a password reset link has been sent.'
      );

      // Verify save was called
      expect(mockUser.save).toHaveBeenCalled();
    });

    it('should return generic success message for non-existent user (security)', async () => {
      const resetData = {
        email: 'nonexistent@example.com',
      };

      // Mock User.findOne to return null
      (User.findOne as jest.Mock).mockResolvedValue(null);

      const response = await request(app).post('/auth/reset-password').send(resetData).expect(200);

      expect(response.body).toHaveProperty('message');
      expect((response.body as { message: string }).message).toBe(
        'If an account with that email exists, a password reset link has been sent.'
      );
    });

    it('should handle missing email field', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);
      const response = await request(app).post('/auth/reset-password').send({}).expect(200);

      expect(response.body).toHaveProperty('message');
    });

    it('should generate unique tokens for multiple reset requests', async () => {
      const resetData = {
        email: 'test@example.com',
      };

      let firstToken: string | undefined;
      let secondToken: string | undefined;

      interface MockUserWithToken {
        id: number;
        email: string;
        resetPasswordToken: string | null;
        save: jest.Mock;
      }

      const mockUser1: MockUserWithToken = {
        id: 1,
        email: 'test@example.com',
        resetPasswordToken: null,
        save: jest.fn().mockImplementation(function (this: MockUserWithToken) {
          firstToken = this.resetPasswordToken ?? undefined;
          return Promise.resolve(true);
        }),
      };

      const mockUser2: MockUserWithToken = {
        id: 1,
        email: 'test@example.com',
        resetPasswordToken: null,
        save: jest.fn().mockImplementation(function (this: MockUserWithToken) {
          secondToken = this.resetPasswordToken ?? undefined;
          return Promise.resolve(true);
        }),
      };

      // First reset request
      (User.findOne as jest.Mock).mockResolvedValueOnce(mockUser1);
      await request(app).post('/auth/reset-password').send(resetData).expect(200);

      // Second reset request
      (User.findOne as jest.Mock).mockResolvedValueOnce(mockUser2);
      await request(app).post('/auth/reset-password').send(resetData).expect(200);

      expect(firstToken).toBeDefined();
      expect(secondToken).toBeDefined();
      expect(firstToken).not.toBe(secondToken);
    });
  });

  describe('POST /auth/reset-password/:token', () => {
    let resetToken: string;
    let hashedToken: string;

    beforeEach(() => {
      // Generate a reset token
      resetToken = crypto.randomBytes(32).toString('hex');
      hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    });

    it('should successfully reset password with valid token', async () => {
      const newPasswordData = {
        password: 'newPassword456',
      };

      // Set expiration to 1 hour from now
      const expirationTime = new Date();
      expirationTime.setHours(expirationTime.getHours() + 1);

      interface MockUserUpdate {
        id: number;
        username: string;
        email: string;
        passwordHash: string;
        resetPasswordToken: string | null;
        resetPasswordExpires: Date | null;
        update: jest.Mock;
      }

      const mockUser: MockUserUpdate = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        passwordHash: await bcrypt.hash('password123', 10),
        resetPasswordToken: hashedToken,
        resetPasswordExpires: expirationTime,
        update: jest.fn().mockImplementation(function (
          this: MockUserUpdate,
          updates: Partial<MockUserUpdate>
        ) {
          Object.assign(this, updates);
          return Promise.resolve(true);
        }),
      };

      // Mock User.findOne to return the user
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app)
        .post(`/auth/reset-password/${resetToken}`)
        .send(newPasswordData)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect((response.body as { message: string }).message).toBe(
        'Password has been reset successfully.'
      );

      // Verify update was called
      expect(mockUser.update).toHaveBeenCalled();

      // Verify reset token was cleared
      expect(mockUser.resetPasswordToken).toBeNull();
      expect(mockUser.resetPasswordExpires).toBeNull();
    });

    it('should reject invalid token', async () => {
      const newPasswordData = {
        password: 'newPassword456',
      };

      const invalidToken = 'invalid-token-12345';

      // Mock User.findOne to return null (no user with this token)
      (User.findOne as jest.Mock).mockResolvedValue(null);

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

      const mockUser = {
        id: 1,
        username: 'expireduser',
        email: 'expired@example.com',
        passwordHash,
        resetPasswordToken: expiredHashedToken,
        resetPasswordExpires: expiredTime,
      };

      // Mock User.findOne to return user with expired token
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

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
      // Set expiration to 1 hour from now
      const expirationTime = new Date();
      expirationTime.setHours(expirationTime.getHours() + 1);

      const passwordHash = await bcrypt.hash('password123', 10);

      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        passwordHash,
        resetPasswordToken: hashedToken,
        resetPasswordExpires: expirationTime,
        update: jest.fn(),
      };

      // Mock User.findOne to return a valid user with valid token
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app)
        .post(`/auth/reset-password/${resetToken}`)
        .send({}) // Send empty body (no password field)
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect((response.body as { message: string }).message).toBe('Password is required.');
      
      // Verify that update was never called since validation failed
      expect(mockUser.update).not.toHaveBeenCalled();
    });

    it('should allow login with new password after reset', async () => {
      // Reset the password
      const newPasswordData = {
        password: 'newPassword456',
      };

      // Set expiration to 1 hour from now
      const expirationTime = new Date();
      expirationTime.setHours(expirationTime.getHours() + 1);

      const passwordHash = await bcrypt.hash('password123', 10);
      const newPasswordHash = await bcrypt.hash('newPassword456', 10);

      interface MockUserForReset {
        id: number;
        username: string;
        email: string;
        passwordHash: string;
        resetPasswordToken: string | null;
        resetPasswordExpires: Date | null;
        update: jest.Mock;
      }

      const mockUser: MockUserForReset = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        passwordHash: passwordHash,
        resetPasswordToken: hashedToken,
        resetPasswordExpires: expirationTime,
        update: jest.fn().mockImplementation(function (this: MockUserForReset) {
          this.passwordHash = newPasswordHash;
          this.resetPasswordToken = null;
          this.resetPasswordExpires = null;
          return Promise.resolve(true);
        }),
      };

      // Mock User.findOne for password reset
      (User.findOne as jest.Mock).mockResolvedValueOnce(mockUser);

      await request(app)
        .post(`/auth/reset-password/${resetToken}`)
        .send(newPasswordData)
        .expect(200);

      // Now mock for login with new password
      mockUser.passwordHash = newPasswordHash;
      (User.findOne as jest.Mock).mockResolvedValueOnce(mockUser);
      (UserRoleXRef.findAll as jest.Mock).mockResolvedValue([]);

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

      // Set expiration to 1 hour from now
      const expirationTime = new Date();
      expirationTime.setHours(expirationTime.getHours() + 1);

      interface MockUserTokenReset {
        id: number;
        username: string;
        email: string;
        passwordHash: string;
        resetPasswordToken: string | null;
        resetPasswordExpires: Date | null;
        update: jest.Mock;
      }

      const mockUser: MockUserTokenReset = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        passwordHash: await bcrypt.hash('password123', 10),
        resetPasswordToken: hashedToken,
        resetPasswordExpires: expirationTime,
        update: jest.fn().mockImplementation(function (this: MockUserTokenReset) {
          this.resetPasswordToken = null;
          this.resetPasswordExpires = null;
          return Promise.resolve(true);
        }),
      };

      // First reset should succeed
      (User.findOne as jest.Mock).mockResolvedValueOnce(mockUser);
      await request(app)
        .post(`/auth/reset-password/${resetToken}`)
        .send(newPasswordData)
        .expect(200);

      // Second attempt with same token should fail (user no longer has the token)
      (User.findOne as jest.Mock).mockResolvedValueOnce(null);

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
