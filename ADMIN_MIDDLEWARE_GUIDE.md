# Admin Middleware Guide

## Overview

The `adminMiddleware` is a security middleware that ensures only users with admin or owner roles can access protected endpoints within a business context.

## Purpose

- Validates that the authenticated user has admin or owner privileges for the requested business
- Provides centralized role-based access control (RBAC)
- Prevents code duplication of role checks across routes
- Ensures consistent authorization behavior

## Location

```
apps/api/src/middlewares/adminMiddleware.ts
```

## How It Works

The admin middleware:

1. **Checks Authentication**: Verifies `req.user` exists (user is authenticated)
2. **Checks Tenant Context**: Verifies `req.userRole` exists (tenant middleware has run)
3. **Validates Role**: Ensures user role is either `admin` or `owner`
4. **Grants Access**: Calls `next()` if all checks pass
5. **Denies Access**: Returns 403 error if user lacks admin privileges

## Dependencies

The admin middleware **must be used after**:
1. `authMiddleware` - Sets `req.user`
2. `tenantMiddleware` - Sets `req.userRole` and `req.businessId`

## Usage

### Basic Usage

```typescript
import { authMiddleware, tenantMiddleware, adminMiddleware } from '../middlewares';

router.post(
  '/:businessId/members',
  authMiddleware,      // 1. Authenticate user
  tenantMiddleware,    // 2. Verify business access & set role
  adminMiddleware,     // 3. Verify admin/owner role
  async (req, res) => {
    // Only admins/owners reach here
    // No need for manual role checks
  }
);
```

### Middleware Chain Order

**✅ Correct Order:**
```typescript
authMiddleware → tenantMiddleware → adminMiddleware → route handler
```

**❌ Incorrect Order:**
```typescript
authMiddleware → adminMiddleware → tenantMiddleware  // Won't work!
```

## Response Codes

| Status | Condition | Response |
|--------|-----------|----------|
| 401 | User not authenticated | `Authentication required` |
| 403 | User not a business member | `Business membership required` |
| 403 | User lacks admin role | `Admin or owner role required` |
| 200/201 | User is admin/owner | Proceeds to route handler |

## Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Authentication required"
}
```

### 403 Forbidden - No Membership
```json
{
  "success": false,
  "error": "Access denied. Business membership required."
}
```

### 403 Forbidden - Not Admin
```json
{
  "success": false,
  "error": "Access denied. Admin or owner role required."
}
```

## Examples

### Example 1: Protected POST Endpoint

```typescript
// Before: Manual role check in handler
router.post('/:businessId/members', authMiddleware, tenantMiddleware, 
  async (req, res) => {
    // Manual check (not recommended)
    if (req.userRole !== 'admin' && req.userRole !== 'owner') {
      return res.status(403).json({ error: 'Only admins can invite members' });
    }
    // ... rest of handler
  }
);

// After: Using admin middleware
router.post('/:businessId/members', 
  authMiddleware, 
  tenantMiddleware, 
  adminMiddleware,  // Handles role check
  async (req, res) => {
    // No manual check needed - only admins reach here
    // ... handler logic
  }
);
```

### Example 2: Multiple Protected Endpoints

```typescript
// Apply to multiple routes
router.post('/:businessId/members', authMiddleware, tenantMiddleware, adminMiddleware, createMember);
router.patch('/:businessId/members/:id/role', authMiddleware, tenantMiddleware, adminMiddleware, updateRole);
router.delete('/:businessId/members/:id', authMiddleware, tenantMiddleware, adminMiddleware, deleteMember);

// Read endpoints don't need admin middleware
router.get('/:businessId/members', authMiddleware, tenantMiddleware, listMembers);
router.get('/:businessId/members/:id', authMiddleware, tenantMiddleware, getMember);
```

### Example 3: Mixed Access Levels

```typescript
// Public read access (any member)
router.get('/:businessId/settings', 
  authMiddleware, 
  tenantMiddleware, 
  getSettings
);

