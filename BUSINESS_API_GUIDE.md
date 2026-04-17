# Business API & Tenant Middleware Guide

This guide documents the newly created Business APIs and Tenant Middleware for the WhatsApp CRM system.

## Overview

The implementation provides:
- **Business Management APIs** for creating, reading, updating, and deleting businesses
- **Tenant Middleware** for multi-tenant access control
- **Business Member Management** for team collaboration
- **Role-based Access Control** (RBAC) for admin operations

## Architecture

### Database Schema

The system uses the following key tables:

- **businesses**: Core business/tenant information
- **businessMembers**: User-to-business relationships with roles
- **users**: User profiles

### Key Relationships

```
User (1) ──→ (Many) BusinessMembers ←── (1) Business
```

Each user can be a member of multiple businesses, and each business can have multiple members.

## API Endpoints

### 1. Create Business

**Endpoint:** `POST /api/businesses`

**Authentication:** Required (Bearer token)

**Request Body:**
```json
{
  "name": "Acme Corp",
  "businessType": "retail",
  "phone": "+1234567890",
  "email": "contact@acme.com",
  "timezone": "America/New_York",
  "country": "USA",
  "currency": "USD",
  "logoUrl": "https://example.com/logo.png"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Acme Corp",
    "slug": "acme-corp",
    "businessType": "retail",
    "ownerUserId": "uuid",
    "phone": "+1234567890",
    "email": "contact@acme.com",
    "timezone": "America/New_York",
    "country": "USA",
    "currency": "USD",
    "logoUrl": "https://example.com/logo.png",
    "status": "active",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Notes:**
- The authenticated user becomes the business owner with admin role
- A unique slug is automatically generated from the business name
- Default timezone is "Asia/Kolkata" if not provided
- Default currency is "INR" if not provided

### 2. Get All Businesses

**Endpoint:** `GET /api/businesses`

**Authentication:** Required (Bearer token)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Acme Corp",
      "slug": "acme-corp",
      ...
    },
    {
      "id": "uuid",
      "name": "Tech Startup",
      "slug": "tech-startup",
      ...
    }
  ]
}
```

**Notes:**
- Returns only businesses where the user is an active member
- Includes businesses where user has any role (admin, member, etc.)

### 3. Get Business by ID

**Endpoint:** `GET /api/businesses/:businessId`

**Authentication:** Required (Bearer token)

**Tenant Access:** Required (user must be a member of the business)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Acme Corp",
    "slug": "acme-corp",
    ...
  }
}
```

**Error Responses:**
- `403 Forbidden`: User does not have access to this business
- `404 Not Found`: Business not found

### 4. Update Business

**Endpoint:** `PUT /api/businesses/:businessId`

**Authentication:** Required (Bearer token)

**Tenant Access:** Required (user must be a member of the business)

**Authorization:** Admin or Owner role required

**Request Body:**
```json
{
  "name": "Acme Corp Updated",
  "phone": "+1234567890",
  "email": "newemail@acme.com",
  "timezone": "America/Los_Angeles",
  "currency": "USD",
  "logoUrl": "https://example.com/new-logo.png"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Acme Corp Updated",
    ...
  }
}
```

**Error Responses:**
- `403 Forbidden`: User does not have admin/owner role
- `404 Not Found`: Business not found

### 5. Delete Business

**Endpoint:** `DELETE /api/businesses/:businessId`

**Authentication:** Required (Bearer token)

**Tenant Access:** Required (user must be a member of the business)

**Authorization:** Admin or Owner role required

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Business deleted successfully"
}
```

**Notes:**
- This is a soft delete - the business status is set to "inactive"
- Data is not permanently removed from the database

### 6. Get Business Members

**Endpoint:** `GET /api/businesses/:businessId/members`

**Authentication:** Required (Bearer token)

**Tenant Access:** Required (user must be a member of the business)

**Response (200 OK):**
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
      "userName": "John Doe",
      "userEmail": "john@example.com"
    },
    {
      "id": "uuid",
      "businessId": "uuid",
      "userId": "uuid",
      "role": "member",
      "isDefaultWorkspace": false,
      "joinedAt": "2024-01-16T14:20:00Z",
      "status": "active",
      "userName": "Jane Smith",
      "userEmail": "jane@example.com"
    }
  ]
}
```

## Tenant Middleware

### Purpose

The tenant middleware ensures that:
1. Users are authenticated
2. Users have access to the requested business
3. User role information is attached to the request

### Implementation

**File:** `apps/api/src/middlewares/tenantMiddleware.ts`

#### Required Tenant Middleware

```typescript
import { tenantMiddleware } from '../middlewares';

router.get('/:businessId/data', authMiddleware, tenantMiddleware, handler);
```

**Behavior:**
- Extracts `businessId` from URL params
- Verifies user is an active member of the business
- Attaches to request:
  - `req.tenantId`: The business ID
  - `req.businessId`: The business ID (alias)
  - `req.userRole`: User's role in the business
- Returns `403 Forbidden` if user lacks access
- Returns `400 Bad Request` if businessId is missing

#### Optional Tenant Middleware

```typescript
import { optionalTenantMiddleware } from '../middlewares';

