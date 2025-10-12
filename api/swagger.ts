import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Comics Tracker API',
      version: '1.0.0',
      description: 'API documentation for Comics Tracker application',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'access_token',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'User ID',
            },
            username: {
              type: 'string',
              description: 'Username',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
            },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'User password',
            },
          },
        },
        RegisterRequest: {
          type: 'object',
          required: ['username', 'email', 'password'],
          properties: {
            username: {
              type: 'string',
              description: 'Username',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'User password',
            },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
            },
            token: {
              type: 'string',
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
            },
          },
        },
        Permission: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Permission ID',
            },
            name: {
              type: 'string',
              description: 'Permission name (e.g., comics:create)',
            },
            resource: {
              type: 'string',
              description: 'Resource type (e.g., comics, users)',
            },
            action: {
              type: 'string',
              description: 'Action type (e.g., create, read, update, delete)',
            },
            description: {
              type: 'string',
              description: 'Permission description',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
          },
        },
        Role: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Role ID',
            },
            name: {
              type: 'string',
              description: 'Role name (e.g., Admin, Editor)',
            },
            description: {
              type: 'string',
              description: 'Role description',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
          },
        },
      },
    },
  },
  apis: ['./controllers/*.ts', './app.ts'], // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
