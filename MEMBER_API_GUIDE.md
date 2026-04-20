# Member Management API Guide

This guide covers the member management APIs for managing team members within a business workspace.

## Overview

The Member Management API allows you to:
- List all members in a business
- Invite/create new members
- Change member roles
- Disable members

All member endpoints require authentication and tenant access. Admin or owner roles are required for write operations (enforced by `adminMiddleware`).

## Base URL

```
/api/businesses/:businessId/members
```

## Authentication & Authorization

All endpoints require:
1. **Authentication**: Valid JWT token in `Authorization` header (via `authMiddleware`)
2. **Tenant Access**: User must be a member of the business (via `tenantMiddleware`)
3. **Admin Role**: Write operations require `admin` or `owner` role (via `adminMiddleware`)

### Middleware Chain

Write operations (POST, PATCH, DELETE) use this middleware chain:
```
authMiddleware → tenantMiddleware → adminMiddleware → route handler
```

Read operations (GET) use:
```
authMiddleware → tenantMiddleware → route handler
```

## Member Roles

- **admin**: Full access to manage business and members
- **member**: Standard access to business features
- **viewer**: Read-only access

## Endpoints

### 1. List Members

Get all members of a business.

**Endpoint**: `GET /api/businesses/:businessId/members`

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "businessId": "uuid",
      "userId": "uuid",
      "role": "admin",
      "isDefaultWorkspace": true,
      "joinedAt": "2024-01-15T10:30:00Z",
      "status": "active",
      "user": {
        "id": "uuid",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+1234567890",
        "profileImageUrl": "https://..."
      }
    }
  ]
}
```

### 2. Get Member by ID

Get details of a specific member.

**Endpoint**: `GET /api/businesses/:businessId/members/:memberId`

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "businessId": "uuid",
    "userId": "uuid",
    "role": "member",
    "isDefaultWorkspace": false,
    "joinedAt": "2024-01-15T10:30:00Z",
    "status": "active",
    "user": {
      "id": "uuid",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "phone": "+1234567890",
      "profileImageUrl": "https://..."
    }
  }
}
```

**Error Response** (404 Not Found):
```json
{
  "success": false,
  "error": "Member not found"
}
```

### 3. Invite/Create Member

Invite a new member to the business. If the user doesn't exist, they will be created automatically.

**Endpoint**: `POST /api/businesses/:businessId/members`

**Headers**:
```
Authorization: Bearer <token>
```

**Required Role**: `admin` or `owner`

**Request Body**:
```json
{
  "email": "newmember@example.com",
  "name": "New Member",
  "role": "member",
  "phone": "+1234567890"
}
```

**Fields**:
- `email` (required): Email address of the member
- `name` (required): Full name of the member
- `role` (required): One of `admin`, `member`, or `viewer`
- `phone` (optional): Phone number

**Response** (201 Created):
```json
{
  "success": true,
  "message": "Member invited successfully",
  "data": {
    "id": "uuid",
    "businessId": "uuid",
    "userId": "uuid",
    "role": "member",
    "isDefaultWorkspace": false,
    "joinedAt": "2024-01-15T10:30:00Z",
    "status": "active",
    "user": {
      "id": "uuid",
      "name": "New Member",
      "email": "newmember@example.com",
      "phone": "+1234567890"
    }
  }
}
```

**Error Responses**:

400 Bad Request - Missing fields:
```json
{
  "success": false,
  "error": "Email, name, and role are required"
}
```

400 Bad Request - Invalid role:
```json
{
  "success": false,
  "error": "Invalid role. Must be one of: admin, member, viewer"
}
```

400 Bad Request - Already a member:
```json
{
  "success": false,
  "error": "User is already a member of this business"
}
```

403 Forbidden - Insufficient permissions:
```json
{
  "success": false,
  "error": "Access denied. Admin or owner role required."
}
```

### 4. Change Member Role

Update a member's role in the business.

**Endpoint**: `PATCH /api/businesses/:businessId/members/:memberId/role`

