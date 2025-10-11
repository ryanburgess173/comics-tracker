# Comics Tracker 📚

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
│   ├── docs/              # API documentation
│   │   └── swagger.md     # Swagger setup guide
│   ├── db.ts              # Database configuration
│   ├── index.ts           # Express app entry point
│   ├── swagger.ts         # Swagger/OpenAPI config
│   └── package.json       # API dependencies
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

4. **Build the TypeScript code**
   ```bash
   npm run build
   ```

5. **Start the server**
   ```bash
   npm start
   ```

The API will be running at `http://localhost:3000`

## 📖 API Documentation

Once the server is running, visit the interactive API documentation:

**Swagger UI:** `http://localhost:3000/api-docs`

For detailed setup and usage information, see [API Documentation](./api/docs/swagger.md)

## 🔌 API Endpoints

### Health Check
- `GET /` - API status check

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and receive JWT token
- `GET /auth/test` - Test authentication endpoint

## 💾 Database

The application uses SQLite with Sequelize ORM. The database file (`database.sqlite`) is automatically created when you first run the application.

### Models

- **User** - User accounts with authentication

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. After logging in, the token is:
- Returned in the response body
- Set as an HTTP-only cookie (`access_token`)

## 📝 Development

### Available Scripts

In the `api` directory:

- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run the compiled application
- `npm test` - Run tests (to be implemented)

### Project Conventions

- TypeScript for all source code
- Build output goes to `/api/out` (git-ignored)
- Use the Winston logger for all logging
- Follow RESTful API design principles

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