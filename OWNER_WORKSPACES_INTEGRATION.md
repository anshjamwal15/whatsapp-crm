# Owner Workspaces API - Integration Guide

## Quick Integration Examples

### Frontend Integration

#### React Hook Example

```typescript
// hooks/useOwnerWorkspaces.ts
import { useState, useEffect } from 'react';
import { api } from '../lib/api';

interface Business {
  id: string;
  name: string;
  slug: string;
  businessType?: string;
  ownerUserId?: string;
  status: string;
  // ... other fields
}

export function useOwnerWorkspaces() {
  const [workspaces, setWorkspaces] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOwnerWorkspaces() {
      try {
        setLoading(true);
        const response = await api.get('/api/businesses/owner/workspaces');
        setWorkspaces(response.data.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch workspaces');
      } finally {
        setLoading(false);
      }
    }

    fetchOwnerWorkspaces();
  }, []);

  return { workspaces, loading, error };
}
```

#### Component Usage

```typescript
// components/OwnerDashboard.tsx
import { useOwnerWorkspaces } from '../hooks/useOwnerWorkspaces';

export function OwnerDashboard() {
  const { workspaces, loading, error } = useOwnerWorkspaces();

  if (loading) {
    return <div>Loading your businesses...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (workspaces.length === 0) {
    return (
      <div>
        <h2>No Businesses Yet</h2>
        <p>You haven't created any businesses yet.</p>
        <button>Create Your First Business</button>
      </div>
    );
  }

  return (
    <div>
      <h1>My Businesses</h1>
      <p>You own {workspaces.length} business(es)</p>
      <div className="grid">
        {workspaces.map(workspace => (
          <div key={workspace.id} className="card">
            <h3>{workspace.name}</h3>
            <p>{workspace.businessType}</p>
            <span className="badge">{workspace.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Backend Integration

#### Using in Another Service

```typescript
// services/billing.service.ts
import { businessService } from './business.service';

export const billingService = {
  async getUserBillingInfo(userId: string) {
    // Get only businesses user owns (responsible for billing)
    const ownedBusinesses = await businessService.getOwnerWorkspaces(userId);
    
    // Calculate total billing
    const billingInfo = ownedBusinesses.map(business => ({
      businessId: business.id,
      businessName: business.name,
      plan: 'premium', // Get from subscription table
      amount: 99.99,
    }));
    
    return {
      totalBusinesses: ownedBusinesses.length,
      totalAmount: billingInfo.reduce((sum, b) => sum + b.amount, 0),
      businesses: billingInfo,
    };
  }
};
```

#### Using in a Route

```typescript
// routes/admin.routes.ts
import { Router } from 'express';
import { authMiddleware } from '../middlewares';
import { businessService } from '../services';

const router = Router();

