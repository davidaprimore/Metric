import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
    Home,
    Calendar,
    Plus,
    BarChart3,
    Dumbbell,
    Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface BottomNavProps {
    activeTab?: string;
    onTabChange?: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab: propActiveTab, onTabChange }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { userProfile } = useAuth();

    // Mapping paths to IDs for embedded mode
    const navItems = [
        { icon: Home, label: 'INÍCIO', path: '/dashboard', id: 'home' },
        { icon: Calendar, label: 'AGENDA', path: '/schedule', id: 'schedule' },
        // Dynamic Middle Button: 'Plus' for Pro, 'Search' for Client
        {
            icon: userProfile?.role === 'profissional' ? Plus : Search,
            label: userProfile?.role === 'profissional' ? 'NOVA' : 'BUSCAR',
            path: userProfile?.role === 'profissional' ? '/assessment' : '/search',
            id: userProfile?.role === 'profissional' ? 'assessment' : 'search',
            isHighlight: true
        },
        { icon: BarChart3, label: 'RESULTADOS', path: '/results', id: 'results' },
        { icon: Dumbbell, label: 'TREINOS', path: '/workouts', id: 'workouts' }
    ];

    const handleNavigation = (item: any) => {
        if (onTabChange) {
            onTabChange(item.id);
        } else {
            navigate(item.path);
        }
    };

    const isTabActive = (item: any) => {
        if (propActiveTab) return propActiveTab === item.id;
        return location.pathname === item.path;
    };

    return (
        <div className="fixed bottom-6 left-6 right-6 h-20 bg-[#080C09]/90 backdrop-blur-2xl rounded-[2.5rem] border-t border-white/10 border-b border-black/80 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] flex items-center justify-between px-4 z-50 max-w-md mx-auto">
            {navItems.map((item) => {
                const isActive = isTabActive(item);
                const Icon = item.icon;

                if (item.isHighlight) {
                    return (
                        <button
                            key={item.label}
                            onClick={() => handleNavigation(item)}
                            className={cn(
                                "flex flex-col items-center justify-center w-14 h-14 rounded-full transition-all relative group",
                                isActive
                                    ? "bg-[#CCFF00] text-black shadow-[0_0_20px_rgba(204,255,0,0.5)] scale-110"
                                    : "bg-white/5 text-slate-400 hover:bg-[#CCFF00] hover:text-black hover:scale-105"
                            )}
                        >
                            <Plus size={24} strokeWidth={isActive ? 3 : 2.5} />
                        </button>
                    );
                }

                return (
                    <button
                        key={item.label}
                        onClick={() => handleNavigation(item)}
                        className={cn(
                            "flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all",
                            isActive
                                ? "text-[#CCFF00] bg-[#CCFF00]/10 shadow-[0_0_15px_rgba(204,255,0,0.2)]"
                                : "text-slate-500 hover:text-[#CCFF00]"
                        )}
                    >
                        <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                    </button>
                );
            })}
        </div>
    );
};
