// Jest setup file - runs before all tests

// Suppress console logs during tests (optional)
// global.console = {
//   ...console,
//   log: jest.fn(),
//   debug: jest.fn(),
//   info: jest.fn(),
//   warn: jest.fn(),
// };

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key-for-testing-only';
process.env.PORT = '3001';

// Note: Model tests now use isolated in-memory databases via testDatabase.ts helper
// This prevents SQLITE_BUSY errors by giving each test file its own database instance
