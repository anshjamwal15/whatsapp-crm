import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { AuthLayout, ResetPassword } from '@/features/auth';
import { Dashboard } from '@/features/home';
import { Workspaces, WorkspaceOnboarding } from '@/features/workspaces';
import { TeamManagement } from '@/features/team';
import { ProtectedRoute } from '@/components';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/auth" element={<AuthLayout />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/workspaces"
            element={
              <ProtectedRoute>
                <Workspaces />
              </ProtectedRoute>
            }
          />
          <Route
            path="/workspaces/onboarding"
            element={
              <ProtectedRoute>
                <WorkspaceOnboarding />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/team"
            element={
              <ProtectedRoute>
                <TeamManagement />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
