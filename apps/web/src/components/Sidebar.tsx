import { useState } from 'react';
import { LayoutGrid, Mail, Users, Zap, BarChart3, HelpCircle, Plus, ChevronDown, LogOut, Briefcase, UserCog } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: string;
}

interface SidebarProps {
  workspaceName?: string;
  workspaceLabel?: string;
  items?: SidebarItem[];
  onNewBroadcast?: () => void;
  onHelpCenter?: () => void;
  className?: string;
}

const defaultItems: SidebarItem[] = [
  
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <LayoutGrid className="w-5 h-5" />,
    href: '/dashboard',
  },
  {
    id: 'workspaces',
    label: 'Workspaces',
    icon: <Briefcase className="w-5 h-5" />,
    href: '/workspaces',
  },
  {
    id: 'inbox',
    label: 'Inbox',
    icon: <Mail className="w-5 h-5" />,
    href: '/inbox',
  },
  {
    id: 'leads',
    label: 'Leads',
    icon: <Users className="w-5 h-5" />,
    href: '/leads',
  },
  {
    id: 'pipeline',
    label: 'Pipeline',
    icon: <Zap className="w-5 h-5" />,
    href: '/pipeline',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: <BarChart3 className="w-5 h-5" />,
    href: '/analytics',
  },
  {
    id: 'team',
    label: 'Team Management',
    icon: <UserCog className="w-5 h-5" />,
    href: '/team',
  },
];

export const Sidebar = ({
  workspaceName = 'Precision HQ',
  workspaceLabel = 'ACTIVE WORKSPACE',
  items = defaultItems,
  onNewBroadcast,
  onHelpCenter,
  className = '',
}: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  return (
    <aside
      className={`flex flex-col h-screen bg-white border-r border-gray-200 transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      } ${className}`}
    >
      {/* Workspace Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            P
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                {workspaceLabel}
              </div>
              <div className="text-sm font-semibold text-gray-900 truncate">
                {workspaceName}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-2">
          {items.map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.id}>
                <Link
                  to={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    active
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!isCollapsed && (
                    <>
                      <span className="flex-1 text-sm font-medium">{item.label}</span>
                      {item.badge && (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Actions */}
      <div className="border-t border-gray-200 p-3 space-y-2">
        {/* New Broadcast Button */}
        <button
          onClick={onNewBroadcast}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded-lg transition-colors"
          title={isCollapsed ? 'New Broadcast' : undefined}
        >
          <Plus className="w-4 h-4" />
          {!isCollapsed && <span>New Broadcast</span>}
        </button>

        {/* Help Center Link */}
        <button
          onClick={onHelpCenter}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
            isCollapsed
              ? 'justify-center'
              : 'justify-start'
          } text-gray-700 hover:bg-gray-50`}
          title={isCollapsed ? 'Help Center' : undefined}
        >
          <HelpCircle className="w-4 h-4 flex-shrink-0" />
          {!isCollapsed && <span className="text-sm font-medium">Help Center</span>}
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
            isCollapsed
              ? 'justify-center'
              : 'justify-start'
          } text-gray-700 hover:bg-red-50 hover:text-red-600`}
          title={isCollapsed ? 'Logout' : undefined}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <div className="border-t border-gray-200 p-3">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors"
          title={isCollapsed ? 'Expand' : 'Collapse'}
        >
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              isCollapsed ? 'rotate-90' : '-rotate-90'
            }`}
          />
        </button>
      </div>
    </aside>
  );
};
