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
import { PatientsList } from '../components/PatientsList';
import { ProfessionalReviews } from '../components/ProfessionalReviews';
import { FinancialOverview } from '../components/FinancialOverview';
import { ProfessionalSettings } from '../components/ProfessionalSettings';
import { FluidBackground } from '@/components/layout/FluidBackground';
import { format } from 'date-fns';
import { ProfileScreen } from '@/features/profile/pages/ProfileScreen';

/* 
  METRIK ORIGINS THEME: "ELITE TEXTURE"
  - Background: Rich Green (#122216)
  - Cards: Textured dark backgrounds + Glass styling
  - Padding: Corrected to prevent Nav overlap
*/

// Translucent, Sober, Premium - Bento Style
const bentoItemClass = "bg-[#1F2937]/40 backdrop-blur-2xl border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-[2.5rem] p-7 transition-all duration-300 hover:scale-[1.01] overflow-hidden relative text-white";
const bentoItemDarkClass = bentoItemClass;

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
                {/* Content Area - Conditionally render header based on tab */}
                {activeTab === 'home' && (
                    <div className="px-6 pt-10 pb-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full border border-white/5 p-0.5 shadow-lg bg-black/60 backdrop-blur-xl overflow-hidden">
                                <img
                                    src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${profile?.full_name}&background=random`}
                                    className="w-full h-full object-cover rounded-full"
                                />
                            </div>
                            <div>
                                <p className="text-[#D4AF37] text-[10px] uppercase tracking-widest font-bold mb-0.5">Metrik Pro</p>
                                <h2 className="text-xl font-bold leading-none text-[#F0F0F0] tracking-tight drop-shadow-sm">
                                    Olá, {freshProfile?.full_name?.split(' ')[0] || profile?.full_name?.split(' ')[0]}
                                </h2>
                            </div>
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="relative group cursor-pointer p-4 rounded-2xl bg-white/10 border border-white/10 hover:bg-white/20 transition-all shadow-xl backdrop-blur-md"
                            >
                                <Bell size={24} className="text-[#F0F0F0] group-hover:text-[#D4AF37] transition-colors" />
                                {notifications.length > 0 && <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-[#D4AF37] rounded-full border-2 border-[#122216] animate-pulse"></div>}
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'home' && (
                    <div className="px-6 space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                        {/* Agenda Card - BENTO HERO */}
                        <div
                            className={`${bentoItemClass} group cursor-pointer`}
                            onClick={() => handleNavigation('calendar')}
                        >
                            {/* Background Image Overlay */}
                            <div className="absolute inset-0 z-0 opacity-20 group-hover:opacity-30 transition-opacity">
                                <img
                                    src="/assets/dashboard-bgs/agenda_bg.png"
                                    className="w-full h-full object-cover grayscale brightness-50"
                                />
                            </div>
                            <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#0F172A] to-transparent"></div>

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xl shadow-blue-200">
                                        <Calendar size={28} strokeWidth={2.5} />
                                    </div>
                                    <span className="text-[10px] font-black text-white uppercase tracking-wider bg-[#D4AF37] px-4 py-2 rounded-full shadow-lg">
                                        Ver tudo
                                    </span>
                                </div>

                                <h3 className="text-3xl font-black mb-1 text-white tracking-tight">Agenda Diária</h3>
                                <p className="text-slate-400 text-sm mb-6 font-semibold">
                                    <span className="text-blue-400 font-bold">{upcomingAppointments.length}</span> consultas confirmadas hoje.
                                </p>

                                <div className="space-y-4">
                                    {upcomingAppointments.length > 0 ? (
                                        <div
                                            onClick={(e) => { e.stopPropagation(); navigate(`/appointment/${upcomingAppointments[0].id}`); }}
                                            className="flex items-center gap-5 p-5 bg-white/5 rounded-[2rem] border-2 border-transparent hover:border-white/10 transition-all"
                                        >
                                            <div className="text-center w-14 shrink-0">
                                                <span className="block text-[10px] text-blue-400 uppercase font-black">Início</span>
                                                <span className="block text-xl font-black text-white">{format(new Date(upcomingAppointments[0].start_time), 'HH:mm')}</span>
                                            </div>
                                            <div className="w-px h-10 bg-white/10"></div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-base text-white">{upcomingAppointments[0].patient?.full_name || 'Paciente'}</h4>
                                            </div>
                                            <ChevronRight size={20} className="text-slate-300 group-hover:text-blue-600 transition-colors" />
                                        </div>
                                    ) : (
                                        <div className="p-8 bg-black/20 rounded-[2.5rem] border-2 border-dashed border-white/5 text-center group/empty">
                                            <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] group-hover/empty:text-[#D4AF37] transition-colors">
                                                Nenhum compromisso pendente
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Grid Navigation */}
                        <div className="grid grid-cols-2 gap-4">
                            <div
                                onClick={() => handleNavigation('patients')}
                                className={`${bentoItemClass} hover:bg-[#1F2937]/60 hover:shadow-blue-500/10 transition-all group`}
                            >
                                {/* Background Image Overlay */}
                                <div className="absolute inset-0 z-0 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <img
                                        src="/assets/dashboard-bgs/patients_bg.png"
                                        className="w-full h-full object-cover grayscale"
                                    />
                                </div>

                                <div className="relative z-10">
                                    <div className="w-12 h-12 bg-blue-600/20 text-blue-400 rounded-2xl flex items-center justify-center mb-4">
                                        <Users size={24} />
                                    </div>
                                    <h3 className="font-black text-white mb-1 text-base">Pacientes</h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">12 Ativos</p>
                                </div>
                            </div>

                            <div
                                onClick={() => handleNavigation('reviews')}
                                className={`${bentoItemClass} hover:bg-gradient-to-br hover:from-[#3D3A2C] hover:to-[#1F2937] transition-all border-white/5 hover:border-[#D4AF37]/30 group/eval group`}>
                                {/* Background Image Overlay */}
                                <div className="absolute inset-0 z-0 opacity-20 group-hover:opacity-30 transition-opacity">
                                    <img
                                        src="/assets/dashboard-bgs/reviews_bg.png"
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="relative z-10">
                                    <div className="w-12 h-12 bg-[#D4AF37] text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-black/20">
                                        <Star size={24} />
                                    </div>
                                    <h3 className="font-bold mb-1 text-base">Avaliações</h3>
                                    <p className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-wider">4.9 Média</p>
                                </div>
                            </div>

                            <div
                                onClick={() => handleNavigation('financial')}
                                className={`${bentoItemClass} hover:bg-[#1F2937]/60 transition-all group`}>
                                {/* Background Image Overlay */}
                                <div className="absolute inset-0 z-0 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <img
                                        src="/assets/dashboard-bgs/financial_bg.png"
                                        className="w-full h-full object-cover grayscale"
                                    />
                                </div>

                                <div className="relative z-10">
                                    <div className="w-12 h-12 bg-blue-400/10 text-blue-400 rounded-2xl flex items-center justify-center mb-4">
                                        <DollarSign size={24} />
                                    </div>
                                    <h3 className="font-black text-white mb-1 text-base">Financeiro</h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Visão Geral</p>
                                </div>
                            </div>

                            <div
                                onClick={() => handleNavigation('settings')}
                                className={`${bentoItemClass} hover:bg-[#1F2937]/60 transition-all group relative`}>
                                {/* Background Image Overlay */}
                                <div className="absolute inset-0 z-0 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <img
                                        src="/assets/dashboard-bgs/settings_bg.png"
                                        className="w-full h-full object-cover grayscale"
                                    />
                                </div>

                                <div className="relative z-10">
                                    <div className="w-12 h-12 bg-white/10 text-slate-400 rounded-2xl flex items-center justify-center mb-4">
                                        <Settings size={24} />
                                    </div>
                                    <h3 className="font-black text-white mb-1 text-base">Ajustes</h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Configurações</p>
                                </div>
                            </div>
                        </div>

                        {/* Support Banner */}
                        <div className="bg-[#D4AF37] p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group cursor-pointer mb-8">
                            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform"></div>
                            <h3 className="font-black text-white text-xl relative z-10">Suporte Metrik</h3>
                            <p className="text-white/80 text-sm mt-1 mb-6 max-w-[80%] relative z-10 font-bold">Precisa de ajuda com a plataforma?</p>
                            <button className="px-8 py-4 bg-white text-[#D4AF37] text-xs font-black uppercase tracking-widest rounded-2xl transition-all relative z-10 hover:shadow-xl flex items-center gap-3">
                                Contatar <ChevronRight size={18} strokeWidth={4} />
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'calendar' && (
                    <div className="px-6 h-full pb-20 animate-in slide-in-from-right-4 duration-500">
                        <ProfessionalAgenda />
                    </div>
                )}

                {activeTab === 'patients' && (
                    <div className="px-6 h-full pb-20">
                        <PatientsList />
                    </div>
                )}

                {activeTab === 'reviews' && (
                    <div className="px-6 h-full pb-20">
                        <ProfessionalReviews />
                    </div>
                )}

                {activeTab === 'financial' && (
                    <div className="px-6 h-full pb-20">
                        <FinancialOverview />
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="px-6 h-full pb-20">
                        <ProfessionalSettings />
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
