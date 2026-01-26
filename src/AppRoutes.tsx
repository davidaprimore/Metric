import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { PrivateRoute } from '@/components/PrivateRoute';

// Feature pages
import { WelcomeScreen } from '@/features/auth/pages/WelcomeScreen';
import { LoginScreen } from '@/features/auth/pages/LoginScreen';
import { RegisterScreen } from '@/features/auth/pages/RegisterScreen';
import { RegisterStep2 } from '@/features/auth/pages/RegisterStep2';
import { RegistrationSuccess } from '@/features/auth/pages/RegistrationSuccess';
import { ForgotPasswordScreen } from '@/features/auth/pages/ForgotPasswordScreen';
import { DashboardScreen } from '@/features/dashboard/pages/DashboardScreen';
import { AssessmentScreen } from '@/features/assessment/pages/AssessmentScreen';
import { AssessmentWizardScreen } from '@/features/dashboard/pages/AssessmentWizardScreen';
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
import { SpecialtiesScreen } from '@/features/admin/pages/SpecialtiesScreen';
import { ProfessionalRegisterScreen } from '@/features/admin/pages/ProfessionalRegisterScreen';
import { ProfessionalVerificationScreen } from '@/features/admin/pages/ProfessionalVerificationScreen';
import { ApprovalListScreen } from '@/features/admin/pages/ApprovalListScreen';
import { RegisterProfessionalStep2 } from '@/features/auth/pages/RegisterProfessionalStep2';
import { RegisterPendingScreen } from '@/features/auth/pages/RegisterPendingScreen';
import { NotificationCenterScreen } from '@/features/admin/pages/NotificationCenterScreen';
import { ProfessionalDataScreen } from '@/features/profile/pages/ProfessionalDataScreen';
import { AssessmentHistoryScreen } from '@/features/profile/pages/AssessmentHistoryScreen';
import { AssessmentDetailScreen } from '@/features/profile/pages/AssessmentDetailScreen';
import { AppointmentDetailScreen } from '@/features/dashboard/pages/AppointmentDetailScreen';
import { SearchScreen } from '@/features/search/pages/SearchScreen';
import { PatientDetailScreen } from '@/features/dashboard/pages/PatientDetailScreen';

export const AppRoutes = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            {/* @ts-expect-error: Key is required for AnimatePresence but missing in RoutesProps definition */}
            <Routes location={location} key={location.pathname}>
                <Route path="/welcome" element={<WelcomeScreen />} />
                <Route path="/login" element={<LoginScreen />} />
                <Route path="/register" element={<RegisterScreen />} />
                <Route path="/register-step-2" element={<RegisterStep2 />} />
                <Route path="/register-professional-step-2" element={<RegisterProfessionalStep2 />} />
                <Route path="/register-pending" element={<RegisterPendingScreen />} />
                <Route path="/register-success" element={<RegistrationSuccess />} />
                <Route path="/forgot-password" element={<ForgotPasswordScreen />} />

                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                <Route path="/dashboard" element={<PrivateRoute><DashboardScreen /></PrivateRoute>} />

                <Route path="/assessment" element={<PrivateRoute><AssessmentScreen /></PrivateRoute>} />
                <Route path="/assessment/anamnesis" element={<PrivateRoute><AnamnesisScreen /></PrivateRoute>} />
                <Route path="/assessment/results/:id" element={<PrivateRoute fullScreen><ResultsScreen /></PrivateRoute>} />
                <Route path="/assessment/start" element={<PrivateRoute><AssessmentWizardScreen /></PrivateRoute>} />

                <Route path="/schedule" element={<PrivateRoute><ScheduleScreen /></PrivateRoute>} />

                <Route path="/profile" element={<PrivateRoute><ProfileScreen /></PrivateRoute>} />
                <Route path="/profile/data" element={<PrivateRoute><PersonalDataScreen /></PrivateRoute>} />
                <Route path="/profile/appointments" element={<PrivateRoute><UserAppointmentsScreen /></PrivateRoute>} />
                <Route path="/profile/security" element={<PrivateRoute><SecurityScreen /></PrivateRoute>} />
                <Route path="/profile/notifications" element={<PrivateRoute><NotificationSettingsScreen /></PrivateRoute>} />
                <Route path="/profile/professional-data" element={<PrivateRoute><ProfessionalDataScreen /></PrivateRoute>} />
                <Route path="/profile/history" element={<PrivateRoute><AssessmentHistoryScreen /></PrivateRoute>} />
                <Route path="/profile/history/:id" element={<PrivateRoute><AssessmentDetailScreen /></PrivateRoute>} />
                <Route path="/profile/:id" element={<PrivateRoute><PatientDetailScreen /></PrivateRoute>} />

                <Route path="/admin" element={<PrivateRoute><AdminScreen /></PrivateRoute>} />
                <Route path="/admin/registrations" element={<PrivateRoute><AdminRegistrationsScreen /></PrivateRoute>} />
                <Route path="/admin/registrations/approvals" element={<PrivateRoute><ApprovalListScreen /></PrivateRoute>} />
                <Route path="/admin/registrations/professionals" element={<PrivateRoute><ProfessionalsScreen /></PrivateRoute>} />
                <Route path="/admin/registrations/units" element={<PrivateRoute><UnitsScreen /></PrivateRoute>} />
                <Route path="/admin/registrations/specialties" element={<PrivateRoute><SpecialtiesScreen /></PrivateRoute>} />
                <Route path="/admin/professionals/new" element={<PrivateRoute><ProfessionalRegisterScreen /></PrivateRoute>} />
                <Route path="/admin/professionals/verify/:id" element={<PrivateRoute><ProfessionalVerificationScreen /></PrivateRoute>} />

                <Route path="/notifications" element={<PrivateRoute><NotificationCenterScreen /></PrivateRoute>} />
                <Route path="/admin/notifications" element={<PrivateRoute><NotificationCenterScreen /></PrivateRoute>} />

                <Route path="/search" element={<PrivateRoute><SearchScreen /></PrivateRoute>} />

                <Route path="/appointment/:id" element={<PrivateRoute><AppointmentDetailScreen /></PrivateRoute>} />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </AnimatePresence>
    );
};
