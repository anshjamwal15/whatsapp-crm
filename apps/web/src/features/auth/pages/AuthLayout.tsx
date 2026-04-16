import { useState } from 'react';
import { Login } from './Login';
import { Signup } from './Signup';

type AuthMode = 'login' | 'signup';

export const AuthLayout = () => {
  const [mode, setMode] = useState<AuthMode>('login');

  return (
    <div className="min-h-screen bg-gray-50">
      {mode === 'login' ? (
        <Login onSwitchToSignup={() => setMode('signup')} />
      ) : (
        <Signup onSwitchToLogin={() => setMode('login')} />
      )}
    </div>
  );
};
