import { useAppSelector, selectUser, selectIsAuthenticated } from '@/store';
import type { User } from '@shared';

/**
 * Hook to access the authenticated user globally
 * Returns null if user is not authenticated
 */
export const useUser = (): User | null => {
  return useAppSelector(selectUser);
};

/**
 * Hook to check if user is authenticated
 */
export const useIsAuthenticated = (): boolean => {
  return useAppSelector(selectIsAuthenticated);
};

/**
 * Hook to get user with authentication status
 */
export const useUserWithAuth = () => {
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  return {
    user,
    isAuthenticated,
  };
};
