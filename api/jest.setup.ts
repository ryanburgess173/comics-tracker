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

// Mock the JWT authentication middleware for all tests
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */
jest.mock('./middleware/authenticateJWT', () => ({
  authenticateJWT: jest.fn((req: any, res: any, next: any) => {
    // Mock an authenticated user for testing
    req.user = {
      id: 1,
      email: 'test@example.com',
      roles: [1], // Admin role
    };
    next();
  }),
  optionalAuthenticateJWT: jest.fn((req: any, res: any, next: any) => {
    // Mock optional authentication
    req.user = {
      id: 1,
      email: 'test@example.com',
      roles: [1],
    };
    next();
  }),
}));

// Mock the permission checking middleware for all tests
jest.mock('./middleware/checkPermissions', () => ({
  requirePermissions: jest.fn(() => (req: any, res: any, next: any) => {
    // User already set by authenticateJWT mock above
    next();
  }),
  authorize: jest.fn(() => [
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    jest.fn((req: any, res: any, next: any) => next()), // authenticateJWT mock
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    jest.fn((req: any, res: any, next: any) => next()), // requirePermissions mock
  ]),
}));
/* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */

// Note: Model tests now use isolated in-memory databases via testDatabase.ts helper
// This prevents SQLITE_BUSY errors by giving each test file its own database instance
