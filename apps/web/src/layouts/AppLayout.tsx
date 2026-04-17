import { ReactNode } from 'react';
import { Sidebar, Header } from '@/components';

interface AppLayoutProps {
  children: ReactNode;
  workspaceName?: string;
  workspaceLabel?: string;
  workspaceIcon?: string;
  showSearch?: boolean;
  searchPlaceholder?: string;
  onNewBroadcast?: () => void;
  onHelpCenter?: () => void;
  onNotificationClick?: () => void;
  onSettingsClick?: () => void;
}

/**
 * Main app layout wrapper with sidebar and header
 * Use this component to wrap any page that needs the sidebar and header
 */
export const AppLayout = ({
  children,
  workspaceName = 'Precision HQ',
  workspaceLabel = 'ACTIVE WORKSPACE',
  workspaceIcon = 'P',
  showSearch = true,
  searchPlaceholder = 'Search contacts or conversations...',
  onNewBroadcast,
  onHelpCenter,
  onNotificationClick,
  onSettingsClick,
}: AppLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar
        workspaceName={workspaceName}
        workspaceLabel={workspaceLabel}
        onNewBroadcast={onNewBroadcast}
        onHelpCenter={onHelpCenter}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header
          workspaceName={workspaceName}
          workspaceLabel={workspaceLabel}
          workspaceIcon={workspaceIcon}
          showSearch={showSearch}
          searchPlaceholder={searchPlaceholder}
          onNotificationClick={onNotificationClick}
          onSettingsClick={onSettingsClick}
        />

        {/* Page Content */}
        {children}
      </div>
    </div>
  );
};
