# Owner Workspaces API

## Overview

New API endpoint to retrieve all workspaces (businesses) where the authenticated user is the owner.

## Endpoint

### Get Owner Workspaces

**Endpoint:** `GET /api/businesses/owner/workspaces`

**Authentication:** Required (Bearer token)

**Description:** Returns all active businesses where the authenticated user is listed as the owner (ownerUserId).

---

## Request

### Headers
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

### Query Parameters
None

### Request Body
None

---

## Response

### Success Response (200 OK)

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "My Company",
      "slug": "my-company",
      "businessType": "retail",
      "ownerUserId": "user-uuid",
      "phone": "+1234567890",
      "email": "contact@mycompany.com",
      "timezone": "America/New_York",
      "country": "USA",
      "currency": "USD",
      "logoUrl": "https://example.com/logo.png",
      "status": "active",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    },
    {
      "id": "uuid-2",
      "name": "Another Business",
      "slug": "another-business",
      "businessType": "services",
      "ownerUserId": "user-uuid",
      "phone": "+1234567891",
      "email": "contact@anotherbusiness.com",
      "timezone": "America/Los_Angeles",
      "country": "USA",
      "currency": "USD",
      "logoUrl": "https://example.com/logo2.png",
      "status": "active",
      "createdAt": "2024-01-20T14:20:00Z",
      "updatedAt": "2024-01-20T14:20:00Z"
    }
  ]
}
```

### Error Responses

**401 Unauthorized**
```json
{
  "success": false,
  "error": "Missing or invalid authorization header"
}
```

**400 Bad Request**
```json
{
  "success": false,
  "error": "Failed to get owner workspaces: [error details]"
}
```

---

## Behavior

### What It Returns
- Only businesses where `ownerUserId` matches the authenticated user's ID
- Only businesses with `status = 'active'`
- Returns an empty array if user owns no businesses

### What It Filters Out
- Businesses where user is a member but not the owner
- Businesses with `status = 'inactive'` (soft deleted)
- Businesses owned by other users

---

## Comparison with Other Endpoints

### GET /api/businesses
- Returns **all businesses** where user is a member (any role)
- Includes businesses owned by others where user is a member

### GET /api/businesses/owner/workspaces
- Returns **only businesses** where user is the owner
- Does not include businesses where user is just a member

---

## Use Cases

1. **Owner Dashboard**: Display only businesses the user owns
2. **Admin Panel**: Show businesses where user has full ownership rights
3. **Billing/Subscription**: List businesses for which user is responsible
4. **Transfer Ownership**: Show businesses that can be transferred
5. **Business Settings**: Display businesses where user can modify core settings

---

## Examples

### cURL Example

```bash
curl -X GET http://localhost:3000/api/businesses/owner/workspaces \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

### JavaScript/Fetch Example

```javascript
const response = await fetch('http://localhost:3000/api/businesses/owner/workspaces', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

const result = await response.json();
console.log('Owner workspaces:', result.data);
```

### Axios Example

```javascript
const response = await axios.get('/api/businesses/owner/workspaces', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

console.log('Owner workspaces:', response.data.data);
```

---

## Service Method

The endpoint uses the `getOwnerWorkspaces` service method:

```typescript
import { businessService } from '../services';

// Get owner workspaces
const ownerWorkspaces = await businessService.getOwnerWorkspaces(userId);
```

### Method Signature

```typescript
async getOwnerWorkspaces(userId: string): Promise<BusinessResponse[]>
```

### Parameters
- `userId` (string): The user ID to filter by

### Returns
- `Promise<BusinessResponse[]>`: Array of businesses where user is owner

---

## Implementation Details

### Database Query

The service method queries the `businesses` table with:
- Filter: `ownerUserId = userId`
- Filter: `status = 'active'`
- No join with `businessMembers` table (direct ownership check)

### SQL Equivalent

```sql
SELECT * FROM businesses
WHERE owner_user_id = 'user-uuid'
  AND status = 'active';
```

---

## Testing

### Test Scenario 1: User Owns Multiple Businesses

**Setup:**
- User creates 3 businesses
- User is a member of 2 other businesses

**Expected Result:**
- Returns only the 3 businesses user owns
- Does not return the 2 businesses where user is just a member

### Test Scenario 2: User Owns No Businesses

**Setup:**
- User is a member of several businesses
- User has not created any businesses

**Expected Result:**
- Returns empty array `[]`

### Test Scenario 3: User Has Inactive Businesses

**Setup:**
- User owns 2 active businesses
- User owns 1 inactive (soft deleted) business

**Expected Result:**
- Returns only the 2 active businesses
- Does not return the inactive business

---

## Security

### Authentication
- ✅ Requires valid JWT token
- ✅ User must be authenticated

### Authorization
- ✅ Users can only see their own owned businesses
- ✅ No role-based restrictions (any authenticated user can call)

### Data Filtering
- ✅ Automatically filters by authenticated user's ID
- ✅ Only returns active businesses
- ✅ No risk of data leakage

---

## Performance Considerations

### Query Optimization
- Uses indexed column `ownerUserId` for fast filtering
- Uses indexed column `status` for filtering
- No joins required (simpler than getUserBusinesses)

### Expected Performance
- Fast query (single table, indexed columns)
- Scales well with large number of businesses
- No N+1 query issues

---

## Integration Example

### Frontend Component

```typescript
import { useEffect, useState } from 'react';
import { api } from './lib/api';

function OwnerDashboard() {
  const [ownedBusinesses, setOwnedBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOwnerWorkspaces() {
      try {
        const response = await api.get('/api/businesses/owner/workspaces');
        setOwnedBusinesses(response.data.data);
      } catch (error) {
        console.error('Failed to fetch owner workspaces:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchOwnerWorkspaces();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>My Businesses</h1>
      {ownedBusinesses.length === 0 ? (
        <p>You don't own any businesses yet.</p>
      ) : (
        <ul>
          {ownedBusinesses.map(business => (
            <li key={business.id}>
              <h2>{business.name}</h2>
              <p>{business.businessType}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

---

## Changelog

### Version 1.0 (Current)
- ✅ Initial implementation
- ✅ Returns businesses where user is owner
- ✅ Filters by active status
- ✅ Requires authentication

---

## Related Endpoints

| Endpoint | Purpose |
|----------|---------|
| GET /api/businesses | Get all businesses where user is a member |
| GET /api/businesses/owner/workspaces | Get businesses where user is owner |
| GET /api/businesses/:businessId | Get specific business details |
| POST /api/businesses | Create new business |

---

## Summary

The **Owner Workspaces API** provides a focused way to retrieve only the businesses that a user owns, making it ideal for:
- Owner-specific dashboards
- Billing and subscription management
- Business transfer workflows
- Administrative panels

It complements the existing `GET /api/businesses` endpoint by providing a more specific filter based on ownership rather than membership.
