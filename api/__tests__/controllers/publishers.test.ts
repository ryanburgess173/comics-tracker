import request from 'supertest';
import express from 'express';
import publishersRouter from '../../controllers/publishers';
import Publisher from '../../models/Publisher';

// Mock the Publisher model
jest.mock('../../models/Publisher');

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
app.use('/publishers', publishersRouter);

describe('Publishers Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /publishers', () => {
    it('should return an empty array when no publishers exist', async () => {
      (Publisher.findAll as jest.Mock).mockResolvedValue([]);

      const response = await request(app).get('/publishers').expect(200);

      expect(Publisher.findAll).toHaveBeenCalledTimes(1);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(0);
    });

    it('should return all publishers', async () => {
      const mockPublishers = [
        { id: 1, name: 'Marvel Comics', country: 'USA', foundedYear: 1939 },
        { id: 2, name: 'DC Comics', country: 'USA', foundedYear: 1934 },
      ];
      (Publisher.findAll as jest.Mock).mockResolvedValue(mockPublishers);

      const response = await request(app).get('/publishers').expect(200);

      expect(Publisher.findAll).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual(mockPublishers);
      expect(response.body).toHaveLength(2);
    });

    it('should handle errors gracefully', async () => {
      (Publisher.findAll as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/publishers').expect(500);

      expect(response.body).toHaveProperty('error', 'Failed to fetch publishers');
    });
  });

  describe('GET /publishers/:id', () => {
    it('should return a publisher by ID', async () => {
      const mockPublisher = {
        id: 1,
        name: 'Marvel Comics',
        country: 'USA',
        foundedYear: 1939,
      };
      (Publisher.findByPk as jest.Mock).mockResolvedValue(mockPublisher);

      const response = await request(app).get('/publishers/1').expect(200);

      expect(Publisher.findByPk).toHaveBeenCalledWith('1');
      expect(response.body).toEqual(mockPublisher);
    });

    it('should return 404 when publisher not found', async () => {
      (Publisher.findByPk as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get('/publishers/999').expect(404);

      expect(Publisher.findByPk).toHaveBeenCalledWith('999');
      expect(response.body).toHaveProperty('error', 'Publisher not found');
    });

    it('should handle errors gracefully', async () => {
      (Publisher.findByPk as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/publishers/1').expect(500);

      expect(response.body).toHaveProperty('error', 'Failed to fetch publisher');
    });
  });

  describe('POST /publishers', () => {
    it('should create a new publisher successfully', async () => {
      const newPublisher = {
        name: 'Image Comics',
        country: 'USA',
        foundedYear: 1992,
        website: 'https://imagecomics.com',
      };
      const mockCreatedPublisher = { id: 1, ...newPublisher };
      (Publisher.create as jest.Mock).mockResolvedValue(mockCreatedPublisher);

      const response = await request(app).post('/publishers').send(newPublisher).expect(201);

      expect(Publisher.create).toHaveBeenCalledWith(newPublisher);
      expect(response.body).toEqual(mockCreatedPublisher);
    });

    it('should create a publisher with only required fields', async () => {
      const newPublisher = { name: 'Dark Horse Comics' };
      const mockCreatedPublisher = { id: 2, ...newPublisher };
      (Publisher.create as jest.Mock).mockResolvedValue(mockCreatedPublisher);

      const response = await request(app).post('/publishers').send(newPublisher).expect(201);

      expect(Publisher.create).toHaveBeenCalled();
      expect(response.body).toEqual(mockCreatedPublisher);
    });

    it('should return 400 when name is missing', async () => {
      const newPublisher = { country: 'USA', foundedYear: 1990 };

      const response = await request(app).post('/publishers').send(newPublisher).expect(400);

      expect(Publisher.create).not.toHaveBeenCalled();
      expect(response.body).toHaveProperty('error', 'Name is required');
    });

    it('should handle errors gracefully', async () => {
      const newPublisher = { name: 'Image Comics' };
      (Publisher.create as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app).post('/publishers').send(newPublisher).expect(500);

      expect(response.body).toHaveProperty('error', 'Failed to create publisher');
    });
  });

  describe('PUT /publishers/:id', () => {
    it('should update a publisher successfully', async () => {
      const updates = {
        name: 'Marvel Comics Inc.',
        country: 'United States',
        foundedYear: 1939,
        website: 'https://www.marvel.com',
      };
      const mockPublisher = {
        id: 1,
        name: 'Marvel Comics',
        country: 'USA',
        foundedYear: 1939,
        update: jest.fn().mockResolvedValue({ id: 1, ...updates }),
      };
      (Publisher.findByPk as jest.Mock).mockResolvedValue(mockPublisher);

      await request(app).put('/publishers/1').send(updates).expect(200);

      expect(Publisher.findByPk).toHaveBeenCalledWith('1');
      expect(mockPublisher.update).toHaveBeenCalledWith(updates);
    });

    it('should return 404 when updating non-existent publisher', async () => {
      (Publisher.findByPk as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .put('/publishers/999')
        .send({ name: 'Updated' })
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Publisher not found');
    });

    it('should handle errors gracefully', async () => {
      (Publisher.findByPk as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .put('/publishers/1')
        .send({ name: 'Updated' })
        .expect(500);

      expect(response.body).toHaveProperty('error', 'Failed to update publisher');
    });
  });

  describe('DELETE /publishers/:id', () => {
    it('should delete a publisher successfully', async () => {
      const mockPublisher = {
        id: 1,
        name: 'Marvel Comics',
        destroy: jest.fn().mockResolvedValue(undefined),
      };
      (Publisher.findByPk as jest.Mock).mockResolvedValue(mockPublisher);

      const response = await request(app).delete('/publishers/1').expect(200);

      expect(Publisher.findByPk).toHaveBeenCalledWith('1');
      expect(mockPublisher.destroy).toHaveBeenCalledTimes(1);
      expect(response.body).toHaveProperty('message', 'Publisher deleted successfully');
    });

    it('should return 404 when deleting non-existent publisher', async () => {
      (Publisher.findByPk as jest.Mock).mockResolvedValue(null);

      const response = await request(app).delete('/publishers/999').expect(404);

      expect(response.body).toHaveProperty('error', 'Publisher not found');
    });

    it('should handle errors gracefully', async () => {
      (Publisher.findByPk as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app).delete('/publishers/1').expect(500);

      expect(response.body).toHaveProperty('error', 'Failed to delete publisher');
    });
  });
});
