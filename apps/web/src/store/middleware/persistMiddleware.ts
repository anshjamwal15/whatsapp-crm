/**
 * Persistence Middleware
 * 
 * This middleware persists the auth state to localStorage
 * so users stay logged in after page refresh
 * 
 * Usage: Add to store configuration
 */

import { Middleware } from '@reduxjs/toolkit';
import { RootState } from './store.js';

const STORAGE_KEY = 'whatsapp-crm-auth';

/**
 * Load persisted auth state from localStorage
 */
export const loadPersistedAuth = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load persisted auth:', error);
  }
  return null;
};

/**
 * Middleware to persist auth state to localStorage
 */
export const persistMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);
  const state = store.getState() as RootState;

  // Persist auth state whenever it changes
  if (action.type.startsWith('auth/')) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.auth));
    } catch (error) {
      console.error('Failed to persist auth state:', error);
    }
  }

  return result;
};

/**
 * Clear persisted auth state
 */
export const clearPersistedAuth = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear persisted auth:', error);
  }
};
