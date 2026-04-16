import { ReactNode } from 'react';
import { Sidebar } from '@/components';

interface AppLayoutProps {
  children: ReactNode;
  workspaceName?: string;
  workspaceLabel?: string;
  onNewBroadcast?: () => void;
  onHelpCenter?: () => void;
}

/**
 * Main app layout wrapper with sidebar
 * Use this component to wrap any page that needs the sidebar
 */
export const AppLayout = ({
  children,
  workspaceName = 'Precision HQ',
  workspaceLabel = 'ACTIVE WORKSPACE',
  onNewBroadcast,
  onHelpCenter,
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
        {children}
      </div>
    </div>
  );
};
