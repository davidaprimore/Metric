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
        <div className="fixed bottom-4 left-4 right-4 h-20 bg-white/90 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] flex items-center justify-between px-2 z-50 max-w-md mx-auto">
            {navItems.map((item) => {
                const isActive = isTabActive(item);
                const Icon = item.icon;

                if (item.isHighlight) {
                    return (
                        <button
                            key={item.label}
                            onClick={() => handleNavigation(item)}
                            className={cn(
                                "flex flex-col items-center justify-center w-14 h-14 rounded-full transition-all relative group -mt-6 shadow-xl",
                                isActive
                                    ? "bg-[#CCFF00] text-black shadow-[0_0_20px_rgba(204,255,0,0.6)] scale-110 ring-4 ring-white"
                                    : "bg-[#222222] text-white hover:scale-105 hover:bg-[#CCFF00] hover:text-black shadow-black/20"
                            )}
                        >
                            <Icon size={24} strokeWidth={3} />
                        </button>
                    );
                }

                return (
                    <button
                        key={item.label}
                        onClick={() => handleNavigation(item)}
                        className={cn(
                            "flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all relative",
                            isActive
                                ? "text-black bg-black/5"
                                : "text-gray-400 hover:text-black hover:bg-black/5"
                        )}
                    >
                        <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                        {isActive && <div className="absolute -bottom-1 w-1 h-1 bg-black rounded-full" />}
                    </button>
                );
            })}
        </div>
    );
};
