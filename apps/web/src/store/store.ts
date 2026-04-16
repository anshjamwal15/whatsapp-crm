import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';
import { persistMiddleware, loadPersistedAuth } from './middleware/persistMiddleware.js';

// Load persisted auth state
const persistedAuth = loadPersistedAuth() || {
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  preloadedState: {
    auth: persistedAuth,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(persistMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