// Admin-only write access
router.put('/:businessId/settings', 
  authMiddleware, 
  tenantMiddleware, 
  adminMiddleware,  // Only admins can update
  updateSettings
);
```

## Roles Hierarchy

| Role | Access Level | Can Use Admin Middleware |
|------|--------------|--------------------------|
| `owner` | Full control | ✅ Yes |
| `admin` | Administrative | ✅ Yes |
| `member` | Standard access | ❌ No |
| `viewer` | Read-only | ❌ No |

## Implementation Details

### Source Code

```typescript
import { Request, Response, NextFunction } from 'express';

export function adminMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    // Ensure user is authenticated
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
      return;
    }

    // Ensure tenant middleware has run and set userRole
    if (!req.userRole) {
      res.status(403).json({
        success: false,
        error: 'Access denied. Business membership required.',
      });
      return;
    }

    // Check if user has admin or owner role
    if (req.userRole !== 'admin' && req.userRole !== 'owner') {
      res.status(403).json({
        success: false,
        error: 'Access denied. Admin or owner role required.',
      });
      return;
    }

    // User has admin privileges, proceed
    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}
```

## Benefits

### 1. **Code Reusability**
- Single middleware used across multiple routes
- No need to duplicate role checks

### 2. **Consistency**
- Same error messages and status codes everywhere
- Uniform authorization behavior

### 3. **Maintainability**
- Change role logic in one place
- Easy to add new roles or modify access rules

### 4. **Security**
- Centralized security logic
- Harder to forget authorization checks
- Clear separation of concerns

### 5. **Readability**
- Route definitions clearly show access requirements
- Less clutter in route handlers

## Testing

### Test Cases

```typescript
describe('adminMiddleware', () => {
  it('should allow admin users', async () => {
    req.user = { userId: '123' };
    req.userRole = 'admin';
    // Should call next()
  });

  it('should allow owner users', async () => {
    req.user = { userId: '123' };
    req.userRole = 'owner';
    // Should call next()
  });

  it('should reject member users', async () => {
    req.user = { userId: '123' };
    req.userRole = 'member';
    // Should return 403
  });

  it('should reject viewer users', async () => {
    req.user = { userId: '123' };
    req.userRole = 'viewer';
    // Should return 403
  });

  it('should reject unauthenticated requests', async () => {
    req.user = null;
    // Should return 401
  });

  it('should reject requests without tenant context', async () => {
    req.user = { userId: '123' };
    req.userRole = null;
    // Should return 403
  });
});
```

## Related Middlewares

- **authMiddleware**: Validates JWT token and sets `req.user`
- **tenantMiddleware**: Validates business access and sets `req.userRole`
- **optionalAuthMiddleware**: Optional authentication
- **optionalTenantMiddleware**: Optional tenant validation

## Best Practices

1. **Always use middleware chain**: `auth → tenant → admin`
2. **Don't skip tenant middleware**: Admin middleware depends on it
3. **Use for write operations**: POST, PUT, PATCH, DELETE
4. **Skip for read operations**: GET endpoints (unless sensitive data)
5. **Document protected routes**: Make it clear which routes require admin access

## Common Mistakes

### ❌ Wrong: Skipping Tenant Middleware
```typescript
router.post('/:businessId/members', 
  authMiddleware, 
  adminMiddleware,  // Will fail - no userRole set
  handler
);
```

### ❌ Wrong: Manual Role Check After Middleware
```typescript
router.post('/:businessId/members', 
  authMiddleware, 
  tenantMiddleware, 
  adminMiddleware,
  async (req, res) => {
    // Redundant check - middleware already did this
    if (req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Not admin' });
    }
  }
);
```

### ✅ Correct: Proper Middleware Chain
```typescript
router.post('/:businessId/members', 
  authMiddleware, 
  tenantMiddleware, 
  adminMiddleware,
  async (req, res) => {
    // No role check needed - proceed with logic
    const member = await memberService.inviteMember(...);
    res.json({ success: true, data: member });
  }
);
```

## Future Enhancements

Potential improvements:
1. **Granular Permissions**: Check specific permissions beyond roles
2. **Custom Error Messages**: Pass custom error messages to middleware
3. **Audit Logging**: Log admin actions automatically
4. **Rate Limiting**: Add rate limits for admin operations
5. **IP Whitelisting**: Restrict admin access by IP
