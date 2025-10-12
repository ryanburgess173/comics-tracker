# Comics Tracker 📚

[![Lint](https://github.com/ryanburgess173/comics-tracker/actions/workflows/lint.yml/badge.svg)](https://github.com/ryanburgess173/comics-tracker/actions/workflows/lint.yml)

A full-stack application for tracking your comic book collection with user authentication and a RESTful API.

## 🚀 Features

- **User Authentication** - JWT-based authentication with secure cookie storage
- **API Documentation** - Interactive Swagger/OpenAPI documentation
- **Database** - SQLite with Sequelize ORM
- **TypeScript** - Fully typed codebase for better developer experience
- **Logging** - Structured logging with Winston

## 📁 Project Structure

```
comics-tracker/
├── api/                    # Backend API
│   ├── controllers/        # Route controllers
│   │   └── auth.ts        # Authentication endpoints
│   ├── models/            # Database models
│   │   └── User.ts        # User model
│   ├── types/             # TypeScript type definitions
│   │   └── UserAttributes.ts
│   ├── utils/             # Utility functions
│   │   └── logger.ts      # Winston logger config
│   ├── db.ts              # Database configuration
│   ├── index.ts           # Express app entry point
│   ├── swagger.ts         # Swagger/OpenAPI config
│   └── package.json       # API dependencies
├── docs/                  # Documentation
│   ├── api/              # API documentation
│   ├── development/      # Development workflow docs
│   ├── guides/           # User guides and tutorials
│   ├── security/         # Security-related documentation
│   └── updates/          # Project updates and changelogs
├── .gitignore
├── LICENSE
└── README.md
```

## 🛠️ Tech Stack

### Backend

- **Node.js** with **Express.js** - Web framework
- **TypeScript** - Type-safe JavaScript
- **Sequelize** - ORM for database operations
- **SQLite** - Lightweight database
- **JWT** - JSON Web Tokens for authentication
- **Swagger/OpenAPI** - API documentation
- **Winston** - Logging library

## 📦 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/ryanburgess173/comics-tracker.git
   cd comics-tracker
   ```

2. **Install API dependencies**

   ```bash
   cd api
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the `api` directory:

   ```env
   PORT=3000
   JWT_SECRET=your_secret_key_here
   NODE_ENV=development
   ```

4. **Run database migrations**

   ```bash
   npm run migrate
   ```

5. **(Optional) Seed the database with sample data**

   ```bash
   npm run seed
   ```

   This creates:
   - Default admin account (`admin@comics-tracker.com` / `Admin123!`)
   - Sample publishers (Marvel, DC, Image, etc.)
   - Comic universes and creators
   - Sample comic book data

6. **Build the TypeScript code**

   ```bash
   npm run build
   ```

7. **Start the server**
   ```bash
   npm start
   ```

The API will be running at `http://localhost:3000`

## 📖 API Documentation

Once the server is running, visit the interactive API documentation:

**Swagger UI:** `http://localhost:3000/api-docs`

For detailed setup and usage information, see [API Documentation](./docs/api/swagger.md)

## 🔌 API Endpoints

### Health Check

- `GET /` - API status check

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and receive JWT token
- `GET /auth/test` - Test authentication endpoint

## 💾 Database

The application uses SQLite with Sequelize ORM. Database schema is managed through **migrations** for version control and safe schema updates.

### Database Migrations

Run migrations to set up your database schema:

```bash
cd api
npm run migrate              # Run all pending migrations
npm run migrate:status       # Check migration status
npm run migrate:undo         # Rollback last migration
```

For detailed migration guide, see [Database Migrations Documentation](./docs/database-migrations.md)

### Models

- **User** - User accounts with authentication
- **Comic** - Individual comic books
- **Run** - Comic series/runs
- **Universe** - Comic universes (Marvel, DC, etc.)
- **Publisher** - Comic publishers
- **Creator** - Authors and artists
- **Omnibus** - Collected editions
- **TradePaperback** - Trade paperback collections

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. After logging in, the token is:

- Returned in the response body
- Set as an HTTP-only cookie (`access_token`)

## � Documentation

This project maintains comprehensive documentation organized by category:

### 📖 [Documentation Index](./docs/INDEX.md)

Complete guide to the documentation structure and organization.

### 🔧 Development Documentation

- **[CI/CD Pipeline](./docs/development/ci-cd.md)** - Continuous integration and deployment workflows
- **[GitHub Actions](./docs/development/github-actions.md)** - Automated linting and testing
- **[Testing Guide](./docs/development/testing.md)** - How to write and run tests

### 🔐 Security Documentation

- **[Security Linting](./docs/security/security-linting.md)** - Security rules and vulnerability detection
- **[Password Security](./docs/security/password-security.md)** - Best practices for password handling

### 📡 API Documentation

- **[Swagger Setup](./docs/api/swagger.md)** - Interactive API documentation setup

### 📰 Updates & Changelog

- **[Updates](./docs/updates/)** - Project updates and version history

## �📝 Development

### Available Scripts

**Root directory:**

- `npm run lint` - Run ESLint on all code
- `npm run lint:fix` - Auto-fix linting issues
- `npm run lint:security` - Run security-focused linting
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm test` - Run API tests

**In the `api` directory:**

- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run the compiled application
- `npm test` - Run test suite with coverage

### Project Conventions

- TypeScript for all source code
- Build output goes to `/api/out` (git-ignored)
- Use the Winston logger for all logging
- Follow RESTful API design principles
- All code must pass ESLint and Prettier checks
- Security linting enforces best practices

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the terms in the [LICENSE](./LICENSE) file.

## 🗺️ Roadmap

- [ ] Add comic book models and endpoints
- [ ] Implement comic collection management
- [ ] Add search and filter capabilities
- [ ] Create frontend application
- [ ] Add user profile management
- [ ] Implement image upload for comic covers
- [ ] Add wishlist functionality
- [ ] Export/import collection data

## 👤 Author

**Ryan Burgess**

- GitHub: [@ryanburgess173](https://github.com/ryanburgess173)

## 🙏 Acknowledgments

- Express.js community
- Swagger/OpenAPI for excellent API documentation tools
- Sequelize ORM for simplified database operations
