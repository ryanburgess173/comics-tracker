import { Sequelize } from 'sequelize';
import User from '../../models/User';

describe('User Model', () => {
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

  describe('User Creation', () => {
    it('should create a new user successfully', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        passwordHash: 'hashedpassword123',
      };

      const user = await User.create(userData);

      expect(user).toBeDefined();
      expect(user.username).toBe(userData.username);
      expect(user.email).toBe(userData.email);
      expect(user.passwordHash).toBe(userData.passwordHash);
      expect(user.id).toBeDefined();
    });

    it('should not allow duplicate usernames', async () => {
      const userData = {
        username: 'testuser',
        email: 'test1@example.com',
        passwordHash: 'hashedpassword123',
      };

      await User.create(userData);

      const duplicateUser = {
        username: 'testuser',
        email: 'test2@example.com',
        passwordHash: 'hashedpassword456',
      };

      await expect(User.create(duplicateUser)).rejects.toThrow();
    });

    it('should not allow duplicate emails', async () => {
      const userData = {
        username: 'testuser1',
        email: 'test@example.com',
        passwordHash: 'hashedpassword123',
      };

      await User.create(userData);

      const duplicateUser = {
        username: 'testuser2',
        email: 'test@example.com',
        passwordHash: 'hashedpassword456',
      };

      await expect(User.create(duplicateUser)).rejects.toThrow();
    });

    it('should require username, email, and passwordHash', async () => {
      const incompleteUser = {
        username: 'testuser',
      };

      // @ts-expect-error - Testing validation
      await expect(User.create(incompleteUser)).rejects.toThrow();
    });
  });

  describe('User Retrieval', () => {
    it('should find a user by email', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        passwordHash: 'hashedpassword123',
      };

      await User.create(userData);

      const foundUser = await User.findOne({ where: { email: userData.email } });

      expect(foundUser).toBeDefined();
      expect(foundUser?.email).toBe(userData.email);
      expect(foundUser?.username).toBe(userData.username);
    });

    it('should return null for non-existent user', async () => {
      const foundUser = await User.findOne({ where: { email: 'nonexistent@example.com' } });

      expect(foundUser).toBeNull();
    });
  });

  describe('User Update', () => {
    it('should update user information', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        passwordHash: 'hashedpassword123',
      };

      const user = await User.create(userData);
      const newUsername = 'updateduser';

      await user.update({ username: newUsername });

      expect(user.username).toBe(newUsername);

      const updatedUser = await User.findByPk(user.id);
      expect(updatedUser?.username).toBe(newUsername);
    });
  });

  describe('User Deletion', () => {
    it('should delete a user', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        passwordHash: 'hashedpassword123',
      };

      const user = await User.create(userData);
      const userId = user.id;

      await user.destroy();

      const deletedUser = await User.findByPk(userId);
      expect(deletedUser).toBeNull();
    });
  });
});
