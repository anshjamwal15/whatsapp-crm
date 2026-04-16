import { useIsAuthenticated, useUser } from '../hooks';

/**
 * Example component showing authentication status
 * Can be used in header/navbar
 */
export const AuthStatus = () => {
  const isAuthenticated = useIsAuthenticated();
  const user = useUser();

  return (
    <div className="flex items-center gap-4">
      {isAuthenticated ? (
        <>
          <span className="text-sm text-gray-700">
            Logged in as <strong>{user?.name}</strong>
          </span>
          <span className="inline-block w-2 h-2 bg-green-500 rounded-full" title="Online" />
        </>
      ) : (
        <>
          <span className="text-sm text-gray-500">Not logged in</span>
          <span className="inline-block w-2 h-2 bg-gray-400 rounded-full" title="Offline" />
        </>
      )}
    </div>
  );
};
