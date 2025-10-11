# Comics Tracker API

The backend REST API for the Comics Tracker application, built with Node.js, Express, and TypeScript.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Build the TypeScript code
npm run build

# Start the server
npm start
```

The API will be running at `http://localhost:3000`

## 📖 API Documentation

### Interactive Documentation
Once the server is running, access the Swagger UI for interactive API testing:
- **Swagger UI:** http://localhost:3000/api-docs

### Setup Guide
For detailed Swagger configuration and setup instructions, see:
- [Swagger Setup Guide](../docs/api/swagger.md)

## 🔌 Available Endpoints

### Health Check
- `GET /` - API status and health check

### Authentication
- `POST /auth/register` - Register a new user account
- `POST /auth/login` - Login and receive JWT token
- `GET /auth/test` - Test authentication with valid token

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. **Register** a new account at `/auth/register`
2. **Login** at `/auth/login` to receive a JWT token
3. The token is:
   - Returned in the response body
   - Set as an HTTP-only cookie (`access_token`)
4. Include the token in subsequent requests via:
   - Cookie (automatic in browsers)
   - `Authorization: Bearer <token>` header

### Password Security
Passwords are securely hashed using bcrypt with 10 salt rounds. See the [Password Security Guide](../docs/security/password-security.md) for implementation details.

## 💾 Database

### Technology
- **SQLite** - Lightweight, file-based database
- **Sequelize** - Promise-based ORM for Node.js

### Models
- **User** (`models/User.ts`) - User accounts with authentication
  - Fields: id, username, email, passwordHash, createdAt, updatedAt

### Database File
The database file (`database.sqlite`) is automatically created in the `api/` directory when you first run the application.

## 🛠️ Development

### Available Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run the compiled application
- `npm run dev` - Development mode with auto-reload (if configured)
- `npm test` - Run test suite with Jest
- `npm run test:coverage` - Run tests with coverage report
- `npm run lint` - Run ESLint (delegates to root)
- `npm run lint:fix` - Auto-fix linting issues

### Project Structure

```
api/
├── controllers/        # Route controllers and business logic
│   └── auth.ts        # Authentication endpoints
├── models/            # Sequelize database models
│   └── User.ts        # User model definition
├── types/             # TypeScript type definitions
│   └── UserAttributes.ts
├── utils/             # Utility functions and helpers
│   └── logger.ts      # Winston logger configuration
├── __tests__/         # Test files (mirrors src structure)
│   ├── app.test.ts
│   ├── db.test.ts
│   └── controllers/
│       └── auth.test.ts
├── db.ts              # Database configuration and initialization
├── app.ts             # Express app configuration
├── index.ts           # Application entry point
├── swagger.ts         # Swagger/OpenAPI configuration
└── package.json       # API dependencies and scripts
```

### Testing

The API uses Jest for testing with Supertest for HTTP assertions:

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Coverage reports are in api/coverage/
```

See the [Testing Guide](../docs/development/testing.md) for more details.

### Code Quality

- **TypeScript** - All source code is fully typed
- **ESLint** - Linting with security rules enabled
- **Prettier** - Consistent code formatting
- **Security Linting** - Automated vulnerability detection

Run quality checks:
```bash
npm run lint              # Check for linting errors
npm run lint:security     # Run security-focused linting
npm run format:check      # Check code formatting
```

See the [Security Linting Guide](../docs/security/security-linting.md) for more information.

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `api/` directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Authentication
JWT_SECRET=your_secure_secret_key_here

# Database (optional, defaults to ./database.sqlite)
DB_PATH=./database.sqlite
```

### Logging

The API uses Winston for structured logging:
- **Development:** Console output with colors and timestamps
- **Production:** JSON-formatted logs to files
- **Configuration:** See `utils/logger.ts`

## 📚 Additional Documentation

- [CI/CD Pipeline](../docs/development/ci-cd.md) - Automated testing and deployment
- [GitHub Actions](../docs/development/github-actions.md) - Continuous integration workflows
- [Documentation Index](../docs/INDEX.md) - Complete documentation structure

## 🤝 Contributing

When contributing to the API:

1. Write tests for new features
2. Ensure all tests pass (`npm test`)
3. Run linting and formatting (`npm run lint`, `npm run format`)
4. Update API documentation (Swagger comments)
5. Follow existing code conventions

## 📄 License

See the [LICENSE](../LICENSE) file in the root directory.
