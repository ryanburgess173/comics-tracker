import request from 'supertest';
import express from 'express';
import creatorsRouter from '../../controllers/creators';
import Creator from '../../models/Creator';
import { CreatorType } from '../../types/CreatorTypes';

// Mock the Creator model
jest.mock('../../models/Creator');

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
app.use('/creators', creatorsRouter);

describe('Creators Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /creators', () => {
    it('should return an empty array when no creators exist', async () => {
      (Creator.findAll as jest.Mock).mockResolvedValue([]);

      const response = await request(app).get('/creators').expect(200);

      expect(Creator.findAll).toHaveBeenCalledTimes(1);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(0);
    });

    it('should return all creators', async () => {
      const mockCreators = [
        { id: 1, name: 'Stan Lee', creatorType: 'AUTHOR', bio: 'Legendary writer' },
        { id: 2, name: 'Jack Kirby', creatorType: 'ARTIST', bio: 'Legendary artist' },
      ];
      (Creator.findAll as jest.Mock).mockResolvedValue(mockCreators);

      const response = await request(app).get('/creators').expect(200);

      expect(Creator.findAll).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual(mockCreators);
      expect(response.body).toHaveLength(2);
    });

    it('should handle errors gracefully', async () => {
      (Creator.findAll as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/creators').expect(500);

      expect(response.body).toHaveProperty('error', 'Failed to fetch creators');
    });
  });

  describe('GET /creators/:id', () => {
    it('should return a creator by ID', async () => {
      const mockCreator = {
        id: 1,
        name: 'Stan Lee',
        creatorType: 'AUTHOR',
        bio: 'Legendary writer',
      };
      (Creator.findByPk as jest.Mock).mockResolvedValue(mockCreator);

      const response = await request(app).get('/creators/1').expect(200);

      expect(Creator.findByPk).toHaveBeenCalledWith('1');
      expect(response.body).toEqual(mockCreator);
    });

    it('should return 404 when creator not found', async () => {
      (Creator.findByPk as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get('/creators/999').expect(404);

      expect(Creator.findByPk).toHaveBeenCalledWith('999');
      expect(response.body).toHaveProperty('error', 'Creator not found');
    });

    it('should handle errors gracefully', async () => {
      (Creator.findByPk as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/creators/1').expect(500);

      expect(response.body).toHaveProperty('error', 'Failed to fetch creator');
    });
  });

  describe('POST /creators', () => {
    it('should create a new creator successfully with AUTHOR type', async () => {
      const newCreator = {
        name: 'Stan Lee',
        creatorType: 'AUTHOR',
        bio: 'Legendary writer and editor',
        birthDate: '1922-12-28',
      };
      const mockCreatedCreator = { id: 1, ...newCreator };
      (Creator.create as jest.Mock).mockResolvedValue(mockCreatedCreator);

      const response = await request(app).post('/creators').send(newCreator).expect(201);

      expect(Creator.create).toHaveBeenCalledWith(newCreator);
      expect(response.body).toEqual(mockCreatedCreator);
    });

    it('should create a new creator successfully with ARTIST type', async () => {
      const newCreator = {
        name: 'Jack Kirby',
        creatorType: 'ARTIST',
        bio: 'Legendary artist',
      };
      const mockCreatedCreator = { id: 2, ...newCreator };
      (Creator.create as jest.Mock).mockResolvedValue(mockCreatedCreator);

      const response = await request(app).post('/creators').send(newCreator).expect(201);

      expect(Creator.create).toHaveBeenCalled();
      expect(response.body).toEqual(mockCreatedCreator);
    });

    it('should create a creator with only required fields', async () => {
      const newCreator = { name: 'Steve Ditko', creatorType: 'ARTIST' };
      const mockCreatedCreator = { id: 3, ...newCreator };
      (Creator.create as jest.Mock).mockResolvedValue(mockCreatedCreator);

      const response = await request(app).post('/creators').send(newCreator).expect(201);

      expect(Creator.create).toHaveBeenCalled();
      expect(response.body).toEqual(mockCreatedCreator);
    });

    it('should return 400 when name is missing', async () => {
      const newCreator = { creatorType: 'AUTHOR' };

      const response = await request(app).post('/creators').send(newCreator).expect(400);

      expect(Creator.create).not.toHaveBeenCalled();
      expect(response.body).toHaveProperty('error', 'Name and creatorType are required');
    });

    it('should return 400 when creator type is missing', async () => {
      const newCreator = { name: 'Stan Lee' };

      const response = await request(app).post('/creators').send(newCreator).expect(400);

      expect(Creator.create).not.toHaveBeenCalled();
      expect(response.body).toHaveProperty('error', 'Name and creatorType are required');
    });

    it('should return 400 when creator type is invalid', async () => {
      const newCreator = {
        name: 'Stan Lee',
        creatorType: 'INVALID_TYPE',
      };

      const response = await request(app).post('/creators').send(newCreator).expect(400);

      expect(Creator.create).not.toHaveBeenCalled();
      expect(response.body).toHaveProperty('error', 'creatorType must be either ARTIST or AUTHOR');
    });

    it('should handle errors gracefully', async () => {
      const newCreator = { name: 'Stan Lee', creatorType: 'AUTHOR' };
      (Creator.create as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app).post('/creators').send(newCreator).expect(500);

      expect(response.body).toHaveProperty('error', 'Failed to create creator');
    });
  });

  describe('PUT /creators/:id', () => {
    it('should update a creator successfully', async () => {
      const updates = {
        name: 'Stan Lee',
        creatorType: 'AUTHOR',
        bio: 'Updated bio',
      };
      const mockCreator = {
        id: 1,
        name: 'Stan Lee',
        creatorType: 'AUTHOR',
        bio: 'Original bio',
        update: jest.fn().mockResolvedValue({ id: 1, ...updates }),
      };
      (Creator.findByPk as jest.Mock).mockResolvedValue(mockCreator);

      await request(app).put('/creators/1').send(updates).expect(200);

      expect(Creator.findByPk).toHaveBeenCalledWith('1');
      // The controller destructures name, creatorType, bio, birthDate, deathDate
      // and passes them all to update, even if undefined
      expect(mockCreator.update).toHaveBeenCalledWith({
        name: 'Stan Lee',
        creatorType: 'AUTHOR',
        bio: 'Updated bio',
        birthDate: undefined,
        deathDate: undefined,
      });
    });

    it('should return 400 when updating with invalid creator type', async () => {
      const mockCreator = {
        id: 1,
        name: 'Stan Lee',
        creatorType: CreatorType.AUTHOR,
        update: jest.fn(),
      };
      (Creator.findByPk as jest.Mock).mockResolvedValue(mockCreator);

      const response = await request(app)
        .put('/creators/1')
        .send({ creatorType: 'INVALID_TYPE' })
        .expect(400);

      expect(mockCreator.update).not.toHaveBeenCalled();
      expect(response.body).toHaveProperty('error', 'creatorType must be either ARTIST or AUTHOR');
    });

    it('should return 404 when updating non-existent creator', async () => {
      (Creator.findByPk as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .put('/creators/999')
        .send({ name: 'Updated' })
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Creator not found');
    });

    it('should handle errors gracefully', async () => {
      (Creator.findByPk as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app).put('/creators/1').send({ name: 'Updated' }).expect(500);

      expect(response.body).toHaveProperty('error', 'Failed to update creator');
    });
  });

  describe('DELETE /creators/:id', () => {
    it('should delete a creator successfully', async () => {
      const mockCreator = {
        id: 1,
        name: 'Stan Lee',
        destroy: jest.fn().mockResolvedValue(undefined),
      };
      (Creator.findByPk as jest.Mock).mockResolvedValue(mockCreator);

      const response = await request(app).delete('/creators/1').expect(200);

      expect(Creator.findByPk).toHaveBeenCalledWith('1');
      expect(mockCreator.destroy).toHaveBeenCalledTimes(1);
      expect(response.body).toHaveProperty('message', 'Creator deleted successfully');
    });

    it('should return 404 when deleting non-existent creator', async () => {
      (Creator.findByPk as jest.Mock).mockResolvedValue(null);

      const response = await request(app).delete('/creators/999').expect(404);

      expect(response.body).toHaveProperty('error', 'Creator not found');
    });

    it('should handle errors gracefully', async () => {
      (Creator.findByPk as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app).delete('/creators/1').expect(500);

      expect(response.body).toHaveProperty('error', 'Failed to delete creator');
    });
  });
});
