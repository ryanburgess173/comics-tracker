# Testing Guide

Complete guide to testing in the Comics Tracker API.

## 📊 Current Status

- **Total Tests**: 40 passing ✅
- **Test Coverage**: 87.8%
- **Test Suites**: 5
- **Average Run Time**: ~7 seconds

## 🧪 Testing Stack

- **Jest** - Testing framework
- **ts-jest** - TypeScript support for Jest
- **Supertest** - HTTP assertions for API endpoint testing
- **SQLite in-memory** - Isolated database for testing

## 🚀 Quick Start

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (auto-rerun on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests optimized for CI
npm run test:ci
```

### Viewing Coverage Reports

```bash
# Generate and open coverage report
npm run test:coverage
open coverage/lcov-report/index.html      # macOS
start coverage/lcov-report/index.html     # Windows
```

## 📁 Test Structure

```
api/
├── __tests__/
│   ├── app.test.ts           # Application & route tests (7 tests)
│   ├── db.test.ts            # Database configuration (5 tests)
│   ├── controllers/
│   │   └── auth.test.ts      # Auth endpoints (9 tests)
│   ├── models/
│   │   └── User.test.ts      # User model (8 tests)
│   └── utils/
│       └── logger.test.ts    # Logger utility (11 tests)
├── jest.config.js            # Jest configuration
└── jest.setup.ts             # Global test setup
```

## 📊 Coverage by Module

```
File             | % Stmts | % Branch | % Funcs | % Lines
-----------------|---------|----------|---------|--------
All files        |   87.80 |    66.66 |   70.00 |   87.65
 controllers     |   97.67 |    87.50 |  100.00 |   97.61  ⭐
 models          |  100.00 |   100.00 |  100.00 |  100.00  ⭐
 utils           |  100.00 |   100.00 |  100.00 |  100.00  ⭐
 app.ts          |   84.21 |    50.00 |   33.33 |   84.21
 db.ts           |  100.00 |   100.00 |  100.00 |  100.00  ⭐
 swagger.ts      |  100.00 |   100.00 |  100.00 |  100.00  ⭐
```

## 🎯 What's Tested

### User Model Tests (8 tests)

- ✅ User creation with valid data
- ✅ Duplicate username prevention
- ✅ Duplicate email prevention
- ✅ Required field validation
- ✅ Find user by email
- ✅ Return null for non-existent users
- ✅ Update user information
- ✅ Delete user

### Auth Controller Tests (9 tests)

- ✅ Test endpoint responds correctly
- ✅ Register new user successfully
- ✅ Prevent duplicate email registration
- ✅ Handle missing registration fields
- ✅ Login with correct credentials
- ✅ Reject incorrect password
- ✅ Reject non-existent email
- ✅ Handle missing login credentials
- ✅ Return valid JWT token format

### Application Tests (7 tests)

- ✅ Root endpoint returns status
- ✅ JSON response format
- ✅ Swagger UI served correctly
- ✅ 404 handling for non-existent routes
- ✅ JSON body parsing middleware
- ✅ Route mounting verification

### Database Tests (5 tests)

- ✅ Sequelize instance creation
- ✅ SQLite dialect configuration
- ✅ Database authentication
- ✅ Connection management

### Logger Tests (11 tests)

- ✅ All logging methods available (info, error, warn, debug)
- ✅ Message logging functionality
- ✅ Formatted message support
- ✅ Multiple argument handling
- ✅ Error object logging

## ✍️ Writing Tests

### Model Test Example

```typescript
import { Sequelize } from 'sequelize';
import User from '../../models/User';

describe('User Model', () => {
  let sequelize: Sequelize;

  beforeAll(async () => {
    // Setup in-memory database
    sequelize = new Sequelize('sqlite::memory:', { logging: false });
    User.init(User.getAttributes(), { sequelize, modelName: 'User' });
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  beforeEach(async () => {
    // Clear data before each test
    await User.destroy({ where: {}, truncate: true });
  });

  it('should create a user with valid data', async () => {
    const user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      passwordHash: 'hash123',
    });

    expect(user.username).toBe('testuser');
    expect(user.id).toBeDefined();
  });
});
```

### Controller/API Test Example

```typescript
import request from 'supertest';
import app from '../app';

describe('Auth Controller', () => {
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      })
      .expect(201);

    expect(response.body.message).toBe('User registered successfully.');
  });

  it('should handle invalid credentials', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'wrong@example.com', password: 'wrong' })
      .expect(401);

    expect(response.body).toHaveProperty('message');
  });
});
```

### Testing Utility Functions

```typescript
import logger from '../../utils/logger';

