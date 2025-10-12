import request from 'supertest';
import express from 'express';
import comicsRouter from '../../controllers/comics';
import Comic from '../../models/Comic';

// Mock the Comic model
jest.mock('../../models/Comic');

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
app.use('/comics', comicsRouter);

describe('Comics Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /comics', () => {
    it('should return an empty array when no comics exist', async () => {
      (Comic.findAll as jest.Mock).mockResolvedValue([]);

      const response = await request(app).get('/comics').expect(200);

      expect(Comic.findAll).toHaveBeenCalledTimes(1);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(0);
    });

    it('should return all comics', async () => {
      const mockComics = [
        { id: 1, title: 'Spider-Man #1', author: 'Stan Lee', pages: 32 },
        { id: 2, title: 'Batman #1', author: 'Bob Kane', pages: 36 },
      ];
      (Comic.findAll as jest.Mock).mockResolvedValue(mockComics);

      const response = await request(app).get('/comics').expect(200);

      expect(Comic.findAll).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual(mockComics);
      expect(response.body).toHaveLength(2);
    });

    it('should handle errors gracefully', async () => {
      (Comic.findAll as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/comics').expect(500);

      expect(response.body).toHaveProperty('error', 'Failed to fetch comics');
    });
  });

  describe('GET /comics/:id', () => {
    it('should return a comic by ID', async () => {
      const mockComic = {
        id: 1,
        title: 'Spider-Man #1',
        author: 'Stan Lee',
        pages: 32,
      };
      (Comic.findByPk as jest.Mock).mockResolvedValue(mockComic);

      const response = await request(app).get('/comics/1').expect(200);

      expect(Comic.findByPk).toHaveBeenCalledWith('1');
      expect(response.body).toEqual(mockComic);
    });

    it('should return 404 when comic not found', async () => {
      (Comic.findByPk as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get('/comics/999').expect(404);

      expect(Comic.findByPk).toHaveBeenCalledWith('999');
      expect(response.body).toHaveProperty('error', 'Comic not found');
    });

    it('should handle errors gracefully', async () => {
      (Comic.findByPk as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/comics/1').expect(500);

      expect(response.body).toHaveProperty('error', 'Failed to fetch comic');
    });
  });

  describe('POST /comics', () => {
    it('should create a new comic successfully', async () => {
      const newComic = {
        title: 'Spider-Man #1',
        authorId: 1,
        description: 'First appearance of Spider-Man',
        pages: 32,
      };
      const mockCreatedComic = { id: 1, ...newComic };
      (Comic.create as jest.Mock).mockResolvedValue(mockCreatedComic);

      const response = await request(app).post('/comics').send(newComic).expect(201);

      expect(Comic.create).toHaveBeenCalledWith(newComic);
      expect(response.body).toEqual(mockCreatedComic);
    });

    it('should create a comic with only required fields', async () => {
      const newComic = { title: 'Batman #1', authorId: 2 };
      const mockCreatedComic = { id: 2, ...newComic };
      (Comic.create as jest.Mock).mockResolvedValue(mockCreatedComic);

      const response = await request(app).post('/comics').send(newComic).expect(201);

      expect(Comic.create).toHaveBeenCalled();
      expect(response.body).toEqual(mockCreatedComic);
    });

    it('should return 400 when title is missing', async () => {
      const newComic = { authorId: 1 };

      const response = await request(app).post('/comics').send(newComic).expect(400);

      expect(Comic.create).not.toHaveBeenCalled();
      expect(response.body).toHaveProperty('error', 'Title is required');
    });

    it('should handle errors gracefully', async () => {
      const newComic = { title: 'Spider-Man #1', authorId: 1 };
      (Comic.create as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app).post('/comics').send(newComic).expect(500);

      expect(response.body).toHaveProperty('error', 'Failed to create comic');
    });
  });

  describe('PUT /comics/:id', () => {
    it('should update a comic successfully', async () => {
      const updates = {
        title: 'Amazing Spider-Man #1',
        authorId: 1,
        pages: 40,
      };
      const mockComic = {
        id: 1,
        title: 'Spider-Man #1',
        authorId: 1,
        pages: 32,
        update: jest.fn().mockResolvedValue({ id: 1, ...updates }),
      };
      (Comic.findByPk as jest.Mock).mockResolvedValue(mockComic);

      await request(app).put('/comics/1').send(updates).expect(200);

      expect(Comic.findByPk).toHaveBeenCalledWith('1');
      expect(mockComic.update).toHaveBeenCalledWith(updates);
    });

    it('should return 404 when updating non-existent comic', async () => {
      (Comic.findByPk as jest.Mock).mockResolvedValue(null);

      const response = await request(app).put('/comics/999').send({ title: 'Updated' }).expect(404);

      expect(response.body).toHaveProperty('error', 'Comic not found');
    });

    it('should handle errors gracefully', async () => {
      (Comic.findByPk as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app).put('/comics/1').send({ title: 'Updated' }).expect(500);

      expect(response.body).toHaveProperty('error', 'Failed to update comic');
    });
  });

  describe('DELETE /comics/:id', () => {
    it('should delete a comic successfully', async () => {
      const mockComic = {
        id: 1,
        title: 'Spider-Man #1',
        destroy: jest.fn().mockResolvedValue(undefined),
      };
      (Comic.findByPk as jest.Mock).mockResolvedValue(mockComic);

      const response = await request(app).delete('/comics/1').expect(200);

      expect(Comic.findByPk).toHaveBeenCalledWith('1');
      expect(mockComic.destroy).toHaveBeenCalledTimes(1);
      expect(response.body).toHaveProperty('message', 'Comic deleted successfully');
    });

    it('should return 404 when deleting non-existent comic', async () => {
      (Comic.findByPk as jest.Mock).mockResolvedValue(null);

      const response = await request(app).delete('/comics/999').expect(404);

      expect(response.body).toHaveProperty('error', 'Comic not found');
    });

    it('should handle errors gracefully', async () => {
      (Comic.findByPk as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app).delete('/comics/1').expect(500);

      expect(response.body).toHaveProperty('error', 'Failed to delete comic');
    });
  });
});
