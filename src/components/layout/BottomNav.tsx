import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
    Home,
    Calendar,
    Plus,
    BarChart3,
    UserCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const BottomNav: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { icon: Home, label: 'INÍCIO', path: '/dashboard' },
        { icon: Calendar, label: 'AGENDA', path: '/schedule' },
        { icon: Plus, label: 'NOVA', path: '/assessment', isCenter: true },
        { icon: BarChart3, label: 'RESULTADOS', path: '/results' },
        { icon: UserCircle, label: 'PERFIL', path: '/profile' }
    ];

    return (
        <div className="fixed bottom-0 left-0 w-full px-0 pb-0 z-50 pointer-events-none">
            <div className="max-w-md mx-auto relative h-28 flex items-end pointer-events-auto">

                {/* Custom SVG Background for the curved bar */}
                <div className="absolute inset-x-0 bottom-0 h-20 w-full">
                    <svg viewBox="0 0 400 80" className="w-full h-full drop-shadow-[0_-5px_25px_rgba(0,0,0,0.06)]" preserveAspectRatio="none">
                        <path
                            d="M0 20 C0 8.95431 8.95431 0 20 0 H140 C160 0 165 25 200 25 C235 25 240 0 260 0 H380 C391.046 0 400 8.95431 400 20 V80 H0 V20 Z"
                            fill="white"
                        />
                    </svg>
                </div>

                <nav className="relative w-full h-20 flex justify-between items-center px-6">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;

                        if (item.isCenter) {
                            return (
                                <div key={item.label} className="relative flex flex-col items-center mb-12">
                                    <button
                                        onClick={() => navigate(item.path)}
                                        className={cn(
                                            "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 transform",
                                            "bg-primary text-dark",
                                            isActive
                                                ? "shadow-[0_0_30px_rgba(202,255,10,0.8)] scale-110"
                                                : "shadow-[0_8px_20px_rgba(202,255,10,0.3)] hover:scale-110 hover:shadow-[0_0_20px_rgba(202,255,10,0.5)]",
                                            "border-[5px] border-white z-10"
                                        )}
                                    >
                                        <Plus className={cn("w-8 h-8", isActive ? "animate-pulse" : "")} strokeWidth={3} />
                                    </button>
                                    <span className={cn(
                                        "absolute -bottom-6 text-[7px] font-black tracking-widest uppercase transition-all duration-300",
                                        isActive ? "text-primary opacity-100" : "text-gray-400 opacity-60"
                                    )}>
                                        {item.label}
                                    </span>
                                </div>
                            );
                        }

                        return (
                            <NavLink
                                key={item.label}
                                to={item.path}
                                className={cn(
                                    "flex flex-col items-center gap-1 flex-1 transition-all duration-300 group",
                                    isActive ? "text-secondary" : "text-gray-300"
                                )}
                            >
                                <Icon className={cn(
                                    "w-8 h-8 transition-all duration-300 group-hover:text-secondary group-hover:scale-110",
                                    isActive ? "scale-110" : ""
                                )} />
                                <span className={cn(
                                    "text-[7px] font-black tracking-widest uppercase mt-1 transition-all",
                                    isActive ? "opacity-100" : "opacity-0 group-hover:opacity-60"
                                )}>
                                    {item.label}
                                </span>
                            </NavLink>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
};
