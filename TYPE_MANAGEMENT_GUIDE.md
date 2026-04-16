================================================================================
                    TYPE MANAGEMENT GUIDE
                Adding New Types or Updating Existing Types
                    in the Authentication State Flow
================================================================================

OVERVIEW:
This document provides a step-by-step guide for adding new types or updating
existing types in the authentication system. It covers where types are defined,
how they're used, and how to propagate changes through the state flow.

================================================================================
                        CURRENT TYPE STRUCTURE
================================================================================

LOCATION: packages/shared/src/types/user.ts

Current User Type:
```
export interface User {
  id: string;
  email: string;
  name: string;
}
```

Current Auth State Type:
LOCATION: apps/web/src/store/slices/authSlice.ts

```
export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}
```

================================================================================
                    SCENARIO 1: ADD NEW FIELD TO USER TYPE
================================================================================

EXAMPLE: Add phone number and role to User type

STEP 1: UPDATE SHARED USER TYPE
File: packages/shared/src/types/user.ts

Current:
```
export interface User {
  id: string;
  email: string;
  name: string;
}
```

Updated:
```
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;           // Optional phone number
  role: 'admin' | 'user';   // User role
}
```

STEP 2: UPDATE AUTH SLICE (if needed)
File: apps/web/src/store/slices/authSlice.ts

No changes needed to AuthState interface since it uses User type.
However, update the async thunks to handle new fields:

Current login thunk:
```
export const login = createAsyncThunk(
  'auth/login',
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      console.log('Login:', { email, password });
      return {
        id: '1',
        email,
        name: 'User',
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      return rejectWithValue(message);
    }
  }
);
```

Updated login thunk:
```
export const login = createAsyncThunk(
  'auth/login',
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      // TODO: Replace with actual API call
      // const response = await loginAPI(email, password);
      // return response.user;
      console.log('Login:', { email, password });
      return {
        id: '1',
        email,
        name: 'User',
        phone: '+1234567890',
        role: 'user',
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      return rejectWithValue(message);
    }
  }
);
```

Similarly update signup thunk:
```
export const signup = createAsyncThunk(
  'auth/signup',
  async (
    { name, email, password }: { name: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      console.log('Signup:', { name, email, password });
      return {
        id: '1',
        email,
        name,
        phone: undefined,
        role: 'user',  // New users default to 'user' role
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Signup failed';
      return rejectWithValue(message);
    }
  }
);
```

STEP 3: UPDATE COMPONENTS USING USER DATA
Files that need updates:

a) apps/web/src/components/UserInfo.tsx
   - Display phone and role information
   - Example:
   ```
   export const UserInfo = () => {
     const user = useAppSelector(selectUser);
     
     if (!user) return null;
     
     return (
       <div>
         <p>Name: {user.name}</p>
         <p>Email: {user.email}</p>
         <p>Phone: {user.phone}</p>
         <p>Role: {user.role}</p>
       </div>
     );
   };
   ```

b) apps/web/src/features/home/pages/Dashboard.tsx
   - Use new user fields if needed
   - Example:
   ```
   export const Dashboard = () => {
     const user = useAppSelector(selectUser);
     
     return (
       <div>
         <h1>Welcome, {user?.name}</h1>
         {user?.role === 'admin' && <AdminPanel />}
       </div>
     );
   };
   ```

STEP 4: UPDATE PERSISTENCE (if needed)
File: apps/web/src/store/middleware/persistMiddleware.ts

No changes needed - middleware automatically persists entire auth state
including new User fields.

STEP 5: UPDATE SELECTORS (if needed)
File: apps/web/src/store/selectors/authSelectors.ts

Add new selectors if you need to access specific user fields:
```
export const selectUser = (state: RootState) => state.auth.user;
export const selectUserRole = (state: RootState) => state.auth.user?.role;
export const selectUserPhone = (state: RootState) => state.auth.user?.phone;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectIsLoading = (state: RootState) => state.auth.isLoading;
export const selectError = (state: RootState) => state.auth.error;
export const selectAuthState = (state: RootState) => state.auth;
```

STEP 6: UPDATE HOOKS (if needed)
File: apps/web/src/hooks/useAuth.ts

