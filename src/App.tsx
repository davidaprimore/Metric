import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
// Feature pages
import { WelcomeScreen } from '@/features/auth/pages/WelcomeScreen';
import { LoginScreen } from '@/features/auth/pages/LoginScreen';
import { RegisterScreen } from '@/features/auth/pages/RegisterScreen';
import { RegisterStep2 } from '@/features/auth/pages/RegisterStep2';
import { DashboardScreen } from '@/features/dashboard/pages/DashboardScreen';
import { AssessmentScreen } from '@/features/assessment/pages/AssessmentScreen';
import { ResultsScreen } from '@/features/assessment/pages/ResultsScreen';
import { ScheduleScreen } from '@/features/schedule/pages/ScheduleScreen';
// import { ProfileScreen } from './screens_temp/ProfileScreen'; // Assuming it exists or will exist

import { useAuth } from '@/contexts/AuthContext';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();

  if (loading) return <div className="min-h-screen bg-dark flex items-center justify-center text-primary font-bold animate-pulse">CARREGANDO...</div>;

  if (!session) {
    return <Navigate to="/welcome" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="font-sans text-foreground bg-background min-h-screen">
          <Routes>
            <Route path="/welcome" element={<WelcomeScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/register-step-2" element={<RegisterStep2 />} />

            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            <Route path="/dashboard" element={
              <PrivateRoute>
                <DashboardScreen />
              </PrivateRoute>
            } />

            <Route path="/assessment" element={
              <PrivateRoute>
                <AssessmentScreen />
              </PrivateRoute>
            } />

            <Route path="/results" element={
              <PrivateRoute>
                <ResultsScreen />
              </PrivateRoute>
            } />

            <Route path="/schedule" element={
              <PrivateRoute>
                <ScheduleScreen />
              </PrivateRoute>
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;