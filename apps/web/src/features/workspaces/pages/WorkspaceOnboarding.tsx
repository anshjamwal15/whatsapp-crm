import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Users, Zap, CheckCircle2, ChevronDown, UserPlus, Download, Info, RefreshCw, LayoutDashboard, Inbox, UserPlus as UserPlusIcon, MessageSquare, ChevronRight } from 'lucide-react';
import { useSuccessBadge } from '../../../components/index.js';

type TeamSize = '1-5' | '6-20' | '21-50' | '50+';
type MemberRole = 'Owner' | 'Manager' | 'Agent';
type MemberStatus = 'ACTIVE' | 'PENDING';

interface TeamMember {
  id: string;
  fullName: string;
  email: string;
  role: MemberRole;
  status: MemberStatus;
  avatar?: string;
}

interface NewMemberForm {
  fullName: string;
  email: string;
  role: MemberRole;
}

interface OnboardingFormData {
  businessName: string;
  category: string;
  ownerName: string;
  whatsappConnection: string;
  teamSize: TeamSize;
  timezone: string;
}

const categories = [
  'Creative Agency',
  'E-commerce',
  'Real Estate',
  'Healthcare',
  'Education',
  'Technology',
  'Consulting',
  'Other',
];

const teamSizeOptions: TeamSize[] = ['1-5', '6-20', '21-50', '50+'];

const roleOptions: MemberRole[] = ['Owner', 'Manager', 'Agent'];

