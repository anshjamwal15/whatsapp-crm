import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks';
import { Login } from './Login.js';
import { Signup } from './Signup.js';

type AuthMode = 'login' | 'signup';

export const AuthLayout = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

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
