# API Reference - Complete Endpoint List

## Base URL
```
http://localhost:3000/api
```

## Authentication
Most endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## 🔐 Authentication Endpoints

### 1. Signup
**POST** `/api/auth/signup`

Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "phone": "+1234567890"  // optional
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "user-uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 2. Login
**POST** `/api/auth/login`

Authenticate user and get access token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "user-uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 3. Logout
**POST** `/api/auth/logout`

🔒 **Requires Authentication**

Logout the current user.

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 4. Refresh Token
**POST** `/api/auth/refresh`

Get a new access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## 👤 User Endpoints

### 5. Get All Users
**GET** `/api/users`

🔒 **Requires Authentication**

Get a list of all users.

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "user-uuid",
      "name": "John Doe",
      "email": "user@example.com",
      "phone": "+1234567890",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### 6. Get User by ID
**GET** `/api/users/{id}`

🔒 **Requires Authentication**

Get a specific user by their ID.

**Path Parameters:**
- `id` (string, required) - User ID

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "user-uuid",
    "name": "John Doe",
    "email": "user@example.com",
    "phone": "+1234567890",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 7. Create User
**POST** `/api/users`

🔒 **Requires Authentication** (Admin only)

Create a new user.

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "name": "Jane Smith",
  "phone": "+1234567890",  // optional
  "password": "password123"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "user-uuid",
    "name": "Jane Smith",
    "email": "newuser@example.com",
    "phone": "+1234567890",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 8. Update User
**PUT** `/api/users/{id}`

🔒 **Requires Authentication** (Owner only)

Update user information.

**Path Parameters:**
- `id` (string, required) - User ID

**Request Body:**
```json
{
  "name": "John Updated",
  "phone": "+9876543210"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "user-uuid",
    "name": "John Updated",
    "email": "user@example.com",
    "phone": "+9876543210",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  }
}
```

---

### 9. Delete User
**DELETE** `/api/users/{id}`

🔒 **Requires Authentication** (Owner only)

Delete a user account.

**Path Parameters:**
- `id` (string, required) - User ID

**Response (200):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

## 🏢 Business Endpoints

### 10. Create Business
**POST** `/api/businesses`

🔒 **Requires Authentication**

Create a new business/workspace.

**Request Body:**
```json
{
  "name": "My Business",
  "businessType": "retail",  // optional
  "phone": "+1234567890",    // optional
  "email": "business@example.com",  // optional
  "timezone": "America/New_York",   // optional
  "country": "US",           // optional
  "currency": "USD",         // optional
  "logoUrl": "https://example.com/logo.png"  // optional
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "business-uuid",
    "name": "My Business",
    "slug": "my-business",
    "businessType": "retail",
    "ownerUserId": "user-uuid",
    "phone": "+1234567890",
    "email": "business@example.com",
    "timezone": "America/New_York",
    "country": "US",
    "currency": "USD",
    "logoUrl": "https://example.com/logo.png",
    "status": "active",
    "numberOfMembers": 1,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 11. Get All Businesses
**GET** `/api/businesses`

🔒 **Requires Authentication**

Get all businesses for the current user.

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "business-uuid",
      "name": "My Business",
      "slug": "my-business",
      "businessType": "retail",
      "ownerUserId": "user-uuid",
      "phone": "+1234567890",
      "email": "business@example.com",
      "timezone": "America/New_York",
      "country": "US",
      "currency": "USD",
      "logoUrl": "https://example.com/logo.png",
      "status": "active",
      "numberOfMembers": 5,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### 12. Get Owner Workspaces
**GET** `/api/businesses/owner/workspaces`

🔒 **Requires Authentication**

Get all workspaces where the user is the owner.

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "business-uuid",
      "name": "My Business",
      "slug": "my-business",
      "status": "active",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### 13. Get Business by ID
**GET** `/api/businesses/{businessId}`

🔒 **Requires Authentication + Tenant Access**

Get a specific business by ID.

**Path Parameters:**
- `businessId` (string, required) - Business ID

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "business-uuid",
    "name": "My Business",
    "slug": "my-business",
    "businessType": "retail",
    "ownerUserId": "user-uuid",
    "phone": "+1234567890",
    "email": "business@example.com",
    "timezone": "America/New_York",
    "country": "US",
    "currency": "USD",
    "logoUrl": "https://example.com/logo.png",
    "status": "active",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 14. Update Business
**PUT** `/api/businesses/{businessId}`

🔒 **Requires Authentication + Tenant Access + Admin Role**

Update business information.

**Path Parameters:**
- `businessId` (string, required) - Business ID

**Request Body:**
```json
{
  "name": "Updated Business Name",
  "businessType": "ecommerce",
  "phone": "+9876543210",
  "email": "updated@example.com",
  "timezone": "America/Los_Angeles",
  "country": "US",
  "currency": "USD",
  "logoUrl": "https://example.com/new-logo.png",
  "status": "active"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "business-uuid",
    "name": "Updated Business Name",
    "slug": "updated-business-name",
    "businessType": "ecommerce",
    "ownerUserId": "user-uuid",
    "phone": "+9876543210",
    "email": "updated@example.com",
    "timezone": "America/Los_Angeles",
    "country": "US",
    "currency": "USD",
    "logoUrl": "https://example.com/new-logo.png",
    "status": "active",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  }
}
```

---

### 15. Delete Business
**DELETE** `/api/businesses/{businessId}`

🔒 **Requires Authentication + Tenant Access + Admin Role**

Delete a business (soft delete).

**Path Parameters:**
- `businessId` (string, required) - Business ID

**Response (200):**
```json
{
  "success": true,
  "message": "Business deleted successfully"
}
```

---

### 16. Get Business Members
**GET** `/api/businesses/{businessId}/members`

🔒 **Requires Authentication + Tenant Access**

Get all members of a business.

**Path Parameters:**
- `businessId` (string, required) - Business ID

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "member-uuid",
      "businessId": "business-uuid",
      "userId": "user-uuid",
      "email": "member@example.com",
      "name": "Jane Doe",
      "phone": "+1234567890",
      "role": "member",
      "isDefaultWorkspace": false,
      "joinedAt": "2024-01-01T00:00:00.000Z",
      "status": "active"
    }
  ]
}
```