router.get('/data', authMiddleware, optionalTenantMiddleware, handler);
```

**Behavior:**
- Does not fail if businessId is missing
- Validates businessId if present
- Silently continues if validation fails
- Useful for endpoints that work with or without tenant context

### Usage Pattern

```typescript
// Protected endpoint - requires tenant access
router.get(
  '/:businessId/contacts',
  authMiddleware,
  tenantMiddleware,
  async (req, res) => {
    // req.tenantId is guaranteed to be set
    // req.userRole is guaranteed to be set
    // User has access to this business
  }
);

// Optional tenant endpoint
router.get(
  '/search',
  authMiddleware,
  optionalTenantMiddleware,
  async (req, res) => {
    if (req.tenantId) {
      // User provided businessId and has access
    } else {
      // No businessId provided or user lacks access
    }
  }
);
```

## Business Service

**File:** `apps/api/src/services/business.service.ts`

### Key Methods

#### `createBusiness(userId, data)`
Creates a new business and adds the creator as an admin member.

#### `getBusinessById(businessId)`
Retrieves a business by ID.

#### `getBusinessBySlug(slug)`
Retrieves a business by its slug.

#### `getUserBusinesses(userId)`
Gets all businesses where the user is an active member.

#### `updateBusiness(businessId, data)`
Updates business information.

#### `deleteBusiness(businessId)`
Soft deletes a business (sets status to inactive).

#### `getBusinessMembers(businessId)`
Gets all active members of a business with user details.

#### `hasBusinessAccess(userId, businessId)`
Checks if a user has access to a business.

#### `getUserRoleInBusiness(userId, businessId)`
Gets the user's role in a specific business.

## Role-Based Access Control

### Roles

- **admin**: Can update and delete business information, manage members
- **owner**: Same permissions as admin (typically the business creator)
- **member**: Can view business information and access resources

### Authorization Pattern

```typescript
router.put(
  '/:businessId',
  authMiddleware,
  tenantMiddleware,
  async (req, res) => {
    // Check role
    if (req.userRole !== 'admin' && req.userRole !== 'owner') {
      return res.status(403).json({
        success: false,
        error: 'Only admins can update business information',
      });
    }
    // Proceed with update
  }
);
```

## Error Handling

### Common Error Responses

**401 Unauthorized**
```json
{
  "success": false,
  "error": "Authentication required"
}
```

**403 Forbidden**
```json
{
  "success": false,
  "error": "Access denied. You do not have access to this business."
}
```

**404 Not Found**
```json
{
  "success": false,
  "error": "Business not found"
}
```

**400 Bad Request**
```json
{
  "success": false,
  "error": "Business name is required"
}
```

## Integration with Existing Code

### How to Use in Other Routes

```typescript
import { Router } from 'express';
import { authMiddleware, tenantMiddleware } from '../middlewares';
import { businessService } from '../services';

const router = Router();

// Get contacts for a business
router.get(
  '/:businessId/contacts',
  authMiddleware,
  tenantMiddleware,
  async (req, res) => {
    try {
      // req.tenantId is the business ID
      // req.userRole is the user's role
      // User has verified access
      
      const contacts = await getContactsForBusiness(req.tenantId);
      res.json({ success: true, data: contacts });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

export default router;
```

### Accessing Business Context

In any route protected by `tenantMiddleware`:

```typescript
// Get the business ID
const businessId = req.tenantId; // or req.businessId

// Get the user's role
const userRole = req.userRole; // 'admin', 'owner', 'member', etc.

// Check access
if (req.userRole === 'admin') {
  // Allow admin operations
}

// Verify business access
const hasAccess = await businessService.hasBusinessAccess(
  req.user!.userId,
  businessId
);
```

## Database Queries

### Get User's Businesses

```typescript
const businesses = await businessService.getUserBusinesses(userId);
```

### Check Business Access

```typescript
const hasAccess = await businessService.hasBusinessAccess(userId, businessId);
```

### Get Business Members

```typescript
const members = await businessService.getBusinessMembers(businessId);
```

## Future Enhancements

1. **Member Invitation System**: Invite users to join a business
2. **Role Management**: Update member roles
3. **Business Settings**: Store additional configuration
4. **Audit Logging**: Track business changes
5. **Subscription Management**: Handle business plans and billing
6. **API Keys**: Generate API keys for business integrations

## Testing

### Example cURL Commands

**Create Business:**
```bash
curl -X POST http://localhost:3000/api/businesses \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Business",
    "businessType": "retail",
    "timezone": "America/New_York",
    "currency": "USD"
  }'
```

**Get All Businesses:**
```bash
curl http://localhost:3000/api/businesses \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Get Business by ID:**
```bash
curl http://localhost:3000/api/businesses/BUSINESS_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Update Business:**
```bash
curl -X PUT http://localhost:3000/api/businesses/BUSINESS_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Business Name",
    "phone": "+1234567890"
  }'
```

**Get Business Members:**
```bash
curl http://localhost:3000/api/businesses/BUSINESS_ID/members \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Files Created/Modified

### New Files
- `apps/api/src/database/models/business.ts` - Business data models and types
- `apps/api/src/middlewares/tenantMiddleware.ts` - Tenant access control middleware
- `apps/api/src/services/business.service.ts` - Business service logic
- `apps/api/src/routes/business.routes.ts` - Business API routes

### Modified Files
- `apps/api/src/services/index.ts` - Added business service export
- `apps/api/src/middlewares/index.ts` - Added tenant middleware export
- `apps/api/src/routes/index.ts` - Added business routes
- `apps/api/src/database/models/index.ts` - Added business models export
