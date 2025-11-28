/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/unbound-method */

import request from 'supertest';
import app from '../../app';
import UserComicXRef from '../../models/UserComicXRef';
import Comic from '../../models/Comic';
import sequelize from '../../db';

describe('Comics Controller - Error Handling', () => {
  let authToken: string;

  beforeAll(async () => {
    // Reset database
    await sequelize.sync({ force: true });

    // Create a test user and get auth token
    const User = require('../../models/User').default;
    const bcrypt = require('bcrypt');
    const passwordHash = await bcrypt.hash('test123', 10);
    await User.create({
      username: 'errortest',
      email: 'error@test.com',
      passwordHash,
    });

    const loginResponse = await request(app).post('/auth/login').send({
      email: 'error@test.com',
      password: 'test123',
    });

    authToken = loginResponse.body.token;
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('GET /comics/my-comics - Error Handling', () => {
    it('should handle database errors gracefully', async () => {
      // Mock UserComicXRef.findAll to throw an error
      const originalFindAll = UserComicXRef.findAll;
      UserComicXRef.findAll = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/comics/my-comics')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(500);

      expect(response.body).toHaveProperty('error', 'Failed to fetch user comics');

      // Restore original function
      UserComicXRef.findAll = originalFindAll;
    });
  });

  describe('POST /comics/my-comics - Error Handling', () => {
    it('should handle database errors when creating UserComicXRef', async () => {
      // Create a test comic
      const Publisher = require('../../models/Publisher').default;
      await Publisher.create({ id: 1, name: 'Test Publisher' });
      const comic = await Comic.create({
        title: 'Error Test Comic',
        publisherId: 1,
        publishedDate: new Date(),
      });

      // Mock UserComicXRef.create to throw an error
      const originalCreate = UserComicXRef.create;
      UserComicXRef.create = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/comics/my-comics')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ comicId: comic.id })
        .expect(500);

      expect(response.body).toHaveProperty('error', 'Failed to add comic to collection');

      // Restore original function
      UserComicXRef.create = originalCreate;
    });
  });

  describe('GET /comics/recentReleases - Error Handling', () => {
    it('should handle database errors gracefully', async () => {
      // Mock sequelize.query to throw an error
      const originalQuery = sequelize.query;

      sequelize.query = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/comics/recentReleases').expect(500);

      expect(response.body).toHaveProperty('error', 'Failed to fetch recent releases');

      // Restore original function
      sequelize.query = originalQuery;
    });
  });
});
