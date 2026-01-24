import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    ChevronRight,
    Database,
    Users,
    Building2,
    DollarSign,
    Settings,
    Bell
} from 'lucide-react';
import { BottomNav } from '@/components/layout/BottomNav';
import { cn } from '@/lib/utils';

export const AdminScreen: React.FC = () => {
    const navigate = useNavigate();

    const menuItems = [
        {
            icon: Database,
            title: 'Cadastros',
            subtitle: 'Unidades, Profissionais e Valores',
            path: '/admin/registrations',
            color: 'bg-indigo-50 text-indigo-500'
        },
        // Placeholder for other future admin features
        /*
        {
            icon: BarChart3,
            title: 'Relatórios',
            subtitle: 'Métricas da plataforma',
            path: '/admin/reports',
            color: 'bg-emerald-50 text-emerald-500'
        }
        */
    ];

    return (
        <div className="min-h-screen bg-[#F1F3F5] pb-32 font-sans px-5">
            <header className="pt-8 flex items-center gap-4 mb-10">
                <button
                    onClick={() => navigate('/profile')}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-dark active:scale-95 transition-transform"
                >
                    <ChevronLeft size={20} />
                </button>
                <h1 className="text-2xl font-bold text-dark flex-1">
                    Administração
                </h1>
                <button
                    onClick={() => navigate('/admin/notifications')}
                    className="w-11 h-11 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 relative active:scale-95 transition-transform"
                >
                    <Bell size={20} fill="currentColor" />
                    <div className="absolute top-3.5 right-3.5 w-2.5 h-2.5 bg-secondary rounded-full border-2 border-[#F1F3F5]"></div>
                </button>
            </header>

            <div className="space-y-4">
                {menuItems.map((item, idx) => (
                    <button
                        key={idx}
                        onClick={() => navigate(item.path)}
                        className="w-full bg-white p-4 rounded-[1.5rem] flex items-center gap-4 border border-gray-100/50 shadow-sm active:scale-95 transition-all duration-200"
                    >
                        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", item.color)}>
                            <item.icon size={22} />
                        </div>
                        <div className="flex-1 text-left">
                            <h3 className="text-sm font-bold text-dark leading-tight">{item.title}</h3>
                            <p className="text-[10px] text-gray-400 font-medium">{item.subtitle}</p>
                        </div>
                        <ChevronRight size={18} className="text-gray-300" />
                    </button>
                ))}
            </div>

            <BottomNav />
        </div>
    );
};
