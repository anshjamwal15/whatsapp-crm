/**
 * API Client
 * Handles all HTTP requests to the backend API
 */

const API_BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) || 'http://localhost:3000/api';
const STORAGE_KEY = 'whatsapp-crm-auth';

interface LoginResponse {
  id: string;
  email: string;
  name: string;
  accessToken: string;
  refreshToken?: string;
}

interface SignupResponse {
  id: string;
  email: string;
  name: string;
  accessToken: string;
}

interface AuthState {
  user?: {
    id: string;
    email: string;
    name: string;
  };
  accessToken?: string;
  isAuthenticated?: boolean;
}

/**
 * Check if running in browser environment
 */
const isBrowser = (): boolean => {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
};

/**
 * Get stored access token from localStorage
 */
export const getAccessToken = (): string | null => {
  if (!isBrowser()) return null;

  try {
    const auth = localStorage.getItem(STORAGE_KEY);
    if (auth) {
      const parsed: AuthState = JSON.parse(auth);
      return parsed.accessToken || null;
    }
  } catch (error) {
    console.error('Failed to get access token:', error);
  }
  return null;
};

/**
 * Set access token in localStorage
 */
export const setAccessToken = (token: string): void => {
  if (!isBrowser()) return;

  try {
    const auth = localStorage.getItem(STORAGE_KEY);
    const parsed: AuthState = auth ? JSON.parse(auth) : {};
    parsed.accessToken = token;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
  } catch (error) {
    console.error('Failed to set access token:', error);
  }
};

/**
 * Clear access token from localStorage
 */
export const clearAccessToken = (): void => {
  if (!isBrowser()) return;

  try {
    const auth = localStorage.getItem(STORAGE_KEY);
    if (auth) {
      const parsed: AuthState = JSON.parse(auth);
      delete parsed.accessToken;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    }
  } catch (error) {
    console.error('Failed to clear access token:', error);
  }
};

/**
 * Make API request with auth token
 */
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAccessToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMessage = `API Error: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch {
        // If response is not JSON, use default error message
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
};

/**
 * Login API
 */
export const loginAPI = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  const response = await apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  if (response.accessToken) {
    setAccessToken(response.accessToken);
  }

  return response;
};

/**
 * Signup API
 */
export const signupAPI = async (
  name: string,
  email: string,
  password: string,
  phone?: string
): Promise<SignupResponse> => {
  if (!name || !email || !password) {
    throw new Error('Name, email, and password are required');
  }

  const response = await apiRequest<SignupResponse>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, ...(phone && { phone }) }),
  });

  if (response.accessToken) {
    setAccessToken(response.accessToken);
  }

  return response;
};

/**
 * Logout API
 */
export const logoutAPI = async (): Promise<void> => {
  try {
    await apiRequest<void>('/auth/logout', {
      method: 'POST',
    });
  } catch (error) {
    console.error('Logout failed:', error);
  } finally {
    clearAccessToken();
  }
};

/**
 * Refresh token API
 */
export const refreshTokenAPI = async (refreshToken: string): Promise<string> => {
  if (!refreshToken) {
    throw new Error('Refresh token is required');
  }

  const response = await apiRequest<{ accessToken: string }>('/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  });

  if (response.accessToken) {
    setAccessToken(response.accessToken);
    return response.accessToken;
  }

  throw new Error('Failed to refresh token');
};

/**
 * Get current user
 */
export const getCurrentUserAPI = async () => {
  return apiRequest('/users/me', {
    method: 'GET',
  });
};