---

## 👥 Member Endpoints

### 17. List Members
**GET** `/api/businesses/{businessId}/members`

🔒 **Requires Authentication + Tenant Access**

List all members of a business.

**Path Parameters:**
- `businessId` (string, required) - Business ID

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "member-uuid",
      "businessId": "business-uuid",
      "userId": "user-uuid",
      "email": "member@example.com",
      "name": "Jane Doe",
      "phone": "+1234567890",
      "role": "member",
      "isDefaultWorkspace": false,
      "joinedAt": "2024-01-01T00:00:00.000Z",
      "status": "active"
    }
  ]
}
```

---

### 18. Get Member by ID
**GET** `/api/businesses/{businessId}/members/{memberId}`

🔒 **Requires Authentication + Tenant Access**

Get a specific member by ID.

**Path Parameters:**
- `businessId` (string, required) - Business ID
- `memberId` (string, required) - Member ID

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "member-uuid",
    "businessId": "business-uuid",
    "userId": "user-uuid",
    "email": "member@example.com",
    "name": "Jane Doe",
    "phone": "+1234567890",
    "role": "member",
    "isDefaultWorkspace": false,
    "joinedAt": "2024-01-01T00:00:00.000Z",
    "status": "active"
  }
}
```

---

### 19. Invite Member
**POST** `/api/businesses/{businessId}/members`

🔒 **Requires Authentication + Tenant Access + Admin Role**

Invite a new member to the business.

**Path Parameters:**
- `businessId` (string, required) - Business ID

**Request Body:**
```json
{
  "email": "newmember@example.com",
  "name": "New Member",
  "role": "member",  // admin, member, or viewer
  "phone": "+1234567890"  // optional
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "member-uuid",
    "businessId": "business-uuid",
    "userId": "user-uuid",
    "email": "newmember@example.com",
    "name": "New Member",
    "phone": "+1234567890",
    "role": "member",
    "isDefaultWorkspace": false,
    "joinedAt": "2024-01-01T00:00:00.000Z",
    "status": "active"
  },
  "message": "Member invited successfully"
}
```

---

### 20. Change Member Role
**PATCH** `/api/businesses/{businessId}/members/{memberId}/role`

🔒 **Requires Authentication + Tenant Access + Admin Role**

Change a member's role.

**Path Parameters:**
- `businessId` (string, required) - Business ID
- `memberId` (string, required) - Member ID

**Request Body:**
```json
{
  "role": "admin"  // admin, member, or viewer
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "member-uuid",
    "businessId": "business-uuid",
    "userId": "user-uuid",
    "email": "member@example.com",
    "name": "Jane Doe",
    "role": "admin",
    "isDefaultWorkspace": false,
    "joinedAt": "2024-01-01T00:00:00.000Z",
    "status": "active"
  },
  "message": "Member role updated successfully"
}
```

---

### 21. Disable Member
**DELETE** `/api/businesses/{businessId}/members/{memberId}`

🔒 **Requires Authentication + Tenant Access + Admin Role**

Disable a member (soft delete).

**Path Parameters:**
- `businessId` (string, required) - Business ID
- `memberId` (string, required) - Member ID

**Response (200):**
```json
{
  "success": true,
  "message": "Member disabled successfully"
}
```

---

## 📊 Summary

### Total Endpoints: 21

- **Authentication**: 4 endpoints
- **Users**: 5 endpoints
- **Businesses**: 7 endpoints
- **Members**: 5 endpoints

### Authentication Requirements

- **Public** (No auth required): 3 endpoints
  - POST /api/auth/signup
  - POST /api/auth/login
  - POST /api/auth/refresh

- **Authenticated**: 18 endpoints
  - All other endpoints require authentication

- **Admin Only**: 8 endpoints
  - Business update/delete
  - Member invite/role change/disable

### Common Error Responses

**400 Bad Request:**
```json
{
  "success": false,
  "error": "Validation error message"
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "error": "Unauthorized"
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "error": "Insufficient permissions"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "error": "Resource not found"
}
```

---

## 🔗 Related Documentation

- [Swagger Quick Start Guide](./SWAGGER_QUICK_START.md)
- [Swagger Documentation](./SWAGGER_DOCUMENTATION.md)
- Interactive API Docs: `http://localhost:3000/api-docs`
