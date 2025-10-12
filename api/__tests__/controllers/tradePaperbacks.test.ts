import request from 'supertest';
import express from 'express';
import tradePaperbacksRouter from '../../controllers/tradePaperbacks';
import TradePaperback from '../../models/TradePaperback';

// Mock the TradePaperback model
jest.mock('../../models/TradePaperback');

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
app.use('/trade-paperbacks', tradePaperbacksRouter);

describe('TradePaperbacks Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /trade-paperbacks', () => {
    it('should return an empty array when no trade paperbacks exist', async () => {
      (TradePaperback.findAll as jest.Mock).mockResolvedValue([]);

      const response = await request(app).get('/trade-paperbacks').expect(200);

      expect(TradePaperback.findAll).toHaveBeenCalledTimes(1);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(0);
    });

    it('should return all trade paperbacks', async () => {
      const mockTradePaperbacks = [
        {
          id: 1,
          title: 'Spider-Man: Birth of Venom',
          isbn: '978-0785124566',
          publicationDate: '2007-05-01',
          pageCount: 240,
        },
        {
          id: 2,
          title: 'Batman: Year One',
          isbn: '978-1401207526',
          publicationDate: '2005-02-01',
          pageCount: 144,
        },
      ];
      (TradePaperback.findAll as jest.Mock).mockResolvedValue(mockTradePaperbacks);

      const response = await request(app).get('/trade-paperbacks').expect(200);

      expect(TradePaperback.findAll).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual(mockTradePaperbacks);
      expect(response.body).toHaveLength(2);
    });

    it('should handle errors gracefully', async () => {
      (TradePaperback.findAll as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/trade-paperbacks').expect(500);

      expect(response.body).toHaveProperty('error', 'Failed to fetch trade paperbacks');
    });
  });

  describe('GET /trade-paperbacks/:id', () => {
    it('should return a trade paperback by ID', async () => {
      const mockTradePaperback = {
        id: 1,
        title: 'Spider-Man: Birth of Venom',
        isbn: '978-0785124566',
        publicationDate: '2007-05-01',
        pageCount: 240,
      };
      (TradePaperback.findByPk as jest.Mock).mockResolvedValue(mockTradePaperback);

      const response = await request(app).get('/trade-paperbacks/1').expect(200);

      expect(TradePaperback.findByPk).toHaveBeenCalledWith('1');
      expect(response.body).toEqual(mockTradePaperback);
    });

    it('should return 404 when trade paperback not found', async () => {
      (TradePaperback.findByPk as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get('/trade-paperbacks/999').expect(404);

      expect(TradePaperback.findByPk).toHaveBeenCalledWith('999');
      expect(response.body).toHaveProperty('error', 'Trade paperback not found');
    });

    it('should handle errors gracefully', async () => {
      (TradePaperback.findByPk as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/trade-paperbacks/1').expect(500);

      expect(response.body).toHaveProperty('error', 'Failed to fetch trade paperback');
    });
  });

  describe('POST /trade-paperbacks', () => {
    it('should create a new trade paperback successfully', async () => {
      const newTradePaperback = {
        title: 'X-Men: Days of Future Past',
        isbn: '978-0785164531',
        publicationDate: '2014-01-01',
        pageCount: 176,
        description: 'Collects X-Men #141-142',
      };
      const mockCreatedTradePaperback = { id: 1, ...newTradePaperback };
      (TradePaperback.create as jest.Mock).mockResolvedValue(mockCreatedTradePaperback);

      const response = await request(app)
        .post('/trade-paperbacks')
        .send(newTradePaperback)
        .expect(201);

      expect(TradePaperback.create).toHaveBeenCalledWith(newTradePaperback);
      expect(response.body).toEqual(mockCreatedTradePaperback);
    });

    it('should create a trade paperback with only required fields', async () => {
      const newTradePaperback = { title: 'Fantastic Four: The Beginning' };
      const mockCreatedTradePaperback = { id: 2, ...newTradePaperback };
      (TradePaperback.create as jest.Mock).mockResolvedValue(mockCreatedTradePaperback);

      const response = await request(app)
        .post('/trade-paperbacks')
        .send(newTradePaperback)
        .expect(201);

      expect(TradePaperback.create).toHaveBeenCalled();
      expect(response.body).toEqual(mockCreatedTradePaperback);
    });

    it('should return 400 when title is missing', async () => {
      const newTradePaperback = {
        isbn: '978-0785164531',
        publicationDate: '2014-01-01',
        pageCount: 176,
      };

      const response = await request(app)
        .post('/trade-paperbacks')
        .send(newTradePaperback)
        .expect(400);

      expect(TradePaperback.create).not.toHaveBeenCalled();
      expect(response.body).toHaveProperty('error', 'Title is required');
    });

    it('should handle errors gracefully', async () => {
      const newTradePaperback = { title: 'X-Men: Days of Future Past' };
      (TradePaperback.create as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/trade-paperbacks')
        .send(newTradePaperback)
        .expect(500);

      expect(response.body).toHaveProperty('error', 'Failed to create trade paperback');
    });
  });

  describe('PUT /trade-paperbacks/:id', () => {
    it('should update a trade paperback successfully', async () => {
      const updates = {
        title: 'Spider-Man: Birth of Venom TPB',
        isbn: '978-0785124566',
        publicationDate: '2007-05-01',
        pageCount: 250,
        description: 'Updated description',
      };
      const mockTradePaperback = {
        id: 1,
        title: 'Spider-Man: Birth of Venom',
        isbn: '978-0785124566',
        pageCount: 240,
        update: jest.fn().mockResolvedValue({ id: 1, ...updates }),
      };
      (TradePaperback.findByPk as jest.Mock).mockResolvedValue(mockTradePaperback);

      await request(app).put('/trade-paperbacks/1').send(updates).expect(200);

      expect(TradePaperback.findByPk).toHaveBeenCalledWith('1');
      expect(mockTradePaperback.update).toHaveBeenCalledWith(updates);
    });

    it('should return 404 when updating non-existent trade paperback', async () => {
      (TradePaperback.findByPk as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .put('/trade-paperbacks/999')
        .send({ title: 'Updated' })
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Trade paperback not found');
    });

    it('should handle errors gracefully', async () => {
      (TradePaperback.findByPk as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .put('/trade-paperbacks/1')
        .send({ title: 'Updated' })
        .expect(500);

      expect(response.body).toHaveProperty('error', 'Failed to update trade paperback');
    });
  });

  describe('DELETE /trade-paperbacks/:id', () => {
    it('should delete a trade paperback successfully', async () => {
      const mockTradePaperback = {
        id: 1,
        title: 'Spider-Man: Birth of Venom',
        destroy: jest.fn().mockResolvedValue(undefined),
      };
      (TradePaperback.findByPk as jest.Mock).mockResolvedValue(mockTradePaperback);

      const response = await request(app).delete('/trade-paperbacks/1').expect(200);

      expect(TradePaperback.findByPk).toHaveBeenCalledWith('1');
      expect(mockTradePaperback.destroy).toHaveBeenCalledTimes(1);
      expect(response.body).toHaveProperty('message', 'Trade paperback deleted successfully');
    });

    it('should return 404 when deleting non-existent trade paperback', async () => {
      (TradePaperback.findByPk as jest.Mock).mockResolvedValue(null);

      const response = await request(app).delete('/trade-paperbacks/999').expect(404);

      expect(response.body).toHaveProperty('error', 'Trade paperback not found');
    });

    it('should handle errors gracefully', async () => {
      (TradePaperback.findByPk as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app).delete('/trade-paperbacks/1').expect(500);

      expect(response.body).toHaveProperty('error', 'Failed to delete trade paperback');
    });
  });
});
