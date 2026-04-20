# Swagger API Documentation

This document provides information about the Swagger/OpenAPI documentation for the WhatsApp CRM API.

## Overview

The API documentation is automatically generated using Swagger/OpenAPI 3.0 specification. It provides an interactive interface to explore and test all available API endpoints.

## Accessing the Documentation

Once the server is running, you can access the Swagger documentation at:

- **Swagger UI**: `http://localhost:3000/api-docs`
- **OpenAPI JSON**: `http://localhost:3000/api-docs.json`

## Features

### Interactive API Testing
- Test API endpoints directly from the browser
- View request/response schemas
- See example payloads
- Test authentication with JWT tokens

### Authentication

Most endpoints require authentication. To test authenticated endpoints:

1. First, call the `/api/auth/login` or `/api/auth/signup` endpoint
2. Copy the `accessToken` from the response
3. Click the "Authorize" button at the top of the Swagger UI
4. Enter the token in the format: `Bearer <your-access-token>`
5. Click "Authorize" and then "Close"
6. Now you can test authenticated endpoints

## API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user (requires auth)
- `POST /api/auth/refresh` - Refresh access token

### Users (`/api/users`)
- `GET /api/users` - Get all users (requires auth)
- `GET /api/users/{id}` - Get user by ID (requires auth)
- `POST /api/users` - Create a new user (requires auth)
- `PUT /api/users/{id}` - Update user (requires auth)
- `DELETE /api/users/{id}` - Delete user (requires auth)

### Businesses (`/api/businesses`)
- `POST /api/businesses` - Create a new business (requires auth)
- `GET /api/businesses` - Get all businesses for current user (requires auth)
- `GET /api/businesses/owner/workspaces` - Get workspaces where user is owner (requires auth)
- `GET /api/businesses/{businessId}` - Get a specific business (requires auth + tenant)
- `PUT /api/businesses/{businessId}` - Update a business (requires auth + tenant + admin)
- `DELETE /api/businesses/{businessId}` - Delete a business (requires auth + tenant + admin)
- `GET /api/businesses/{businessId}/members` - Get business members (requires auth + tenant)

### Members (`/api/businesses/{businessId}/members`)
- `GET /api/businesses/{businessId}/members` - List all members (requires auth + tenant)
- `GET /api/businesses/{businessId}/members/{memberId}` - Get a specific member (requires auth + tenant)
- `POST /api/businesses/{businessId}/members` - Invite a new member (requires auth + tenant + admin)
- `PATCH /api/businesses/{businessId}/members/{memberId}/role` - Change member role (requires auth + tenant + admin)
- `DELETE /api/businesses/{businessId}/members/{memberId}` - Disable member (requires auth + tenant + admin)

## Request/Response Schemas

All request and response schemas are documented in the Swagger UI. Key schemas include:

### Authentication
- `LoginRequest` - Email and password
- `LoginResponse` - User info with access token
- `SignupRequest` - User registration data
- `SignupResponse` - Created user with access token
- `RefreshTokenRequest` - Refresh token
- `RefreshTokenResponse` - New access token

### Users
- `UserResponse` - User information
- `CreateUserRequest` - Create user payload
- `UpdateUserRequest` - Update user payload

### Businesses
- `BusinessResponse` - Business/workspace information
- `CreateBusinessRequest` - Create business payload
- `UpdateBusinessRequest` - Update business payload

### Members
- `MemberResponse` - Member information
- `InviteMemberRequest` - Invite member payload
- `UpdateMemberRoleRequest` - Update member role payload

### Common
- `ErrorResponse` - Standard error response
- `SuccessResponse` - Standard success response

## Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": { /* response data */ }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## Security

The API uses JWT (JSON Web Tokens) for authentication:

- **Type**: HTTP Bearer Authentication
- **Format**: `Bearer <token>`
- **Header**: `Authorization: Bearer <your-jwt-token>`

## Development

### Adding New Endpoints

When adding new endpoints, follow these steps:

1. **Add the route handler** in the appropriate route file
2. **Add Swagger annotations** using JSDoc comments:

```typescript
/**
 * @swagger
 * /api/your-endpoint:
 *   post:
 *     summary: Brief description
 *     description: Detailed description
 *     tags: [YourTag]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/YourRequestSchema'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/YourResponseSchema'
 */
router.post('/your-endpoint', async (req, res) => {
  // handler code
});
```

3. **Add schemas** to `src/config/swagger.ts` if needed
4. **Test** the endpoint in Swagger UI

### Updating Schemas

To add or modify schemas, edit the `components.schemas` section in `src/config/swagger.ts`.

## Configuration

Swagger configuration is located in `src/config/swagger.ts`. You can customize:

- API information (title, version, description)
- Server URLs
- Security schemes
- Component schemas
- Tags and grouping

## Production Deployment

For production:

1. Update the server URL in `src/config/swagger.ts`:
```typescript
servers: [
  {
    url: 'https://your-production-domain.com',
    description: 'Production server',
  },
],
```

2. Consider restricting access to `/api-docs` in production if needed
3. The OpenAPI JSON spec is available at `/api-docs.json` for external tools

## Tools and Libraries

- **swagger-jsdoc**: Generates OpenAPI spec from JSDoc comments
- **swagger-ui-express**: Serves Swagger UI interface
- **OpenAPI 3.0**: API specification standard

## Additional Resources

- [OpenAPI Specification](https://swagger.io/specification/)
- [Swagger UI Documentation](https://swagger.io/tools/swagger-ui/)
- [swagger-jsdoc Documentation](https://github.com/Surnet/swagger-jsdoc)

## Support

For issues or questions about the API documentation, please contact the development team.
