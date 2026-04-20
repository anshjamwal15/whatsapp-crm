# WhatsApp CRM API - Swagger Documentation

## 🎯 Quick Access

### Swagger UI (Interactive Documentation)
```
http://localhost:3000/api-docs
```

### OpenAPI JSON Specification
```
http://localhost:3000/api-docs.json
```

## 📖 Documentation Files

| File | Description |
|------|-------------|
| [SWAGGER_QUICK_START.md](./SWAGGER_QUICK_START.md) | Get started in 5 minutes with step-by-step guide |
| [API_REFERENCE.md](./API_REFERENCE.md) | Complete API reference with all 21 endpoints |
| [SWAGGER_DOCUMENTATION.md](./SWAGGER_DOCUMENTATION.md) | Comprehensive documentation guide |
| [SWAGGER_SETUP_COMPLETE.md](./SWAGGER_SETUP_COMPLETE.md) | Setup summary and overview |

## 🚀 Getting Started

### 1. Start the API Server
```bash
cd apps/api
npm install  # if not already done
npm run dev
```

### 2. Open Swagger UI
Navigate to `http://localhost:3000/api-docs` in your browser

### 3. Test Your First Endpoint

#### Create an Account
1. Find `POST /api/auth/signup` in the Auth section
2. Click "Try it out"
3. Enter your details:
```json
{
  "email": "test@example.com",
  "password": "password123",
  "name": "Test User"
}
```
4. Click "Execute"
5. Copy the `accessToken` from the response

#### Authorize
1. Click the "Authorize" button (🔓) at the top
2. Enter: `Bearer YOUR_ACCESS_TOKEN`
3. Click "Authorize" then "Close"

#### Create a Business
1. Find `POST /api/businesses`
2. Click "Try it out"
3. Enter:
```json
{
  "name": "My First Business",
  "currency": "USD"
}
```
4. Click "Execute"

🎉 You're now ready to explore all endpoints!

## 📊 API Statistics

- **Total Endpoints**: 21
- **Authentication Endpoints**: 4
- **User Endpoints**: 5
- **Business Endpoints**: 7
- **Member Endpoints**: 5

## 🔐 Authentication

Most endpoints require JWT authentication:

```
Authorization: Bearer <your-jwt-token>
```

Get your token by calling:
- `POST /api/auth/signup` (new users)
- `POST /api/auth/login` (existing users)

## 📋 Endpoint Categories

### 🔐 Authentication
- Signup, Login, Logout, Refresh Token

### 👤 Users
- CRUD operations for user management

### 🏢 Businesses
- Create and manage workspaces/businesses
- Get owned workspaces
- Manage business members

### 👥 Members
- Invite team members
- Manage roles (admin, member, viewer)
- List and view members

## 🎨 Features

### Interactive Testing
- Test all endpoints directly from browser
- No Postman or curl needed
- Real-time request/response

### Complete Schemas
- All request bodies documented
- All response formats shown
- Example values provided

### Security
- JWT Bearer authentication
- Protected endpoints marked
- Authorization flow documented

### Export Options
- Download OpenAPI JSON spec
- Import into Postman
- Generate client SDKs
- Copy curl commands

## 💡 Common Workflows

### User Registration Flow
```
1. POST /api/auth/signup
2. Receive access token
3. Use token for authenticated requests
```

### Business Setup Flow
```
1. POST /api/auth/login
2. POST /api/businesses (create workspace)
3. POST /api/businesses/{id}/members (invite team)
4. PATCH /api/businesses/{id}/members/{memberId}/role (set roles)
```

### Member Management Flow
```
1. GET /api/businesses/{id}/members (list team)
2. PATCH /api/businesses/{id}/members/{memberId}/role (change role)
3. DELETE /api/businesses/{id}/members/{memberId} (remove member)
```

## 🔍 Response Format

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
  "error": "Error message"
}
```

## 📱 Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Server Error |

## 🛠️ For Developers

### Adding New Endpoints

1. **Create the route handler**
2. **Add Swagger annotation**:
```typescript
/**
 * @swagger
 * /api/your-endpoint:
 *   post:
 *     summary: Brief description
 *     tags: [YourTag]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/YourSchema'
 *     responses:
 *       200:
 *         description: Success
 */
```
3. **Add schema to `swagger.ts`** if needed
4. **Test in Swagger UI**

### Updating Schemas

Edit `apps/api/src/config/swagger.ts`:
```typescript
components: {
  schemas: {
    YourNewSchema: {
      type: 'object',
      properties: {
        // your properties
      }
    }
  }
}
```

## 🌐 Production Deployment

Update server URLs in `src/config/swagger.ts`:
```typescript
servers: [
  {
    url: 'https://api.your-domain.com',
    description: 'Production server',
  },
],
```

## 📦 Dependencies

```json
{
  "swagger-jsdoc": "^6.2.8",
  "swagger-ui-express": "^5.0.0",
  "@types/swagger-jsdoc": "^6.0.4",
  "@types/swagger-ui-express": "^4.1.6"
}
```

## 🐛 Troubleshooting

### Swagger UI not loading?
- Check if server is running on port 3000
- Verify no errors in terminal
- Try accessing `/health` endpoint first

### "Unauthorized" errors?
- Click "Authorize" button
- Enter token as: `Bearer YOUR_TOKEN`
- Make sure token hasn't expired

### Can't see new endpoints?
- Restart the server
- Clear browser cache
- Check route file has Swagger annotations

## 📚 Learn More

- [OpenAPI Specification](https://swagger.io/specification/)
- [Swagger UI Documentation](https://swagger.io/tools/swagger-ui/)
- [swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc)

## 🎓 Resources

- **Quick Start**: [SWAGGER_QUICK_START.md](./SWAGGER_QUICK_START.md)
- **Full Reference**: [API_REFERENCE.md](./API_REFERENCE.md)
- **Complete Guide**: [SWAGGER_DOCUMENTATION.md](./SWAGGER_DOCUMENTATION.md)

---

**Happy API Testing! 🚀**

For questions or support, contact the development team.
