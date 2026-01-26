import request from 'supertest';
import express from 'express';
import comicsRouter from '../../controllers/comics';
import Comic from '../../models/Comic';
import Creator from '../../models/Creator';

// Mock the models
jest.mock('../../models/Comic');
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
app.use('/comics', comicsRouter);

describe('Comics Search Endpoint - GET /comics/search', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Search by Author', () => {
    it('should find comics by author name (case-insensitive)', async () => {
      const mockAuthor = {
        id: 1,
        name: 'Jason Aaron',
        get: jest.fn((key: string) => (key === 'id' ? 1 : 'Jason Aaron')),
      };

      const mockComics = [
        { id: 1, title: 'Thor #1', authorId: 1 },
        { id: 2, title: 'Avengers #1', authorId: 1 },
      ];

      (Creator.findOne as jest.Mock).mockResolvedValue(mockAuthor);
      (Comic.findAll as jest.Mock).mockResolvedValue(mockComics);

      const response = await request(app)
        .get('/comics/search')
        .query({ searchType: 'Author', searchTerm: 'jason' })
        .expect(200);

      expect(Creator.findOne).toHaveBeenCalledTimes(1);
      expect(Comic.findAll).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual(mockComics);
      expect(response.body).toHaveLength(2);
    });

    it('should return 404 when author is not found', async () => {
      (Creator.findOne as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .get('/comics/search')
        .query({ searchType: 'Author', searchTerm: 'NonExistentAuthor' })
        .expect(404);

      expect(Creator.findOne).toHaveBeenCalledTimes(1);
      expect(response.body).toHaveProperty('error', 'No author with that name found.');
    });

    it('should return 404 when author exists but has no comics', async () => {
      const mockAuthor = {
        id: 1,
        name: 'New Author',
        get: jest.fn((key: string) => (key === 'id' ? 1 : 'New Author')),
      };

      (Creator.findOne as jest.Mock).mockResolvedValue(mockAuthor);
      (Comic.findAll as jest.Mock).mockResolvedValue([]);

      const response = await request(app)
        .get('/comics/search')
        .query({ searchType: 'Author', searchTerm: 'New Author' })
        .expect(404);

      expect(Creator.findOne).toHaveBeenCalledTimes(1);
      expect(Comic.findAll).toHaveBeenCalledTimes(1);
      expect(response.body).toHaveProperty('error', 'No comics by that author were found.');
    });

    it('should handle partial author name matches', async () => {
      const mockAuthor = {
        id: 1,
        name: 'Jason Aaron',
        get: jest.fn((key: string) => (key === 'id' ? 1 : 'Jason Aaron')),
      };

      const mockComics = [{ id: 1, title: 'Thor #1', authorId: 1 }];

      (Creator.findOne as jest.Mock).mockResolvedValue(mockAuthor);
      (Comic.findAll as jest.Mock).mockResolvedValue(mockComics);

      const response = await request(app)
        .get('/comics/search')
        .query({ searchType: 'Author', searchTerm: 'jason' })
        .expect(200);

      expect(response.body).toHaveLength(1);
    });
  });

  describe('Search by Title', () => {
    it('should find comics by title (case-insensitive)', async () => {
      const mockComics = [
        { id: 1, title: 'Spider-Man #1', authorId: 1 },
        { id: 2, title: 'Amazing Spider-Man #1', authorId: 1 },
      ];

      (Comic.findAll as jest.Mock).mockResolvedValue(mockComics);

      const response = await request(app)
        .get('/comics/search')
        .query({ searchType: 'Title', searchTerm: 'spider' })
        .expect(200);

      expect(Comic.findAll).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual(mockComics);
      expect(response.body).toHaveLength(2);
    });

    it('should return 404 when no comics match the title', async () => {
      (Comic.findAll as jest.Mock).mockResolvedValue([]);

      const response = await request(app)
        .get('/comics/search')
        .query({ searchType: 'Title', searchTerm: 'NonExistentTitle' })
        .expect(404);

      expect(Comic.findAll).toHaveBeenCalledTimes(1);
      expect(response.body).toHaveProperty('error', 'No comics by that title were found. ');
    });

    it('should handle partial title matches', async () => {
      const mockComics = [
        { id: 1, title: 'The Amazing Spider-Man', authorId: 1 },
        { id: 2, title: 'Spider-Man 2099', authorId: 2 },
      ];

      (Comic.findAll as jest.Mock).mockResolvedValue(mockComics);

      const response = await request(app)
        .get('/comics/search')
        .query({ searchType: 'Title', searchTerm: 'spider' })
        .expect(200);

      expect(response.body).toHaveLength(2);
    });

    it('should be case-insensitive for title search', async () => {
      const mockComics = [{ id: 1, title: 'Batman: The Dark Knight', authorId: 1 }];

      (Comic.findAll as jest.Mock).mockResolvedValue(mockComics);

      const response = await request(app)
        .get('/comics/search')
        .query({ searchType: 'Title', searchTerm: 'BATMAN' })
        .expect(200);

      expect(response.body).toHaveLength(1);
    });
  });

  describe('Invalid Search Types', () => {
    it('should return 400 for invalid search type', async () => {
      const response = await request(app)
        .get('/comics/search')
        .query({ searchType: 'InvalidType', searchTerm: 'test' })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Invalid search type. ');
    });

    it('should return 400 when searchType is missing', async () => {
      const response = await request(app)
        .get('/comics/search')
        .query({ searchTerm: 'test' })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Invalid search type. ');
    });
  });

  describe('Error Handling', () => {
    it('should handle database errors during author search', async () => {
      (Creator.findOne as jest.Mock).mockRejectedValue(new Error('Database connection failed'));

      const response = await request(app)
        .get('/comics/search')
        .query({ searchType: 'Author', searchTerm: 'test' })
        .expect(500);

      expect(response.body).toHaveProperty('error', 'Failed to search comics');
    });

    it('should handle database errors during title search', async () => {
      (Comic.findAll as jest.Mock).mockRejectedValue(new Error('Database connection failed'));

      const response = await request(app)
        .get('/comics/search')
        .query({ searchType: 'Title', searchTerm: 'test' })
        .expect(500);

      expect(response.body).toHaveProperty('error', 'Failed to search comics');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty searchTerm', async () => {
      const mockComics = [
        { id: 1, title: 'Comic 1', authorId: 1 },
        { id: 2, title: 'Comic 2', authorId: 1 },
      ];

      (Comic.findAll as jest.Mock).mockResolvedValue(mockComics);

      await request(app)
        .get('/comics/search')
        .query({ searchType: 'Title', searchTerm: '' })
        .expect(200);

      expect(Comic.findAll).toHaveBeenCalledTimes(1);
    });

    it('should handle special characters in search term', async () => {
      const mockComics = [{ id: 1, title: "Spider-Man: It's Complicated", authorId: 1 }];

      (Comic.findAll as jest.Mock).mockResolvedValue(mockComics);

      await request(app)
        .get('/comics/search')
        .query({ searchType: 'Title', searchTerm: "it's" })
        .expect(200);

      expect(Comic.findAll).toHaveBeenCalledTimes(1);
    });

    it('should handle very long search terms', async () => {
      const longSearchTerm = 'a'.repeat(1000);
      (Comic.findAll as jest.Mock).mockResolvedValue([]);

      await request(app)
        .get('/comics/search')
        .query({ searchType: 'Title', searchTerm: longSearchTerm })
        .expect(404);

      expect(Comic.findAll).toHaveBeenCalledTimes(1);
    });
  });
});
