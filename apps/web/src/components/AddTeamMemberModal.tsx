import { useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type TeamMemberRole = 'Owner' | 'Manager' | 'Agent' | 'External';

export interface AddTeamMemberFormData {
  name: string;
  email: string;
  phone: string;
  role: TeamMemberRole;
}

interface AddTeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: AddTeamMemberFormData) => void | Promise<void>;
  title?: string;
  description?: string;
  submitButtonText?: string;
  availableRoles?: TeamMemberRole[];
  defaultRole?: TeamMemberRole;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const AddTeamMemberModal = ({
  isOpen,
  onClose,
  onSubmit,
  title = 'Invite Team Member',
  description = 'Send an invitation to join your workspace.',
  submitButtonText = 'Send Invite',
  availableRoles = ['Manager', 'Agent', 'External'],
  defaultRole = 'Agent',
}: AddTeamMemberModalProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<TeamMemberRole>(defaultRole);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (onSubmit) {
      setIsSubmitting(true);
      try {
        await onSubmit({ name, email, phone, role });
        // Reset form on success
        setName('');
        setEmail('');
        setPhone('');
        setRole(defaultRole);
        onClose();
      } catch (error) {
        console.error('Failed to add team member:', error);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // If no onSubmit handler, just close
      onClose();
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      // Reset form on close
      setName('');
      setEmail('');
      setPhone('');
      setRole(defaultRole);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-1">{title}</h2>
        <p className="text-sm text-gray-500 mb-6">{description}</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              disabled={isSubmitting}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="colleague@company.com"
              disabled={isSubmitting}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 7303829493"
              disabled={isSubmitting}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as TeamMemberRole)}
              disabled={isSubmitting}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
            >
              {availableRoles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Sending...' : submitButtonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
