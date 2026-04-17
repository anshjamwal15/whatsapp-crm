import { Plus, Clock } from 'lucide-react';
import { AppLayout } from '@/layouts';

interface Workspace {
  id: string;
  name: string;
  icon: string;
  iconBg: string;
  badge?: 'ENTERPRISE' | 'PRO';
  lastActive: string;
  members: {
    avatars: string[];
    total: number;
  };
}

const mockWorkspaces: Workspace[] = [
  {
    id: '1',
    name: 'Nexus Design Studio',
    icon: '🎨',
    iconBg: 'bg-blue-100',
    lastActive: 'Last active 2 hours ago',
    members: {
      avatars: ['👤', '👤', '👤'],
      total: 15,
    },
  },
  {
    id: '2',
    name: 'Global Sales Ops',
    icon: '🌍',
    iconBg: 'bg-teal-100',
    badge: 'ENTERPRISE',
    lastActive: 'Last active 5 minutes ago',
    members: {
      avatars: ['👤', '👤', '👤'],
      total: 8,
    },
  },
  {
    id: '3',
    name: 'Cloud Inception',
    icon: '🚀',
    iconBg: 'bg-green-100',
    badge: 'PRO',
    lastActive: 'Last active 1 day ago',
    members: {
      avatars: ['👤', '👤'],
      total: 4,
    },
  },
  {
    id: '4',
    name: 'Security Audit Team',
    icon: '🛡️',
    iconBg: 'bg-red-100',
    badge: 'ENTERPRISE',
    lastActive: 'Last active 3 hours ago',
    members: {
      avatars: ['👤', '👤'],
      total: 22,
    },
  },
];

export const Workspaces = () => {
  const handleCreateWorkspace = () => {
    // TODO: Implement create workspace modal
    console.log('Create new workspace');
  };

  const handleWorkspaceClick = (workspaceId: string) => {
    // TODO: Implement workspace switching
    console.log('Switch to workspace:', workspaceId);
  };

  return (
    <AppLayout
      workspaceName="Architect CRM"
      workspaceLabel="Active Workspace"
      workspaceIcon="A"
      onNewBroadcast={() => console.log('New Broadcast clicked')}
      onHelpCenter={() => console.log('Help Center clicked')}
      onNotificationClick={() => console.log('Notifications clicked')}
      onSettingsClick={() => console.log('Settings clicked')}
    >
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">My Workspaces</h1>
          <p className="text-gray-600 text-lg">
            Architect your collaborative environment. Switch between dedicated project engines or
            create a new perimeter for your team.
          </p>
        </div>

        {/* Workspaces Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Create New Workspace Card */}
          <button
            onClick={handleCreateWorkspace}
            className="bg-blue-50 border-2 border-dashed border-blue-200 rounded-xl p-8 hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 flex flex-col items-center justify-center min-h-[280px] group"
          >
            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Plus className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Create New Workspace
            </h3>
            <p className="text-sm text-blue-700">Start a fresh project hub</p>
          </button>

          {/* Workspace Cards */}
          {mockWorkspaces.map((workspace) => (
            <button
              key={workspace.id}
              onClick={() => handleWorkspaceClick(workspace.id)}
              className="bg-white rounded-xl p-6 hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-blue-300 flex flex-col min-h-[280px] text-left group"
            >
              {/* Icon and Badge */}
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-14 h-14 ${workspace.iconBg} rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}
                >
                  {workspace.icon}
                </div>
                {workspace.badge && (
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded ${
                      workspace.badge === 'ENTERPRISE'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {workspace.badge}
                  </span>
                )}
              </div>

              {/* Workspace Name */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {workspace.name}
              </h3>

              {/* Last Active */}
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                <Clock className="w-4 h-4" />
                <span>{workspace.lastActive}</span>
              </div>

              {/* Members */}
              <div className="mt-auto flex items-center justify-between">
                <div className="flex -space-x-2">
                  {workspace.members.avatars.map((avatar, index) => (
                    <div
                      key={index}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-white flex items-center justify-center text-xs"
                    >
                      {avatar}
                    </div>
                  ))}
                  {workspace.members.total > workspace.members.avatars.length && (
                    <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-semibold text-gray-600">
                      +{workspace.members.total - workspace.members.avatars.length}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full">
                  <span className="font-semibold">{workspace.members.total}</span>
                  <span>Members</span>
                </div>
              </div>
            </button>
          ))}
        </div>
        </div>
      </div>
    </AppLayout>
  );
};
