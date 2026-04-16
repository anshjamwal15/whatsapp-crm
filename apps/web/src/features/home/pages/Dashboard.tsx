import { useUser, useAuth } from '../../../hooks';
import { UserInfo, AuthStatus } from '../../../components';
import { useEffect } from 'react';

/**
 * Example Dashboard page showing global user state usage
 */
export const Dashboard = () => {
  const user = useUser();
  const auth = useAuth();
  const { logout } = useAuth();

  useEffect(() => {
    console.log("New data", auth.isAuthenticated);
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please log in to access the dashboard</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <AuthStatus />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Card */}
          <div className="md:col-span-1">
            <UserInfo />
          </div>

          {/* Welcome Section */}
          <div className="md:col-span-2 bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Welcome, {user.name}!
            </h2>
            <p className="text-gray-600 mb-4">
              You are successfully logged in to the WhatsApp CRM system.
            </p>

            {/* User Details */}
            <div className="bg-gray-50 rounded p-4 mb-4">
              <h3 className="font-semibold text-gray-900 mb-3">Your Information</h3>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-gray-600">User ID:</dt>
                  <dd className="font-mono text-gray-900">{user.id}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Email:</dt>
                  <dd className="text-gray-900">{user.email}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Name:</dt>
                  <dd className="text-gray-900">{user.name}</dd>
                </div>
              </dl>
            </div>

            {/* Logout Button */}
            <button
              onClick={() => logout()}
              className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Additional Sections */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Messages</span>
                <span className="text-2xl font-bold text-blue-600">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Contacts</span>
                <span className="text-2xl font-bold text-green-600">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Campaigns</span>
                <span className="text-2xl font-bold text-purple-600">0</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <p className="text-gray-600">No recent activity</p>
          </div>
        </div>
      </main>
    </div>
  );
};
