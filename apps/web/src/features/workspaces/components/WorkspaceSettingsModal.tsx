import { X, Info, Users, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { SuccessBadge } from '../../../components/SuccessBadge.js';
import { ErrorBadge } from '../../../components/ErrorBadge.js';
import { getAccessToken } from '../../../lib/api.js';

const API_BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) || 'http://localhost:3000/api';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'EDITOR' | 'VIEWER';
  avatarUrl?: string;
}

interface WorkspaceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
  workspaceName: string;
}

export const WorkspaceSettingsModal = ({
  isOpen,
  onClose,
  workspaceId,
  workspaceName: initialWorkspaceName,
}: WorkspaceSettingsModalProps) => {
  const [workspaceName, setWorkspaceName] = useState(initialWorkspaceName);
  const [plan, setPlan] = useState('Enterprise');
  const [liveSyncEnabled, setLiveSyncEnabled] = useState(true);
  const [teamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'Alex Rivera',
      email: 'alex.r@nexus.studio',
      role: 'ADMIN',
    },
    {
      id: '2',
      name: 'Sarah Chen',
      email: 's.chen@nexus.studio',
      role: 'EDITOR',
    },
    {
      id: '3',
      name: 'Jordan Smythe',
      email: 'jordan@nexus.studio',
      role: 'VIEWER',
    },
  ]);

  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessBadge, setShowSuccessBadge] = useState(false);
  const [showErrorBadge, setShowErrorBadge] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setWorkspaceName(initialWorkspaceName);
  }, [initialWorkspaceName]);

  useEffect(() => {
    const changed = workspaceName !== initialWorkspaceName;
    setHasChanges(changed);
  }, [workspaceName, initialWorkspaceName]);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!hasChanges) {
      onClose();
      return;
    }

    setIsLoading(true);
    setShowSuccessBadge(false);
    setShowErrorBadge(false);
    setErrorMessage('');

    try {
      const token = getAccessToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/businesses/${workspaceId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: workspaceName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to update workspace: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setShowSuccessBadge(true);
        setHasChanges(false);
        
        // Auto-hide success badge and close modal after 2 seconds
        setTimeout(() => {
          setShowSuccessBadge(false);
          onClose();
        }, 2000);
      } else {
        throw new Error(result.message || 'Failed to update workspace');
      }
    } catch (err) {
      console.error('Error updating workspace:', err);
      setErrorMessage(err instanceof Error ? err.message : 'Failed to update workspace');
      setShowErrorBadge(true);
      
      // Auto-hide error badge after 5 seconds
      setTimeout(() => {
        setShowErrorBadge(false);
      }, 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiscard = () => {
    setWorkspaceName(initialWorkspaceName);
    setHasChanges(false);
    onClose();
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-blue-100 text-blue-700';
      case 'EDITOR':
        return 'bg-gray-200 text-gray-700';
      case 'VIEWER':
        return 'bg-gray-200 text-gray-600';
      default:
        return 'bg-gray-200 text-gray-600';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Workspace Settings
              </h2>
              <p className="text-gray-600">
                Configure your team environment and access levels.
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Success/Error Badges */}
        {showSuccessBadge && (
          <div className="px-8 pt-6">
            <SuccessBadge message="Workspace updated successfully!" />
          </div>
        )}
        {showErrorBadge && (
          <div className="px-8 pt-6">
            <ErrorBadge message={errorMessage} />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {/* General Information Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-5 h-5 text-blue-600" />
              <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                General Information
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Workspace Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  WORKSPACE NAME
                </label>
                <input
                  type="text"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="Enter workspace name"
                />
              </div>

              {/* Plan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PLAN
                </label>
                <div className="relative">
                  <select
                    value={plan}
                    onChange={(e) => setPlan(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none bg-white cursor-pointer"
                  >
                    <option value="Free">Free</option>
                    <option value="Pro">Pro</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Team Access Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                  Team Access
                </h3>
              </div>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1">
                + ADD MEMBER
              </button>
            </div>

            {/* Team Members List */}
            <div className="space-y-3">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                      {getInitials(member.name)}
                    </div>
                    {/* Name and Email */}
                    <div>
                      <div className="font-semibold text-gray-900">
                        {member.name}
                      </div>
                      <div className="text-sm text-gray-600">{member.email}</div>
                    </div>
                  </div>
                  {/* Role Badge */}
                  <span
                    className={`px-3 py-1 rounded-md text-sm font-semibold ${getRoleBadgeColor(
                      member.role
                    )}`}
                  >
                    {member.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Live Sync Section */}
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    Live Sync Enabled
                  </div>
                  <div className="text-sm text-gray-600">
                    Real-time collaborative updates across all devices.
                  </div>
                </div>
              </div>
              {/* Toggle Switch */}
              <button
                onClick={() => setLiveSyncEnabled(!liveSyncEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  liveSyncEnabled ? 'bg-green-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    liveSyncEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-end gap-4">
            <button
              onClick={handleDiscard}
              className="px-6 py-2.5 text-gray-700 font-medium hover:text-gray-900 transition-colors"
            >
              DISCARD CHANGES
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading || !hasChanges}
              className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  SAVING...
                </>
              ) : (
                'SAVE WORKSPACE'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
