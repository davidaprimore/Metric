import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutGrid,
    CalendarCheck,
    Plus,
    Search,
    Trophy,
    Smile
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
        { icon: LayoutGrid, label: 'INÍCIO', path: '/dashboard', id: 'home' },
        { icon: CalendarCheck, label: 'DIÁRIO', path: '/schedule', id: 'daily' }, // Daily routine
        // Dynamic Middle Button: 'Plus' for Pro, 'Search' for Client
        {
            icon: userProfile?.role === 'profissional' ? Plus : Search,
            label: userProfile?.role === 'profissional' ? 'NOVA' : 'BUSCAR',
            path: userProfile?.role === 'profissional' ? '/assessment' : '/search',
            id: userProfile?.role === 'profissional' ? 'assessment' : 'search',
            isHighlight: true
        },
        { icon: Trophy, label: 'EVOLUÇÃO', path: '/profile/history', id: 'progress' }, // Trophy = Success/Happy
        { icon: Smile, label: 'PERFIL', path: '/profile', id: 'profile' } // Smile = Happy/User
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
        <div className="fixed bottom-0 left-0 right-0 h-16 bg-white/85 backdrop-blur-xl border-t border-white/50 shadow-[0_-10px_40px_-5px_rgba(0,0,0,0.1)] flex items-center justify-between px-8 z-50 transition-all duration-300">
            {navItems.map((item) => {
                const isActive = isTabActive(item);
                const Icon = item.icon;

                if (item.id === 'search' || item.id === 'assessment') {
                    // Main Action Button (Floating Look)
                    return (
                        <button
                            key={item.label}
                            onClick={() => handleNavigation(item)}
                            className={cn(
                                "flex flex-col items-center justify-center w-14 h-14 -mt-8 rounded-full transition-all relative group shadow-xl border-4 border-[#F1F5F9]",
                                isActive
                                    ? "bg-slate-900 text-white scale-110 shadow-slate-900/30"
                                    : "bg-blue-600 text-white hover:bg-slate-900 hover:scale-105"
                            )}
                        >
                            <Icon size={24} strokeWidth={2.5} />
                        </button>
                    );
                }

                return (
                    <button
                        key={item.label}
                        onClick={() => handleNavigation(item)}
                        className={cn(
                            "group flex flex-col items-center justify-center w-10 h-10 rounded-xl transition-all relative active:scale-95",
                            isActive
                                ? "text-slate-900"
                                : "text-slate-400 hover:text-slate-600"
                        )}
                    >
                        <div className={cn(
                            "relative transition-all duration-300",
                            isActive ? "-translate-y-1" : "group-hover:-translate-y-0.5"
                        )}>
                            <Icon
                                size={24} // Slightly larger for clarity
                                strokeWidth={isActive ? 2.5 : 2}
                                className={cn(
                                    "transition-all",
                                    isActive ? "drop-shadow-sm" : ""
                                )}
                            />
                        </div>
                    </button>
                );
            })}
        </div>
    );
};
