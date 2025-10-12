import request from 'supertest';
import express from 'express';
import universesRouter from '../../controllers/universes';
import Universe from '../../models/Universe';

// Mock the Universe model
jest.mock('../../models/Universe');

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
app.use('/universes', universesRouter);

describe('Universes Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /universes', () => {
    it('should return an empty array when no universes exist', async () => {
      (Universe.findAll as jest.Mock).mockResolvedValue([]);

      const response = await request(app).get('/universes').expect(200);

      expect(Universe.findAll).toHaveBeenCalledTimes(1);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(0);
    });

    it('should return all universes', async () => {
      const mockUniverses = [
        { id: 1, name: 'Marvel Universe', description: 'Earth-616', publisher: 'Marvel Comics' },
        { id: 2, name: 'DC Universe', description: 'Earth-0', publisher: 'DC Comics' },
      ];
      (Universe.findAll as jest.Mock).mockResolvedValue(mockUniverses);

      const response = await request(app).get('/universes').expect(200);

      expect(Universe.findAll).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual(mockUniverses);
      expect(response.body).toHaveLength(2);
    });

    it('should handle errors gracefully', async () => {
      (Universe.findAll as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/universes').expect(500);

      expect(response.body).toHaveProperty('error', 'Failed to fetch universes');
    });
  });

  describe('GET /universes/:id', () => {
    it('should return a universe by ID', async () => {
      const mockUniverse = {
        id: 1,
        name: 'Marvel Universe',
        description: 'Earth-616',
        publisher: 'Marvel Comics',
      };
      (Universe.findByPk as jest.Mock).mockResolvedValue(mockUniverse);

      const response = await request(app).get('/universes/1').expect(200);

      expect(Universe.findByPk).toHaveBeenCalledWith('1');
      expect(response.body).toEqual(mockUniverse);
    });

    it('should return 404 when universe not found', async () => {
      (Universe.findByPk as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get('/universes/999').expect(404);

      expect(Universe.findByPk).toHaveBeenCalledWith('999');
      expect(response.body).toHaveProperty('error', 'Universe not found');
    });

    it('should handle errors gracefully', async () => {
      (Universe.findByPk as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/universes/1').expect(500);

      expect(response.body).toHaveProperty('error', 'Failed to fetch universe');
    });
  });

  describe('POST /universes', () => {
    it('should create a new universe successfully', async () => {
      const newUniverse = {
        name: 'Ultimate Universe',
        description: 'Earth-1610',
        publisherId: 1,
      };
      const mockCreatedUniverse = { id: 1, ...newUniverse };
      (Universe.create as jest.Mock).mockResolvedValue(mockCreatedUniverse);

      const response = await request(app).post('/universes').send(newUniverse).expect(201);

      expect(Universe.create).toHaveBeenCalledWith(newUniverse);
      expect(response.body).toEqual(mockCreatedUniverse);
    });

    it('should create a universe with only required fields', async () => {
      const newUniverse = { name: 'Wildstorm Universe' };
      const mockCreatedUniverse = { id: 2, ...newUniverse };
      (Universe.create as jest.Mock).mockResolvedValue(mockCreatedUniverse);

      const response = await request(app).post('/universes').send(newUniverse).expect(201);

      expect(Universe.create).toHaveBeenCalled();
      expect(response.body).toEqual(mockCreatedUniverse);
    });

    it('should return 400 when name is missing', async () => {
      const newUniverse = { description: 'A comic universe', publisher: 'Some Publisher' };

      const response = await request(app).post('/universes').send(newUniverse).expect(400);

      expect(Universe.create).not.toHaveBeenCalled();
      expect(response.body).toHaveProperty('error', 'Name is required');
    });

    it('should handle errors gracefully', async () => {
      const newUniverse = { name: 'Ultimate Universe' };
      (Universe.create as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app).post('/universes').send(newUniverse).expect(500);

      expect(response.body).toHaveProperty('error', 'Failed to create universe');
    });
  });

  describe('PUT /universes/:id', () => {
    it('should update a universe successfully', async () => {
      const updates = {
        name: 'Marvel Cinematic Universe',
        description: 'Earth-199999',
        publisherId: 1,
      };
      const mockUniverse = {
        id: 1,
        name: 'Marvel Universe',
        description: 'Earth-616',
        publisherId: 1,
        update: jest.fn().mockResolvedValue({ id: 1, ...updates }),
      };
      (Universe.findByPk as jest.Mock).mockResolvedValue(mockUniverse);

      await request(app).put('/universes/1').send(updates).expect(200);

      expect(Universe.findByPk).toHaveBeenCalledWith('1');
      expect(mockUniverse.update).toHaveBeenCalledWith(updates);
    });

    it('should return 404 when updating non-existent universe', async () => {
      (Universe.findByPk as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .put('/universes/999')
        .send({ name: 'Updated' })
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Universe not found');
    });

    it('should handle errors gracefully', async () => {
      (Universe.findByPk as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app).put('/universes/1').send({ name: 'Updated' }).expect(500);

      expect(response.body).toHaveProperty('error', 'Failed to update universe');
    });
  });

  describe('DELETE /universes/:id', () => {
    it('should delete a universe successfully', async () => {
      const mockUniverse = {
        id: 1,
        name: 'Marvel Universe',
        destroy: jest.fn().mockResolvedValue(undefined),
      };
      (Universe.findByPk as jest.Mock).mockResolvedValue(mockUniverse);

      const response = await request(app).delete('/universes/1').expect(200);

      expect(Universe.findByPk).toHaveBeenCalledWith('1');
      expect(mockUniverse.destroy).toHaveBeenCalledTimes(1);
      expect(response.body).toHaveProperty('message', 'Universe deleted successfully');
    });

    it('should return 404 when deleting non-existent universe', async () => {
      (Universe.findByPk as jest.Mock).mockResolvedValue(null);

      const response = await request(app).delete('/universes/999').expect(404);

      expect(response.body).toHaveProperty('error', 'Universe not found');
    });

    it('should handle errors gracefully', async () => {
      (Universe.findByPk as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app).delete('/universes/1').expect(500);

      expect(response.body).toHaveProperty('error', 'Failed to delete universe');
    });
  });
});
