import { Bell, Settings, Search } from 'lucide-react';
import { useUser } from '@/hooks';

interface HeaderProps {
  workspaceName?: string;
  workspaceLabel?: string;
  workspaceIcon?: string;
  showSearch?: boolean;
  searchPlaceholder?: string;
  onNotificationClick?: () => void;
  onSettingsClick?: () => void;
  className?: string;
}

export const Header = ({
  workspaceName = 'Architect CRM',
  workspaceLabel = 'Active Workspace',
  workspaceIcon = 'A',
  showSearch = true,
  searchPlaceholder = 'Search contacts or conversations...',
  onNotificationClick,
  onSettingsClick,
  className = '',
}: HeaderProps) => {
  const user = useUser();

  return (
    <header className={`bg-white border-b border-gray-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Workspace Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
            {workspaceIcon}
          </div>
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">
              {workspaceLabel}
            </div>
            <div className="text-sm font-semibold text-gray-900">
              {workspaceName}
            </div>
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          {showSearch && (
            <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2 w-64">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                className="bg-transparent ml-2 text-sm w-full outline-none"
              />
            </div>
          )}

          {/* Notifications */}
          <button
            onClick={onNotificationClick}
            className="relative hover:bg-gray-100 p-2 rounded-lg transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            {/* Optional notification badge */}
            {/* <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span> */}
          </button>

          {/* Settings */}
          <button
            onClick={onSettingsClick}
            className="hover:bg-gray-100 p-2 rounded-lg transition-colors"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5 text-gray-600" />
          </button>

          {/* User Avatar */}
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold cursor-pointer hover:bg-blue-700 transition-colors">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
};
