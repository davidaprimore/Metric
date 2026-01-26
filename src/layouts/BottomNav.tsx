import { Monitor, Calculator, TrendingUp, Calendar, Menu } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

export const BottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { label: 'Início', icon: Monitor, path: '/' },
        { label: 'Pacientes', icon: Calculator, path: '/patients' },
        { label: 'Agenda', icon: Calendar, path: '/agenda' },
        { label: 'Financeiro', icon: TrendingUp, path: '/financial' },
        { label: 'Menu', icon: Menu, path: '/menu' },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden pb-safe">
            <div className="mx-4 mb-4">
                <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex justify-between items-center px-2 py-3">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;

                        return (
                            <button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                className={cn(
                                    "flex flex-col items-center justify-center w-full gap-1 p-1 relative group transition-all duration-300 ease-out",
                                    isActive ? "text-[#D4AF37]" : "text-slate-500 hover:text-slate-300"
                                )}
                            >
                                <div className={cn(
                                    "p-1.5 rounded-xl transition-all duration-300",
                                    isActive ? "bg-[#D4AF37]/10 scale-110" : "bg-transparent group-active:scale-95"
                                )}>
                                    <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                </div>
                                <span className={cn(
                                    "text-[9px] font-bold tracking-wide transition-all duration-300",
                                    isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 h-0 overflow-hidden"
                                )}>
                                    {item.label}
                                </span>

                                {/* Active Indicator Dot */}
                                {isActive && (
                                    <div className="absolute -bottom-1 w-1 h-1 bg-[#D4AF37] rounded-full shadow-[0_0_8px_#D4AF37]" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
