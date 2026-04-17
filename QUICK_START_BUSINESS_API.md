# Quick Start: Business API & Tenant Middleware

## What's New

You now have a complete multi-tenant business management system with:
- ✅ Business CRUD APIs
- ✅ Tenant middleware for access control
- ✅ Role-based authorization
- ✅ Business member management

## Files Created

```
apps/api/src/
├── database/models/business.ts          # Data models & types
├── middlewares/tenantMiddleware.ts      # Tenant access control
├── services/business.service.ts         # Business logic
└── routes/business.routes.ts            # API endpoints
```

## API Endpoints

### Create Business
```bash
POST /api/businesses
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "name": "My Company",
  "businessType": "retail",
  "timezone": "America/New_York",
  "currency": "USD"
}
```

### Get All Businesses
```bash
GET /api/businesses
Authorization: Bearer TOKEN
```

### Get Business Details
```bash
GET /api/businesses/:businessId
Authorization: Bearer TOKEN
```

### Update Business (Admin Only)
```bash
PUT /api/businesses/:businessId
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "name": "Updated Name",
  "phone": "+1234567890"
}
```

### Delete Business (Admin Only)
```bash
DELETE /api/businesses/:businessId
Authorization: Bearer TOKEN
```

### Get Business Members
```bash
GET /api/businesses/:businessId/members
Authorization: Bearer TOKEN
```

## Using Tenant Middleware

### In Your Routes

```typescript
import { Router } from 'express';
import { authMiddleware, tenantMiddleware } from '../middlewares';

const router = Router();

// Protected endpoint - requires tenant access
router.get(
  '/:businessId/contacts',
  authMiddleware,
  tenantMiddleware,
  async (req, res) => {
    // req.tenantId = business ID
    // req.businessId = business ID (alias)
    // req.userRole = user's role ('admin', 'member', etc.)
    // User access is verified
    
    const businessId = req.tenantId;
    const userRole = req.userRole;
    
    // Your logic here
  }
);

export default router;
```

### Role-Based Authorization

```typescript
router.put(
  '/:businessId/settings',
  authMiddleware,
  tenantMiddleware,
  async (req, res) => {
    // Check if user is admin
    if (req.userRole !== 'admin' && req.userRole !== 'owner') {
      return res.status(403).json({
        success: false,
        error: 'Only admins can update settings',
      });
    }
    
    // Proceed with update
  }
);
```

## Service Methods

```typescript
import { businessService } from '../services';

// Create business
const business = await businessService.createBusiness(userId, {
  name: 'My Company',
  timezone: 'America/New_York',
});

// Get business
const business = await businessService.getBusinessById(businessId);

// Get user's businesses
const businesses = await businessService.getUserBusinesses(userId);

// Update business
const updated = await businessService.updateBusiness(businessId, {
  name: 'New Name',
});

// Delete business (soft delete)
await businessService.deleteBusiness(businessId);

// Get business members
const members = await businessService.getBusinessMembers(businessId);

// Check access
const hasAccess = await businessService.hasBusinessAccess(userId, businessId);

// Get user's role
const role = await businessService.getUserRoleInBusiness(userId, businessId);
```

## Response Format

All endpoints return consistent JSON responses:

### Success Response
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "My Company",
    "slug": "my-company",
    ...
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

## HTTP Status Codes

- `200 OK` - Successful GET/PUT
- `201 Created` - Successful POST
- `400 Bad Request` - Validation error
- `401 Unauthorized` - Missing/invalid auth
- `403 Forbidden` - No access/insufficient role
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Key Features

### Automatic Slug Generation
- Business names are converted to URL-friendly slugs
- Example: "Acme Corp" → "acme-corp"
- Uniqueness is automatically guaranteed

### Soft Delete
- Businesses are marked as inactive, not deleted
- Data is preserved for audit trails
- Can be restored if needed

### Multi-Tenant Architecture
- Users can belong to multiple businesses
- Each business is isolated via businessId
- Tenant middleware enforces access on every request

### Role-Based Access Control
- **admin/owner**: Can update and delete business info
- **member**: Can view business info and access resources
- Extensible for future roles

## Integration Example

Here's how to integrate with your existing routes:

```typescript
// apps/api/src/routes/contacts.routes.ts
import { Router } from 'express';
import { authMiddleware, tenantMiddleware } from '../middlewares';

const router = Router();

// Get contacts for a business
router.get(
  '/:businessId/contacts',
  authMiddleware,
  tenantMiddleware,
  async (req, res) => {
    try {
      const businessId = req.tenantId;
      
      // Get contacts for this business
      const contacts = await db
        .select()
        .from(contacts)
        .where(eq(contacts.businessId, businessId));
      
      res.json({
        success: true,
        data: contacts,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

export default router;
```

## Testing

### Using cURL

```bash
# Create business
curl -X POST http://localhost:3000/api/businesses \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Business","timezone":"America/New_York"}'

# Get all businesses
curl http://localhost:3000/api/businesses \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get business details
curl http://localhost:3000/api/businesses/BUSINESS_ID \
  -H "Authorization: Bearer YOUR_TOKEN"

# Update business
curl -X PUT http://localhost:3000/api/businesses/BUSINESS_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Name"}'

# Get members
curl http://localhost:3000/api/businesses/BUSINESS_ID/members \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Next Steps

1. **Test the APIs** using the cURL examples above
2. **Integrate with other modules** (contacts, conversations, etc.)
3. **Add member invitation system** for team collaboration
4. **Implement audit logging** for business changes
5. **Add subscription management** for business plans

## Documentation

- **BUSINESS_API_GUIDE.md** - Comprehensive API documentation
- **IMPLEMENTATION_SUMMARY.md** - Technical implementation details
- **QUICK_START_BUSINESS_API.md** - This file

## Troubleshooting

### "Access denied. You do not have access to this business."
- User is not a member of the business
- Check businessMembers table for user-business relationship

### "Only admins can update business information"
- User role is not 'admin' or 'owner'
- Check businessMembers.role for the user

### "Business ID is required"
- businessId is missing from URL params
- Ensure route includes :businessId parameter

### Build errors
- Run `npm run build` in apps/api to verify
- All TypeScript errors should be resolved

## Support

For detailed information, see:
- BUSINESS_API_GUIDE.md for complete API documentation
- IMPLEMENTATION_SUMMARY.md for technical details
