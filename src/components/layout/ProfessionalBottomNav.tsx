import React from 'react';
import { Home, Users, Calendar, DollarSign, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface ProfessionalBottomNavProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export const ProfessionalBottomNav: React.FC<ProfessionalBottomNavProps> = ({ activeTab, onTabChange }) => {
    const navigate = useNavigate();

    const handleNavigation = (tab: string) => {
        if (tab === 'profile') {
            navigate('/profile');
        } else {
            onTabChange(tab);
            if (window.location.pathname !== '/dashboard') {
                navigate('/dashboard');
            }
        }
    };

    return (
        <div className="fixed bottom-6 left-6 right-6 h-20 bg-[#1F2937]/60 backdrop-blur-2xl rounded-[2.5rem] border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-between px-6 z-50">
            <button
                onClick={() => handleNavigation('home')}
                className={cn(
                    "flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all",
                    activeTab === 'home'
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                        : "text-slate-500 hover:text-blue-400"
                )}
            >
                <Home size={22} strokeWidth={activeTab === 'home' ? 3 : 2} />
            </button>

            <button
                onClick={() => handleNavigation('patients')}
                className={cn(
                    "flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all",
                    activeTab === 'patients' ? "text-blue-400" : "text-slate-500 hover:text-blue-400"
                )}
            >
                <Users size={22} />
            </button>

            {/* Calendar Focus */}
            <button
                onClick={() => handleNavigation('calendar')}
                className={cn(
                    "flex flex-col items-center justify-center w-16 h-16 rounded-[1.5rem] transition-all relative group shadow-xl",
                    activeTab === 'calendar'
                        ? "bg-[#D4AF37] text-white scale-110 -translate-y-2"
                        : "bg-[#1E3A8A] text-white/50 hover:bg-[#D4AF37] hover:text-white hover:scale-105"
                )}
            >
                <Calendar size={26} strokeWidth={2.5} />
            </button>

            <button
                onClick={() => handleNavigation('financial')}
                className={cn(
                    "flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all",
                    activeTab === 'financial' ? "text-blue-400" : "text-slate-500 hover:text-blue-400"
                )}
            >
                <DollarSign size={22} />
            </button>

            <button
                onClick={() => handleNavigation('profile')}
                className={cn(
                    "flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all",
                    activeTab === 'profile' ? "text-blue-400" : "text-slate-500 hover:text-blue-400"
                )}
            >
                <User size={22} />
            </button>
        </div>
    );
};
