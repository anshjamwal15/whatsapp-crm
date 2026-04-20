import { ReactNode } from 'react';
import { Sidebar, Header } from '@/components';
import { useWorkspace } from '@/hooks';

interface AppLayoutProps {
  children: ReactNode;
  showSearch?: boolean;
  searchPlaceholder?: string;
  onNewBroadcast?: () => void;
  onHelpCenter?: () => void;
  onNotificationClick?: () => void;
  onSettingsClick?: () => void;
}

/**
 * Main app layout wrapper with sidebar and header.
 * Workspace name and ID are read from the global Redux store — no need to pass them as props.
 */
export const AppLayout = ({
  children,
  showSearch = true,
  searchPlaceholder = 'Search contacts or conversations...',
  onNewBroadcast,
  onHelpCenter,
  onNotificationClick,
  onSettingsClick,
}: AppLayoutProps) => {
  const { activeWorkspaceName } = useWorkspace();

  const workspaceName = activeWorkspaceName ?? 'Select a workspace';
  const workspaceLabel = activeWorkspaceName ? 'ACTIVE WORKSPACE' : 'NO WORKSPACE';
  const workspaceIcon = workspaceName.charAt(0).toUpperCase();

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
