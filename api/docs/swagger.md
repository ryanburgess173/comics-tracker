# Swagger API Documentation Setup

This project now includes Swagger/OpenAPI documentation for the Comics Tracker API.

## 🚀 Quick Start

1. **Start the API server:**

   ```bash
   npm run build
   npm start
   ```

2. **Access the Swagger UI:**
   Open your browser and navigate to:
   ```
   http://localhost:3000/api-docs
   ```

## 📚 What's Included

### Installed Packages

- `swagger-jsdoc` - Generate Swagger/OpenAPI specs from JSDoc comments
- `swagger-ui-express` - Serve Swagger UI in Express
- `@types/swagger-jsdoc` - TypeScript types for swagger-jsdoc
- `@types/swagger-ui-express` - TypeScript types for swagger-ui-express
- `jsonwebtoken` - JWT token generation (was missing)
- `@types/jsonwebtoken` - TypeScript types for jsonwebtoken

### Files Created/Modified

#### New Files:

- `swagger.ts` - Swagger configuration and schema definitions

#### Modified Files:

- `index.ts` - Added Swagger UI middleware and documentation
- `controllers/auth.ts` - Added Swagger annotations for all auth endpoints

## 📝 Documented Endpoints

### Health Check

- `GET /` - API health check

### Authentication

- `GET /auth/test` - Test auth endpoint
- `POST /auth/login` - User login (returns JWT token)
- `POST /auth/register` - User registration

## 🎨 Features

- **Interactive API Testing** - Try out endpoints directly from the Swagger UI
- **Schema Validation** - Request/response schemas defined
- **JWT Authentication** - Security schemes configured for bearer tokens and cookies
- **Auto-generated Documentation** - Uses JSDoc comments in code

## 📖 Adding Documentation to New Endpoints

To document a new endpoint, add a JSDoc comment above the route handler:

```typescript
/**
 * @swagger
 * /your-path:
 *   get:
 *     summary: Brief description
 *     description: Detailed description
 *     tags:
 *       - YourTag
 *     responses:
 *       200:
 *         description: Success response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get("/your-path", (req, res) => {
  // Your handler code
});
```

## 🔧 Configuration

The Swagger configuration is in `swagger.ts`. You can:

- Update API information (title, description, version)
- Add more servers (production, staging, etc.)
- Define new schemas for request/response bodies
- Configure security schemes

## 🔐 Security Schemes

Two authentication methods are configured:

1. **Bearer Token** - Pass JWT in Authorization header
2. **Cookie Auth** - JWT stored in `access_token` cookie (used by login endpoint)

## 📦 Environment Variables

Make sure you have these set in your `.env` file:

- `PORT` - API port (default: 3000)
- `JWT_SECRET` - Secret key for JWT signing

## 🎯 Next Steps

Consider adding:

- More detailed schema validations
- Example responses for error cases
- API versioning
- Rate limiting documentation
- Additional endpoints as you build them out

## 🔗 Resources

- [Swagger/OpenAPI Specification](https://swagger.io/specification/)
- [swagger-jsdoc Documentation](https://github.com/Surnet/swagger-jsdoc)
- [Swagger UI Express](https://github.com/scottie1984/swagger-ui-express)