describe('Logger Utility', () => {
  let infoSpy: jest.SpyInstance;

  beforeEach(() => {
    infoSpy = jest.spyOn(logger, 'info').mockImplementation();
  });

  afterEach(() => {
    infoSpy.mockRestore();
  });

  it('should log info messages', () => {
    logger.info('Test message');
    expect(infoSpy).toHaveBeenCalledWith('Test message');
  });
});
```

## 🛠️ Configuration

### jest.config.js

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  collectCoverageFrom: [
    '**/*.ts',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/out/**',
    '!**/coverage/**',
    '!jest.config.js',
  ],
  coverageDirectory: 'coverage',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};
```

### jest.setup.ts

```typescript
// Test environment configuration
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key-for-testing-only';
process.env.PORT = '3001';
```

## 🎭 Testing Best Practices

### 1. Test Isolation

Each test should be independent and not rely on others.

```typescript
beforeEach(async () => {
  // Reset state before each test
  await User.destroy({ where: {}, truncate: true });
});
```

### 2. Descriptive Test Names

Use clear, descriptive names that explain what is being tested.

```typescript
// ❌ Bad
it('test 1', () => {});

// ✅ Good
it('should create user with valid email and username', () => {});
it('should reject registration with duplicate email', () => {});
```

### 3. AAA Pattern (Arrange, Act, Assert)

```typescript
it('should update user information', async () => {
  // Arrange - Setup
  const user = await User.create({
    username: 'oldname',
    email: 'test@example.com',
  });

  // Act - Perform action
  await user.update({ username: 'newname' });

  // Assert - Verify result
  expect(user.username).toBe('newname');
});
```

### 4. Test Edge Cases

- Happy path (successful scenarios)
- Error conditions
- Boundary values
- Invalid inputs
- Null/undefined values
- Empty strings/arrays

### 5. Use In-Memory Databases

```typescript
// Fast, isolated testing
const sequelize = new Sequelize('sqlite::memory:', {
  logging: false,
});
```

## 🔍 Common Patterns

### Testing Async Functions

```typescript
it('should handle async operations', async () => {
  const result = await asyncFunction();
  expect(result).toBeDefined();
});
```

### Testing Promise Rejections

```typescript
it('should throw error for invalid data', async () => {
  await expect(User.create({})).rejects.toThrow();
});
```

### Testing HTTP Status Codes

```typescript
it('should return 404 for missing resource', async () => {
  await request(app).get('/nonexistent').expect(404);
});
```

### Testing Response Body

```typescript
it('should return user data', async () => {
  const res = await request(app).get('/auth/test').expect(200);

  expect(res.body).toHaveProperty('message');
  expect(res.body.message).toBe('Auth route works!');
});
```

### Mocking Functions

```typescript
const mockFn = jest.spyOn(logger, 'info').mockImplementation();

it('should call logger', () => {
  someFunction();
  expect(mockFn).toHaveBeenCalled();
});

afterEach(() => {
  mockFn.mockRestore();
});
```

## 📈 Coverage Goals & Requirements

### Minimum Thresholds (Enforced in CI)

