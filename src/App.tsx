import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
// Feature pages
import { WelcomeScreen } from '@/features/auth/pages/WelcomeScreen';
import { LoginScreen } from '@/features/auth/pages/LoginScreen';
import { RegisterScreen } from '@/features/auth/pages/RegisterScreen';
import { RegisterStep2 } from '@/features/auth/pages/RegisterStep2';
import { RegistrationSuccess } from '@/features/auth/pages/RegistrationSuccess';
import { ForgotPasswordScreen } from '@/features/auth/pages/ForgotPasswordScreen';
import { DashboardScreen } from '@/features/dashboard/pages/DashboardScreen';
import { AssessmentScreen } from '@/features/assessment/pages/AssessmentScreen';
import { AnamnesisScreen } from '@/features/assessment/pages/AnamnesisScreen';
import { ResultsScreen } from '@/features/assessment/pages/ResultsScreen';
import { ScheduleScreen } from '@/features/schedule/pages/ScheduleScreen';
import { ProfileScreen } from '@/features/profile/pages/ProfileScreen';
import { PersonalDataScreen } from '@/features/profile/pages/PersonalDataScreen';
import { UserAppointmentsScreen } from '@/features/profile/pages/UserAppointmentsScreen';
import { SecurityScreen } from '@/features/profile/pages/SecurityScreen';
import { NotificationSettingsScreen } from '@/features/profile/pages/NotificationSettingsScreen';
import { AdminScreen } from '@/features/admin/pages/AdminScreen';
import { AdminRegistrationsScreen } from '@/features/admin/pages/AdminRegistrationsScreen';
import { ProfessionalsScreen } from '@/features/admin/pages/ProfessionalsScreen';
import { UnitsScreen } from '@/features/admin/pages/UnitsScreen';

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
            <Route path="/register-success" element={<RegistrationSuccess />} />
            <Route path="/forgot-password" element={<ForgotPasswordScreen />} />

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

            <Route path="/assessment/anamnesis" element={
              <PrivateRoute>
                <AnamnesisScreen />
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

            <Route path="/profile" element={
              <PrivateRoute>
                <ProfileScreen />
              </PrivateRoute>
            } />

            <Route path="/profile/data" element={
              <PrivateRoute>
                <PersonalDataScreen />
              </PrivateRoute>
            } />

            <Route path="/profile/appointments" element={
              <PrivateRoute>
                <UserAppointmentsScreen />
              </PrivateRoute>
            } />

            <Route path="/profile/security" element={
              <PrivateRoute>
                <SecurityScreen />
              </PrivateRoute>
            } />

            <Route path="/profile/notifications" element={
              <PrivateRoute>
                <NotificationSettingsScreen />
              </PrivateRoute>
            } />

            <Route path="/admin" element={
              <PrivateRoute>
                <AdminScreen />
              </PrivateRoute>
            } />

            <Route path="/admin/registrations" element={
              <PrivateRoute>
                <AdminRegistrationsScreen />
              </PrivateRoute>
            } />

            <Route path="/admin/registrations/professionals" element={
              <PrivateRoute>
                <ProfessionalsScreen />
              </PrivateRoute>
            } />

            <Route path="/admin/registrations/units" element={
              <PrivateRoute>
                <UnitsScreen />
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