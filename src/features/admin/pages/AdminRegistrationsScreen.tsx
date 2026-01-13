import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    ChevronRight,
    Users,
    Building2,
    DollarSign,
    Award
} from 'lucide-react';
import { BottomNav } from '@/components/layout/BottomNav';
import { cn } from '@/lib/utils';

export const AdminRegistrationsScreen: React.FC = () => {
    const navigate = useNavigate();

    const menuItems = [
        {
            icon: Building2,
            title: 'Unidades',
            subtitle: 'Gestão de locais de atendimento',
            path: '/admin/registrations/units',
            color: 'bg-orange-50 text-orange-500'
        },
        {
            icon: Users,
            title: 'Profissionais',
            subtitle: 'Gestão da equipe multidisciplinar',
            path: '/admin/registrations/professionals',
            color: 'bg-emerald-50 text-emerald-500'
        },
        {
            icon: Award,
            title: 'Especialidades',
            subtitle: 'Áreas de atuação',
            path: '/admin/registrations/specialties',
            color: 'bg-indigo-50 text-indigo-500'
        },
        {
            icon: DollarSign,
            title: 'Valores',
            subtitle: 'Tabela de preços e serviços',
            path: '/admin/registrations/values',
            color: 'bg-blue-50 text-blue-500'
        }
    ];

    return (
        <div className="min-h-screen bg-[#F1F3F5] pb-32 font-sans px-5">
            <header className="pt-8 flex items-center gap-4 mb-10">
                <button
                    onClick={() => navigate('/admin')}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-dark active:scale-95 transition-transform"
                >
                    <ChevronLeft size={20} />
                </button>
                <h1 className="text-2xl font-bold text-dark">
                    Cadastros
                </h1>
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
