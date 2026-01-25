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
        <div className="fixed bottom-6 left-6 right-6 h-20 bg-[#080C09]/90 backdrop-blur-2xl rounded-[2.5rem] border-t border-white/10 border-b border-black/80 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] flex items-center justify-between px-4 z-50">
            <button
                onClick={() => handleNavigation('home')}
                className={cn(
                    "flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all",
                    activeTab === 'home'
                        ? "bg-[#CCFF00]/10 text-[#CCFF00] shadow-[0_0_15px_rgba(204,255,0,0.3)]"
                        : "text-slate-500 hover:text-[#CCFF00]"
                )}
            >
                <Home size={20} strokeWidth={activeTab === 'home' ? 2.5 : 2} />
            </button>

            <button
                onClick={() => handleNavigation('patients')}
                className={cn(
                    "flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all",
                    activeTab === 'patients' ? "text-[#CCFF00]" : "text-slate-500 hover:text-[#CCFF00]"
                )}
            >
                <Users size={20} />
            </button>

            {/* Calendar - Contained, Nano Banana Accent */}
            <button
                onClick={() => handleNavigation('calendar')}
                className={cn(
                    "flex flex-col items-center justify-center w-14 h-14 rounded-full transition-all relative group",
                    activeTab === 'calendar'
                        ? "bg-[#CCFF00] text-black shadow-[0_0_20px_rgba(204,255,0,0.5)] scale-110" // High Contrast
                        : "bg-white/5 text-slate-400 hover:bg-[#CCFF00] hover:text-black hover:scale-105"
                )}
            >
                <Calendar size={22} strokeWidth={2.5} />
            </button>

            <button
                onClick={() => handleNavigation('financial')}
                className={cn(
                    "flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all",
                    activeTab === 'financial' ? "text-[#CCFF00]" : "text-slate-500 hover:text-[#CCFF00]"
                )}
            >
                <DollarSign size={20} />
            </button>

            <button
                onClick={() => handleNavigation('profile')}
                className={cn(
                    "flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all",
                    activeTab === 'profile' ? "text-[#CCFF00]" : "text-slate-500 hover:text-[#CCFF00]"
                )}
            >
                <User size={20} />
            </button>
        </div>
    );
};