export const WorkspaceOnboarding = () => {
  const navigate = useNavigate();
  const { showSuccess, SuccessBadgeComponent } = useSuccessBadge();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingFormData>({
    businessName: '',
    category: 'Creative Agency',
    ownerName: '',
    whatsappConnection: '',
    teamSize: '6-20',
    timezone: 'PST (UTC-8:00) Pacific Standard Time',
  });

  const [newMember, setNewMember] = useState<NewMemberForm>({
    fullName: '',
    email: '',
    role: 'Agent',
  });

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      fullName: 'Sarah Chen',
      email: 'sarah.c@nexus.ai',
      role: 'Owner',
      status: 'ACTIVE',
      avatar: '👩‍💼',
    },
    {
      id: '2',
      fullName: 'Marcus Holloway',
      email: 'm.holloway@nexus.ai',
      role: 'Manager',
      status: 'PENDING',
      avatar: '👨‍💼',
    },
    {
      id: '3',
      fullName: 'Elena Rodriguez',
      email: 'elena.r@nexus.ai',
      role: 'Agent',
      status: 'PENDING',
      avatar: '👩‍💻',
    },
  ]);

  const [qrCodeStatus, setQrCodeStatus] = useState<'generating' | 'ready'>('generating');

  const steps = [
    { id: 1, label: 'Workspace Setup', icon: Building2 },
    { id: 2, label: 'Team Access', icon: Users },
    { id: 3, label: 'WhatsApp Link', icon: Zap },
    { id: 4, label: 'Finish', icon: CheckCircle2 },
  ];

  const handleInputChange = (field: keyof OnboardingFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTeamSizeSelect = (size: TeamSize) => {
    setFormData((prev) => ({ ...prev, teamSize: size }));
  };

  const handleContinue = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      // Show success message when moving to next step
      const stepMessages = [
        'Workspace setup completed successfully!',
        'Team members invited successfully!',
        'WhatsApp account connected successfully!',
      ];
      if (currentStep <= 3) {
        showSuccess(stepMessages[currentStep - 1]);
      }
    } else {
      // Complete onboarding
      showSuccess('Workspace onboarding completed!');
      setTimeout(() => navigate('/workspaces'), 1500);
    }
  };

  const handleSkip = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      navigate('/workspaces');
    }
  };

  const handleNewMemberChange = (field: keyof NewMemberForm, value: string) => {
    setNewMember((prev) => ({ ...prev, [field]: value }));
  };

  const handleInviteMember = () => {
    if (newMember.fullName && newMember.email) {
      const newTeamMember: TeamMember = {
        id: Date.now().toString(),
        fullName: newMember.fullName,
        email: newMember.email,
        role: newMember.role,
        status: 'PENDING',
      };
      setTeamMembers([...teamMembers, newTeamMember]);
      setNewMember({ fullName: '', email: '', role: 'Agent' });
      showSuccess(`Invitation sent to ${newMember.fullName}`, 'Success');
    }
  };

  const handleExportMemberList = () => {
    console.log('Exporting member list:', teamMembers);
  };

  const handleRefreshQRCode = () => {
    setQrCodeStatus('generating');
    // Simulate QR code generation
    setTimeout(() => {
      setQrCodeStatus('ready');
    }, 2000);
  };

  const isStepComplete = (stepId: number) => {
    return stepId < currentStep;
  };

  const isStepActive = (stepId: number) => {
    return stepId === currentStep;
  };

  return (
    <>
      {/* Success Badge - Appears on top of everything */}
      {SuccessBadgeComponent}
      
      <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 p-8 flex flex-col">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Onboarding</h2>
              <p className="text-sm text-gray-500">Step {currentStep} of 4</p>
            </div>
          </div>
        </div>

        {/* Steps */}
        <nav className="space-y-2 mb-8">
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = isStepActive(step.id);
            const isComplete = isStepComplete(step.id);

            return (
              <div
                key={step.id}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-blue-50 border-l-4 border-blue-600'
                    : isComplete
                    ? 'text-gray-600'
                    : 'text-gray-400'
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    isActive ? 'text-blue-600' : isComplete ? 'text-gray-600' : 'text-gray-400'
                  }`}
                />
                <span
                  className={`font-medium ${
                    isActive ? 'text-blue-900' : isComplete ? 'text-gray-700' : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
                {isComplete && (
                  <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto" />
                )}
              </div>
            );
          })}
        </nav>

        {/* Save Changes Button */}
        {/*<div className="mt-auto">
          <button
            onClick={handleSaveChanges}
            className="bg-blue-600 text-white px-16 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            Save Changes
          </button>
        </div>
        */}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-3xl">
          {/* Step Indicator */}
          <div className="mb-8 flex items-center justify-end">
            <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-4 py-2 rounded-full">
              STEP {String(currentStep).padStart(2, '0')}
            </span>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12">
            {currentStep === 1 && <WorkspaceSetupStep />}
            {currentStep === 2 && <TeamAccessStep />}
            {currentStep === 3 && <WhatsAppLinkStep />}
            {currentStep === 4 && <FinishStep />}
          </div>
        </div>
      </div>
    </div>
    </>
  );

  // Step 1: Workspace Setup Component
  function WorkspaceSetupStep() {
    return (
      <>
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Build your workspace</h1>
          <div className="w-24 h-1 bg-blue-600 mb-6"></div>
          <p className="text-gray-600 text-lg leading-relaxed">
            Let's lay the foundation for your collaborative CRM. Your workspace is where teams,
            WhatsApp flows, and customer data converge.
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Business Name & Category Row */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                BUSINESS NAME
              </label>
              <input
                type="text"
                placeholder="e.g. Acme Studio"
                value={formData.businessName}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
                className="w-full px-4 py-3 bg-blue-50 border border-blue-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CATEGORY</label>
              <div className="relative">
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-4 py-3 bg-blue-50 border border-blue-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all appearance-none cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Owner Name & WhatsApp Connection Row */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">OWNER NAME</label>
              <input
                type="text"
                placeholder="Full name"
                value={formData.ownerName}
                onChange={(e) => handleInputChange('ownerName', e.target.value)}
                className="w-full px-4 py-3 bg-blue-50 border border-blue-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                WHATSAPP CONNECTION
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <img
                    src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2325D366'%3E%3Cpath d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z'/%3E%3C/svg%3E"
                    alt="WhatsApp"
                    className="w-5 h-5"
                  />
                </div>
                <input
                  type="text"
                  placeholder="000-000-0000"
                  value={formData.whatsappConnection}
                  onChange={(e) => handleInputChange('whatsappConnection', e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-blue-50 border border-blue-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Team Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              ESTIMATED TEAM SIZE
            </label>
            <div className="grid grid-cols-4 gap-3">
              {teamSizeOptions.map((size) => (
                <button
                  key={size}
                  onClick={() => handleTeamSizeSelect(size)}
                  className={`py-3 px-4 rounded-lg font-medium transition-all ${
                    formData.teamSize === size
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Timezone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              WORKSPACE TIMEZONE
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.timezone}
                onChange={(e) => handleInputChange('timezone', e.target.value)}
                className="w-full px-4 py-3 bg-blue-50 border border-blue-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors">
                <svg
                  className="w-4 h-4 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Collaborative Sync Status */}
          <div className="flex items-center gap-2 pt-4">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Collaborative sync active</span>
          </div>

          {/* Continue Button */}
          <div className="flex justify-between pt-6">
            <button
              onClick={handleSkip}
              className="text-gray-600 px-8 py-3 rounded-lg font-semibold hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              Skip for now
            </button>
            <button
              onClick={handleContinue}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              Continue
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>
          </div>
        </div>
      </>
    );
  }

  // Step 2: Team Access Component
  function TeamAccessStep() {
    return (
      <>
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Invite your team</h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Bring your colleagues into the Nexus to start building high-performance workflows
            together.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-5 gap-8">
          {/* Left: New Member Form */}
          <div className="col-span-2 bg-gray-50 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <Users className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">New Member Details</h3>
            </div>

            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">FULL NAME</label>
                <input
                  type="text"
                  placeholder="e.g. Alex Rivera"
                  value={newMember.fullName}
                  onChange={(e) => handleNewMemberChange('fullName', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder-gray-400"
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  placeholder="alex@company.com"
                  value={newMember.email}
                  onChange={(e) => handleNewMemberChange('email', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder-gray-400"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">ROLE</label>
                <div className="relative">
                  <select
                    value={newMember.role}
                    onChange={(e) => handleNewMemberChange('role', e.target.value as MemberRole)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none cursor-pointer"
                  >
                    {roleOptions.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                </div>
              </div>

              {/* Invite Button */}
              <button
                onClick={handleInviteMember}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg mt-6"
              >
                <UserPlus className="w-5 h-5" />
                Invite Member
              </button>
            </div>
          </div>

          {/* Right: Added Team Members */}
          <div className="col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Added Team Members</h3>
              <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                {teamMembers.length} Members
              </span>
            </div>

            {/* Team Members List */}
            <div className="space-y-3 mb-6">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-xl">
                      {member.avatar || '👤'}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{member.fullName}</h4>
                      <p className="text-sm text-gray-500">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-1">ROLE</p>
                      <p className="font-medium text-gray-900">{member.role}</p>
                    </div>
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        member.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {member.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500 italic">
                Recent invitations expire in 48 hours.
              </p>
              <button
                onClick={handleExportMemberList}
                className="text-blue-600 font-medium text-sm flex items-center gap-2 hover:text-blue-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export Member List
              </button>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="flex justify-between pt-8 mt-8 border-t border-gray-200">
          <button
            onClick={handleSkip}
            className="text-gray-600 px-8 py-3 rounded-lg font-semibold hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            Skip for now
          </button>
          <button
            onClick={handleContinue}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            Continue
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
        </div>
      </>
    );
  }

  // Step 3: WhatsApp Link Component
  function WhatsAppLinkStep() {
    return (
      <>
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Connect your account</h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Scan the QR code with your WhatsApp Business app to link your account to Architect CRM.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-2 gap-12">
          {/* Left: Instructions */}
          <div className="space-y-6">
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-lg">1</span>
              </div>
              <div className="pt-1">
                <p className="text-gray-900 font-medium text-lg">Open WhatsApp on your phone</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-lg">2</span>
              </div>
              <div className="pt-1">
                <p className="text-gray-900 font-medium text-lg">
                  Go to <span className="font-semibold">Settings &gt; Linked Devices</span>
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-lg">3</span>
              </div>
              <div className="pt-1">
                <p className="text-gray-900 font-medium text-lg">
                  Tap on <span className="font-semibold">Link a Device</span> and point your phone
                  to this screen
                </p>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3 mt-8">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700">
                Ensure your phone has a stable internet connection for the initial sync.
              </p>
            </div>
          </div>

          {/* Right: QR Code */}
          <div className="flex flex-col items-center justify-center">
            <div className="bg-gray-100 rounded-2xl p-8 w-full aspect-square flex items-center justify-center mb-6">
              {qrCodeStatus === 'generating' ? (
                <div className="text-center">
                  <RefreshCw className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
                  <p className="text-blue-600 font-semibold text-lg">GENERATING LINK...</p>
                </div>
              ) : (
                <div className="bg-white rounded-xl p-6 shadow-md">
                  {/* QR Code Placeholder */}
                  <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                    <svg
                      className="w-full h-full p-4"
                      viewBox="0 0 100 100"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* Simple QR code pattern */}
                      <rect x="0" y="0" width="20" height="20" fill="#000" />
                      <rect x="25" y="0" width="5" height="5" fill="#000" />
                      <rect x="35" y="0" width="5" height="5" fill="#000" />
                      <rect x="45" y="0" width="10" height="10" fill="#000" />
                      <rect x="60" y="0" width="5" height="5" fill="#000" />
                      <rect x="80" y="0" width="20" height="20" fill="#000" />
                      <rect x="0" y="25" width="5" height="5" fill="#000" />
                      <rect x="15" y="25" width="5" height="5" fill="#000" />
                      <rect x="25" y="25" width="10" height="10" fill="#000" />
                      <rect x="40" y="25" width="5" height="5" fill="#000" />
                      <rect x="50" y="25" width="10" height="10" fill="#000" />
                      <rect x="80" y="25" width="5" height="5" fill="#000" />
                      <rect x="95" y="25" width="5" height="5" fill="#000" />
                      <rect x="0" y="80" width="20" height="20" fill="#000" />
                      <rect x="25" y="80" width="5" height="5" fill="#000" />
                      <rect x="35" y="80" width="10" height="10" fill="#000" />
                      <rect x="50" y="80" width="5" height="5" fill="#000" />
                      <rect x="60" y="80" width="10" height="10" fill="#000" />
                      <rect x="80" y="80" width="20" height="20" fill="#000" />
                      {/* Center logo */}
                      <circle cx="50" cy="50" r="15" fill="#2563EB" />
                      <path
                        d="M45 50 L50 45 L50 55 Z M55 50 L50 55 L50 45 Z"
                        fill="white"
                        transform="rotate(45 50 50)"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleRefreshQRCode}
              disabled={qrCodeStatus === 'generating'}
              className="text-blue-600 font-semibold text-sm flex items-center gap-2 hover:text-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 ${qrCodeStatus === 'generating' ? 'animate-spin' : ''}`} />
              Refresh QR Code
            </button>
          </div>
        </div>

        {/* Continue Button */}
        <div className="flex justify-between pt-8 mt-8 border-t border-gray-200">
          <button
            onClick={handleSkip}
            className="text-gray-600 px-8 py-3 rounded-lg font-semibold hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            Skip for now
          </button>
          <button
            onClick={handleContinue}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            Continue
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
        </div>
      </>
    );
  }

  // Step 4: Finish Component
  function FinishStep() {
    return (
      <div className="text-center">
        {/* Success Icon */}
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 bg-green-400 rounded-3xl flex items-center justify-center shadow-lg">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-white" strokeWidth={3} />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl font-bold text-gray-900 mb-6">Your workspace is ready!</h1>
        <p className="text-gray-600 text-lg mb-12 max-w-2xl mx-auto">
          You've successfully set up your{' '}
          <span className="text-blue-600 font-semibold">Nexus Collaborative</span> workspace. Your
          team can now start managing WhatsApp conversations with precision.
        </p>

        {/* Action Cards */}
        <div className="grid grid-cols-2 gap-6 mb-12">
          {/* Go to Dashboard Card */}
          <div className="bg-blue-600 rounded-2xl p-8 text-left text-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center mb-6">
              <LayoutDashboard className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Go to Dashboard</h3>
            <p className="text-blue-100 mb-6 leading-relaxed">
              Access your high-performance cockpit and monitor team metrics in real-time.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="text-white font-semibold flex items-center gap-2 hover:gap-3 transition-all"
            >
              Launch Now
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Open Shared Inbox Card */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 text-left shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-green-400 rounded-xl flex items-center justify-center mb-6">
              <Inbox className="w-7 h-7 text-green-700" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Open Shared Inbox</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Jump straight into collaborative conversations and start assigning chats.
            </p>
            <button
              onClick={() => navigate('/inbox')}
              className="text-blue-600 font-semibold flex items-center gap-2 hover:gap-3 transition-all"
            >
              View Inbox
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* What's Next Section */}
        <div className="bg-gray-50 rounded-2xl p-8 text-left">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">What's next?</h3>
              <p className="text-gray-600">Recommended actions to maximize your CRM potential.</p>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-full">
              GROWTH PATH
            </span>
          </div>

          {/* Recommendation Items */}
          <div className="space-y-4">
            {/* Invite more team members */}
            <button className="w-full bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 hover:border-blue-300 hover:shadow-md transition-all group">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <UserPlusIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1 text-left">
                <h4 className="font-semibold text-gray-900 mb-1">Invite more team members</h4>
                <p className="text-sm text-gray-600">
                  Bring your entire collaborative unit onboard.
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </button>

            {/* Create your first message template */}
            <button className="w-full bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 hover:border-blue-300 hover:shadow-md transition-all group">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1 text-left">
                <h4 className="font-semibold text-gray-900 mb-1">
                  Create your first message template
                </h4>
                <p className="text-sm text-gray-600">
                  Standardize responses for high-speed precision.
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </button>
          </div>
        </div>
      </div>
    );
  }
};
