# Member Management API - Quick Reference

## Base URL
```
/api/businesses/:businessId/members
```

## Endpoints

### 1. List Members
```http
GET /api/businesses/:businessId/members
Authorization: Bearer <token>
```

### 2. Get Member
```http
GET /api/businesses/:businessId/members/:memberId
Authorization: Bearer <token>
```

### 3. Invite Member (Admin Only)
```http
POST /api/businesses/:businessId/members
Authorization: Bearer <token>
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "User Name",
  "role": "member",
  "phone": "+1234567890"
}
```

**Roles**: `admin`, `member`, `viewer`

### 4. Change Role (Admin Only)
```http
PATCH /api/businesses/:businessId/members/:memberId/role
Authorization: Bearer <token>
Content-Type: application/json

{
  "role": "admin"
}
```

### 5. Disable Member (Admin Only)
```http
DELETE /api/businesses/:businessId/members/:memberId
Authorization: Bearer <token>
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "businessId": "uuid",
    "userId": "uuid",
    "role": "member",
    "status": "active",
    "joinedAt": "2024-01-15T10:30:00Z",
    "isDefaultWorkspace": false,
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "profileImageUrl": "https://..."
    }
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

## Status Codes
- `200` - Success (GET, PATCH, DELETE)
- `201` - Created (POST)
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found

## Permissions

| Endpoint | Required Role |
|----------|---------------|
| List Members | Any member |
| Get Member | Any member |
| Invite Member | Admin/Owner |
| Change Role | Admin/Owner |
| Disable Member | Admin/Owner |

## cURL Examples

### List Members
```bash
curl -X GET \
  "http://localhost:3000/api/businesses/123/members" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Invite Member
```bash
curl -X POST \
  "http://localhost:3000/api/businesses/123/members" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "name": "New User",
    "role": "member"
  }'
```

### Change Role
```bash
curl -X PATCH \
  "http://localhost:3000/api/businesses/123/members/456/role" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"role": "admin"}'
```

### Disable Member
```bash
curl -X DELETE \
  "http://localhost:3000/api/businesses/123/members/456" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Notes

- All endpoints require authentication via JWT token
- Write operations (POST, PATCH, DELETE) require admin or owner role
- Members are soft-deleted (status set to 'inactive')
- Inviting an existing disabled member will reactivate them
- New users are auto-created with temporary passwords
