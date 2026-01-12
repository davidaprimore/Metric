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
        <div className="fixed bottom-0 left-0 w-full px-4 pb-4 z-50 pointer-events-none">
            <nav className="max-w-md mx-auto h-20 bg-white/90 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.12)] border border-white/50 flex justify-between items-center px-4 pointer-events-auto relative">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;

                    if (item.isCenter) {
                        return (
                            <div key={item.label} className="relative w-16 h-16 flex items-center justify-center">
                                <button
                                    onClick={() => navigate(item.path)}
                                    className="w-14 h-14 bg-secondary rounded-[1.25rem] flex items-center justify-center shadow-[0_8px_20px_rgba(138,122,208,0.4)] hover:shadow-secondary/50 transform transition-all active:scale-90"
                                >
                                    <Icon className="text-white w-7 h-7" strokeWidth={3} />
                                </button>
                                <span className="absolute -bottom-1 text-[8px] font-black text-secondary tracking-widest uppercase">
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
                                "flex flex-col items-center gap-1.5 flex-1 transition-all duration-300",
                                isActive ? "text-secondary scale-110" : "text-gray-300 hover:text-gray-500"
                            )}
                        >
                            <Icon className={cn("w-6 h-6", isActive ? "fill-secondary/10" : "")} />
                            <span className={cn(
                                "text-[9px] font-black tracking-widest uppercase",
                                isActive ? "opacity-100" : "opacity-0"
                            )}>
                                {item.label}
                            </span>
                        </NavLink>
                    );
                })}
            </nav>
        </div>
    );
};
