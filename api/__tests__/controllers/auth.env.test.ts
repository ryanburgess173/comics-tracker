// Mock the checkPermissions module before it's imported
/* eslint-disable @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call */
jest.mock('../../middleware/checkPermissions', () => ({
  authorize: jest.fn(() => [
    jest.fn((req, res, next) => next()),
    jest.fn((req, res, next) => next()),
  ]),
  requirePermissions: jest.fn(() => jest.fn((req, res, next) => next())),
}));
/* eslint-enable @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call */

describe('Auth Controller Environment', () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    // Save original environment
    originalEnv = { ...process.env };
    // Clear module cache
    jest.resetModules();
  });

  afterEach(() => {
    // Restore environment
    process.env = originalEnv;
    jest.resetModules();
  });

  it('should throw error when JWT_SECRET is not defined', () => {
    // Remove JWT_SECRET from environment
    delete process.env.JWT_SECRET;

    // Attempting to import should throw an error
    expect(() => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require('../../controllers/auth');
    }).toThrow('JWT_SECRET environment variable is not defined');
  });

  it('should load successfully when JWT_SECRET is defined', () => {
    // Set JWT_SECRET
    process.env.JWT_SECRET = 'test-secret-key';

    // Should load without throwing
    expect(() => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require('../../controllers/auth');
    }).not.toThrow();
  });

  it('should handle empty JWT_SECRET as missing', () => {
    // Set JWT_SECRET to empty string
    process.env.JWT_SECRET = '';

    // Should throw because empty string is falsy
    expect(() => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require('../../controllers/auth');
    }).toThrow('JWT_SECRET environment variable is not defined');
  });
});