No changes needed - hook automatically provides updated user data.

STEP 7: UPDATE API INTEGRATION
File: apps/api/src/database/models/user.ts (Backend)

Ensure backend User model includes new fields:
```
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'admin' | 'user';
}
```

STEP 8: UPDATE DATABASE SCHEMA
File: apps/api/src/database/schema.ts (Backend)

Add new columns to user table:
```
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  role: varchar('role', { length: 50 }).notNull().default('user'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
```

AFFECTED FILES SUMMARY:
✓ packages/shared/src/types/user.ts (Type definition)
✓ apps/web/src/store/slices/authSlice.ts (Async thunks)
✓ apps/web/src/components/UserInfo.tsx (Display component)
✓ apps/web/src/features/home/pages/Dashboard.tsx (Protected page)
✓ apps/web/src/store/selectors/authSelectors.ts (Selectors)
✓ apps/api/src/database/models/user.ts (Backend model)
✓ apps/api/src/database/schema.ts (Database schema)

================================================================================
                    SCENARIO 2: ADD NEW FIELD TO AUTH STATE
================================================================================

EXAMPLE: Add lastLoginTime and loginAttempts to AuthState

STEP 1: UPDATE AUTH STATE TYPE
File: apps/web/src/store/slices/authSlice.ts

Current:
```
export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}
```

Updated:
```
export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  lastLoginTime: number | null;      // Timestamp of last login
  loginAttempts: number;              // Failed login attempts
}
```

STEP 2: UPDATE INITIAL STATE
File: apps/web/src/store/slices/authSlice.ts

Current:
```
const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};
```

Updated:
```
const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  lastLoginTime: null,
  loginAttempts: 0,
};
```

STEP 3: UPDATE REDUCERS
File: apps/web/src/store/slices/authSlice.ts

Update login.fulfilled reducer:
```
.addCase(login.fulfilled, (state, action) => {
  state.isLoading = false;
  state.user = action.payload;
  state.isAuthenticated = true;
  state.lastLoginTime = Date.now();
  state.loginAttempts = 0;  // Reset on successful login
})
```

Update login.rejected reducer:
```
.addCase(login.rejected, (state, action) => {
  state.isLoading = false;
  state.error = action.payload as string;
  state.loginAttempts += 1;  // Increment on failed attempt
})
```

Add logout reducer update:
```
logout: (state) => {
  state.user = null;
  state.isAuthenticated = false;
  state.error = null;
  state.lastLoginTime = null;
  state.loginAttempts = 0;
}
```

STEP 4: ADD NEW SELECTORS
File: apps/web/src/store/selectors/authSelectors.ts

```
export const selectLastLoginTime = (state: RootState) => 
  state.auth.lastLoginTime;

export const selectLoginAttempts = (state: RootState) => 
  state.auth.loginAttempts;

export const selectIsAccountLocked = (state: RootState) => 
  state.auth.loginAttempts >= 5;  // Lock after 5 attempts
```

STEP 5: UPDATE COMPONENTS
File: apps/web/src/features/auth/pages/Login.tsx

Add account lock check:
```
const { login, isLoading, error, loginAttempts } = useAuth();

const isAccountLocked = loginAttempts >= 5;

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (isAccountLocked) {
    setError('Account locked due to too many failed attempts');
    return;
  }
  
  try {
    await login(email, password);
    navigate('/dashboard');
  } catch (err) {
    console.error('Login failed:', err);
  }
};
```

AFFECTED FILES SUMMARY:
✓ apps/web/src/store/slices/authSlice.ts (Type, initial state, reducers)
✓ apps/web/src/store/selectors/authSelectors.ts (New selectors)
✓ apps/web/src/features/auth/pages/Login.tsx (Account lock logic)
✓ apps/web/src/hooks/useAuth.ts (Provides new state)

================================================================================
                    SCENARIO 3: CREATE NEW TYPE FOR PERMISSIONS
================================================================================

EXAMPLE: Add Permissions type for role-based access control

STEP 1: CREATE NEW TYPE FILE
File: packages/shared/src/types/permissions.ts

