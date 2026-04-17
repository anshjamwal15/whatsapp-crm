import { Plus, Clock, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AppLayout } from '../../../layouts/AppLayout.js';
import { getAccessToken } from '../../../lib/api.js';

const API_BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) || 'http://localhost:3000/api';

interface WorkspaceFromAPI {
  id: string;
  name: string;
  slug: string;
  businessType: string;
  ownerUserId: string;
  phone: string;
  email: string;
  timezone: string;
  country: string;
  currency: string;
  logoUrl: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  numberOfMembers: number;
}

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
  logoUrl?: string | null;
}

const getBusinessTypeIcon = (businessType: string): string => {
  const icons: Record<string, string> = {
    service: '🛠️',
    retail: '🛍️',
    ecommerce: '🛒',
    saas: '💻',
    consulting: '💼',
    education: '📚',
    healthcare: '🏥',
    finance: '💰',
  };
  return icons[businessType.toLowerCase()] || '🏢';
};

const getRandomIconBg = (): string => {
  const colors = [
    'bg-blue-100',
    'bg-teal-100',
    'bg-green-100',
    'bg-purple-100',
    'bg-pink-100',
    'bg-yellow-100',
    'bg-red-100',
    'bg-indigo-100',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const getTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) {
    return `Last active ${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
  } else if (diffHours < 24) {
    return `Last active ${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
  } else {
    return `Last active ${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
  }
};

export const Workspaces = () => {
  const navigate = useNavigate();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const token = getAccessToken();
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(`${API_BASE_URL}/businesses/owner/workspaces`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch workspaces: ${response.statusText}`);
        }

        const result = await response.json();
        
        if (result.success && Array.isArray(result.data)) {
          const transformedWorkspaces: Workspace[] = result.data.map((ws: WorkspaceFromAPI) => {
            // Generate mock avatars based on number of members
            const avatarCount = Math.min(ws.numberOfMembers, 3);
            const avatars = Array(avatarCount).fill('👤');

            return {
              id: ws.id,
              name: ws.name,
              icon: getBusinessTypeIcon(ws.businessType),
              iconBg: getRandomIconBg(),
              badge: ws.numberOfMembers > 10 ? 'ENTERPRISE' : ws.numberOfMembers > 5 ? 'PRO' : undefined,
              lastActive: getTimeAgo(ws.updatedAt),
              members: {
                avatars,
                total: ws.numberOfMembers,
              },
              logoUrl: ws.logoUrl,
            };
          });
          
          setWorkspaces(transformedWorkspaces);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error('Error fetching workspaces:', err);
        setError(err instanceof Error ? err.message : 'Failed to load workspaces');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkspaces();
  }, []);

  const handleCreateWorkspace = () => {
    navigate('/workspaces/onboarding');
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

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <span className="ml-3 text-gray-600">Loading workspaces...</span>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-3">
              <div className="text-red-600 text-xl">⚠️</div>
              <div>
                <h3 className="text-red-900 font-semibold mb-1">Failed to load workspaces</h3>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Workspaces Grid */}
        {!isLoading && !error && (
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
            {workspaces.map((workspace) => (
              <button
                key={workspace.id}
                onClick={() => handleWorkspaceClick(workspace.id)}
                className="bg-white rounded-xl p-6 hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-blue-300 flex flex-col min-h-[280px] text-left group"
              >
                {/* Icon and Badge */}
                <div className="flex items-start justify-between mb-4">
                  {workspace.logoUrl ? (
                    <div className="w-14 h-14 rounded-xl overflow-hidden group-hover:scale-110 transition-transform border border-gray-200">
                      <img 
                        src={workspace.logoUrl} 
                        alt={workspace.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div
                      className={`w-14 h-14 ${workspace.iconBg} rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}
                    >
                      {workspace.icon}
                    </div>
                  )}
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
                    <span>{workspace.members.total === 1 ? 'Member' : 'Members'}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
        </div>
      </div>
    </AppLayout>
  );
};
