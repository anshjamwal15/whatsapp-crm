import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthLayout, ResetPassword } from './features/auth';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthLayout />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/" element={<Navigate to="/auth" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
