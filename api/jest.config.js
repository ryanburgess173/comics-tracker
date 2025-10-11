/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  testMatch: [
    '**/__tests__/**/*.ts',
    '**/?(*.)+(spec|test).ts'
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/__tests__/helpers/',
    '/__tests__/__mocks__/',
    '/__tests__/setup.ts'
  ],
  // Run tests serially within each file to avoid SQLite locking issues
  maxConcurrency: 1,
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    '**/*.ts',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/out/**',
    '!**/coverage/**',
    '!jest.config.js',
    '!index.ts', // Exclude server entry point from coverage
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  verbose: true,
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  // Run tests sequentially to avoid SQLite locking issues
  maxWorkers: 1,
};
