import swaggerJsdoc = require('swagger-jsdoc');
import swaggerUi = require('swagger-ui-express');
import { Express } from 'express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'WhatsApp CRM API',
      version: '1.0.0',
      description: 'API documentation for WhatsApp CRM application',
      contact: {
        name: 'API Support',
        email: 'support@whatsapp-crm.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
      {
        url: 'https://api.whatsapp-crm.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token',
        },
      },
      schemas: {
        // Error Response
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'string',
              example: 'Error message',
            },
            code: {
              type: 'string',
              example: 'ERROR_CODE',
            },
          },
        },
        // Auth Schemas
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'user@example.com',
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'password123',
            },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            data: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  example: 'user-uuid',
                },
                email: {
                  type: 'string',
                  example: 'user@example.com',
                },
                name: {
                  type: 'string',
                  example: 'John Doe',
                },
                accessToken: {
                  type: 'string',
                  example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                },
                refreshToken: {
                  type: 'string',
                  example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                },
              },
            },
          },
        },
        SignupRequest: {
          type: 'object',
          required: ['email', 'password', 'name'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'user@example.com',
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'password123',
            },
            name: {
              type: 'string',
              example: 'John Doe',
            },
            phone: {
              type: 'string',
              example: '+1234567890',
            },
          },
        },
        SignupResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            data: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  example: 'user-uuid',
                },
                email: {
                  type: 'string',
                  example: 'user@example.com',
                },
                name: {
                  type: 'string',
                  example: 'John Doe',
                },
                accessToken: {
                  type: 'string',
                  example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                },
              },
            },
          },
        },
        RefreshTokenRequest: {
          type: 'object',
          required: ['refreshToken'],
          properties: {
            refreshToken: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
          },
        },
        RefreshTokenResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            data: {
              type: 'object',
              properties: {
                accessToken: {
                  type: 'string',
                  example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                },
              },
            },
          },
        },
        // User Schemas
        UserResponse: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'user-uuid',
            },
            name: {
              type: 'string',
              example: 'John Doe',
            },
            email: {
              type: 'string',
              example: 'user@example.com',
            },
            phone: {
              type: 'string',
              example: '+1234567890',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T00:00:00.000Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T00:00:00.000Z',
            },
          },
        },
        CreateUserRequest: {
          type: 'object',
          required: ['email', 'name'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'user@example.com',
            },
            name: {
              type: 'string',
              example: 'John Doe',
            },
            phone: {
              type: 'string',
              example: '+1234567890',
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'password123',
            },
          },
        },
        UpdateUserRequest: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              example: 'John Doe',
            },
            phone: {
              type: 'string',
              example: '+1234567890',
            },
          },
        },
        // Business Schemas
        BusinessResponse: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'business-uuid',
            },
            name: {
              type: 'string',
              example: 'My Business',
            },
            slug: {
              type: 'string',
              example: 'my-business',
            },
            businessType: {
              type: 'string',
              example: 'retail',
            },
            ownerUserId: {
              type: 'string',
              example: 'user-uuid',
            },
            phone: {
              type: 'string',
              example: '+1234567890',
            },
            email: {
              type: 'string',
              example: 'business@example.com',
            },
            timezone: {
              type: 'string',
              example: 'America/New_York',
            },
            country: {
              type: 'string',
              example: 'US',
            },
            currency: {
              type: 'string',
              example: 'USD',
            },
            logoUrl: {
              type: 'string',
              example: 'https://example.com/logo.png',
            },
            status: {
              type: 'string',
              example: 'active',
            },
            numberOfMembers: {
              type: 'number',
              example: 5,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T00:00:00.000Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T00:00:00.000Z',
            },
          },
        },
        CreateBusinessRequest: {
          type: 'object',
          required: ['name'],
          properties: {
            name: {
              type: 'string',
              example: 'My Business',
            },
            businessType: {
              type: 'string',
              example: 'retail',
            },
            phone: {
              type: 'string',
              example: '+1234567890',
            },
            email: {
              type: 'string',
              example: 'business@example.com',
            },
            timezone: {
              type: 'string',
              example: 'America/New_York',
            },
            country: {
              type: 'string',
              example: 'US',
            },
            currency: {
              type: 'string',
              example: 'USD',
            },
            logoUrl: {
              type: 'string',
              example: 'https://example.com/logo.png',
            },
          },
        },
        UpdateBusinessRequest: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              example: 'My Business',
            },
            businessType: {
              type: 'string',
              example: 'retail',
            },
            phone: {
              type: 'string',
              example: '+1234567890',
            },
            email: {
              type: 'string',
              example: 'business@example.com',
            },
            timezone: {
              type: 'string',
              example: 'America/New_York',
            },
            country: {
              type: 'string',
              example: 'US',
            },
            currency: {
              type: 'string',
              example: 'USD',
            },
            logoUrl: {
              type: 'string',
              example: 'https://example.com/logo.png',
            },
            status: {
              type: 'string',
              example: 'active',
            },
          },
        },
        // Member Schemas
        MemberResponse: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'member-uuid',
            },
            businessId: {
              type: 'string',
              example: 'business-uuid',
            },
            userId: {
              type: 'string',
              example: 'user-uuid',
            },
            email: {
              type: 'string',
              example: 'member@example.com',
            },
            name: {
              type: 'string',
              example: 'Jane Doe',
            },
            phone: {
              type: 'string',
              example: '+1234567890',
            },
            role: {
              type: 'string',
              enum: ['owner', 'admin', 'member', 'viewer'],
              example: 'member',
            },
            isDefaultWorkspace: {
              type: 'boolean',
              example: false,
            },
            joinedAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T00:00:00.000Z',
            },
            status: {
              type: 'string',
              example: 'active',
            },
          },
        },
        InviteMemberRequest: {
          type: 'object',
          required: ['email', 'name', 'role'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'member@example.com',
            },
            name: {
              type: 'string',
              example: 'Jane Doe',
            },
            role: {
              type: 'string',
              enum: ['admin', 'member', 'viewer'],
              example: 'member',
            },
            phone: {
              type: 'string',
              example: '+1234567890',
            },
          },
        },
        UpdateMemberRoleRequest: {
          type: 'object',
          required: ['role'],
          properties: {
            role: {
              type: 'string',
              enum: ['admin', 'member', 'viewer'],
              example: 'admin',
            },
          },
        },
        // Success Response
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'Operation completed successfully',
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Auth',
        description: 'Authentication endpoints',
      },
      {
        name: 'Users',
        description: 'User management endpoints',
      },
      {
        name: 'Businesses',
        description: 'Business/Workspace management endpoints',
      },
      {
        name: 'Members',
        description: 'Business member management endpoints',
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express): void => {
  // Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'WhatsApp CRM API Docs',
  }));

  // Swagger JSON
  app.get('/api-docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  console.log('Swagger documentation available at /api-docs');
};

export default swaggerSpec;