```
export type Permission = 
  | 'read:dashboard'
  | 'write:dashboard'
  | 'read:users'
  | 'write:users'
  | 'delete:users'
  | 'read:reports'
  | 'write:reports';

export interface RolePermissions {
  role: 'admin' | 'user' | 'guest';
  permissions: Permission[];
}

export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  admin: [
    'read:dashboard',
    'write:dashboard',
    'read:users',
    'write:users',
    'delete:users',
    'read:reports',
    'write:reports',
  ],
  user: [
    'read:dashboard',
    'read:reports',
  ],
  guest: [],
};
```

STEP 2: EXPORT FROM SHARED INDEX
File: packages/shared/src/types/index.ts

```
export type { User } from './user';
export type { Permission, RolePermissions } from './permissions';
export { ROLE_PERMISSIONS } from './permissions';
```

STEP 3: UPDATE USER TYPE TO INCLUDE PERMISSIONS
File: packages/shared/src/types/user.ts

```
import type { Permission } from './permissions';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'admin' | 'user';
  permissions: Permission[];
}
```

STEP 4: ADD PERMISSION SELECTORS
File: apps/web/src/store/selectors/authSelectors.ts

```
export const selectUserPermissions = (state: RootState) => 
  state.auth.user?.permissions || [];

export const selectHasPermission = (permission: Permission) => 
  (state: RootState) => 
    state.auth.user?.permissions.includes(permission) || false;
```

STEP 5: CREATE PERMISSION HOOK
File: apps/web/src/hooks/usePermissions.ts

```
import { useAppSelector } from '../store/hooks';
import { selectUserPermissions, selectHasPermission } from '../store/selectors/authSelectors';
import type { Permission } from '@shared';

export const usePermissions = () => {
  const permissions = useAppSelector(selectUserPermissions);
  
  const hasPermission = (permission: Permission): boolean => {
    return useAppSelector(selectHasPermission(permission));
  };
  
  const hasAnyPermission = (perms: Permission[]): boolean => {
    return perms.some(perm => permissions.includes(perm));
  };
  
  const hasAllPermissions = (perms: Permission[]): boolean => {
    return perms.every(perm => permissions.includes(perm));
  };
  
  return {
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
};
```

STEP 6: CREATE PERMISSION GUARD COMPONENT
File: apps/web/src/components/PermissionGuard.tsx

```
import { usePermissions } from '../hooks/usePermissions';
import type { Permission } from '@shared';

interface PermissionGuardProps {
  permission: Permission | Permission[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireAll?: boolean;
}

export const PermissionGuard = ({
  permission,
  children,
  fallback = null,
  requireAll = false,
}: PermissionGuardProps) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();
  
  const permissions = Array.isArray(permission) ? permission : [permission];
  
  const hasAccess = requireAll 
    ? hasAllPermissions(permissions)
    : hasAnyPermission(permissions);
  
  return hasAccess ? <>{children}</> : <>{fallback}</>;
};
```

STEP 7: UPDATE ASYNC THUNKS
File: apps/web/src/store/slices/authSlice.ts

```
export const login = createAsyncThunk(
  'auth/login',
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      // API call returns user with permissions
      return {
        id: '1',
        email,
        name: 'User',
        phone: '+1234567890',
        role: 'user',
        permissions: ['read:dashboard', 'read:reports'],
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      return rejectWithValue(message);
    }
  }
);
```

AFFECTED FILES SUMMARY:
✓ packages/shared/src/types/permissions.ts (New type file)
✓ packages/shared/src/types/index.ts (Export new types)
✓ packages/shared/src/types/user.ts (Add permissions field)
✓ apps/web/src/store/slices/authSlice.ts (Update async thunks)
✓ apps/web/src/store/selectors/authSelectors.ts (Permission selectors)
✓ apps/web/src/hooks/usePermissions.ts (New permission hook)
✓ apps/web/src/components/PermissionGuard.tsx (New guard component)

================================================================================
                    SCENARIO 4: ADD NEW ASYNC THUNK
================================================================================

EXAMPLE: Add fetchUserProfile async thunk to load additional user data

STEP 1: CREATE NEW ASYNC THUNK
File: apps/web/src/store/slices/authSlice.ts

