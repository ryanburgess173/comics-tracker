import request from 'supertest';
import express from 'express';
import omnibusRouter from '../../controllers/omnibus';
import Omnibus from '../../models/Omnibus';

// Mock the Omnibus model
jest.mock('../../models/Omnibus');

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
app.use('/omnibus', omnibusRouter);

describe('Omnibus Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /omnibus', () => {
    it('should return an empty array when no omnibus editions exist', async () => {
      (Omnibus.findAll as jest.Mock).mockResolvedValue([]);

      const response = await request(app).get('/omnibus').expect(200);

      expect(Omnibus.findAll).toHaveBeenCalledTimes(1);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(0);
    });

    it('should return all omnibus editions', async () => {
      const mockOmnibus = [
        {
          id: 1,
          title: 'Spider-Man Omnibus Vol. 1',
          isbn: '978-0785123456',
          publicationDate: '2007-01-01',
          pageCount: 800,
        },
        {
          id: 2,
          title: 'Batman Omnibus Vol. 1',
          isbn: '978-1401234567',
          publicationDate: '2015-06-01',
          pageCount: 900,
        },
      ];
      (Omnibus.findAll as jest.Mock).mockResolvedValue(mockOmnibus);

      const response = await request(app).get('/omnibus').expect(200);

      expect(Omnibus.findAll).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual(mockOmnibus);
      expect(response.body).toHaveLength(2);
    });

    it('should handle errors gracefully', async () => {
      (Omnibus.findAll as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/omnibus').expect(500);

      expect(response.body).toHaveProperty('error', 'Failed to fetch omnibus editions');
    });
  });

  describe('GET /omnibus/:id', () => {
    it('should return an omnibus by ID', async () => {
      const mockOmnibus = {
        id: 1,
        title: 'Spider-Man Omnibus Vol. 1',
        isbn: '978-0785123456',
        publicationDate: '2007-01-01',
        pageCount: 800,
      };
      (Omnibus.findByPk as jest.Mock).mockResolvedValue(mockOmnibus);

      const response = await request(app).get('/omnibus/1').expect(200);

      expect(Omnibus.findByPk).toHaveBeenCalledWith('1');
      expect(response.body).toEqual(mockOmnibus);
    });

    it('should return 404 when omnibus not found', async () => {
      (Omnibus.findByPk as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get('/omnibus/999').expect(404);

      expect(Omnibus.findByPk).toHaveBeenCalledWith('999');
      expect(response.body).toHaveProperty('error', 'Omnibus edition not found');
    });

    it('should handle errors gracefully', async () => {
      (Omnibus.findByPk as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/omnibus/1').expect(500);

      expect(response.body).toHaveProperty('error', 'Failed to fetch omnibus edition');
    });
  });

  describe('POST /omnibus', () => {
    it('should create a new omnibus successfully', async () => {
      const newOmnibus = {
        title: 'X-Men Omnibus Vol. 1',
        isbn: '978-0785345678',
        publicationDate: '2009-01-01',
        pageCount: 950,
        description: 'Collects X-Men #1-20',
      };
      const mockCreatedOmnibus = { id: 1, ...newOmnibus };
      (Omnibus.create as jest.Mock).mockResolvedValue(mockCreatedOmnibus);

      const response = await request(app).post('/omnibus').send(newOmnibus).expect(201);

      expect(Omnibus.create).toHaveBeenCalledWith(newOmnibus);
      expect(response.body).toEqual(mockCreatedOmnibus);
    });

    it('should create an omnibus with only required fields', async () => {
      const newOmnibus = { title: 'Fantastic Four Omnibus Vol. 1' };
      const mockCreatedOmnibus = { id: 2, ...newOmnibus };
      (Omnibus.create as jest.Mock).mockResolvedValue(mockCreatedOmnibus);

      const response = await request(app).post('/omnibus').send(newOmnibus).expect(201);

      expect(Omnibus.create).toHaveBeenCalled();
      expect(response.body).toEqual(mockCreatedOmnibus);
    });

    it('should return 400 when title is missing', async () => {
      const newOmnibus = {
        isbn: '978-0785345678',
        publicationDate: '2009-01-01',
        pageCount: 950,
      };

      const response = await request(app).post('/omnibus').send(newOmnibus).expect(400);

      expect(Omnibus.create).not.toHaveBeenCalled();
      expect(response.body).toHaveProperty('error', 'Title is required');
    });

    it('should handle errors gracefully', async () => {
      const newOmnibus = { title: 'X-Men Omnibus Vol. 1' };
      (Omnibus.create as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app).post('/omnibus').send(newOmnibus).expect(500);

      expect(response.body).toHaveProperty('error', 'Failed to create omnibus edition');
    });
  });

  describe('PUT /omnibus/:id', () => {
    it('should update an omnibus successfully', async () => {
      const updates = {
        title: 'Spider-Man Omnibus Vol. 1 HC',
        isbn: '978-0785123456',
        publicationDate: '2007-01-01',
        pageCount: 850,
        description: 'Updated description',
      };
      const mockOmnibus = {
        id: 1,
        title: 'Spider-Man Omnibus Vol. 1',
        isbn: '978-0785123456',
        pageCount: 800,
        update: jest.fn().mockResolvedValue({ id: 1, ...updates }),
      };
      (Omnibus.findByPk as jest.Mock).mockResolvedValue(mockOmnibus);

      await request(app).put('/omnibus/1').send(updates).expect(200);

      expect(Omnibus.findByPk).toHaveBeenCalledWith('1');
      expect(mockOmnibus.update).toHaveBeenCalledWith(updates);
    });

    it('should return 404 when updating non-existent omnibus', async () => {
      (Omnibus.findByPk as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .put('/omnibus/999')
        .send({ title: 'Updated' })
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Omnibus edition not found');
    });

    it('should handle errors gracefully', async () => {
      (Omnibus.findByPk as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app).put('/omnibus/1').send({ title: 'Updated' }).expect(500);

      expect(response.body).toHaveProperty('error', 'Failed to update omnibus edition');
    });
  });

  describe('DELETE /omnibus/:id', () => {
    it('should delete an omnibus successfully', async () => {
      const mockOmnibus = {
        id: 1,
        title: 'Spider-Man Omnibus Vol. 1',
        destroy: jest.fn().mockResolvedValue(undefined),
      };
      (Omnibus.findByPk as jest.Mock).mockResolvedValue(mockOmnibus);

      const response = await request(app).delete('/omnibus/1').expect(200);

      expect(Omnibus.findByPk).toHaveBeenCalledWith('1');
      expect(mockOmnibus.destroy).toHaveBeenCalledTimes(1);
      expect(response.body).toHaveProperty('message', 'Omnibus edition deleted successfully');
    });

    it('should return 404 when deleting non-existent omnibus', async () => {
      (Omnibus.findByPk as jest.Mock).mockResolvedValue(null);

      const response = await request(app).delete('/omnibus/999').expect(404);

      expect(response.body).toHaveProperty('error', 'Omnibus edition not found');
    });

    it('should handle errors gracefully', async () => {
      (Omnibus.findByPk as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app).delete('/omnibus/1').expect(500);

      expect(response.body).toHaveProperty('error', 'Failed to delete omnibus edition');
    });
  });
});
