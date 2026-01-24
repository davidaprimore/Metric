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
    Loader
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '../../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../../lib/utils';
import { ProfessionalBottomNav } from '../../../components/layout/ProfessionalBottomNav';
import { Toast } from '../../../components/ui/Toast';
import { ProfessionalAgenda } from '../components/ProfessionalAgenda';
import { format } from 'date-fns';

/* 
  BREAKING BAD THEME: "LIVING GREEN FOG"
  - Background: Deep Black/Green with moving fog layers
  - Colors: #39FF14 (Neon Green), #FBBF24 (Hazmat Gold)
  - Atmosphere: Radioactive, Industrial, "Alive"
*/

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

            // 1. Get fresh profile
            const { data: p, error: pError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

            if (p) setFreshProfile(p);

            // 2. Get unread notifications
            const { data: n, error: nError } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', session.user.id)
                .eq('read', false)
                .order('created_at', { ascending: false });

            if (n) setNotifications(n);

            // 3. Get upcoming confirmed appointments
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const { data: apps, error: aError } = await supabase
                .from('appointments')
                .select('*, patient:profiles!patient_id(full_name, avatar_url)')
                .eq('professional_id', session.user.id)
                .eq('status', 'confirmed')
                .gte('start_time', today.toISOString())
                .order('start_time', { ascending: true })
                .limit(5);

            if (apps) setUpcomingAppointments(apps);
        } catch (error) {
            console.error('Error loading dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderPendingView = () => (
        <div className="flex flex-col items-center justify-center p-8 text-center h-[80vh] animate-in fade-in duration-700">
            <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <AlertCircle size={40} className="text-amber-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Conta em Análise</h2>
            <p className="text-slate-500 max-w-xs leading-relaxed">
                Nossa equipe está verificando suas credenciais. Você receberá uma notificação assim que o acesso for liberado.
            </p>
            <button
                onClick={() => window.location.reload()}
                className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-full font-bold text-sm tracking-wide hover:bg-slate-800 transition-all"
            >
                Atualizar Status
            </button>
        </div>
    );

    const renderOnboardingView = () => (
        <div className="flex h-screen items-center justify-center text-white">
            <p>Onboarding Temporariamente Indisponível</p>
        </div>
    );

    const handleNavigation = (tab: string) => {
        if (tab === 'profile') {
            navigate('/profile');
        } else {
            setActiveTab(tab);
        }
    };

    const renderWorkspaceView = () => (
        <div className="min-h-screen bg-[#020502] text-white font-sans pb-32 relative overflow-hidden">
            {/* INLINE STYLES FOR RELIABLE MOTION */}
            <style>{`
                @keyframes liquid-fog-1 {
                    0% { transform: translate(-20%, -20%) scale(1.0) rotate(0deg); opacity: 0.8; }
                    50% { transform: translate(10%, 10%) scale(1.4) rotate(10deg); opacity: 0.5; }
                    100% { transform: translate(-20%, -20%) scale(1.0) rotate(0deg); opacity: 0.8; }
                }
                @keyframes liquid-fog-2 {
                    0% { transform: translate(10%, 0%) scale(1.2) rotate(0deg); opacity: 0.4; }
                    50% { transform: translate(-10%, 20%) scale(1.6) rotate(-10deg); opacity: 0.7; }
                    100% { transform: translate(10%, 0%) scale(1.2) rotate(0deg); opacity: 0.4; }
                }
                .liquid-layer-1 {
                    animation: liquid-fog-1 20s infinite ease-in-out alternate;
                    background: radial-gradient(circle at center, rgba(57, 255, 20, 0.5), transparent 60%);
                    filter: blur(50px);
                }
                .liquid-layer-2 {
                    animation: liquid-fog-2 25s infinite ease-in-out alternate;
                    /* HAZMAT YELLOW MIXED WITH DARK GREEN */
                    background: radial-gradient(circle at center, rgba(200, 180, 0, 0.4), rgba(5, 40, 5, 0.8) 70%);
                    filter: blur(80px);
                    mix-blend-mode: color-dodge;
                }
            `}</style>

            {/* Theme: Breaking Bad (Toxic Atmosphere) */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[#0a100a]"></div>
                <div className="absolute inset-0 liquid-layer-1 mix-blend-screen"></div>
                <div className="absolute inset-0 liquid-layer-2"></div>
                {/* Vignette */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#000000_100%)] opacity-80"></div>
            </div>

            <div className="relative z-10">
                {/* Header - Transparent Glass */}
                <div className="px-6 pt-10 pb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full border border-[#39FF14]/30 p-0.5 shadow-[0_0_15px_rgba(57,255,20,0.1)] bg-black/40 backdrop-blur-md">
                            <img
                                src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${profile?.full_name}&background=random`}
                                className="w-full h-full object-cover rounded-full"
                            />
                        </div>
                        <div>
                            <p className="text-[#39FF14] text-[10px] uppercase tracking-widest font-bold mb-0.5 drop-shadow-[0_0_5px_rgba(57,255,20,0.5)]">Laboratório</p>
                            <h2 className="text-xl font-bold leading-none text-white tracking-tight">
                                Olá, {freshProfile?.full_name?.split(' ')[0] || profile?.full_name?.split(' ')[0]}
                            </h2>
                        </div>
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="relative group cursor-pointer p-3 rounded-full hover:bg-[#39FF14]/10 transition-colors"
                        >
                            {notifications.length > 0 && (
                                <div className="absolute top-2 right-2 w-2 h-2 bg-[#FBBF24] rounded-full shadow-[0_0_10px_#FBBF24] animate-pulse"></div>
                            )}
                            <Bell size={24} className="text-[#39FF14]/70 group-hover:text-[#39FF14] transition-colors" />
                        </button>

                        {/* Notifications Popover */}
                        {showNotifications && (
                            <div className="absolute right-0 top-full mt-2 w-80 bg-[#111] border border-white/10 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
                                <h3 className="text-sm font-bold text-white mb-3 px-2">Notificações</h3>
                                <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                                    {notifications.length > 0 ? notifications.map(n => (
                                        <div key={n.id} className="p-3 bg-white/5 rounded-xl border border-white/5 hover:border-[#39FF14]/30 transition-colors">
                                            <p className="text-xs font-bold text-white">{n.title}</p>
                                            <p className="text-[10px] text-slate-400 mt-1">{n.message}</p>
                                        </div>
                                    )) : (
                                        <p className="text-xs text-slate-500 text-center py-4">Nenhuma notificação nova.</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* No Photo Notification (Updated Copy) */}
                {!profile?.avatar_url && (
                    <div className="px-6 mb-8 animate-in slide-in-from-top-4 duration-700">
                        <div
                            onClick={() => navigate('/profile')}
                            className="bg-black/40 border border-[#FBBF24]/30 p-5 rounded-3xl flex items-center gap-5 cursor-pointer hover:bg-black/60 transition-all shadow-[0_0_15px_rgba(251,191,36,0.1)] backdrop-blur-md"
                        >
                            <div className="w-12 h-12 bg-[#FBBF24]/10 text-[#FBBF24] rounded-2xl flex items-center justify-center shrink-0 border border-[#FBBF24]/20 shadow-[0_0_10px_rgba(251,191,36,0.3)]">
                                <AlertCircle size={24} />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-bold text-white">Insira sua foto</h4>
                                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-1">Perfil com foto transmite mais confiança.</p>
                            </div>
                            <ChevronRight size={18} className="text-[#FBBF24] ml-auto" />
                        </div>
                    </div>
                )}

                {activeTab === 'home' && (
                    <div className="px-6 space-y-6 animate-in slide-in-from-left-4 duration-500">
                        {/* Agenda Card */}
                        <div className="w-full bg-black/40 backdrop-blur-xl rounded-[2.5rem] p-7 border border-[#39FF14]/20 hover:bg-black/60 transition-all cursor-pointer shadow-lg group relative overflow-hidden" onClick={() => handleNavigation('calendar')}>

                            <div className="absolute inset-0 bg-[#39FF14]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                            <div className="flex justify-between items-start mb-6 relative z-10">
                                <div className="w-12 h-12 rounded-2xl bg-[#39FF14] text-black flex items-center justify-center shadow-[0_0_20px_rgba(57,255,20,0.5)] animate-gold-pulse">
                                    <Calendar size={24} strokeWidth={2.5} />
                                </div>
                                <button className="text-[10px] font-bold text-[#39FF14] uppercase tracking-wider bg-black/50 border border-[#39FF14]/30 px-3 py-1.5 rounded-full hover:bg-[#39FF14] hover:text-black transition-all">
                                    Ver tudo
                                </button>
                            </div>

                            <h3 className="text-2xl font-bold mb-2 text-white tracking-tight relative z-10">Agenda Diária</h3>
                            <p className="text-slate-400 text-sm mb-6 font-medium flex items-center gap-2 relative z-10">
                                <span className="text-[#39FF14] font-bold text-xl">{upcomingAppointments.length}</span> consultas confirmadas.
                            </p>

                            <div className="space-y-3 relative z-10">
                                {upcomingAppointments.length > 0 ? (
                                    <div
                                        onClick={(e) => { e.stopPropagation(); navigate(`/appointment/${upcomingAppointments[0].id}`); }}
                                        className="flex items-center gap-4 p-4 bg-black/50 rounded-3xl border-l-4 border-[#39FF14] hover:bg-black/70 transition-colors"
                                    >
                                        <div className="text-center w-12 shrink-0">
                                            <span className="block text-[10px] text-[#39FF14] uppercase font-bold">Hoje</span>
                                            <span className="block text-lg font-bold text-white">{format(new Date(upcomingAppointments[0].start_time), 'HH:mm')}</span>
                                        </div>
                                        <div className="w-px h-8 bg-white/10"></div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-sm text-white">{upcomingAppointments[0].patient?.full_name || 'Paciente'}</h4>
                                            <p className="text-[10px] text-[#39FF14] font-bold uppercase tracking-wider">{upcomingAppointments[0].notes || 'Consulta'}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-4 bg-black/30 rounded-3xl border border-dashed border-white/5 text-center">
                                        <p className="text-[10px] text-slate-500 uppercase font-black">Nenhum agendamento para hoje</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Grid Navigation */}
                        <div className="grid grid-cols-2 gap-4">
                            <div
                                onClick={() => handleNavigation('patients')}
                                className="bg-black/40 p-6 rounded-[2.5rem] border border-white/5 hover:border-[#39FF14]/50 transition-all cursor-pointer active:scale-95 shadow-lg backdrop-blur-sm group"
                            >
                                <div className="w-10 h-10 bg-black/60 text-[#39FF14] rounded-xl flex items-center justify-center mb-4 border border-[#39FF14]/20 group-hover:shadow-[0_0_10px_rgba(57,255,20,0.3)]">
                                    <Users size={20} />
                                </div>
                                <h3 className="font-bold text-white mb-1 text-sm">Pacientes</h3>
                                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">12 Ativos</p>
                            </div>

                            <div className="bg-black/40 p-6 rounded-[2.5rem] border border-white/5 hover:border-[#FBBF24]/50 transition-all cursor-pointer active:scale-95 shadow-lg backdrop-blur-sm group">
                                <div className="w-10 h-10 bg-black/60 text-[#FBBF24] rounded-xl flex items-center justify-center mb-4 border border-[#FBBF24]/20 group-hover:shadow-[0_0_10px_rgba(251,191,36,0.3)]">
                                    <Star size={20} />
                                </div>
                                <h3 className="font-bold text-white mb-1 text-sm">Avaliações</h3>
                                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">4.9 Média</p>
                            </div>

                            <div
                                onClick={() => handleNavigation('financial')}
                                className="bg-black/40 p-6 rounded-[2.5rem] border border-white/5 hover:border-[#39FF14]/50 transition-all cursor-pointer active:scale-95 shadow-lg backdrop-blur-sm group">
                                <div className="w-10 h-10 bg-black/60 text-[#39FF14] rounded-xl flex items-center justify-center mb-4 border border-[#39FF14]/20 group-hover:shadow-[0_0_10px_rgba(57,255,20,0.3)]">
                                    <DollarSign size={20} />
                                </div>
                                <h3 className="font-bold text-white mb-1 text-sm">Financeiro</h3>
                                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Visão Geral</p>
                            </div>

                            <div className="bg-black/40 p-6 rounded-[2.5rem] border border-white/5 hover:border-white/30 transition-all cursor-pointer active:scale-95 shadow-lg backdrop-blur-sm group">
                                <div className="w-10 h-10 bg-black/60 text-slate-400 rounded-xl flex items-center justify-center mb-4 group-hover:text-white transition-colors border border-white/5">
                                    <Settings size={20} />
                                </div>
                                <h3 className="font-bold text-white mb-1 text-sm">Ajustes</h3>
                                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Configurações</p>
                            </div>
                        </div>

                        {/* Support Banner */}
                        <div className="mt-8 bg-black/40 p-7 rounded-[2.5rem] border border-[#FBBF24]/30 relative overflow-hidden group cursor-pointer shadow-lg backdrop-blur-md">
                            <h3 className="font-bold text-white relative z-10 text-lg">Suporte Metrik</h3>
                            <p className="text-xs text-slate-400 mt-1 mb-6 max-w-[80%] relative z-10 font-medium leading-relaxed">Precisa de ajuda laboratorial?</p>
                            <button className="px-6 py-3 bg-[#FBBF24] text-black text-xs font-bold uppercase tracking-wider rounded-xl transition-all relative z-10 hover:shadow-[0_0_20px_rgba(251,191,36,0.5)] flex items-center gap-2">
                                Contatar Laboratório <ChevronRight size={16} strokeWidth={3} />
                            </button>
                        </div>
                    </div>
                )}


                {activeTab === 'calendar' && (
                    <div className="px-6 h-full pb-20 animate-in slide-in-from-right-4 duration-500">
                        <ProfessionalAgenda />
                    </div>
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
        </div>
    );

    // --- MAIN RENDER ---

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-black text-[#39FF14]"><Loader className="animate-spin" size={32} /></div>;

    const approvalStatus = (freshProfile || profile)?.approval_status;
    const isOnboardingComplete = (freshProfile || profile)?.onboarding_completed;

    if (approvalStatus !== 'approved') {
        return (
            <div className="min-h-screen bg-[#F1F3F5] font-sans">
                <Toast isVisible={toast.show} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />
                {renderPendingView()}
            </div>
        );
    }

    if (!isOnboardingComplete) {
        // return renderOnboardingView();
        return <div className="p-10 text-white">Onboarding em manutenção. Contate o suporte.</div>;
    }

    return renderWorkspaceView();
};

export default ProfessionalDashboardScreen;