```
export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (userId: string, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      // const response = await getUserProfileAPI(userId);
      // return response.profile;
      console.log('Fetching profile for user:', userId);
      return {
        bio: 'User bio',
        avatar: 'https://example.com/avatar.jpg',
        preferences: {
          theme: 'dark',
          notifications: true,
        },
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch profile';
      return rejectWithValue(message);
    }
  }
);
```

STEP 2: EXTEND AUTH STATE TYPE
File: apps/web/src/store/slices/authSlice.ts

```
export interface UserProfile {
  bio: string;
  avatar: string;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  lastLoginTime: number | null;
  loginAttempts: number;
  profile: UserProfile | null;        // New field
  profileLoading: boolean;             // New field
}
```

STEP 3: UPDATE INITIAL STATE
File: apps/web/src/store/slices/authSlice.ts

```
const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  lastLoginTime: null,
  loginAttempts: 0,
  profile: null,
  profileLoading: false,
};
```

STEP 4: ADD EXTRA REDUCERS FOR NEW THUNK
File: apps/web/src/store/slices/authSlice.ts

```
// Fetch User Profile
builder
  .addCase(fetchUserProfile.pending, (state) => {
    state.profileLoading = true;
  })
  .addCase(fetchUserProfile.fulfilled, (state, action) => {
    state.profileLoading = false;
    state.profile = action.payload;
  })
  .addCase(fetchUserProfile.rejected, (state, action) => {
    state.profileLoading = false;
    state.error = action.payload as string;
  });
```

STEP 5: ADD SELECTORS
File: apps/web/src/store/selectors/authSelectors.ts

```
export const selectUserProfile = (state: RootState) => state.auth.profile;
export const selectProfileLoading = (state: RootState) => state.auth.profileLoading;
```

STEP 6: UPDATE HOOK
File: apps/web/src/hooks/useAuth.ts

```
export const useAuth = (): AuthContextType => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectError);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const profile = useAppSelector(selectUserProfile);
  const profileLoading = useAppSelector(selectProfileLoading);

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    profile,
    profileLoading,
    login: async (email: string, password: string) => {
      await dispatch(login({ email, password }));
    },
    signup: async (name: string, email: string, password: string) => {
      await dispatch(signup({ name, email, password }));
    },
    logout: () => {
      dispatch(logout());
    },
    resetPassword: async (email: string) => {
      await dispatch(resetPassword(email));
    },
    fetchUserProfile: async (userId: string) => {
      await dispatch(fetchUserProfile(userId));
    },
  };
};
```

STEP 7: USE IN COMPONENT
File: apps/web/src/features/home/pages/Dashboard.tsx

```
export const Dashboard = () => {
  const { user, profile, profileLoading, fetchUserProfile } = useAuth();
  
  useEffect(() => {
    if (user && !profile) {
      fetchUserProfile(user.id);
    }
  }, [user, profile, fetchUserProfile]);
  
  if (profileLoading) return <div>Loading profile...</div>;
  
  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      {profile && (
        <div>
          <img src={profile.avatar} alt="Avatar" />
          <p>{profile.bio}</p>
        </div>
      )}
    </div>
  );
};
```

AFFECTED FILES SUMMARY:
✓ apps/web/src/store/slices/authSlice.ts (New thunk, state, reducers)
✓ apps/web/src/store/selectors/authSelectors.ts (New selectors)
✓ apps/web/src/hooks/useAuth.ts (New method)
✓ apps/web/src/features/home/pages/Dashboard.tsx (Use new thunk)

================================================================================
                    CHECKLIST FOR ADDING NEW TYPES
================================================================================

When adding a new type or updating existing types, follow this checklist:

□ 1. DEFINE TYPE
   - Create or update type file in packages/shared/src/types/
   - Export from packages/shared/src/types/index.ts

□ 2. UPDATE STATE
   - Update AuthState interface in apps/web/src/store/slices/authSlice.ts
   - Update initialState with new fields

□ 3. UPDATE REDUCERS
   - Add/update reducers in authSlice.ts
   - Handle new fields in async thunk handlers

□ 4. UPDATE ASYNC THUNKS
   - Update existing thunks to return new fields
   - Create new thunks if needed