| Metric     | Minimum | Current | Status |
| ---------- | ------- | ------- | ------ |
| Statements | 70%     | 87.8%   | ✅     |
| Branches   | 65%     | 66.66%  | ✅     |
| Functions  | 70%     | 70%     | ✅     |
| Lines      | 70%     | 87.65%  | ✅     |

### How to Check Coverage

```bash
# Generate detailed coverage report
npm run test:coverage

# View specific file coverage
npm run test:coverage -- --collectCoverageFrom=controllers/auth.ts
```

## 🚨 Troubleshooting

### Tests Running Slowly

**Solutions:**

- Use in-memory SQLite: `sqlite::memory:`
- Mock external services
- Run specific test: `npm test -- auth.test.ts`
- Disable logging: `logging: false` in Sequelize

### Database Conflicts

```typescript
// Ensure cleanup after each test
afterEach(async () => {
  await User.destroy({ where: {}, truncate: true });
});

// Force sync in test setup
await sequelize.sync({ force: true });
```

### TypeScript Errors in Tests

```typescript
// For intentionally testing invalid types
// @ts-expect-error - Testing validation
await User.create({ invalidField: 'value' });
```

### Port Already in Use

```typescript
// Use different port for tests (jest.setup.ts)
process.env.PORT = '3001';
```

### Module Not Found Errors

```bash
# Clear Jest cache
npm test -- --clearCache

# Reinstall dependencies
rm -rf node_modules && npm install
```

## 🔄 CI/CD Integration

Tests run automatically via GitHub Actions:

- ✅ On every push to `develop` branch
- ✅ On every PR to `main` branch
- ✅ Multiple Node.js versions (18.x, 20.x)
- ✅ Coverage reporting to Codecov
- ✅ Minimum coverage enforcement

See [CI/CD Documentation](./ci-cd.md) for complete details.

### Running Tests Like CI

```bash
# Simulate CI environment locally
npm run test:ci
```

## 📝 Adding Tests for New Features

### Step-by-Step Process

1. **Create test file** in appropriate directory:

   ```
   __tests__/controllers/newFeature.test.ts
   ```

2. **Write tests first** (TDD approach):

   ```typescript
   describe('New Feature', () => {
     it('should do something', async () => {
       // Write test before implementation
     });
   });
   ```

3. **Run in watch mode**:

   ```bash
   npm run test:watch
   ```

4. **Implement the feature** until tests pass

5. **Check coverage**:

   ```bash
   npm run test:coverage
   ```

6. **Ensure ≥70% coverage** on new code

### Example: New Endpoint Test

```typescript
// __tests__/controllers/comics.test.ts
import request from 'supertest';
import app from '../app';

describe('Comics Controller', () => {
  describe('GET /comics', () => {
    it('should return list of comics', async () => {
      const res = await request(app).get('/comics').expect(200).expect('Content-Type', /json/);

      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('POST /comics', () => {
    it('should create a new comic', async () => {
      const comic = {
        title: 'Amazing Spider-Man',
        issue: 1,
        year: 1963,
      };

      const res = await request(app).post('/comics').send(comic).expect(201);

      expect(res.body).toHaveProperty('id');
      expect(res.body.title).toBe('Amazing Spider-Man');
    });
  });
});
```

## 🎓 Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started) - Official Jest docs
- [Supertest GitHub](https://github.com/ladjs/supertest) - HTTP testing library
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices) - Comprehensive guide
- [ts-jest Docs](https://kulshekhar.github.io/ts-jest/) - TypeScript + Jest integration

## 🎯 Next Steps

Future testing improvements to consider:

- [ ] Add integration tests for full user flows
- [ ] Implement E2E tests using Playwright/Cypress
- [ ] Add performance/load testing with Artillery or k6
- [ ] Set up mutation testing with Stryker
- [ ] Add visual regression testing (if applicable)
- [ ] Configure test parallelization for faster runs
- [ ] Add contract testing for API consumers

---

**Questions?** Check the [CI/CD guide](./ci-cd.md) or review test examples in the `__tests__/` directory!
