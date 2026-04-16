import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@/store';
import { selectUser, selectIsLoading } from '@/store';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const user = useAppSelector(selectUser);
  const isLoading = useAppSelector(selectIsLoading);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};
