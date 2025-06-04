import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ResourcesPage from './pages/ResourcesPage';
import ResourceDetailPage from './pages/ResourceDetailPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import SignupPage from './pages/SignupPage';
import HelpPage from './pages/HelpPage';
import AssistePage from './pages/AssistePage';
import AdmissionPage from './pages/AdmissionPage';
import AdmissionDetailPage from './pages/AdmissionDetailPage';
import { StepEditor as AdminKETEditPage } from './pages/AdminKETEditPage';
import AdminCOMEDKEditPage from './pages/AdminCOMEDKEditPage';
import AdminManagementEditPage from './pages/AdminManagementEditPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { initializeLocalStorage } from './utils/localStorage';
import AdmissionHelpPage from './pages/AdmissionHelpPage';
import AdminAdmissionHelpRequestsPage from './pages/AdminAdmissionHelpRequestsPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ProfilePage from './pages/ProfilePage';
import AuthCallbackPage from './pages/AuthCallbackPage';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode, requireAdmin?: boolean }> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/resources" element={<ResourcesPage />} />
      <Route path="/resources/:id" element={<ResourceDetailPage />} />
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute requireAdmin>
            <AdminDashboardPage />
          </ProtectedRoute>
        } 
      />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/help" element={<ProtectedRoute><HelpPage /></ProtectedRoute>} />
      <Route path="/assiste" element={<ProtectedRoute requireAdmin><AssistePage /></ProtectedRoute>} />
      <Route path="/admission" element={<AdmissionPage />} />
      <Route path="/admission/:type" element={<AdmissionDetailPage />} />
      <Route path="/admin/admission/ket" element={<ProtectedRoute requireAdmin><AdminKETEditPage type="ket" label="KET Admission" /></ProtectedRoute>} />
      <Route path="/admin/admission/comedk" element={<ProtectedRoute requireAdmin><AdminCOMEDKEditPage /></ProtectedRoute>} />
      <Route path="/admin/admission/management" element={<ProtectedRoute requireAdmin><AdminManagementEditPage /></ProtectedRoute>} />
      <Route path="/admission/:type/help" element={<AdmissionHelpPage />} />
      <Route path="/admin/admission/:type/help-requests" element={<ProtectedRoute requireAdmin><AdminAdmissionHelpRequestsPage /></ProtectedRoute>} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      <Route path="/auth/verify" element={<AuthCallbackPage />} />
      <Route path="/auth/reset" element={<AuthCallbackPage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

function App() {
  useEffect(() => {
    // Initialize local storage data when app loads
    initializeLocalStorage();
  }, []);

  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;