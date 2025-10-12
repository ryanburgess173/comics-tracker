import request from 'supertest';
import express from 'express';
import rolesRouter from '../../controllers/roles';
import Role from '../../models/Role';
import Permission from '../../models/Permission';
import RolePermissionXRef from '../../models/RolePermissionXRef';

// Mock the models
jest.mock('../../models/Role');
jest.mock('../../models/Permission');
jest.mock('../../models/RolePermissionXRef');

// Mock the logger
jest.mock('../../utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}));

// Create a test app
const app = express();
app.use(express.json());
app.use('/roles', rolesRouter);

describe('Roles Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /roles', () => {
    it('should return all roles ordered by name', async () => {
      const mockRoles = [
        { id: 1, name: 'Admin', description: 'Full access' },
        { id: 2, name: 'Editor', description: 'Can edit content' },
      ];
      (Role.findAll as jest.Mock).mockResolvedValue(mockRoles);

      const response = await request(app).get('/roles').expect(200);

      expect(Role.findAll).toHaveBeenCalledWith({
        order: [['name', 'ASC']],
      });
      expect(response.body).toEqual(mockRoles);
      expect(response.body).toHaveLength(2);
    });

    it('should handle errors gracefully', async () => {
      (Role.findAll as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/roles').expect(500);

      expect(response.body).toHaveProperty('error', 'Failed to fetch roles');
    });
  });

  describe('GET /roles/:id', () => {
    it('should return a role by ID', async () => {
      const mockRole = {
        id: 1,
        name: 'Admin',
        description: 'Full access',
      };
      (Role.findByPk as jest.Mock).mockResolvedValue(mockRole);

      const response = await request(app).get('/roles/1').expect(200);

      expect(Role.findByPk).toHaveBeenCalledWith('1');
      expect(response.body).toEqual(mockRole);
    });

    it('should return 404 when role not found', async () => {
      (Role.findByPk as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get('/roles/999').expect(404);

      expect(response.body).toHaveProperty('error', 'Role not found');
    });

    it('should handle errors gracefully', async () => {
      (Role.findByPk as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/roles/1').expect(500);

      expect(response.body).toHaveProperty('error', 'Failed to fetch role');
    });
  });

  describe('POST /roles', () => {
    it('should create a new role successfully', async () => {
      const newRoleData = {
        name: 'Moderator',
        description: 'Can moderate content',
      };

      (Role.findOne as jest.Mock).mockResolvedValue(null);
      (Role.create as jest.Mock).mockResolvedValue({
        id: 1,
        ...newRoleData,
      });

      const response = await request(app).post('/roles').send(newRoleData).expect(201);

      expect(Role.findOne).toHaveBeenCalledWith({
        where: { name: newRoleData.name },
      });
      expect(Role.create).toHaveBeenCalledWith(newRoleData);
      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty('name', 'Moderator');
    });

    it('should return 400 if name is missing', async () => {
      const response = await request(app).post('/roles').send({}).expect(400);

      expect(response.body).toHaveProperty('error', 'Name is required');
    });

    it('should return 400 if role already exists', async () => {
      (Role.findOne as jest.Mock).mockResolvedValue({
        id: 1,
        name: 'Admin',
      });

      const response = await request(app)
        .post('/roles')
        .send({
          name: 'Admin',
          description: 'Full access',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Role with this name already exists');
    });

    it('should handle errors gracefully', async () => {
      (Role.findOne as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/roles')
        .send({
          name: 'Moderator',
        })
        .expect(500);

      expect(response.body).toHaveProperty('error', 'Failed to create role');
    });
  });

  describe('PUT /roles/:id', () => {
    it('should update a role successfully', async () => {
      const mockRole = {
        id: 1,
        name: 'Admin',
        description: 'Old description',
        save: jest.fn(),
      };
      (Role.findByPk as jest.Mock).mockResolvedValue(mockRole);

      const response = await request(app)
        .put('/roles/1')
        .send({ description: 'New description' })
        .expect(200);

      expect(mockRole.save).toHaveBeenCalled();
      expect(mockRole.description).toBe('New description');
    });

    it('should return 404 when role not found', async () => {
      (Role.findByPk as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .put('/roles/999')
        .send({ description: 'New description' })
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Role not found');
    });

    it('should handle errors gracefully', async () => {
      (Role.findByPk as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .put('/roles/1')
        .send({ description: 'New description' })
        .expect(500);

      expect(response.body).toHaveProperty('error', 'Failed to update role');
    });
  });

  describe('DELETE /roles/:id', () => {
    it('should delete a role successfully', async () => {
      const mockRole = {
        id: 1,
        destroy: jest.fn(),
      };
      (Role.findByPk as jest.Mock).mockResolvedValue(mockRole);

      const response = await request(app).delete('/roles/1').expect(200);

      expect(mockRole.destroy).toHaveBeenCalled();
      expect(response.body).toHaveProperty('message', 'Role deleted successfully');
    });

    it('should return 404 when role not found', async () => {
      (Role.findByPk as jest.Mock).mockResolvedValue(null);

      const response = await request(app).delete('/roles/999').expect(404);

      expect(response.body).toHaveProperty('error', 'Role not found');
    });

    it('should handle errors gracefully', async () => {
      (Role.findByPk as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app).delete('/roles/1').expect(500);

      expect(response.body).toHaveProperty('error', 'Failed to delete role');
    });
  });

  describe('GET /roles/:id/permissions', () => {
    it('should return role permissions', async () => {
      const mockRole = { id: 1, name: 'Admin' };
      const mockPermissions = [
        { id: 1, name: 'comics:create' },
        { id: 2, name: 'comics:read' },
      ];
      const mockRolePermissions = [
        { Permission: mockPermissions[0] },
        { Permission: mockPermissions[1] },
      ];

      (Role.findByPk as jest.Mock).mockResolvedValue(mockRole);
      (RolePermissionXRef.findAll as jest.Mock).mockResolvedValue(mockRolePermissions);

      const response = await request(app).get('/roles/1/permissions').expect(200);

      expect(RolePermissionXRef.findAll).toHaveBeenCalledWith({
        where: { roleId: '1' },
        include: [{ model: Permission }],
      });
      expect(response.body).toHaveLength(2);
    });

    it('should return 404 when role not found', async () => {
      (Role.findByPk as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get('/roles/999/permissions').expect(404);

      expect(response.body).toHaveProperty('error', 'Role not found');
    });
  });

  describe('POST /roles/:id/permissions', () => {
    it('should assign a permission to a role successfully', async () => {
      const mockRole = { id: 1, name: 'Editor' };
      const mockPermission = { id: 5, name: 'comics:create' };

      (Role.findByPk as jest.Mock).mockResolvedValue(mockRole);
      (Permission.findByPk as jest.Mock).mockResolvedValue(mockPermission);
      (RolePermissionXRef.findOne as jest.Mock).mockResolvedValue(null);
      (RolePermissionXRef.create as jest.Mock).mockResolvedValue({});

      const response = await request(app)
        .post('/roles/1/permissions')
        .send({ permissionId: 5 })
        .expect(201);

      expect(RolePermissionXRef.create).toHaveBeenCalledWith({ roleId: 1, permissionId: 5 });
      expect(response.body).toHaveProperty('message', 'Permission assigned successfully');
    });

    it('should return 400 if permissionId is missing', async () => {
      const response = await request(app).post('/roles/1/permissions').send({}).expect(400);

      expect(response.body).toHaveProperty('error', 'permissionId is required');
    });

    it('should return 404 if role not found', async () => {
      (Role.findByPk as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .post('/roles/999/permissions')
        .send({ permissionId: 5 })
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Role not found');
    });

    it('should return 404 if permission not found', async () => {
      const mockRole = { id: 1, name: 'Editor' };
      (Role.findByPk as jest.Mock).mockResolvedValue(mockRole);
      (Permission.findByPk as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .post('/roles/1/permissions')
        .send({ permissionId: 999 })
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Permission not found');
    });

    it('should return 400 if permission already assigned', async () => {
      const mockRole = { id: 1, name: 'Editor' };
      const mockPermission = { id: 5, name: 'comics:create' };

      (Role.findByPk as jest.Mock).mockResolvedValue(mockRole);
      (Permission.findByPk as jest.Mock).mockResolvedValue(mockPermission);
      (RolePermissionXRef.findOne as jest.Mock).mockResolvedValue({ roleId: 1, permissionId: 5 });

      const response = await request(app)
        .post('/roles/1/permissions')
        .send({ permissionId: 5 })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Role already has this permission');
    });
  });

  describe('DELETE /roles/:id/permissions/:permissionId', () => {
    it('should remove a permission from a role successfully', async () => {
      const mockAssignment = {
        destroy: jest.fn(),
      };
      (RolePermissionXRef.findOne as jest.Mock).mockResolvedValue(mockAssignment);

      const response = await request(app).delete('/roles/1/permissions/5').expect(200);

      expect(mockAssignment.destroy).toHaveBeenCalled();
      expect(response.body).toHaveProperty('message', 'Permission removed successfully');
    });

    it('should return 404 if assignment not found', async () => {
      (RolePermissionXRef.findOne as jest.Mock).mockResolvedValue(null);

      const response = await request(app).delete('/roles/1/permissions/5').expect(404);

      expect(response.body).toHaveProperty('error', 'Permission assignment not found');
    });
  });

  describe('POST /roles/:id/permissions/bulk', () => {
    it('should bulk assign permissions successfully', async () => {
      const mockRole = { id: 1, name: 'Editor' };
      const mockPermissions = [
        { id: 1, name: 'comics:create' },
        { id: 2, name: 'comics:read' },
        { id: 3, name: 'comics:update' },
      ];

      (Role.findByPk as jest.Mock).mockResolvedValue(mockRole);
      (Permission.findByPk as jest.Mock)
        .mockResolvedValueOnce(mockPermissions[0])
        .mockResolvedValueOnce(mockPermissions[1])
        .mockResolvedValueOnce(mockPermissions[2]);
      (RolePermissionXRef.findOne as jest.Mock).mockResolvedValue(null);
      (RolePermissionXRef.create as jest.Mock).mockResolvedValue({});

      const response = await request(app)
        .post('/roles/1/permissions/bulk')
        .send({ permissionIds: [1, 2, 3] })
        .expect(201);

      expect(RolePermissionXRef.create).toHaveBeenCalledTimes(3);
      expect(response.body).toHaveProperty('message', '3 permissions assigned successfully');
      expect(response.body).toHaveProperty('assigned', 3);
      expect(response.body).toHaveProperty('skipped', 0);
    });

    it('should skip already assigned permissions', async () => {
      const mockRole = { id: 1, name: 'Editor' };
      const mockPermissions = [
        { id: 1, name: 'comics:create' },
        { id: 2, name: 'comics:read' },
      ];

      (Role.findByPk as jest.Mock).mockResolvedValue(mockRole);
      (Permission.findByPk as jest.Mock)
        .mockResolvedValueOnce(mockPermissions[0])
        .mockResolvedValueOnce(mockPermissions[1]);
      (RolePermissionXRef.findOne as jest.Mock)
        .mockResolvedValueOnce({ roleId: 1, permissionId: 1 }) // Already assigned
        .mockResolvedValueOnce(null); // Not assigned
      (RolePermissionXRef.create as jest.Mock).mockResolvedValue({});

      const response = await request(app)
        .post('/roles/1/permissions/bulk')
        .send({ permissionIds: [1, 2] })
        .expect(201);

      expect(RolePermissionXRef.create).toHaveBeenCalledTimes(1);
      expect(response.body).toHaveProperty('assigned', 1);
      expect(response.body).toHaveProperty('skipped', 1);
    });

    it('should skip non-existent permissions', async () => {
      const mockRole = { id: 1, name: 'Editor' };

      (Role.findByPk as jest.Mock).mockResolvedValue(mockRole);
      (Permission.findByPk as jest.Mock)
        .mockResolvedValueOnce(null) // Permission not found
        .mockResolvedValueOnce({ id: 2, name: 'comics:read' });
      (RolePermissionXRef.findOne as jest.Mock).mockResolvedValue(null);
      (RolePermissionXRef.create as jest.Mock).mockResolvedValue({});

      const response = await request(app)
        .post('/roles/1/permissions/bulk')
        .send({ permissionIds: [999, 2] })
        .expect(201);

      expect(RolePermissionXRef.create).toHaveBeenCalledTimes(1);
      expect(response.body).toHaveProperty('assigned', 1);
      expect(response.body).toHaveProperty('skipped', 1);
    });

    it('should return 400 if permissionIds array is missing', async () => {
      const response = await request(app).post('/roles/1/permissions/bulk').send({}).expect(400);

      expect(response.body).toHaveProperty('error', 'permissionIds array is required');
    });

    it('should return 400 if permissionIds is not an array', async () => {
      const response = await request(app)
        .post('/roles/1/permissions/bulk')
        .send({ permissionIds: 'not-an-array' })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'permissionIds array is required');
    });

    it('should return 404 if role not found', async () => {
      (Role.findByPk as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .post('/roles/999/permissions/bulk')
        .send({ permissionIds: [1, 2, 3] })
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Role not found');
    });
  });
});
