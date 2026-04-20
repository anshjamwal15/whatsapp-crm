import { useState, useEffect } from 'react';
import {
  Users,
  Zap,
  MessageSquare,
  Search,
  SlidersHorizontal,
  UserPlus,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Edit2,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { AppLayout } from '@/layouts';
import { AddTeamMemberModal } from '@/components';
import { useSuccessBadge, useErrorBadge } from '@/components';
import { useWorkspace } from '@/hooks';
import { getAccessToken } from '@/lib/api';

// ─── Types ────────────────────────────────────────────────────────────────────

type Role = 'Owner' | 'Manager' | 'Agent' | 'External';
type Status = 'Active' | 'Inactive' | 'Pending';
type RoleFilter = 'All Roles' | 'Managers' | 'Agents' | 'External';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: Status;
  activeThreads: number;
  lastActive: string;
  avatarUrl?: string;
  avatarInitials?: string;
  avatarColor?: string;
}

// ─── API Types ────────────────────────────────────────────────────────────────

interface ApiMember {
  id: string;
  businessId: string;
  userId: string;
  role: string;
  status: string;
  isDefaultWorkspace: boolean;
  joinedAt: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  userProfileImageUrl?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  'bg-blue-500', 'bg-purple-500', 'bg-green-500',
  'bg-orange-500', 'bg-pink-500', 'bg-teal-500',
];

const mapApiRole = (role: string): Role => {
  if (role === 'admin') return 'Owner';
  if (role === 'member') return 'Agent';
  if (role === 'viewer') return 'External';
  return 'Agent';
};

const mapApiStatus = (status: string): Status => {
  if (status === 'active') return 'Active';
  if (status === 'inactive') return 'Inactive';
  if (status === 'pending') return 'Pending';
  return 'Inactive';
};

const getInitials = (name: string): string =>
  name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

const apiMemberToTeamMember = (m: ApiMember, index: number): TeamMember => ({
  id: m.id,
  name: m.userName,
  email: m.userEmail,
  role: mapApiRole(m.role),
  status: mapApiStatus(m.status),
  activeThreads: 0,
  lastActive: new Date(m.joinedAt).toLocaleDateString(),
  avatarUrl: m.userProfileImageUrl,
  avatarInitials: m.userProfileImageUrl ? undefined : getInitials(m.userName),
  avatarColor: m.userProfileImageUrl ? undefined : AVATAR_COLORS[index % AVATAR_COLORS.length],
});

const mapUiRoleToApi = (role: string): 'admin' | 'member' | 'viewer' => {
  if (role === 'Owner') return 'admin';
  if (role === 'Manager') return 'admin';
  if (role === 'External') return 'viewer';
  return 'member'; // Agent
};

const PAGE_SIZE = 4;

// ─── Sub-components ───────────────────────────────────────────────────────────

const RoleBadge = ({ role }: { role: Role }) => {
  const styles: Record<Role, string> = {
    Owner: 'bg-blue-100 text-blue-700 border border-blue-200',
    Manager: 'bg-indigo-100 text-indigo-700 border border-indigo-200',
    Agent: 'bg-gray-100 text-gray-600 border border-gray-200',
    External: 'bg-gray-100 text-gray-600 border border-gray-200',
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-md uppercase tracking-wide ${styles[role]}`}>
      {role}
    </span>
  );
};

const StatusDot = ({ status }: { status: Status }) => {
  const dotColor: Record<Status, string> = {
    Active: 'bg-green-500',
    Inactive: 'bg-gray-400',
    Pending: 'bg-blue-400',
  };
  const textColor: Record<Status, string> = {
    Active: 'text-gray-700',
    Inactive: 'text-gray-500',
    Pending: 'text-gray-500',
  };
  return (
    <span className={`flex items-center gap-1.5 text-sm ${textColor[status]}`}>
      <span className={`w-2 h-2 rounded-full ${dotColor[status]}`} />
      {status}
    </span>
  );
};

const MemberAvatar = ({ member }: { member: TeamMember }) => {
  const isOnline = member.status === 'Active';
  return (
    <div className="relative flex-shrink-0">
      {member.avatarUrl ? (
        <img
          src={member.avatarUrl}
          alt={member.name}
          className="w-10 h-10 rounded-full object-cover"
        />
      ) : (
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold ${member.avatarColor ?? 'bg-gray-400'}`}
        >
          {member.avatarInitials}
        </div>
      )}
      <span
        className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
          isOnline ? 'bg-green-500' : member.status === 'Pending' ? 'bg-blue-400' : 'bg-gray-400'
        }`}
      />
    </div>
  );
};

// ─── Change Role Modal ────────────────────────────────────────────────────────

const API_ROLES = ['admin', 'member', 'viewer'] as const;
type ApiRole = typeof API_ROLES[number];

const API_ROLE_LABELS: Record<ApiRole, string> = {
  admin: 'Owner',
  member: 'Agent',
  viewer: 'External',
};

const uiRoleToApiRole = (role: Role): ApiRole => {
  if (role === 'Owner') return 'admin';
  if (role === 'External') return 'viewer';
  return 'member';
};

const ChangeRoleModal = ({
  member,
  isLoading,
  onConfirm,
  onCancel,
}: {
  member: TeamMember;
  isLoading: boolean;
  onConfirm: (role: ApiRole) => void;
  onCancel: () => void;
}) => {
  const [selectedRole, setSelectedRole] = useState<ApiRole>(uiRoleToApiRole(member.role));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Change role</h2>
        <p className="text-sm text-gray-500 mb-5">
          Update the role for{' '}
          <span className="font-semibold text-gray-700">{member.name}</span>.
        </p>

        {/* Role options */}
        <div className="space-y-2 mb-6">
          {API_ROLES.map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
                selectedRole === role
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span>{API_ROLE_LABELS[role]}</span>
              <span
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  selectedRole === role ? 'border-blue-500' : 'border-gray-300'
                }`}
              >
                {selectedRole === role && (
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                )}
              </span>
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(selectedRole)}
            disabled={isLoading || selectedRole === uiRoleToApiRole(member.role)}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};



