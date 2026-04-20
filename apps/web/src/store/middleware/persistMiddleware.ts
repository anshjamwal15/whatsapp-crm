/**
 * Persistence Middleware
 *
 * Persists auth and workspace state to localStorage
 * so users stay logged in and their active workspace is remembered after page refresh.
 */

import { Middleware } from '@reduxjs/toolkit';
import { RootState } from '../store.js';

const AUTH_STORAGE_KEY = 'whatsapp-crm-auth';
const WORKSPACE_STORAGE_KEY = 'whatsapp-crm-workspace';

// ---------------------------------------------------------------------------
// Auth persistence
// ---------------------------------------------------------------------------

export const loadPersistedAuth = () => {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        user: parsed.user || null,
        isLoading: false,
        error: null,
        isAuthenticated: !!parsed.user,
        accessToken: parsed.accessToken || null,
      };
    }
  } catch (error) {
    console.error('Failed to load persisted auth:', error);
  }
  return null;
};

export const clearPersistedAuth = () => {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear persisted auth:', error);
  }
};

// ---------------------------------------------------------------------------
// Workspace persistence
// ---------------------------------------------------------------------------

export const loadPersistedWorkspace = () => {
  try {
    const stored = localStorage.getItem(WORKSPACE_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        activeWorkspace: parsed.activeWorkspace || null,
      };
    }
  } catch (error) {
    console.error('Failed to load persisted workspace:', error);
  }
  return null;
};

export const clearPersistedWorkspace = () => {
  try {
    localStorage.removeItem(WORKSPACE_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear persisted workspace:', error);
  }
};

// ---------------------------------------------------------------------------
// Combined middleware
// ---------------------------------------------------------------------------

export const persistMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);
  const state = store.getState() as RootState;

  if ((action as { type: string }).type.startsWith('auth/')) {
    try {
      const authState = state.auth;
      localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({
          user: authState.user,
          accessToken: authState.accessToken,
          isAuthenticated: authState.isAuthenticated,
        })
      );
    } catch (error) {
      console.error('Failed to persist auth state:', error);
    }
  }

  if ((action as { type: string }).type.startsWith('workspace/')) {
    try {
      const workspaceState = state.workspace;
      localStorage.setItem(
        WORKSPACE_STORAGE_KEY,
        JSON.stringify({
          activeWorkspace: workspaceState.activeWorkspace,
        })
      );
    } catch (error) {
      console.error('Failed to persist workspace state:', error);
    }
  }

  return result;
};
