import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks';

export const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState<'request' | 'reset' | 'confirmation'>('request');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [success, setSuccess] = useState('');
  const { resetPassword, isLoading, error } = useAuth();

  const token = searchParams.get('token');

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    setSuccess('');

    try {
      await resetPassword(email);
      setStep('confirmation');
    } catch (err) {
      console.error('Reset request failed:', err);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    try {
      // TODO: Implement password reset with token
      console.log('Reset password with token:', token);
      setSuccess('Password reset successfully. You can now login.');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        window.location.href = '/auth';
      }, 2000);
    } catch (err) {
      console.error('Reset password failed:', err);
    }
  };

  const displayError = localError || error;

  // Confirmation screen after email sent
  if (step === 'confirmation') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <span className="text-xl font-bold text-gray-900">NEXUS CRM</span>
          </div>
        </div>
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-green-400 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-center text-2xl font-bold text-gray-900">
              Check your email
            </h2>
            <p className="text-center text-sm text-gray-600">
              We've sent a password reset link to <span className="font-semibold text-blue-600">{email}</span>. Please check your inbox and click the link to continue.
            </p>
          </div>

          <div>
            <button
              onClick={() => window.location.href = '/auth'}
              className="w-full py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-colors"
            >
              Back to Login
            </button>
          </div>

          <div className="text-center">
            <button
              onClick={() => {
                setStep('request');
                setEmail('');
              }}
              className="flex items-center justify-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Didn't receive the email? Click to resend
            </button>
          </div>
        </div>
        <div className="mt-12 text-center text-xs text-gray-600">
          <p>Need help? Contact our support squad at <a href="mailto:support@nexuscollaborative.com" className="font-semibold text-blue-600 hover:text-blue-700">support@nexuscollaborative.com</a></p>
        </div>
        <div className="mt-8 flex items-center gap-2 text-xs text-gray-500">
          <div className="flex -space-x-2">
            <div className="w-6 h-6 bg-blue-400 rounded-full border-2 border-white"></div>
            <div className="w-6 h-6 bg-purple-400 rounded-full border-2 border-white"></div>
            <div className="w-6 h-6 bg-pink-400 rounded-full border-2 border-white"></div>
          </div>
          <span className="text-gray-500 uppercase tracking-wide">TEAM NEXUS IS HERE TO HELP</span>
        </div>
      </div>
    );
  }

  if (token) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <span className="text-xl font-bold text-gray-900">NEXUS CRM</span>
          </div>
        </div>
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 space-y-6">
          <div>
            <h2 className="text-center text-2xl font-bold text-gray-900">
              Reset your password
            </h2>
          </div>
          <form className="space-y-6" onSubmit={handleResetPassword}>
            {displayError && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm font-medium text-red-800">{displayError}</p>
              </div>
            )}
            {success && (
              <div className="rounded-md bg-green-50 p-4">
                <p className="text-sm font-medium text-green-800">{success}</p>
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label htmlFor="newPassword" className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  New Password
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="mt-2 appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent sm:text-sm"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="mt-2 appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent sm:text-sm"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:opacity-50 transition-colors"
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
                {!isLoading && <span>→</span>}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center justify-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">N</span>
          </div>
          <span className="text-xl font-bold text-gray-900">NEXUS CRM</span>
        </div>
      </div>
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 space-y-6">
        <div>
          <h2 className="text-center text-2xl font-bold text-gray-900">
            Forgot your password?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleRequestReset}>
          {displayError && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm font-medium text-red-800">{displayError}</p>
            </div>
          )}
          {success && (
            <div className="rounded-md bg-green-50 p-4">
              <p className="text-sm font-medium text-green-800">{success}</p>
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Email Address
            </label>
            <div className="mt-2 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="pl-12 appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent sm:text-sm"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
              {!isLoading && <span>→</span>}
            </button>
          </div>

          <div className="text-center text-sm">
            <a href="/auth" className="flex items-center justify-center gap-1 font-semibold text-blue-600 hover:text-blue-700 transition-colors">
              <span>←</span> Back to sign in
            </a>
          </div>
        </form>
      </div>
      <div className="mt-12 text-center text-xs text-gray-500">
        <p>Need help? Contact our <a href="#" className="font-semibold text-blue-600 hover:text-blue-700">technical support team</a> or visit the <a href="#" className="font-semibold text-blue-600 hover:text-blue-700">Help Center</a>.</p>
      </div>
    </div>
  );
};
