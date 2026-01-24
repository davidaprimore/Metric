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
        <div className="fixed bottom-6 left-6 right-6 h-20 bg-black/90 backdrop-blur-xl rounded-full border border-white/10 shadow-2xl flex items-center justify-between px-4 z-50">
            <button
                onClick={() => handleNavigation('home')}
                className={cn(
                    "flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all",
                    activeTab === 'home'
                        ? "bg-[#39FF14]/10 text-[#39FF14] shadow-[0_0_15px_rgba(57,255,20,0.3)]"
                        : "text-slate-500 hover:text-[#39FF14]"
                )}
            >
                <Home size={20} strokeWidth={activeTab === 'home' ? 2.5 : 2} />
            </button>

            <button
                onClick={() => handleNavigation('patients')}
                className={cn(
                    "flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all",
                    activeTab === 'patients' ? "text-[#39FF14]" : "text-slate-500 hover:text-[#39FF14]"
                )}
            >
                <Users size={20} />
            </button>

            {/* Calendar - Contained, Gold Accent */}
            <button
                onClick={() => handleNavigation('calendar')}
                className={cn(
                    "flex flex-col items-center justify-center w-14 h-14 rounded-full transition-all relative group",
                    activeTab === 'calendar'
                        ? "bg-[#FBBF24] text-black shadow-[0_0_20px_rgba(251,191,36,0.5)] scale-110"
                        : "bg-white/5 text-slate-400 hover:bg-[#39FF14] hover:text-black hover:scale-105"
                )}
            >
                <Calendar size={22} strokeWidth={2.5} />
            </button>

            <button
                onClick={() => handleNavigation('financial')}
                className={cn(
                    "flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all",
                    activeTab === 'financial' ? "text-[#39FF14]" : "text-slate-500 hover:text-[#39FF14]"
                )}
            >
                <DollarSign size={20} />
            </button>

            <button
                onClick={() => handleNavigation('profile')}
                className={cn(
                    "flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all",
                    activeTab === 'profile' ? "text-[#39FF14]" : "text-slate-500 hover:text-[#39FF14]"
                )}
            >
                <User size={20} />
            </button>
        </div>
    );
};
