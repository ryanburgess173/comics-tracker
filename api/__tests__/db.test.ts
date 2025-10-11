import { Sequelize } from 'sequelize';
import sequelize from '../db';

describe('Database Configuration', () => {
  it('should create a Sequelize instance', () => {
    expect(sequelize).toBeDefined();
    expect(sequelize).toBeInstanceOf(Sequelize);
  });

  it('should be configured for SQLite', () => {
    expect(sequelize.getDialect()).toBe('sqlite');
  });

  it('should have database configuration', () => {
    const config = sequelize.config;
    expect(config).toBeDefined();
    expect(config.host).toBe('localhost');
  });

  it('should be able to authenticate', async () => {
    await expect(sequelize.authenticate()).resolves.not.toThrow();
  });

  it('should be able to close connection', async () => {
    // Create a new instance for this test
    const testSequelize = new Sequelize('sqlite::memory:', {
      logging: false,
    });

    await expect(testSequelize.authenticate()).resolves.not.toThrow();
    await expect(testSequelize.close()).resolves.not.toThrow();
  });
});
