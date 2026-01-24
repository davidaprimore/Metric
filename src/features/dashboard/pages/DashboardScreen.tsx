import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PatientDashboardScreen } from './PatientDashboardScreen';
import ProfessionalDashboardScreen from './ProfessionalDashboardScreen';
import { Loader } from 'lucide-react';

export const DashboardScreen: React.FC = () => {
    const { userProfile, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
                <Loader className="w-12 h-12 text-secondary animate-spin mb-4" />
                <p className="text-sm font-black text-dark uppercase tracking-widest">Aguarde, configurando seu acesso...</p>
            </div>
        );
    }

    // Role-based routing
    if (userProfile?.role === 'profissional') {
        return <ProfessionalDashboardScreen />;
    }

    // Default to Patient Dashboard
    return <PatientDashboardScreen />;
};
