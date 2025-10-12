import request from 'supertest';
import express from 'express';
import usersRouter from '../../controllers/users';
import User from '../../models/User';
import Role from '../../models/Role';
import UserRoleXRef from '../../models/UserRoleXRef';
import bcrypt from 'bcrypt';

// Mock the models
jest.mock('../../models/User');
jest.mock('../../models/Role');
jest.mock('../../models/UserRoleXRef');
jest.mock('bcrypt');

// Mock the logger
jest.mock('../../utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}));

// Mock email utility
jest.mock('../../utils/email', () => ({
  sendPasswordResetEmail: jest.fn(),
}));

// Create a test app
const app = express();
app.use(express.json());
app.use('/users', usersRouter);

describe('Users Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /users', () => {
    it('should return all users without sensitive data', async () => {
      const mockUsers = [
        { id: 1, username: 'admin', email: 'admin@example.com' },
        { id: 2, username: 'user1', email: 'user1@example.com' },
      ];
      (User.findAll as jest.Mock).mockResolvedValue(mockUsers);

      const response = await request(app).get('/users').expect(200);

      expect(User.findAll).toHaveBeenCalledWith({
        attributes: { exclude: ['passwordHash', 'resetPasswordToken', 'resetPasswordExpires'] },
      });
      expect(response.body).toEqual(mockUsers);
      expect(response.body).toHaveLength(2);
    });

    it('should handle errors gracefully', async () => {
      (User.findAll as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/users').expect(500);

      expect(response.body).toHaveProperty('error', 'Failed to fetch users');
    });
  });

  describe('GET /users/:id', () => {
    it('should return a user by ID', async () => {
      const mockUser = {
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
      };
      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app).get('/users/1').expect(200);

      expect(User.findByPk).toHaveBeenCalledWith('1', {
        attributes: { exclude: ['passwordHash', 'resetPasswordToken', 'resetPasswordExpires'] },
      });
      expect(response.body).toEqual(mockUser);
    });

    it('should return 404 when user not found', async () => {
      (User.findByPk as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get('/users/999').expect(404);

      expect(response.body).toHaveProperty('error', 'User not found');
    });

    it('should handle errors gracefully', async () => {
      (User.findByPk as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/users/1').expect(500);

      expect(response.body).toHaveProperty('error', 'Failed to fetch user');
    });
  });

  describe('POST /users', () => {
    it('should create a new user successfully', async () => {
      const newUserData = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'SecurePass123!',
      };

      const hashedPassword = 'hashed_password';
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      (User.findOne as jest.Mock).mockResolvedValue(null);

      const mockCreatedUser = {
        id: 1,
        username: 'newuser',
        email: 'newuser@example.com',
        passwordHash: hashedPassword,
        toJSON: jest.fn().mockReturnValue({
          id: 1,
          username: 'newuser',
          email: 'newuser@example.com',
          passwordHash: hashedPassword,
          resetPasswordToken: null,
          resetPasswordExpires: null,
        }),
      };
      (User.create as jest.Mock).mockResolvedValue(mockCreatedUser);

      const response = await request(app).post('/users').send(newUserData).expect(201);

      expect(User.findOne).toHaveBeenCalledWith({ where: { email: newUserData.email } });
      expect(bcrypt.hash).toHaveBeenCalledWith(newUserData.password, 10);
      expect(User.create).toHaveBeenCalledWith({
        username: newUserData.username,
        email: newUserData.email,
        passwordHash: hashedPassword,
      });
      expect(response.body).not.toHaveProperty('passwordHash');
      expect(response.body).not.toHaveProperty('resetPasswordToken');
    });

    it('should return 400 if required fields are missing', async () => {
      const response = await request(app).post('/users').send({ username: 'test' }).expect(400);

      expect(response.body).toHaveProperty('error', 'Username, email, and password are required');
    });

    it('should return 400 if user already exists', async () => {
      (User.findOne as jest.Mock).mockResolvedValue({ id: 1, email: 'existing@example.com' });

      const response = await request(app)
        .post('/users')
        .send({
          username: 'test',
          email: 'existing@example.com',
          password: 'password123',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'User with this email already exists');
    });

    it('should handle errors gracefully', async () => {
      (User.findOne as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/users')
        .send({
          username: 'test',
          email: 'test@example.com',
          password: 'password123',
        })
        .expect(500);

      expect(response.body).toHaveProperty('error', 'Failed to create user');
    });
  });

  describe('PUT /users/:id', () => {
    it('should update a user successfully', async () => {
      const mockUser = {
        id: 1,
        username: 'oldname',
        email: 'old@example.com',
        save: jest.fn(),
        toJSON: jest.fn().mockReturnValue({
          id: 1,
          username: 'newname',
          email: 'new@example.com',
          passwordHash: 'hash',
          resetPasswordToken: null,
          resetPasswordExpires: null,
        }),
      };
      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app)
        .put('/users/1')
        .send({ username: 'newname', email: 'new@example.com' })
        .expect(200);

      expect(mockUser.save).toHaveBeenCalled();
      expect(response.body).toHaveProperty('username', 'newname');
      expect(response.body).not.toHaveProperty('passwordHash');
    });

    it('should return 404 when user not found', async () => {
      (User.findByPk as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .put('/users/999')
        .send({ username: 'newname' })
        .expect(404);

      expect(response.body).toHaveProperty('error', 'User not found');
    });

    it('should handle errors gracefully', async () => {
      (User.findByPk as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app).put('/users/1').send({ username: 'newname' }).expect(500);

      expect(response.body).toHaveProperty('error', 'Failed to update user');
    });
  });

  describe('DELETE /users/:id', () => {
    it('should delete a user successfully', async () => {
      const mockUser = {
        id: 1,
        destroy: jest.fn(),
      };
      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app).delete('/users/1').expect(200);

      expect(mockUser.destroy).toHaveBeenCalled();
      expect(response.body).toHaveProperty('message', 'User deleted successfully');
    });

    it('should return 404 when user not found', async () => {
      (User.findByPk as jest.Mock).mockResolvedValue(null);

      const response = await request(app).delete('/users/999').expect(404);

      expect(response.body).toHaveProperty('error', 'User not found');
    });

    it('should handle errors gracefully', async () => {
      (User.findByPk as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app).delete('/users/1').expect(500);

      expect(response.body).toHaveProperty('error', 'Failed to delete user');
    });
  });

  describe('GET /users/:id/roles', () => {
    it('should return user roles', async () => {
      const mockUser = { id: 1, username: 'test' };
      const mockRoles = [
        { id: 1, name: 'Admin' },
        { id: 2, name: 'Editor' },
      ];
      const mockUserRoles = [{ Role: mockRoles[0] }, { Role: mockRoles[1] }];

      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);
      (UserRoleXRef.findAll as jest.Mock).mockResolvedValue(mockUserRoles);

      const response = await request(app).get('/users/1/roles').expect(200);

      expect(UserRoleXRef.findAll).toHaveBeenCalledWith({
        where: { userId: '1' },
        include: [{ model: Role }],
      });
      expect(response.body).toHaveLength(2);
    });

    it('should return 404 when user not found', async () => {
      (User.findByPk as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get('/users/999/roles').expect(404);

      expect(response.body).toHaveProperty('error', 'User not found');
    });
  });

  describe('POST /users/:id/roles', () => {
    it('should assign a role to a user successfully', async () => {
      const mockUser = { id: 1, username: 'test' };
      const mockRole = { id: 2, name: 'Editor' };

      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);
      (Role.findByPk as jest.Mock).mockResolvedValue(mockRole);
      (UserRoleXRef.findOne as jest.Mock).mockResolvedValue(null);
      (UserRoleXRef.create as jest.Mock).mockResolvedValue({});

      const response = await request(app).post('/users/1/roles').send({ roleId: 2 }).expect(201);

      expect(UserRoleXRef.create).toHaveBeenCalledWith({ userId: 1, roleId: 2 });
      expect(response.body).toHaveProperty('message', 'Role assigned successfully');
    });

    it('should return 400 if roleId is missing', async () => {
      const response = await request(app).post('/users/1/roles').send({}).expect(400);

      expect(response.body).toHaveProperty('error', 'roleId is required');
    });

    it('should return 404 if user not found', async () => {
      (User.findByPk as jest.Mock).mockResolvedValue(null);

      const response = await request(app).post('/users/999/roles').send({ roleId: 2 }).expect(404);

      expect(response.body).toHaveProperty('error', 'User not found');
    });

    it('should return 404 if role not found', async () => {
      const mockUser = { id: 1, username: 'test' };
      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);
      (Role.findByPk as jest.Mock).mockResolvedValue(null);

      const response = await request(app).post('/users/1/roles').send({ roleId: 999 }).expect(404);

      expect(response.body).toHaveProperty('error', 'Role not found');
    });

    it('should return 400 if role already assigned', async () => {
      const mockUser = { id: 1, username: 'test' };
      const mockRole = { id: 2, name: 'Editor' };

      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);
      (Role.findByPk as jest.Mock).mockResolvedValue(mockRole);
      (UserRoleXRef.findOne as jest.Mock).mockResolvedValue({ userId: 1, roleId: 2 });

      const response = await request(app).post('/users/1/roles').send({ roleId: 2 }).expect(400);

      expect(response.body).toHaveProperty('error', 'User already has this role');
    });
  });

  describe('DELETE /users/:id/roles/:roleId', () => {
    it('should remove a role from a user successfully', async () => {
      const mockAssignment = {
        destroy: jest.fn(),
      };
      (UserRoleXRef.findOne as jest.Mock).mockResolvedValue(mockAssignment);

      const response = await request(app).delete('/users/1/roles/2').expect(200);

      expect(mockAssignment.destroy).toHaveBeenCalled();
      expect(response.body).toHaveProperty('message', 'Role removed successfully');
    });

    it('should return 404 if assignment not found', async () => {
      (UserRoleXRef.findOne as jest.Mock).mockResolvedValue(null);

      const response = await request(app).delete('/users/1/roles/2').expect(404);

      expect(response.body).toHaveProperty('error', 'Role assignment not found');
    });
  });

  describe('POST /users/:id/change-password', () => {
    it('should change user password successfully', async () => {
      const mockUser = {
        id: 1,
        passwordHash: 'old_hash',
        save: jest.fn(),
      };
      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue('new_hash');

      const response = await request(app)
        .post('/users/1/change-password')
        .send({
          currentPassword: 'oldpass123',
          newPassword: 'newpass456',
        })
        .expect(200);

      expect(bcrypt.compare).toHaveBeenCalledWith('oldpass123', 'old_hash');
      expect(bcrypt.hash).toHaveBeenCalledWith('newpass456', 10);
      expect(mockUser.save).toHaveBeenCalled();
      expect(response.body).toHaveProperty('message', 'Password changed successfully');
    });

    it('should return 400 if required fields are missing', async () => {
      const response = await request(app)
        .post('/users/1/change-password')
        .send({ currentPassword: 'oldpass' })
        .expect(400);

      expect(response.body).toHaveProperty(
        'error',
        'Current password and new password are required'
      );
    });

    it('should return 404 if user not found', async () => {
      (User.findByPk as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .post('/users/999/change-password')
        .send({
          currentPassword: 'oldpass',
          newPassword: 'newpass',
        })
        .expect(404);

      expect(response.body).toHaveProperty('error', 'User not found');
    });

    it('should return 400 if current password is incorrect', async () => {
      const mockUser = {
        id: 1,
        passwordHash: 'old_hash',
      };
      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const response = await request(app)
        .post('/users/1/change-password')
        .send({
          currentPassword: 'wrongpass',
          newPassword: 'newpass',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Current password is incorrect');
    });
  });
});