router.get('/admin/my-businesses', authMiddleware, async (req, res) => {
  try {
    // Get only businesses where user is owner
    const ownedBusinesses = await businessService.getOwnerWorkspaces(
      req.user!.userId
    );
    
    // Add additional admin data
    const businessesWithStats = await Promise.all(
      ownedBusinesses.map(async (business) => {
        const members = await businessService.getBusinessMembers(business.id);
        return {
          ...business,
          memberCount: members.length,
        };
      })
    );
    
    res.json({
      success: true,
      data: businessesWithStats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
```

### API Client Examples

#### Axios Client

```typescript
// lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const businessApi = {
  // Get all businesses (member of)
  getAllBusinesses: () => api.get('/api/businesses'),
  
  // Get only owned businesses
  getOwnerWorkspaces: () => api.get('/api/businesses/owner/workspaces'),
  
  // Get specific business
  getBusiness: (id: string) => api.get(`/api/businesses/${id}`),
  
  // Create business
  createBusiness: (data: any) => api.post('/api/businesses', data),
};
```

#### Fetch Client

```typescript
// lib/businessClient.ts
const API_BASE = 'http://localhost:3000/api';

async function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}

export const businessClient = {
  async getOwnerWorkspaces() {
    const response = await fetch(`${API_BASE}/businesses/owner/workspaces`, {
      method: 'GET',
      headers: await getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch owner workspaces');
    }
    
    return response.json();
  },
  
  async getAllBusinesses() {
    const response = await fetch(`${API_BASE}/businesses`, {
      method: 'GET',
      headers: await getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch businesses');
    }
    
    return response.json();
  },
};
```

### Comparison Component

```typescript
// components/BusinessComparison.tsx
import { useState, useEffect } from 'react';
import { businessApi } from '../lib/api';

export function BusinessComparison() {
  const [allBusinesses, setAllBusinesses] = useState([]);
  const [ownedBusinesses, setOwnedBusinesses] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const [all, owned] = await Promise.all([
        businessApi.getAllBusinesses(),
        businessApi.getOwnerWorkspaces(),
      ]);
      
      setAllBusinesses(all.data.data);
      setOwnedBusinesses(owned.data.data);
    }
    
    fetchData();
  }, []);

  const memberBusinesses = allBusinesses.filter(
    b => !ownedBusinesses.find(o => o.id === b.id)
  );

  return (
    <div>
      <h2>Business Overview</h2>
      
      <div className="stats">
        <div className="stat">
          <h3>{ownedBusinesses.length}</h3>
          <p>Businesses I Own</p>
        </div>
        <div className="stat">
          <h3>{memberBusinesses.length}</h3>
          <p>Businesses I'm Member Of</p>
        </div>
        <div className="stat">
          <h3>{allBusinesses.length}</h3>
          <p>Total Businesses</p>
        </div>
      </div>
      
      <div className="sections">
        <section>
          <h3>My Businesses</h3>
          {ownedBusinesses.map(b => (
            <div key={b.id}>{b.name} (Owner)</div>
          ))}
        </section>
        
        <section>
          <h3>Member Of</h3>
          {memberBusinesses.map(b => (
            <div key={b.id}>{b.name} (Member)</div>
          ))}
        </section>
      </div>
    </div>
  );
}
```

### Redux Integration

```typescript
// store/slices/businessSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { businessApi } from '../../lib/api';

export const fetchOwnerWorkspaces = createAsyncThunk(
  'business/fetchOwnerWorkspaces',
  async () => {
    const response = await businessApi.getOwnerWorkspaces();
    return response.data.data;
  }
);

const businessSlice = createSlice({
  name: 'business',
  initialState: {
    ownedWorkspaces: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOwnerWorkspaces.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOwnerWorkspaces.fulfilled, (state, action) => {
        state.loading = false;
        state.ownedWorkspaces = action.payload;
      })
      .addCase(fetchOwnerWorkspaces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default businessSlice.reducer;
```

### Testing Examples

#### Jest Test

```typescript
// __tests__/ownerWorkspaces.test.ts
import { businessService } from '../services/business.service';

describe('getOwnerWorkspaces', () => {
  it('should return only businesses owned by user', async () => {
    const userId = 'test-user-id';
    const workspaces = await businessService.getOwnerWorkspaces(userId);
    
    // All returned businesses should have ownerUserId = userId
    workspaces.forEach(workspace => {
      expect(workspace.ownerUserId).toBe(userId);
    });
  });
  
  it('should return only active businesses', async () => {
    const userId = 'test-user-id';
    const workspaces = await businessService.getOwnerWorkspaces(userId);
    
    // All returned businesses should be active
    workspaces.forEach(workspace => {
      expect(workspace.status).toBe('active');
    });
  });
  
  it('should return empty array if user owns no businesses', async () => {
    const userId = 'user-with-no-businesses';
    const workspaces = await businessService.getOwnerWorkspaces(userId);
    
    expect(workspaces).toEqual([]);
  });
});
```

### Mobile App Integration (React Native)

```typescript
// services/businessService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE = 'https://api.yourapp.com';

export const businessService = {
  async getOwnerWorkspaces() {
    const token = await AsyncStorage.getItem('authToken');
    
    const response = await fetch(`${API_BASE}/api/businesses/owner/workspaces`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch owner workspaces');
    }
    
    const data = await response.json();
    return data.data;
  },
};
```

```typescript
// screens/OwnerDashboard.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { businessService } from '../services/businessService';

export function OwnerDashboard() {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorkspaces();
  }, []);

  async function loadWorkspaces() {
    try {
      const data = await businessService.getOwnerWorkspaces();
      setWorkspaces(data);
    } catch (error) {
      console.error('Failed to load workspaces:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
        My Businesses
      </Text>
      <FlatList
        data={workspaces}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ padding: 16, borderBottomWidth: 1 }}>
            <Text style={{ fontSize: 18 }}>{item.name}</Text>
            <Text style={{ color: 'gray' }}>{item.businessType}</Text>
          </View>
        )}
      />
    </View>
  );
}
```

## Summary

The Owner Workspaces API integrates seamlessly with:
- ✅ React/Next.js applications
- ✅ Redux state management
- ✅ React Native mobile apps
- ✅ Backend services
- ✅ Admin panels
- ✅ Billing systems

Use it whenever you need to distinguish between businesses a user owns versus businesses they're just a member of.
