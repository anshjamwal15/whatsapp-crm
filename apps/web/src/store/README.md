# Redux Store Setup

This directory contains the Redux state management setup for the WhatsApp CRM web application.

## Architecture

The store is organized using Redux Toolkit with the following structure:

```
store/
├── slices/          # Redux slices (reducers + actions)
│   └── authSlice.ts # Authentication state management
├── selectors/       # Memoized state selectors
│   └── authSelectors.ts
├── hooks.ts         # Custom typed hooks (useAppDispatch, useAppSelector)
├── store.ts         # Store configuration
└── index.ts         # Public exports
```

## Key Features

- **Redux Toolkit**: Modern Redux with simplified boilerplate
- **Async Thunks**: Built-in async action handling for API calls
- **Typed Selectors**: Memoized selectors for optimal performance
- **Custom Hooks**: Type-safe dispatch and selector hooks

## Usage

### Using Auth State in Components

```typescript
import { useAuth } from '@/features/auth/hooks/useAuth';

function MyComponent() {
  const { user, isLoading, error, login } = useAuth();

  const handleLogin = async () => {
    try {
      await login('user@example.com', 'password');
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {user && <p>Welcome, {user.name}!</p>}
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
```

### Direct Selector Usage

```typescript
import { useAppSelector } from '@/store/hooks';
import { selectUser, selectIsAuthenticated } from '@/store/selectors/authSelectors';

function MyComponent() {
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  return (
    <div>
      {isAuthenticated && <p>User: {user?.email}</p>}
    </div>
  );
}
```

### Dispatching Actions Directly

```typescript
import { useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';

function LogoutButton() {
  const dispatch = useAppDispatch();

  return (
    <button onClick={() => dispatch(logout())}>
      Logout
    </button>
  );
}
```

## Auth Slice

The auth slice manages:

- **State**:
  - `user`: Current authenticated user or null
  - `isLoading`: Loading state for async operations
  - `error`: Error message if any operation fails
  - `isAuthenticated`: Boolean flag for authentication status

- **Async Thunks**:
  - `login(email, password)`: Authenticate user
  - `signup(name, email, password)`: Create new account
  - `resetPassword(email)`: Request password reset

- **Reducers**:
  - `logout()`: Clear user and auth state
  - `clearError()`: Clear error message
  - `setUser(user)`: Manually set user (for hydration)

## Adding New Slices

To add a new feature slice:

1. Create a new file in `slices/` directory
2. Define your state interface and initial state
3. Create reducers and async thunks
4. Export the reducer as default
5. Add to store configuration in `store.ts`
6. Create selectors in `selectors/` directory
7. Export from `index.ts`

Example:

```typescript
// slices/userSlice.ts
import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: { /* ... */ },
  reducers: { /* ... */ },
});

export default userSlice.reducer;
```

```typescript
// store.ts
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer, // Add here
  },
});
```

## Best Practices

1. **Use Selectors**: Always use memoized selectors to prevent unnecessary re-renders
2. **Type Safety**: Leverage TypeScript with `useAppDispatch` and `useAppSelector`
3. **Error Handling**: Handle errors in components or use middleware
4. **Async Operations**: Use async thunks for API calls
5. **Immutability**: Redux Toolkit uses Immer, so you can write "mutative" code safely
6. **DevTools**: Redux DevTools are enabled by default in development

## Debugging

Redux DevTools are automatically enabled. You can:

1. Install [Redux DevTools Extension](https://github.com/reduxjs/redux-devtools-extension)
2. View state changes in real-time
3. Time-travel debug through actions
4. Dispatch actions manually

## Migration from Context API

The auth functionality has been migrated from Context API to Redux:

- `AuthContext` → `authSlice`
- `useAuthContext()` → `useAuth()` (now uses Redux)
- `AuthProvider` → `Provider` from react-redux in App.tsx

All components using `useAuth()` will automatically work with Redux without changes.
