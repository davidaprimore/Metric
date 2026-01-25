import React, { useState, useEffect } from 'react';
import {
    Calendar,
    Users,
    DollarSign,
    Star,
    Settings,
    ChevronRight,
    Bell,
    AlertCircle,
    Loader,
    Search
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '../../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../../lib/utils';
import { ProfessionalBottomNav } from '../../../components/layout/ProfessionalBottomNav';
import { Toast } from '../../../components/ui/Toast';
import { ProfessionalAgenda } from '../components/ProfessionalAgenda';
import { FluidBackground } from '@/components/layout/FluidBackground';
import { format } from 'date-fns';
import { ProfileScreen } from '@/features/profile/pages/ProfileScreen';

/* 
  METRIK ORIGINS THEME: "ELITE TEXTURE"
  - Background: Rich Green (#122216)
  - Cards: Textured dark backgrounds + Glass styling
  - Padding: Corrected to prevent Nav overlap
*/

// Glassy, Transparent, Luminous
const textureCardClass = "bg-black/40 bg-[radial-gradient(120%_120%_at_50%_0%,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent backdrop-blur-3xl border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] relative overflow-hidden";

const ProfessionalDashboardScreen = () => {
    const { userProfile: profile, session } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [freshProfile, setFreshProfile] = useState<any>(null);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' | 'info' });
    const [showNotifications, setShowNotifications] = useState(false);
    const [activeTab, setActiveTab] = useState('home');

    // Admin Check
    const isAdmin = profile?.email === 'admin@metrik.com' || profile?.role === 'admin';

    useEffect(() => {
        loadDashboardData();
    }, [session]);

    const loadDashboardData = async () => {
        try {
            if (!session?.user.id) return;
            const { data: p } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
            if (p) setFreshProfile(p);
            const { data: n } = await supabase.from('notifications').select('*').eq('user_id', session.user.id).eq('read', false).order('created_at', { ascending: false });
            if (n) setNotifications(n);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const { data: apps } = await supabase.from('appointments').select('*, patient:profiles!patient_id(full_name, avatar_url)').eq('professional_id', session.user.id).eq('status', 'confirmed').gte('start_time', today.toISOString()).order('start_time', { ascending: true }).limit(5);
            if (apps) setUpcomingAppointments(apps);
        } catch (error) {
            console.error('Error loading dashboard:', error);
        } finally {
            setLoading(false);
        }
    };



    const handleNavigation = (tab: string) => {
        // Consolidated State Navigation to prevent URL changes
        setActiveTab(tab);
        window.scrollTo(0, 0);
    };

    const renderWorkspaceView = () => (
        // INCREASED PADDING HERE: pb-40
        <FluidBackground variant="luminous" className="pb-40 font-sans min-h-screen">
            <div className="relative z-10 text-white">
                {/* Header */}
                <div className="px-6 pt-10 pb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full border border-white/5 p-0.5 shadow-lg bg-black/60 backdrop-blur-xl">
                            <img
                                src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${profile?.full_name}&background=random`}
                                className="w-full h-full object-cover rounded-full"
                            />
                        </div>
                        <div>
                            <p className="text-[#CCFF00] text-[10px] uppercase tracking-widest font-bold mb-0.5 animate-pulse">Metrik Pro</p>
                            <h2 className="text-xl font-bold leading-none text-white tracking-tight drop-shadow-sm">
                                Olá, {freshProfile?.full_name?.split(' ')[0] || profile?.full_name?.split(' ')[0]}
                            </h2>
                        </div>
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="relative group cursor-pointer p-3 rounded-full hover:bg-black/40 transition-colors"
                        >
                            <Bell size={24} className="text-slate-400 group-hover:text-[#CCFF00] transition-colors" />
                            {notifications.length > 0 && <div className="absolute top-2 right-2 w-2 h-2 bg-[#FFC107] rounded-full animate-pulse"></div>}
                        </button>
                    </div>
                </div>

                {activeTab === 'home' && (
                    <div className="px-6 space-y-6 animate-in slide-in-from-left-4 duration-500">
                        {/* Agenda Card - HERO TEXTURE */}
                        <div
                            className={`${textureCardClass} w-full rounded-[2.5rem] p-7 transition-all cursor-pointer group hover:brightness-110`}
                            onClick={() => handleNavigation('calendar')}
                        >
                            {/* Background Image/Pattern Overlay */}
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                            <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#CCFF00]/5 rounded-full blur-3xl pointer-events-none"></div>

                            <div className="flex justify-between items-start mb-6 relative z-10">
                                <div className="w-12 h-12 rounded-2xl bg-[#CCFF00]/10 text-[#CCFF00] flex items-center justify-center shadow-lg border border-[#CCFF00]/20">
                                    <Calendar size={24} strokeWidth={2.5} />
                                </div>
                                <span className="text-[10px] font-black text-black uppercase tracking-wider bg-[#CCFF00] px-3 py-1.5 rounded-full">
                                    Ver tudo
                                </span>
                            </div>

                            <h3 className="text-2xl font-bold mb-2 text-white tracking-tight relative z-10">Agenda Diária</h3>
                            <p className="text-slate-400 text-sm mb-6 font-medium flex items-center gap-2 relative z-10">
                                <span className="text-[#CCFF00] font-bold text-xl">{upcomingAppointments.length}</span> consultas confirmadas.
                            </p>

                            <div className="space-y-3 relative z-10">
                                {upcomingAppointments.length > 0 ? (
                                    <div
                                        onClick={(e) => { e.stopPropagation(); navigate(`/appointment/${upcomingAppointments[0].id}`); }}
                                        className="flex items-center gap-4 p-4 bg-white/5 rounded-3xl border-l-4 border-[#CCFF00] hover:bg-white/10 transition-colors"
                                    >
                                        <div className="text-center w-12 shrink-0">
                                            <span className="block text-[10px] text-[#CCFF00] uppercase font-bold">Hoje</span>
                                            <span className="block text-lg font-bold text-white">{format(new Date(upcomingAppointments[0].start_time), 'HH:mm')}</span>
                                        </div>
                                        <div className="w-px h-8 bg-white/10"></div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-sm text-slate-200">{upcomingAppointments[0].patient?.full_name || 'Paciente'}</h4>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-4 bg-white/5 rounded-3xl border border-dashed border-white/10 text-center">
                                        <p className="text-[10px] text-slate-500 uppercase font-black">Nenhum agendamento para hoje</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Grid Navigation */}
                        <div className="grid grid-cols-2 gap-4">
                            <div
                                onClick={() => handleNavigation('patients')}
                                className={`${textureCardClass} p-5 rounded-[2.5rem] hover:scale-[1.02] transition-all cursor-pointer group`}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50"></div>
                                <div className="absolute -right-4 -top-4 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl"></div>
                                <div className="top-0 right-0 p-3 opacity-30 absolute"><img src="/assets/3d/caliper.png" className="w-16 h-16 object-contain" /></div>

                                <div className="w-10 h-10 bg-[#CCFF00]/10 text-[#CCFF00] rounded-xl flex items-center justify-center mb-4 border border-[#CCFF00]/20 relative z-10">
                                    <Users size={20} />
                                </div>
                                <h3 className="font-bold text-white mb-1 text-sm relative z-10">Pacientes</h3>
                                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider relative z-10">12 Ativos</p>
                            </div>

                            <div className={`${textureCardClass} p-5 rounded-[2.5rem] hover:scale-[1.02] transition-all cursor-pointer group`}>
                                <div className="absolute inset-0 bg-gradient-to-br from-[#FFC107]/5 to-transparent opacity-50"></div>
                                <div className="absolute -bottom-2 -right-2 p-3 opacity-30"><img src="/assets/3d/scale.png" className="w-16 h-16 object-contain" /></div>

                                <div className="w-10 h-10 bg-[#FFC107]/10 text-[#FFC107] rounded-xl flex items-center justify-center mb-4 border border-[#FFC107]/20 relative z-10">
                                    <Star size={20} />
                                </div>
                                <h3 className="font-bold text-white mb-1 text-sm relative z-10">Avaliações</h3>
                                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider relative z-10">4.9 Média</p>
                            </div>

                            <div
                                onClick={() => handleNavigation('financial')}
                                className={`${textureCardClass} p-5 rounded-[2.5rem] hover:scale-[1.02] transition-all cursor-pointer group`}>
                                <div className="w-10 h-10 bg-[#CCFF00]/10 text-[#CCFF00] rounded-xl flex items-center justify-center mb-4 border border-[#CCFF00]/20">
                                    <DollarSign size={20} />
                                </div>
                                <h3 className="font-bold text-white mb-1 text-sm">Financeiro</h3>
                                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Visão Geral</p>
                            </div>

                            <div className={`${textureCardClass} p-5 rounded-[2.5rem] hover:scale-[1.02] transition-all cursor-pointer group`}>
                                <div className="w-10 h-10 bg-white/5 text-slate-400 rounded-xl flex items-center justify-center mb-4 border border-white/10">
                                    <Settings size={20} />
                                </div>
                                <h3 className="font-bold text-white mb-1 text-sm">Ajustes</h3>
                                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Config</p>
                            </div>
                        </div>

                        {/* Support Banner - With Padding Protection */}
                        <div className={`${textureCardClass} p-7 rounded-[2.5rem] group cursor-pointer hover:bg-[#0C120E] transition-all mb-8`}>
                            <h3 className="font-bold text-white relative z-10 text-lg">Suporte Metrik</h3>
                            <p className="text-xs text-slate-400 mt-1 mb-6 max-w-[80%] relative z-10 font-medium leading-relaxed">Precisa de ajuda com a plataforma?</p>
                            <button className="px-6 py-3 bg-white text-black text-xs font-bold uppercase tracking-wider rounded-xl transition-all relative z-10 hover:bg-slate-200 flex items-center gap-2 shadow-lg">
                                Contatar <ChevronRight size={16} strokeWidth={3} />
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'calendar' && (
                    <div className="px-6 h-full pb-20 animate-in slide-in-from-right-4 duration-500">
                        <ProfessionalAgenda />
                    </div>
                )}

                {activeTab === 'profile' && (
                    <ProfileScreen embedded />
                )}
            </div>

            {/* Floating Bottom Nav */}
            <ProfessionalBottomNav
                activeTab={activeTab}
                onTabChange={(tab) => {
                    if (tab === 'profile') {
                        navigate('/profile');
                    } else {
                        setActiveTab(tab);
                    }
                }}
            />
        </FluidBackground>
    );

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#122216] text-[#CCFF00]"><Loader className="animate-spin" size={32} /></div>;
    return renderWorkspaceView();
};

export default ProfessionalDashboardScreen;
