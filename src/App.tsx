import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
// Feature pages
import { LoginScreen } from '@/features/auth/pages/LoginScreen';
import { DashboardScreen } from '@/features/dashboard/pages/DashboardScreen';
import { AssessmentScreen } from '@/features/assessment/pages/AssessmentScreen';
import { ResultsScreen } from '@/features/assessment/pages/ResultsScreen';
import { ScheduleScreen } from '@/features/schedule/pages/ScheduleScreen';
// import { ProfileScreen } from './screens_temp/ProfileScreen'; // Assuming it exists or will exist

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  // TODO: Add auth check logic here once Login is working with Supabase
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="font-sans text-foreground bg-background min-h-screen">
          <Routes>
            <Route path="/login" element={<LoginScreen onNavigate={() => { }} />} />

            <Route path="/" element={
              <PrivateRoute>
                <DashboardScreen onNavigate={() => { }} />
              </PrivateRoute>
            } />

            <Route path="/assessment" element={
              <PrivateRoute>
                <AssessmentScreen onNavigate={() => { }} />
              </PrivateRoute>
            } />

            <Route path="/results" element={
              <PrivateRoute>
                <ResultsScreen onNavigate={() => { }} />
              </PrivateRoute>
            } />

            <Route path="/schedule" element={
              <PrivateRoute>
                <ScheduleScreen onNavigate={() => { }} />
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