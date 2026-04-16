import { useUser, useAuth } from '../hooks';

/**
 * Example component showing how to use global user state
 * This component can be used anywhere in the app
 */
export const UserInfo = () => {
  const user = useUser();
  const { logout } = useAuth();

  if (!user) {
    return (
      <div className="p-4 bg-gray-100 rounded">
        <p className="text-gray-600">Not authenticated</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-blue-50 rounded border border-blue-200">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">{user.name}</h3>
          <p className="text-sm text-gray-600">{user.email}</p>
          <p className="text-xs text-gray-500 mt-1">ID: {user.id}</p>
        </div>
        <button
          onClick={() => logout()}
          className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
};
