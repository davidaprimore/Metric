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
    Pencil,
    Terminal,
    Settings,
    ShieldAlert
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { BottomNav } from '@/components/layout/BottomNav';
import { DefaultAvatar } from '@/components/shared/DefaultAvatar';
import { cn } from '@/lib/utils';

export const ProfileScreen: React.FC = () => {
    const navigate = useNavigate();
    const { user, signOut, userProfile } = useAuth();
    const firstName = userProfile?.first_name || user?.user_metadata?.first_name || 'Usuário';
    const lastName = userProfile?.last_name || user?.user_metadata?.last_name || '';
    const email = user?.email || 'email@exemplo.com';
    const role = userProfile?.role || 'usuario';

    const isDeveloper = role === 'desenvolvedor';
    const isAdmin = role === 'administrador' || isDeveloper;

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
            icon: Bell,
            title: 'Notificações e Pushs',
            subtitle: 'Preferências de alerta',
            path: '/profile/notifications',
            color: 'bg-blue-50 text-blue-500'
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
                    <div className="w-32 h-32 rounded-full border-[3px] border-secondary p-1 bg-white shadow-xl overflow-hidden">
                        {(userProfile?.avatar_url || (user?.user_metadata?.avatar_url && !user.user_metadata.avatar_url.includes('pravatar.cc'))) ? (
                            <img
                                src={userProfile?.avatar_url || user?.user_metadata?.avatar_url}
                                alt="Avatar"
                                className="w-full h-full rounded-full object-cover"
                            />
                        ) : (
                            <DefaultAvatar gender={userProfile?.gender || user?.user_metadata?.gender} className="w-full h-full rounded-full" />
                        )}
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

                {/* Management Section (Admin/Dev only) */}
                {(isAdmin || isDeveloper) && (
                    <div className="pt-4 space-y-4">
                        <p className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] mb-4 px-2">Gestão</p>

                        {isAdmin && (
                            <button
                                onClick={() => navigate('/admin')}
                                className="w-full bg-[#FAFAFA] p-4 rounded-[1.5rem] flex items-center gap-4 border border-gray-100 shadow-sm active:scale-95 transition-all duration-200"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center shrink-0 text-indigo-500">
                                    <Settings size={22} />
                                </div>
                                <div className="flex-1 text-left">
                                    <h3 className="text-sm font-bold text-dark leading-tight">Administração</h3>
                                    <p className="text-[10px] text-gray-400 font-medium">Gestão de clientes e profissionais</p>
                                </div>
                                <ChevronRight size={18} className="text-gray-300" />
                            </button>
                        )}

                        {isDeveloper && (
                            <button
                                onClick={() => navigate('/dev')}
                                className="w-full bg-[#EDBAB1] p-4 rounded-[1.5rem] flex items-center gap-4 border border-rose-200 shadow-sm active:scale-95 transition-all duration-200"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 text-white">
                                    <Terminal size={22} />
                                </div>
                                <div className="flex-1 text-left">
                                    <h3 className="text-sm font-bold text-white leading-tight">Desenvolvedor</h3>
                                    <p className="text-[10px] text-white/80 font-medium">Acesso total e ferramentas de sistema</p>
                                </div>
                                <ChevronRight size={18} className="text-white/50" />
                            </button>
                        )}
                    </div>
                )}

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