□ 5. ADD SELECTORS
   - Add selectors in apps/web/src/store/selectors/authSelectors.ts
   - Create specific selectors for new fields

□ 6. UPDATE HOOKS
   - Update useAuth.ts to expose new state/methods
   - Create new hooks if needed (e.g., usePermissions)

□ 7. UPDATE COMPONENTS
   - Update components that display user data
   - Add new components if needed (e.g., PermissionGuard)

□ 8. UPDATE PERSISTENCE
   - Verify persistMiddleware handles new fields
   - Update localStorage key if needed

□ 9. UPDATE BACKEND
   - Update API models in apps/api/src/database/models/
   - Update database schema in apps/api/src/database/schema.ts
   - Update API endpoints to return new fields

□ 10. TEST
   - Test login/signup with new fields
   - Test persistence across page refresh
   - Test component rendering with new data
   - Test error handling

================================================================================
                    FILE ORGANIZATION REFERENCE
================================================================================

SHARED TYPES (Shared between frontend and backend):
- packages/shared/src/types/user.ts
- packages/shared/src/types/permissions.ts
- packages/shared/src/types/index.ts

FRONTEND STATE MANAGEMENT:
- apps/web/src/store/slices/authSlice.ts (State, reducers, thunks)
- apps/web/src/store/selectors/authSelectors.ts (Selectors)
- apps/web/src/store/middleware/persistMiddleware.ts (Persistence)
- apps/web/src/store/store.ts (Store configuration)

FRONTEND HOOKS:
- apps/web/src/hooks/useAuth.ts (Auth operations)
- apps/web/src/hooks/usePermissions.ts (Permission checks)

FRONTEND COMPONENTS:
- apps/web/src/components/ProtectedRoute.tsx (Route protection)
- apps/web/src/components/PermissionGuard.tsx (Permission guard)
- apps/web/src/components/UserInfo.tsx (User display)
- apps/web/src/features/auth/pages/Login.tsx (Login form)
- apps/web/src/features/auth/pages/Signup.tsx (Signup form)
- apps/web/src/features/home/pages/Dashboard.tsx (Protected page)

BACKEND MODELS:
- apps/api/src/database/models/user.ts (User model)
- apps/api/src/database/schema.ts (Database schema)

================================================================================
                    COMMON PATTERNS
================================================================================

PATTERN 1: OPTIONAL FIELD
```
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;  // Optional field
}
```

PATTERN 2: ENUM FIELD
```
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'guest';  // Enum-like field
}
```

PATTERN 3: NESTED OBJECT
```
export interface UserProfile {
  bio: string;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
}

export interface AuthState {
  profile: UserProfile | null;
}
```

PATTERN 4: ARRAY FIELD
```
export interface User {
  id: string;
  email: string;
  name: string;
  permissions: Permission[];  // Array of permissions
}
```

PATTERN 5: TIMESTAMP FIELD
```
export interface AuthState {
  lastLoginTime: number | null;  // Unix timestamp
}
```

================================================================================
                    MIGRATION GUIDE
================================================================================

If you need to migrate existing data when changing types:

STEP 1: Create migration file
File: apps/api/src/database/migrations/[timestamp]_add_new_field.ts

STEP 2: Update database schema
File: apps/api/src/database/schema.ts

STEP 3: Create migration script
```
// Run migration
npm run migrate

// Rollback if needed
npm run migrate:rollback
```

STEP 4: Update frontend to handle both old and new data
```
const user = {
  ...oldUser,
  newField: oldUser.newField || defaultValue,
};
```

STEP 5: Test with existing data
- Verify old data still works
- Verify new data is created correctly
- Test persistence with migrated data

================================================================================
                    SUMMARY
================================================================================

Adding or updating types in the authentication state flow requires:

1. Defining types in packages/shared/src/types/
2. Updating AuthState interface
3. Updating initial state
4. Updating reducers and async thunks
5. Adding selectors for new fields
6. Updating hooks to expose new state
7. Updating components to use new data
8. Ensuring persistence works correctly
9. Updating backend models and schema
10. Testing the complete flow

Follow the checklist and patterns provided in this guide to ensure
consistent and maintainable type management across the application.

================================================================================