**Headers**:
```
Authorization: Bearer <token>
```

**Required Role**: `admin` or `owner`

**Request Body**:
```json
{
  "role": "admin"
}
```

**Fields**:
- `role` (required): New role - one of `admin`, `member`, or `viewer`

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Member role updated successfully",
  "data": {
    "id": "uuid",
    "businessId": "uuid",
    "userId": "uuid",
    "role": "admin",
    "isDefaultWorkspace": false,
    "joinedAt": "2024-01-15T10:30:00Z",
    "status": "active",
    "user": {
      "id": "uuid",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "phone": "+1234567890"
    }
  }
}
```

**Error Responses**:

400 Bad Request - Missing role:
```json
{
  "success": false,
  "error": "Role is required"
}
```

400 Bad Request - Invalid role:
```json
{
  "success": false,
  "error": "Invalid role. Must be one of: admin, member, viewer"
}
```

400 Bad Request - Member not found:
```json
{
  "success": false,
  "error": "Failed to change member role: Member not found"
}
```

403 Forbidden - Insufficient permissions:
```json
{
  "success": false,
  "error": "Access denied. Admin or owner role required."
}
```

### 5. Disable Member

Disable a member (soft delete). The member will no longer have access to the business.

**Endpoint**: `DELETE /api/businesses/:businessId/members/:memberId`

**Headers**:
```
Authorization: Bearer <token>
```

**Required Role**: `admin` or `owner`

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Member disabled successfully"
}
```

**Error Responses**:

400 Bad Request - Member not found:
```json
{
  "success": false,
  "error": "Failed to disable member: Member not found"
}
```

403 Forbidden - Insufficient permissions:
```json
{
  "success": false,
  "error": "Access denied. Admin or owner role required."
}
```

## Usage Examples

### Example 1: List All Members

```bash
curl -X GET \
  'http://localhost:3000/api/businesses/123e4567-e89b-12d3-a456-426614174000/members' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

### Example 2: Invite a New Member

```bash
curl -X POST \
  'http://localhost:3000/api/businesses/123e4567-e89b-12d3-a456-426614174000/members' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "newmember@example.com",
    "name": "New Member",
    "role": "member",
    "phone": "+1234567890"
  }'
```

### Example 3: Change Member Role

```bash
curl -X PATCH \
  'http://localhost:3000/api/businesses/123e4567-e89b-12d3-a456-426614174000/members/456e7890-e89b-12d3-a456-426614174001/role' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' \
  -H 'Content-Type: application/json' \
  -d '{
    "role": "admin"
  }'
```

### Example 4: Disable a Member

```bash
curl -X DELETE \
  'http://localhost:3000/api/businesses/123e4567-e89b-12d3-a456-426614174000/members/456e7890-e89b-12d3-a456-426614174001' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

## Important Notes

1. **User Creation**: When inviting a member with an email that doesn't exist in the system, a new user account is automatically created with a temporary password. The user should reset their password on first login.

2. **Reactivation**: If you try to invite a member who was previously disabled, they will be reactivated with the new role specified in the request.

3. **Business Owner**: The business owner (created when the business is created) automatically gets the `admin` role and cannot be disabled.

4. **Role Hierarchy**: 
   - `owner`: Business creator (set automatically)
   - `admin`: Can manage business settings and members
   - `member`: Standard access to features
   - `viewer`: Read-only access

5. **Tenant Middleware**: All endpoints use the tenant middleware which verifies that the authenticated user has access to the specified business.

## Error Handling

All endpoints follow a consistent error response format:

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

Common HTTP status codes:
- `200 OK`: Successful GET/PATCH/DELETE request
- `201 Created`: Successful POST request
- `400 Bad Request`: Invalid input or business logic error
- `401 Unauthorized`: Missing or invalid authentication token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found

## Related APIs

- [Business API Guide](./BUSINESS_API_GUIDE.md) - Managing businesses
- [Auth API Guide](./AUTH_STATE_FLOW.md) - Authentication and authorization
