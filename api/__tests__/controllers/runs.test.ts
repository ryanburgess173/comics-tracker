import request from 'supertest';
import express from 'express';
import runsRouter from '../../controllers/runs';
import Run from '../../models/Run';

// Mock the Run model
jest.mock('../../models/Run');

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
app.use('/runs', runsRouter);

describe('Runs Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /runs', () => {
    it('should return an empty array when no runs exist', async () => {
      (Run.findAll as jest.Mock).mockResolvedValue([]);

      const response = await request(app).get('/runs').expect(200);

      expect(Run.findAll).toHaveBeenCalledTimes(1);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(0);
    });

    it('should return all runs', async () => {
      const mockRuns = [
        {
          id: 1,
          seriesName: 'Amazing Spider-Man',
          keyAuthorId: 1,
          keyArtistId: 1,
          startDate: '1963-03-01',
          universeId: 1,
        },
        {
          id: 2,
          seriesName: 'Batman',
          keyAuthorId: 2,
          keyArtistId: 2,
          startDate: '1940-04-01',
          universeId: 2,
        },
      ];
      (Run.findAll as jest.Mock).mockResolvedValue(mockRuns);

      const response = await request(app).get('/runs').expect(200);

      expect(Run.findAll).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual(mockRuns);
      expect(response.body).toHaveLength(2);
    });

    it('should handle errors gracefully', async () => {
      (Run.findAll as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/runs').expect(500);

      expect(response.body).toHaveProperty('error', 'Failed to fetch runs');
    });
  });

  describe('GET /runs/:id', () => {
    it('should return a run by ID', async () => {
      const mockRun = {
        id: 1,
        seriesName: 'Amazing Spider-Man',
        keyAuthorId: 1,
        keyArtistId: 1,
        startDate: '1963-03-01',
        universeId: 1,
      };
      (Run.findByPk as jest.Mock).mockResolvedValue(mockRun);

      const response = await request(app).get('/runs/1').expect(200);

      expect(Run.findByPk).toHaveBeenCalledWith('1');
      expect(response.body).toEqual(mockRun);
    });

    it('should return 404 when run not found', async () => {
      (Run.findByPk as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get('/runs/999').expect(404);

      expect(Run.findByPk).toHaveBeenCalledWith('999');
      expect(response.body).toHaveProperty('error', 'Run not found');
    });

    it('should handle errors gracefully', async () => {
      (Run.findByPk as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/runs/1').expect(500);

      expect(response.body).toHaveProperty('error', 'Failed to fetch run');
    });
  });

  describe('POST /runs', () => {
    it('should create a new run successfully', async () => {
      const newRun = {
        seriesName: 'X-Men',
        keyAuthorId: 1,
        keyArtistId: 1,
        startDate: '1963-09-01',
        startIssue: 1,
        description: 'First X-Men series',
        universeId: 1,
      };
      const mockCreatedRun = { id: 1, ...newRun };
      (Run.create as jest.Mock).mockResolvedValue(mockCreatedRun);

      const response = await request(app).post('/runs').send(newRun).expect(201);

      expect(Run.create).toHaveBeenCalledWith(newRun);
      expect(response.body).toEqual(mockCreatedRun);
    });

    it('should create a run with only required fields', async () => {
      const newRun = {
        seriesName: 'Fantastic Four',
      };
      const mockCreatedRun = { id: 2, ...newRun };
      (Run.create as jest.Mock).mockResolvedValue(mockCreatedRun);

      const response = await request(app).post('/runs').send(newRun).expect(201);

      expect(Run.create).toHaveBeenCalled();
      expect(response.body).toEqual(mockCreatedRun);
    });

    it('should return 400 when seriesName is missing', async () => {
      const newRun = {
        keyAuthorId: 1,
        universeId: 1,
      };

      const response = await request(app).post('/runs').send(newRun).expect(400);

      expect(Run.create).not.toHaveBeenCalled();
      expect(response.body).toHaveProperty('error', 'Series name is required');
    });

    it('should handle errors gracefully', async () => {
      const newRun = {
        seriesName: 'X-Men',
      };
      (Run.create as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app).post('/runs').send(newRun).expect(500);

      expect(response.body).toHaveProperty('error', 'Failed to create run');
    });
  });

  describe('PUT /runs/:id', () => {
    it('should update a run successfully', async () => {
      const updates = {
        seriesName: 'Amazing Spider-Man Vol. 1',
        startDate: '1963-03-01',
        endDate: '1998-11-01',
        endIssue: 441,
        description: 'Updated description',
      };
      const mockRun = {
        id: 1,
        seriesName: 'Amazing Spider-Man',
        startDate: '1963-03-01',
        update: jest.fn().mockResolvedValue({ id: 1, ...updates }),
      };
      (Run.findByPk as jest.Mock).mockResolvedValue(mockRun);

      await request(app).put('/runs/1').send(updates).expect(200);

      expect(Run.findByPk).toHaveBeenCalledWith('1');
      expect(mockRun.update).toHaveBeenCalledWith(updates);
    });

    it('should return 404 when updating non-existent run', async () => {
      (Run.findByPk as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .put('/runs/999')
        .send({ seriesName: 'Updated' })
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Run not found');
    });

    it('should handle errors gracefully', async () => {
      (Run.findByPk as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .put('/runs/1')
        .send({ seriesName: 'Updated' })
        .expect(500);

      expect(response.body).toHaveProperty('error', 'Failed to update run');
    });
  });

  describe('DELETE /runs/:id', () => {
    it('should delete a run successfully', async () => {
      const mockRun = {
        id: 1,
        seriesName: 'Amazing Spider-Man',
        destroy: jest.fn().mockResolvedValue(undefined),
      };
      (Run.findByPk as jest.Mock).mockResolvedValue(mockRun);

      const response = await request(app).delete('/runs/1').expect(200);

      expect(Run.findByPk).toHaveBeenCalledWith('1');
      expect(mockRun.destroy).toHaveBeenCalledTimes(1);
      expect(response.body).toHaveProperty('message', 'Run deleted successfully');
    });

    it('should return 404 when deleting non-existent run', async () => {
      (Run.findByPk as jest.Mock).mockResolvedValue(null);

      const response = await request(app).delete('/runs/999').expect(404);

      expect(response.body).toHaveProperty('error', 'Run not found');
    });

    it('should handle errors gracefully', async () => {
      (Run.findByPk as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app).delete('/runs/1').expect(500);

      expect(response.body).toHaveProperty('error', 'Failed to delete run');
    });
  });
});
