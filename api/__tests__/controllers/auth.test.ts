import request from 'supertest';
import express from 'express';
import { Sequelize } from 'sequelize';
import bcrypt from 'bcrypt';
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
});
