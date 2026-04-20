import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';
import workspaceReducer from './slices/workspaceSlice.js';
import type { AuthState } from './slices/authSlice.js';
import type { WorkspaceState } from './slices/workspaceSlice.js';
import { persistMiddleware, loadPersistedAuth, loadPersistedWorkspace } from './middleware/persistMiddleware.js';

// Load persisted auth state
const persistedAuth: AuthState = loadPersistedAuth() ?? {
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  accessToken: null,
};

// Load persisted workspace state
const persistedWorkspace: WorkspaceState = loadPersistedWorkspace() ?? {
  activeWorkspace: null,
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    workspace: workspaceReducer,
  },
  preloadedState: {
    auth: persistedAuth,
    workspace: persistedWorkspace,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(persistMiddleware) as unknown as ReturnType<typeof getDefaultMiddleware>,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
