import React from 'react';
import {
    Bell,
    ChevronRight,
    User,
    Calendar,
    CreditCard,
    MapPin,
    Shield,
    LogOut,
    Pencil
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { BottomNav } from '@/components/layout/BottomNav';
import { cn } from '@/lib/utils';

export const ProfileScreen: React.FC = () => {
    const navigate = useNavigate();
    const { user, signOut } = useAuth();
    const firstName = user?.user_metadata?.first_name || 'Usuário';
    const lastName = user?.user_metadata?.last_name || '';
    const email = user?.email || 'email@exemplo.com';

    const menuItems = [
        {
            icon: User,
            title: 'Dados Pessoais',
            subtitle: 'CPF, Data de Nascimento',
            path: '/profile/data',
            color: 'bg-indigo-50 text-indigo-500'
        },
        {
            icon: Calendar,
            title: 'Meus Agendamentos',
            subtitle: 'Próximas avaliações físicas',
            path: '/profile/appointments',
            color: 'bg-purple-50 text-purple-500'
        },
        {
            icon: CreditCard,
            title: 'Assinatura e Planos',
            subtitle: 'Plano Premium Mensal',
            path: '/profile/billing',
            color: 'bg-blue-50 text-blue-500'
        },
        {
            icon: MapPin,
            title: 'Preferências de Unidades',
            subtitle: 'Unidades favoritas',
            path: '/profile/locations',
            color: 'bg-violet-50 text-violet-500'
        },
        {
            icon: Shield,
            title: 'Segurança',
            subtitle: 'Senha e Biometria',
            path: '/profile/security',
            color: 'bg-slate-50 text-slate-500'
        }
    ];

    return (
        <div className="min-h-screen bg-[#F1F3F5] pb-32 font-sans px-5">
            {/* Header */}
            <header className="pt-8 flex justify-between items-center mb-10">
                <h1 className="text-2xl font-bold text-dark">
                    Meu <span className="text-secondary">Perfil</span>
                </h1>
                <button className="w-11 h-11 bg-white rounded-full flex items-center justify-center text-secondary shadow-sm">
                    <Bell size={20} fill="currentColor" />
                </button>
            </header>

            {/* Profile Info */}
            <div className="flex flex-col items-center mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="relative">
                    <div className="w-32 h-32 rounded-full border-[3px] border-secondary p-1 bg-white shadow-xl">
                        <img
                            src="https://i.pravatar.cc/150?u=Ricardo"
                            alt="Avatar"
                            className="w-full h-full rounded-full object-cover"
                        />
                    </div>
                    <button className="absolute bottom-1 right-1 w-8 h-8 bg-secondary text-white rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                        <Pencil size={14} strokeWidth={2.5} />
                    </button>
                </div>

                <h2 className="mt-4 text-xl font-extrabold text-dark">{firstName} {lastName}</h2>
                <p className="text-xs font-medium text-gray-400 mt-1">{email}</p>
            </div>

            {/* Configurations Section */}
            <div className="space-y-4">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 px-2">Configurações</p>

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

                {/* Logout Button */}
                <button
                    onClick={signOut}
                    className="w-full bg-red-50 p-4 rounded-[1.5rem] flex items-center gap-4 border border-red-100/50 shadow-sm mt-6 active:scale-95 transition-all duration-200"
                >
                    <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center shrink-0 text-red-500">
                        <LogOut size={22} />
                    </div>
                    <div className="flex-1 text-left">
                        <h3 className="text-sm font-bold text-red-500">Sair</h3>
                    </div>
                </button>
            </div>

            {/* Bottom Nav */}
            <BottomNav />
        </div>
    );
};
