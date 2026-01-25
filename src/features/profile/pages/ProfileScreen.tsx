import React from 'react';
import { FluidBackground } from '@/components/layout/FluidBackground';
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
    ShieldAlert,
    Camera
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ProfessionalBottomNav } from '@/components/layout/ProfessionalBottomNav';
import { DefaultAvatar } from '@/components/shared/DefaultAvatar';
import { cn } from '@/lib/utils';

interface ProfileScreenProps {
    embedded?: boolean;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = (props) => {
    const navigate = useNavigate();
    const { user, signOut, userProfile } = useAuth();

    const triggerGallery = () => {
        document.getElementById('gallery-upload')?.click();
    };

    const triggerCamera = () => {
        document.getElementById('camera-upload')?.click();
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;
        // Mock logic for now
        console.log('Uploading avatar:', file.name);
    };

    const firstName = userProfile?.first_name || user?.user_metadata?.first_name || 'Usuário';
    const lastName = userProfile?.last_name || user?.user_metadata?.last_name || '';
    const role = userProfile?.role || 'usuario';

    const isAdmin = role === 'administrador' || role === 'desenvolvedor';

    const menuItems = [
        {
            icon: User,
            title: 'Dados Pessoais',
            subtitle: role === 'profissional' ? '' : 'CPF, Data de Nascimento',
            path: '/profile/data',
        },
        ...(role === 'profissional' ? [
            {
                icon: Shield,
                title: 'Dados Profissionais',
                subtitle: '',
                path: '/profile/professional-data',
            },
            {
                icon: Terminal,
                title: 'Histórico de Avaliações',
                subtitle: '',
                path: '/profile/history',
            }
        ] : []),
        {
            icon: Shield,
            title: 'Segurança',
            subtitle: 'Senha e Biometria',
            path: '/profile/security',
        }
    ];

    // Glassy, Transparent, Luminous
    const textureCardClass = "bg-black/40 bg-[radial-gradient(120%_120%_at_50%_0%,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent backdrop-blur-3xl border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] relative overflow-hidden";

    // NOTE: ProfessionalBottomNav handles switching via parent state if embedded
    return (
        <FluidBackground variant="luminous" className="pb-40 font-sans px-6 relative overflow-hidden min-h-screen">
            <div className="relative z-10 text-white">
                {/* Header */}
                <header className="pt-10 flex justify-between items-center mb-10">
                    <h1 className="text-2xl font-black text-white uppercase tracking-tighter">
                        Meu <span className="text-[#CCFF00]">Perfil</span>
                    </h1>
                    <button
                        onClick={() => isAdmin ? navigate('/admin/notifications') : navigate('/profile/notifications')}
                        className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 border border-white/10 active:scale-95 transition-all shadow-sm hover:text-[#CCFF00]"
                    >
                        <Bell size={20} />
                    </button>
                </header>

                {/* Profile Info */}
                <div className="flex flex-col items-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full border-4 border-[#CCFF00] p-1.5 bg-[#080C09] shadow-xl shadow-[#CCFF00]/10 overflow-hidden transition-transform group-hover:scale-105 duration-500">
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
                        <button
                            onClick={triggerCamera}
                            className="absolute bottom-1 right-1 w-10 h-10 bg-[#CCFF00] text-black rounded-full flex items-center justify-center border-4 border-[#122216] shadow-lg shadow-[#CCFF00]/10 hover:scale-110 transition-transform cursor-pointer"
                        >
                            <Camera size={18} strokeWidth={3} />
                        </button>
                    </div>

                    <button
                        onClick={triggerGallery}
                        className="mt-4 text-[#CCFF00] text-[10px] font-black uppercase tracking-[0.2em] hover:underline cursor-pointer drop-shadow-sm"
                    >
                        Alterar Foto
                    </button>

                    <h2 className="mt-4 text-2xl font-black text-white tracking-tighter uppercase">{firstName} {lastName}</h2>

                    {/* Hidden Inputs */}
                    <input type="file" id="gallery-upload" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                    <input type="file" id="camera-upload" className="hidden" accept="image/*" capture="user" onChange={handleAvatarUpload} />
                    {role === 'profissional' ? (
                        <div className="flex flex-col items-center gap-2 mt-2">
                            <span className="bg-white/5 backdrop-blur-sm text-slate-200 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-white/10 shadow-sm flex items-center gap-2">
                                Avaliador Profissional <div className="w-1 h-1 bg-[#CCFF00] rounded-full"></div>
                            </span>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                                ID: MET-{user?.id ? user.id.substring(0, 4).toUpperCase() : '0000'}
                            </span>
                        </div>
                    ) : (
                        <p className="text-sm font-medium text-slate-500 mt-2">{user?.email}</p>
                    )}
                </div>

                {/* Configurations Section */}
                <div className="space-y-4">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6 pl-2 opacity-70">Control Panel</p>

                    {menuItems.map((item, idx) => (
                        <button
                            key={idx}
                            onClick={() => navigate(item.path)}
                            className={`${textureCardClass} w-full p-5 rounded-[2rem] flex items-center gap-5 hover:border-[#CCFF00] hover:shadow-xl hover:shadow-[#CCFF00]/5 active:scale-[0.98] transition-all duration-300 group`}
                        >
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 text-slate-400 group-hover:bg-[#CCFF00]/10 group-hover:text-[#CCFF00] transition-colors border border-white/5">
                                <item.icon size={22} />
                            </div>
                            <div className="flex-1 text-left">
                                <h3 className="text-sm font-black text-slate-200 leading-tight uppercase tracking-wide group-hover:text-[#CCFF00] transition-colors">{item.title}</h3>
                                {item.subtitle && <p className="text-[10px] text-slate-500 font-bold mt-0.5 uppercase tracking-widest">{item.subtitle}</p>}
                            </div>
                            <ChevronRight size={18} className="text-slate-600 group-hover:text-[#CCFF00] transition-colors translate-x-0 group-hover:translate-x-1" />
                        </button>
                    ))}

                    {/* Management Section (Admin/Dev only) */}
                    {isAdmin && (
                        <div className="pt-8 space-y-4">
                            <p className="text-[10px] font-black text-[#CCFF00] uppercase tracking-[0.3em] mb-6 pl-2 opacity-70">Management</p>

                            <button
                                onClick={() => navigate('/admin')}
                                className={`${textureCardClass} w-full p-5 rounded-[2rem] flex items-center gap-5 active:scale-[0.98] transition-all duration-300 group`}
                            >
                                <div className="w-12 h-12 rounded-2xl bg-[#CCFF00]/10 flex items-center justify-center shrink-0 text-[#CCFF00] border border-[#CCFF00]/20">
                                    <Settings size={22} />
                                </div>
                                <div className="flex-1 text-left">
                                    <h3 className="text-sm font-bold text-white leading-tight uppercase tracking-wide">Administração</h3>
                                    <p className="text-[10px] text-gray-500 font-medium mt-0.5">Gestão de clientes e profissionais</p>
                                </div>
                                <ChevronRight size={18} className="text-gray-600 transition-all" />
                            </button>

                            {role === 'desenvolvedor' && (
                                <button
                                    onClick={() => navigate('/dev')}
                                    className="w-full bg-rose-500/10 backdrop-blur-md p-5 rounded-[2rem] flex items-center gap-5 border border-rose-500/20 hover:bg-rose-500/20 active:scale-[0.98] transition-all duration-300 group"
                                    style={{ background: 'rgba(244, 63, 94, 0.1)' }}
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-rose-500/20 flex items-center justify-center shrink-0 text-rose-400">
                                        <Terminal size={22} />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <h3 className="text-sm font-bold text-rose-400 leading-tight uppercase tracking-wide">Developer Shell</h3>
                                        <p className="text-[10px] text-rose-500/60 font-medium mt-0.5">System-level tools and access</p>
                                    </div>
                                    <ChevronRight size={18} className="text-rose-500/50" />
                                </button>
                            )}
                        </div>
                    )}

                    {/* Logout Button */}
                    <button
                        onClick={signOut}
                        className="w-full bg-red-500/10 p-5 rounded-[2rem] flex items-center gap-5 border border-red-500/20 hover:bg-red-500/20 active:scale-[0.98] transition-all duration-300 mt-10 group shadow-sm"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center shrink-0 text-red-500">
                            <LogOut size={22} />
                        </div>
                        <div className="flex-1 text-left">
                            <h3 className="text-sm font-black text-red-500 uppercase tracking-widest">Sair da Conta</h3>
                        </div>
                    </button>
                </div>
            </div>

            {/* Bottom Nav Section - Only show if not embedded */}
            {!props.embedded && <ProfessionalBottomNav activeTab="profile" onTabChange={() => { }} />}
        </FluidBackground>
    );
};