const DisableMemberModal = ({
  member,
  isLoading,
  onConfirm,
  onCancel,
}: {
  member: TeamMember;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6">
      {/* Icon */}
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50 mx-auto mb-4">
        <AlertTriangle className="w-6 h-6 text-red-500" />
      </div>

      {/* Text */}
      <h2 className="text-lg font-bold text-gray-900 text-center mb-1">Disable member</h2>
      <p className="text-sm text-gray-500 text-center mb-6">
        Are you sure you want to disable{' '}
        <span className="font-semibold text-gray-700">{member.name}</span>? They will lose
        access to this workspace immediately.
      </p>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Disabling...' : 'Disable'}
        </button>
      </div>
    </div>
  </div>
);


export const TeamManagement = () => {
  const { activeWorkspaceId } = useWorkspace();
  const { showSuccess, SuccessBadgeComponent } = useSuccessBadge();
  const { showError, ErrorBadgeComponent } = useErrorBadge();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('All Roles');
  const [currentPage, setCurrentPage] = useState(1);
  const [showInvite, setShowInvite] = useState(false);
  const [disableTarget, setDisableTarget] = useState<TeamMember | null>(null);
  const [isDisabling, setIsDisabling] = useState(false);
  const [roleTarget, setRoleTarget] = useState<TeamMember | null>(null);
  const [isChangingRole, setIsChangingRole] = useState(false);

  // Invite member
  const handleInviteMember = async (data: { name: string; email: string; phone: string; role: string }) => {
    if (!activeWorkspaceId) throw new Error('No active workspace');

    const token = getAccessToken();
    const response = await fetch(
      `${(import.meta.env.VITE_API_URL as string | undefined) || 'http://localhost:3000/api'}/businesses/${activeWorkspaceId}/members`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          email: data.email,
          name: data.name,
          role: mapUiRoleToApi(data.role),
          ...(data.phone ? { phone: data.phone } : {}),
        }),
      }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      const message = (err as { error?: string }).error ?? `Failed to invite member: ${response.status}`;
      showError(message, 'Invite failed');
      throw new Error(message);
    }

    const json = await response.json();
    const raw = (json.data ?? json) as ApiMember & { user?: { name: string; email: string; phone?: string; profileImageUrl?: string } };

    // Normalise: POST response has nested `user`, list response has flat fields
    const normalised: ApiMember = {
      id: raw.id,
      businessId: raw.businessId,
      userId: raw.userId,
      role: raw.role,
      status: raw.status,
      isDefaultWorkspace: raw.isDefaultWorkspace,
      joinedAt: raw.joinedAt,
      userName: raw.user?.name ?? raw.userName,
      userEmail: raw.user?.email ?? raw.userEmail,
      userPhone: raw.user?.phone ?? raw.userPhone,
      userProfileImageUrl: raw.user?.profileImageUrl ?? raw.userProfileImageUrl,
    };

    setMembers((prev) => [...prev, apiMemberToTeamMember(normalised, prev.length)]);
    showSuccess(`${normalised.userName} has been added to the workspace.`, 'Member invited!');
  };

  // Disable member
  const handleDisableMember = async () => {
    if (!activeWorkspaceId || !disableTarget) return;
    setIsDisabling(true);
    try {
      const token = getAccessToken();
      const response = await fetch(
        `${(import.meta.env.VITE_API_URL as string | undefined) || 'http://localhost:3000/api'}/businesses/${activeWorkspaceId}/members/${disableTarget.id}`,
        {
          method: 'DELETE',
          headers: {
            accept: 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        const message = (err as { error?: string }).error ?? `Failed to disable member: ${response.status}`;
        showError(message, 'Action failed');
        return;
      }
      setMembers((prev) => prev.filter((m) => m.id !== disableTarget.id));
      showSuccess(`${disableTarget.name} has been disabled.`, 'Member disabled');
      setDisableTarget(null);
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to disable member', 'Action failed');
    } finally {
      setIsDisabling(false);
    }
  };

  // Change member role
  const handleChangeRole = async (newRole: ApiRole) => {
    if (!activeWorkspaceId || !roleTarget) return;
    setIsChangingRole(true);
    try {
      const token = getAccessToken();
      const response = await fetch(
        `${(import.meta.env.VITE_API_URL as string | undefined) || 'http://localhost:3000/api'}/businesses/${activeWorkspaceId}/members/${roleTarget.id}/role`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            accept: 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ role: newRole }),
        }
      );
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        const message = (err as { error?: string }).error ?? `Failed to change role: ${response.status}`;
        showError(message, 'Action failed');
        return;
      }
      setMembers((prev) =>
        prev.map((m) =>
          m.id === roleTarget.id ? { ...m, role: mapApiRole(newRole) } : m
        )
      );
      showSuccess(`${roleTarget.name}'s role has been updated to ${API_ROLE_LABELS[newRole]}.`, 'Role updated');
      setRoleTarget(null);
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to change role', 'Action failed');
    } finally {
      setIsChangingRole(false);
    }
  };

  // Fetch members from API
  useEffect(() => {
    if (!activeWorkspaceId) return;

    const fetchMembers = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = getAccessToken();
        const response = await fetch(
          `${(import.meta.env.VITE_API_URL as string | undefined) || 'http://localhost:3000/api'}/businesses/${activeWorkspaceId}/members`,
          {
            headers: {
              accept: 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch members: ${response.status}`);
        }
        const json = await response.json();
        const raw: ApiMember[] = json.data ?? json;
        setMembers(raw.map(apiMemberToTeamMember));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load members');
      } finally {
        setLoading(false);
      }
    };

    void fetchMembers();
  }, [activeWorkspaceId]);

  // Derived stats
  const totalMembers = members.length;
  const activeNow = members.filter((m) => m.status === 'Active').length;
  const liveConvos = members.reduce((sum, m) => sum + m.activeThreads, 0);

  // Filtering
  const filtered = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.role.toLowerCase().includes(search.toLowerCase());

    const matchesRole =
      roleFilter === 'All Roles' ||
      (roleFilter === 'Managers' && m.role === 'Manager') ||
      (roleFilter === 'Agents' && m.role === 'Agent') ||
      (roleFilter === 'External' && m.role === 'External');

    return matchesSearch && matchesRole;
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleRoleFilter = (f: RoleFilter) => {
    setRoleFilter(f);
    setCurrentPage(1);
  };

  const handleSearch = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const roleFilters: RoleFilter[] = ['All Roles', 'Managers', 'Agents', 'External'];

  return (
    <AppLayout>
      {SuccessBadgeComponent}
      {ErrorBadgeComponent}
      <main className="flex-1 overflow-y-auto bg-slate-50">
        <div className="max-w-6xl mx-auto px-6 py-8 w-full">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wide font-semibold mb-4">
            <span>Organization</span>
            <span className="text-gray-400">›</span>
            <span className="text-gray-700">Team Management</span>
          </div>

          {/* Page Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
              <p className="text-gray-500 mt-1 max-w-lg text-sm leading-relaxed">
                Coordinate your architectural workflow by managing roles, permissions,
                and active collaboration metrics for your workspace members.
              </p>
            </div>
            <button
              onClick={() => setShowInvite(true)}
              className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm flex-shrink-0"
            >
              <UserPlus className="w-4 h-4" />
              Invite Team Member
            </button>
          </div>

          {/* Stats Cards */}
          {/*
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-0.5">
                  Total Members
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-gray-900">{totalMembers}</span>
                  <span className="flex items-center gap-0.5 text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                    <TrendingUp className="w-3 h-3" />
                    +2
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-0.5">
                  Active Now
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-gray-900">{activeNow}</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-6 h-6 text-blue-500" />
              </div>
              <div className="flex-1">
                <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-0.5">
                  Live Convos
                </div>
                <span className="text-3xl font-bold text-gray-900">{liveConvos}</span>
              </div>
            </div>
          </div>
          */}
          {/* Search & Filters */}
          <div className="bg-white rounded-2xl border border-gray-200 px-4 py-3 flex flex-wrap items-center gap-3 mb-4">
            {/* Search */}
            <div className="flex items-center gap-2 flex-1 min-w-48">
              <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search by name, email or role..."
                className="text-sm w-full outline-none text-gray-700 placeholder-gray-400"
              />
            </div>

            {/* Divider */}
            <div className="h-6 w-px bg-gray-200" />

            {/* Filters button */}
            <button className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors px-2 py-1 rounded-lg hover:bg-gray-50">
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>

            {/* Role filter tabs */}
            <div className="flex items-center gap-1">
              {roleFilters.map((f) => (
                <button
                  key={f}
                  onClick={() => handleRoleFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    roleFilter === f
                      ? 'bg-white border border-gray-300 text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Members Table */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-[2fr_1fr_1fr_2fr_1fr] px-6 py-3 border-b border-gray-100">
              {['Member', 'Role', 'Status', 'Activity', 'Actions'].map((col) => (
                <div key={col} className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {col}
                </div>
              ))}
            </div>

            {/* Rows */}
            {loading ? (
              <div className="py-16 text-center text-gray-400 text-sm">
                Loading members...
              </div>
            ) : error ? (
              <div className="py-16 text-center text-red-400 text-sm">
                {error}
              </div>
            ) : paginated.length === 0 ? (
              <div className="py-16 text-center text-gray-400 text-sm">
                No members match your search.
              </div>
            ) : (
              paginated.map((member, idx) => (
                <div
                  key={member.id}
                  className={`grid grid-cols-[2fr_1fr_1fr_2fr_1fr] px-6 py-4 items-center hover:bg-gray-50 transition-colors ${
                    idx < paginated.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  {/* Member */}
                  <div className="flex items-center gap-3">
                    <MemberAvatar member={member} />
                    <div>
                      <div className="text-sm font-semibold text-blue-600 hover:underline cursor-pointer">
                        {member.name}
                      </div>
                      <div className="text-xs text-gray-500">{member.email}</div>
                    </div>
                  </div>

                  {/* Role */}
                  <div>
                    <RoleBadge role={member.role} />
                  </div>

                  {/* Status */}
                  <div>
                    <StatusDot status={member.status} />
                  </div>

                  {/* Activity */}
                  <div>
                    <div className="text-sm font-semibold text-gray-800">
                      {member.activeThreads} Active Thread{member.activeThreads !== 1 ? 's' : ''}
                    </div>
                    <div className="text-xs text-gray-400">
                      {member.lastActive === 'Never logged in'
                        ? 'Never logged in'
                        : `Last active ${member.lastActive}`}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setRoleTarget(member)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label="Edit member"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDisableTarget(member)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                      aria-label="Remove member"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {/* <button
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label="More options"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button> */}
                  </div>
                </div>
              ))
            )}

            {/* Table Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Showing {Math.min((safePage - 1) * PAGE_SIZE + 1, filtered.length)}–
                {Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length} member
                {filtered.length !== 1 ? 's' : ''}
              </span>

              {/* Pagination */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                  className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                      page === safePage
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage === totalPages}
                  className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Invite Modal */}
      {showInvite && (
        <AddTeamMemberModal
          isOpen={showInvite}
          onClose={() => setShowInvite(false)}
          onSubmit={handleInviteMember}
        />
      )}

      {/* Disable Member Modal */}
      {disableTarget && (
        <DisableMemberModal
          member={disableTarget}
          isLoading={isDisabling}
          onConfirm={handleDisableMember}
          onCancel={() => setDisableTarget(null)}
        />
      )}

      {/* Change Role Modal */}
      {roleTarget && (
        <ChangeRoleModal
          member={roleTarget}
          isLoading={isChangingRole}
          onConfirm={handleChangeRole}
          onCancel={() => setRoleTarget(null)}
        />
      )}
    </AppLayout>
  );
};
