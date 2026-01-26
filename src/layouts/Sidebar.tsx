import { ComponentType } from 'react';
import { Monitor, Calculator, TrendingUp, Calendar, Users, Settings, LogOut } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

export const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { signOut } = useAuth();

    const navItems = [
        { label: 'Dashboard', icon: Monitor, path: '/' },
        { label: 'Pacientes', icon: Users, path: '/patients' }, // Adjusted path to generic patients list if exists, currently /patients seems intended
        { label: 'Agenda', icon: Calendar, path: '/agenda' },
        { label: 'Financeiro', icon: TrendingUp, path: '/financial' },
        { label: 'Avaliações', icon: Calculator, path: '/assessments' },
    ];

    const bottomItems = [
        { label: 'Ajustes', icon: Settings, path: '/settings' },
    ];

    return (
        <div className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-black border-r border-white/5 z-40">
            {/* Brand */}
            <div className="p-8 pb-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#D4AF37] flex items-center justify-center">
                        <span className="font-black text-black text-lg">M</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-black text-white tracking-[0.2em]">METRIK</span>
                        <span className="text-[9px] font-bold text-[#D4AF37] uppercase tracking-widest">PRO</span>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 px-4 py-8 space-y-1">
                <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Menu Principal</p>

                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                                isActive
                                    ? "bg-white/5 text-[#D4AF37]"
                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className="relative z-10" />
                            <span className={cn(
                                "text-sm font-medium tracking-wide relative z-10",
                                isActive && "font-bold"
                            )}>
                                {item.label}
                            </span>

                            {isActive && (
                                <div className="absolute inset-0 bg-[#D4AF37]/5 animate-pulse" />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Utilities */}
            <div className="p-4 border-t border-white/5 space-y-1">
                {bottomItems.map((item) => (
                    <button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200"
                    >
                        <item.icon size={18} />
                        <span className="text-sm font-medium tracking-wide">{item.label}</span>
                    </button>
                ))}

                <button
                    onClick={signOut}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 mt-2"
                >
                    <LogOut size={18} />
                    <span className="text-sm font-medium tracking-wide">Sair</span>
                </button>
            </div>
        </div>
    );
};
