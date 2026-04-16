import { useAppDispatch, useAppSelector } from '../store/hooks';
import { login, signup, logout, resetPassword } from '../store/slices/authSlice';
import { selectUser, selectIsLoading, selectError, selectIsAuthenticated } from '../store/selectors/authSelectors';
import type { User } from '@shared';

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
}

export const useAuth = (): AuthContextType => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectError);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
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
  };
};
