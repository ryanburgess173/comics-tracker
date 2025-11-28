import request from 'supertest';
import express from 'express';
import permissionsRouter from '../../controllers/permissions';
import Permission from '../../models/Permission';

// Mock the Permission model
jest.mock('../../models/Permission');

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
app.use('/permissions', permissionsRouter);

describe('Permissions Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /permissions', () => {
    it('should return all permissions ordered by resource and action', async () => {
      const mockPermissions = [
        {
          id: 1,
          name: 'comics:create',
          resource: 'comics',
          action: 'create',
          description: 'Create new comics',
        },
        {
          id: 2,
          name: 'comics:read',
          resource: 'comics',
          action: 'read',
          description: 'View comics',
        },
      ];
      (Permission.findAll as jest.Mock).mockResolvedValue(mockPermissions);

      const response = await request(app).get('/permissions').expect(200);

      expect(Permission.findAll).toHaveBeenCalledWith({
        order: [
          ['resource', 'ASC'],
          ['action', 'ASC'],
        ],
      });
      expect(response.body).toEqual(mockPermissions);
      expect(response.body).toHaveLength(2);
    });

    it('should handle errors gracefully', async () => {
      (Permission.findAll as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/permissions').expect(500);

      expect(response.body).toHaveProperty('error', 'Failed to fetch permissions');
    });
  });

  describe('GET /permissions/by-resource', () => {
    it('should return permissions grouped by resource', async () => {
      const mockPermissions = [
        {
          id: 1,
          name: 'comics:create',
          resource: 'comics',
          action: 'create',
          description: 'Create new comics',
        },
        {
          id: 2,
          name: 'comics:read',
          resource: 'comics',
          action: 'read',
          description: 'View comics',
        },
        {
          id: 3,
          name: 'users:create',
          resource: 'users',
          action: 'create',
          description: 'Create new users',
        },
      ];
      (Permission.findAll as jest.Mock).mockResolvedValue(mockPermissions);

      const response = await request(app).get('/permissions/by-resource').expect(200);

      expect(Permission.findAll).toHaveBeenCalledWith({
        order: [
          ['resource', 'ASC'],
          ['action', 'ASC'],
        ],
      });
      expect(response.body).toHaveProperty('comics');
      expect(response.body).toHaveProperty('users');
      expect((response.body as { comics: unknown[] }).comics).toHaveLength(2);
      expect((response.body as { users: unknown[] }).users).toHaveLength(1);
    });

    it('should handle errors gracefully', async () => {
      (Permission.findAll as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/permissions/by-resource').expect(500);

      expect(response.body).toHaveProperty('error', 'Failed to fetch grouped permissions');
    });
  });

  describe('GET /permissions/:id', () => {
    it('should return a permission by ID', async () => {
      const mockPermission = {
        id: 1,
        name: 'comics:create',
        resource: 'comics',
        action: 'create',
        description: 'Create new comics',
      };
      (Permission.findByPk as jest.Mock).mockResolvedValue(mockPermission);

      const response = await request(app).get('/permissions/1').expect(200);

      expect(Permission.findByPk).toHaveBeenCalledWith('1');
      expect(response.body).toEqual(mockPermission);
    });

    it('should return 404 when permission not found', async () => {
      (Permission.findByPk as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get('/permissions/999').expect(404);

      expect(response.body).toHaveProperty('error', 'Permission not found');
    });

    it('should handle errors gracefully', async () => {
      (Permission.findByPk as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/permissions/1').expect(500);

      expect(response.body).toHaveProperty('error', 'Failed to fetch permission');
    });
  });

  describe('POST /permissions', () => {
    it('should create a new permission successfully', async () => {
      const newPermissionData = {
        name: 'comics:create',
        resource: 'comics',
        action: 'create',
        description: 'Create new comics',
      };

      (Permission.findOne as jest.Mock).mockResolvedValue(null);
      (Permission.create as jest.Mock).mockResolvedValue({
        id: 1,
        ...newPermissionData,
      });

      const response = await request(app).post('/permissions').send(newPermissionData).expect(201);

      expect(Permission.findOne).toHaveBeenCalledWith({
        where: { name: newPermissionData.name },
      });
      expect(Permission.create).toHaveBeenCalledWith(newPermissionData);
      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty('name', 'comics:create');
    });

    it('should return 400 if required fields are missing', async () => {
      const response = await request(app).post('/permissions').send({ name: 'test' }).expect(400);

      expect(response.body).toHaveProperty('error', 'Name, resource, and action are required');
    });

    it('should return 400 if permission already exists', async () => {
      (Permission.findOne as jest.Mock).mockResolvedValue({
        id: 1,
        name: 'comics:create',
      });

      const response = await request(app)
        .post('/permissions')
        .send({
          name: 'comics:create',
          resource: 'comics',
          action: 'create',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Permission with this name already exists');
    });

    it('should handle errors gracefully', async () => {
      (Permission.findOne as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/permissions')
        .send({
          name: 'comics:create',
          resource: 'comics',
          action: 'create',
        })
        .expect(500);

      expect(response.body).toHaveProperty('error', 'Failed to create permission');
    });
  });

  describe('PUT /permissions/:id', () => {
    it('should update a permission successfully', async () => {
      const mockPermission = {
        id: 1,
        name: 'comics:create',
        resource: 'comics',
        action: 'create',
        description: 'Old description',
        save: jest.fn(),
      };
      (Permission.findByPk as jest.Mock).mockResolvedValue(mockPermission);

      await request(app).put('/permissions/1').send({ description: 'New description' }).expect(200);

      expect(mockPermission.save).toHaveBeenCalled();
      expect(mockPermission.description).toBe('New description');
    });

    it('should update permission name', async () => {
      const mockPermission = {
        id: 1,
        name: 'comics:create',
        resource: 'comics',
        action: 'create',
        description: 'Description',
        save: jest.fn(),
      };
      (Permission.findByPk as jest.Mock).mockResolvedValue(mockPermission);

      await request(app).put('/permissions/1').send({ name: 'comics:update' }).expect(200);

      expect(mockPermission.save).toHaveBeenCalled();
      expect(mockPermission.name).toBe('comics:update');
    });

    it('should update permission resource', async () => {
      const mockPermission = {
        id: 1,
        name: 'comics:create',
        resource: 'comics',
        action: 'create',
        description: 'Description',
        save: jest.fn(),
      };
      (Permission.findByPk as jest.Mock).mockResolvedValue(mockPermission);

      await request(app).put('/permissions/1').send({ resource: 'books' }).expect(200);

      expect(mockPermission.save).toHaveBeenCalled();
      expect(mockPermission.resource).toBe('books');
    });

    it('should update permission action', async () => {
      const mockPermission = {
        id: 1,
        name: 'comics:create',
        resource: 'comics',
        action: 'create',
        description: 'Description',
        save: jest.fn(),
      };
      (Permission.findByPk as jest.Mock).mockResolvedValue(mockPermission);

      await request(app).put('/permissions/1').send({ action: 'delete' }).expect(200);

      expect(mockPermission.save).toHaveBeenCalled();
      expect(mockPermission.action).toBe('delete');
    });

    it('should update multiple fields at once', async () => {
      const mockPermission = {
        id: 1,
        name: 'comics:create',
        resource: 'comics',
        action: 'create',
        description: 'Old description',
        save: jest.fn(),
      };
      (Permission.findByPk as jest.Mock).mockResolvedValue(mockPermission);

      await request(app)
        .put('/permissions/1')
        .send({
          name: 'books:create',
          resource: 'books',
          action: 'create',
          description: 'New description',
        })
        .expect(200);

      expect(mockPermission.save).toHaveBeenCalled();
      expect(mockPermission.name).toBe('books:create');
      expect(mockPermission.resource).toBe('books');
      expect(mockPermission.action).toBe('create');
      expect(mockPermission.description).toBe('New description');
    });

    it('should return 404 when permission not found', async () => {
      (Permission.findByPk as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .put('/permissions/999')
        .send({ description: 'New description' })
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Permission not found');
    });

    it('should handle errors gracefully', async () => {
      (Permission.findByPk as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .put('/permissions/1')
        .send({ description: 'New description' })
        .expect(500);

      expect(response.body).toHaveProperty('error', 'Failed to update permission');
    });
  });

  describe('DELETE /permissions/:id', () => {
    it('should delete a permission successfully', async () => {
      const mockPermission = {
        id: 1,
        destroy: jest.fn(),
      };
      (Permission.findByPk as jest.Mock).mockResolvedValue(mockPermission);

      const response = await request(app).delete('/permissions/1').expect(200);

      expect(mockPermission.destroy).toHaveBeenCalled();
      expect(response.body).toHaveProperty('message', 'Permission deleted successfully');
    });

    it('should return 404 when permission not found', async () => {
      (Permission.findByPk as jest.Mock).mockResolvedValue(null);

      const response = await request(app).delete('/permissions/999').expect(404);

      expect(response.body).toHaveProperty('error', 'Permission not found');
    });

    it('should handle errors gracefully', async () => {
      (Permission.findByPk as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app).delete('/permissions/1').expect(500);

      expect(response.body).toHaveProperty('error', 'Failed to delete permission');
    });
  });
});
