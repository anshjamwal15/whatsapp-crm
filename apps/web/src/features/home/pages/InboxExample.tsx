/**
 * Example: Inbox page using the Sidebar component
 * This demonstrates how to use the AppLayout with the Sidebar
 * in a different screen/page
 */

import { AppLayout } from '@/layouts';
import { Mail, Search, Filter } from 'lucide-react';

export const InboxExample = () => {
  return (
    <AppLayout
      workspaceName="Precision HQ"
      workspaceLabel="ACTIVE WORKSPACE"
      onNewBroadcast={() => {
        console.log('Opening new broadcast dialog');
        // TODO: Implement broadcast dialog
      }}
      onHelpCenter={() => {
        console.log('Opening help center');
        // TODO: Navigate to help center or open in new tab
      }}
    >
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Inbox</h1>
            <p className="text-sm text-gray-600 mt-1">Manage your conversations</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 w-64">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="bg-transparent ml-2 text-sm w-full outline-none"
              />
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition">
              <Filter className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Inbox Content */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="divide-y divide-gray-200">
              {[
                {
                  name: 'John Smith',
                  message: 'Hi, I wanted to follow up on our conversation...',
                  time: '2 minutes ago',
                  unread: true,
                },
                {
                  name: 'Sarah Johnson',
                  message: 'Thanks for the update. Looking forward to hearing more.',
                  time: '1 hour ago',
                  unread: false,
                },
                {
                  name: 'Mike Chen',
                  message: 'Can we schedule a call for tomorrow?',
                  time: '3 hours ago',
                  unread: false,
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {item.name.charAt(0)}
                        </div>
                        <div>
                          <p
                            className={`text-sm font-medium ${
                              item.unread
                                ? 'text-gray-900 font-semibold'
                                : 'text-gray-900'
                            }`}
                          >
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-600 truncate">
                            {item.message}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.unread && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                      <span className="text-xs text-gray-500">{item.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </AppLayout>
  );
};
