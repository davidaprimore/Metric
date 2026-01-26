import React, { useState, useEffect } from 'react';
import { FluidBackground } from '@/components/layout/FluidBackground';
import { supabase } from '@/lib/supabase';
import {
  Bell,
  Calendar as CalendarIcon,
  Clock,
  ChevronRight,
  Plus,
  AlertCircle,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  ExternalLink,
  ShieldCheck,
  CalendarDays
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { BottomNav } from '@/components/layout/BottomNav';
import { DefaultAvatar } from '@/components/shared/DefaultAvatar';

// Feature Screens
import { ScheduleScreen } from '@/features/schedule/pages/ScheduleScreen';
import { ProfileScreen } from '@/features/profile/pages/ProfileScreen';
import { ResultsScreen } from '@/features/assessment/pages/ResultsScreen';

/* 
  METRIK GLASS PRO THEME (Patient)
  - Cards: Frosted Glass (Black/40) + Gold Accents
  - Background: Fluid Light Beams (via FluidBackground)
*/

// Glassy, Premium, Minimalist
const textureCardClass = "bg-[#0A0A0A]/40 backdrop-blur-xl border border-white/5 relative overflow-hidden shadow-2xl";

export const PatientDashboardScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user, userProfile, refreshProfile } = useAuth();

  // Sync Avatar from Auth to Profile if missing (Self-Healing)
  useEffect(() => {
    const syncAvatar = async () => {
      if (user?.user_metadata?.avatar_url && userProfile && !userProfile.avatar_url) {
        console.log('Syncing avatar from Auth to Profile...');
        await supabase.from('profiles').update({
          avatar_url: user.user_metadata.avatar_url
        }).eq('id', user.id);
        if (refreshProfile) refreshProfile();
      }
    };
    syncAvatar();
  }, [user, userProfile]);

  const [activeTab, setActiveTab] = useState('home'); // State-based navigation

  // Data State
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [profileIncomplete, setProfileIncomplete] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      const meta = user.user_metadata || {};
      const missing = [];
      if (!meta.phone) missing.push('Telefone');
      if (!meta.weight) missing.push('Peso');
      if (!meta.height) missing.push('Altura');
      if (!meta.avatar_url || meta.avatar_url.includes('pravatar.cc')) missing.push('Foto de Perfil');
      setMissingFields(missing);
      setProfileIncomplete(missing.length > 0);

      // 1. Get IDs of appointments that are already assessed (Ghost Check)
      const { data: assessedIds } = await supabase.from('assessments').select('appointment_id').eq('patient_id', user.id).not('appointment_id', 'is', null);
      const ignoreIds = assessedIds?.map(a => a.appointment_id) || [];

      const { data: appts } = await supabase.from('appointments')
        .select('*')
        .eq('patient_id', user.id)
        .eq('status', 'confirmed')
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true });

      if (appts) {
        const valid = appts.filter(a => !ignoreIds.includes(a.id));
        setUpcomingAppointments(valid.slice(0, 1));
      }

      const { data: notifs } = await supabase.from('notifications').select('*').eq('user_id', user.id).eq('read', false).order('created_at', { ascending: false });
      if (notifs) setNotifications(notifs);

      // Fetch Completed Assessments (For Dashboard Metrics)
      const { data: assess } = await supabase.from('assessments').select('*').eq('patient_id', user.id).order('created_at', { ascending: true });
      if (assess) setAssessments(assess);
    };
    fetchUserData();
  }, [user]);

  const assessmentCount = assessments.length;
  const firstName = user?.user_metadata?.first_name || 'Usuário';
  const latestAssessment = assessmentCount > 0 ? assessments[assessmentCount - 1] : null;
  const userWeight = user?.user_metadata?.weight || '0.0';

  const metrics = [
    { label: 'Gordura Corporal', value: latestAssessment?.fat_percentage || latestAssessment?.body_fat || '0.0', unit: '%', trend: assessmentCount >= 2 ? (Number(latestAssessment?.fat_percentage || 0) - Number(assessments[assessmentCount - 2]?.fat_percentage || 0)).toFixed(1) + '%' : null, up: assessmentCount >= 2 && Number(latestAssessment?.fat_percentage) > Number(assessments[assessments.length - 2]?.fat_percentage), icon: "/assets/3d/caliper.png" },
    { label: 'Peso Atual', value: latestAssessment?.weight || userWeight || '0.0', unit: 'kg', trend: assessmentCount >= 2 ? (Number(latestAssessment?.weight || 0) - Number(assessments[assessmentCount - 2]?.weight || 0)).toFixed(1) + 'kg' : null, up: assessmentCount >= 2 && Number(latestAssessment?.weight) > Number(assessments[assessments.length - 2]?.weight), icon: "/assets/3d/scale.png" }
  ];

  const handleTabChange = (tab: string) => {
    if (tab === 'assessment') {
      navigate('/assessment'); // Keep assessment as full route for now (Wizard)
    } else {
      setActiveTab(tab);
      window.scrollTo(0, 0);
    }
  };

  const renderHome = () => (
    <div className="relative z-10 text-white animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <header className="pt-8 flex justify-between items-center mb-6">
        <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setActiveTab('profile')}>
          <div className="w-14 h-14 rounded-full border border-[#D4AF37]/30 p-0.5 bg-black/60 shadow-[0_0_15px_rgba(212,175,55,0.2)] overflow-hidden group-hover:scale-105 transition-transform backdrop-blur-xl relative">
            <div className="absolute inset-0 rounded-full border border-white/10"></div>
            {(userProfile?.avatar_url || (user?.user_metadata?.avatar_url && !user.user_metadata.avatar_url.includes('pravatar.cc'))) ? (
              <img src={userProfile?.avatar_url || user?.user_metadata?.avatar_url} alt="Profile" className="w-full h-full rounded-full object-cover" />
            ) : (
              <DefaultAvatar gender={userProfile?.gender || user?.user_metadata?.gender} className="w-full h-full rounded-full" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.2em] mb-1">Bem-vindo</span>
            <h1 className="text-2xl font-bold text-white leading-none drop-shadow-sm">{firstName}</h1>
          </div>
        </div>

        <button onClick={() => setShowNotifications(!showNotifications)} className="w-11 h-11 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-slate-300 relative hover:bg-white/10 transition-colors">
          <Bell size={20} className={cn("text-slate-400 opacity-80", notifications.length > 0 && "text-[#D4AF37]")} />
          {notifications.length > 0 && <div className="absolute top-2.5 right-3 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_red]"></div>}
        </button>
      </header>

      {/* HERO SECTION - Texture */}
      <div className={`${textureCardClass} w-full h-44 rounded-[2.5rem] mb-8 flex items-center justify-between px-8 relative group`}>
        {/* Subtle Gold Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/10 via-transparent to-transparent pointer-events-none opacity-50"></div>

        <div className="relative z-10 max-w-[60%]">
          <div className="w-8 h-1 bg-[#D4AF37] rounded-full mb-3"></div>
          <h2 className="text-xl font-bold text-white leading-tight mb-2">Seu corpo,<br />sua obra de arte.</h2>
          <p className="text-[10px] text-slate-400 font-medium tracking-wide">Vamos medir seu progresso hoje?</p>
        </div>
        <div className="relative z-10 w-36 h-36 -mr-6 animate-in fade-in zoom-in duration-1000">
          <img src="/assets/3d/tape_measure.png" className="w-full h-full object-contain filter drop-shadow-[0_0_25px_rgba(212,175,55,0.2)]" alt="Tape Measure Friend" />
        </div>
      </div>

      {/* COMPROMISSOS & PENDING TASKS SECTION */}
      <div className="mb-8 space-y-4">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Centro de Avisos</p>

        {profileIncomplete && (
          <div className={`${textureCardClass} p-5 rounded-[2rem] flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500 border-red-500/20 bg-red-500/5`}>
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center shrink-0 border border-red-500/20">
              <ShieldCheck className="text-red-500" size={24} />
            </div>
            <div className="flex-1">
              <p className="text-xs font-black text-red-500 uppercase tracking-tight">Perfil Incompleto</p>
              <p className="text-[10px] text-slate-400 font-medium leading-tight mt-0.5">Faltando: <span className="font-bold text-white">{missingFields.join(', ')}</span>.</p>
            </div>
            <button onClick={() => navigate('/profile/data')} className="w-10 h-10 bg-red-500/10 text-red-500 border border-red-500/20 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"><ArrowRight size={18} /></button>
          </div>
        )}

        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2 pt-2">Agenda</p>

        {upcomingAppointments.length > 0 ? (
          <div className={`${textureCardClass} rounded-[2.5rem] p-6 shadow-md transition-all duration-300 group hover:border-[#D4AF37]/30`}>
            <div className="flex justify-between items-start mb-4">
              <span className="bg-[#D4AF37]/10 text-[#D4AF37] text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider border border-[#D4AF37]/20 shadow-sm">Próximo</span>
              <div className="w-10 h-10 bg-[#D4AF37]/10 rounded-2xl flex items-center justify-center border border-[#D4AF37]/5"><CalendarIcon className="text-[#D4AF37]" size={20} /></div>
            </div>
            <h3 className="text-lg font-bold text-white mb-4">Consulta Confirmada</h3>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/5"><Clock className="text-[#D4AF37]" size={14} /></div>
                <div>
                  <p className="text-sm font-bold text-white leading-none">{new Date(upcomingAppointments[0].start_time).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">As {new Date(upcomingAppointments[0].start_time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            </div>
            <Button onClick={() => setActiveTab('schedule')} className="w-full h-12 rounded-xl bg-white text-black font-black text-xs hover:bg-[#D4AF37] hover:text-black transition-all shadow-lg tracking-widest uppercase">Ver Detalhes</Button>
          </div>
        ) : (
          <div className={`${textureCardClass} rounded-[2rem] p-6 shadow-sm flex items-center gap-4`}>
            <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5"><CalendarDays className="text-slate-600" size={20} /></div>
            <div className="flex-1"><p className="text-xs font-bold text-slate-500">Nenhum agendamento futuro.</p></div>
            <button onClick={() => setActiveTab('schedule')} className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider hover:text-white transition-colors">Agendar Agora</button>
          </div>
        )}
      </div>

      {/* Metrics Grid */}
      <div className="mb-8 relative">
        <div className="grid grid-cols-2 gap-4">
          {metrics.map((item, idx) => (
            <div key={idx} className={`${textureCardClass} rounded-[2rem] p-5 shadow-sm group hover:bg-white/5 transition-colors`}>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight mb-2 relative z-10">{item.label}</p>
              {item.icon && <div className="absolute -bottom-4 -right-4 w-20 h-20 opacity-20 group-hover:opacity-40 transition-opacity grayscale group-hover:grayscale-0 contrast-125"><img src={item.icon} className="w-full h-full object-contain" /></div>}
              <div className="flex items-baseline gap-1 relative z-10">
                <span className="text-2xl font-black text-white tracking-tighter drop-shadow-sm">{item.value}</span>
                <span className="text-xs font-bold text-[#D4AF37]">{item.unit}</span>
              </div>
              {item.trend && (
                <div className={cn("flex items-center gap-1 mt-2 text-[10px] font-bold relative z-10", item.up ? "text-red-400" : "text-green-400")}>
                  {item.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {item.trend}
                </div>
              )}
            </div>
          ))}
        </div>
        {assessmentCount === 0 && <div className="mt-4 px-2"><p className="text-[10px] text-slate-600 font-bold italic leading-relaxed">* Os dados serão atualizados após a sua <span className="text-[#D4AF37] font-black">primeira consulta</span>.</p></div>}
      </div>

      <div className={`${textureCardClass} rounded-[2.5rem] p-6 shadow-md mb-8`}>
        <div className="flex justify-between items-center mb-6"><h3 className="text-lg font-bold text-white">Minha Evolução</h3></div>
        {assessmentCount > 0 ? (
          <div className="h-40 w-full flex items-end relative overflow-hidden group">
            {(() => {
              const dataPoints = assessments.slice(-5);
              if (dataPoints.length < 2) return (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
                  <TrendingUp size={24} className="mb-2 opacity-50 text-[#D4AF37]" />
                  <p className="text-xs font-bold">1ª Avaliação Registrada!</p>
                  <p className="text-[10px] opacity-60 mt-1">O gráfico aparecerá na próxima consulta.</p>
                </div>
              );

              const width = 100;
              const height = 50;
              const values = dataPoints.map(d => Number(d.fat_percentage || d.body_fat || 0));
              const maxVal = Math.max(...values) * 1.1;
              const minVal = Math.min(...values) * 0.9;

              const getX = (i: number) => (i / (dataPoints.length - 1)) * width;
              const getY = (val: number) => height - ((val - minVal) / (maxVal - minVal || 1)) * height;

              const pathData = dataPoints.map((d, i) =>
                `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(Number(d.fat_percentage || d.body_fat || 0))}`
              ).join(' ');

              const areaPath = `${pathData} V ${height} H 0 Z`;

              return (
                <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
                  <line x1="0" y1={height} x2={width} y2={height} stroke="white" strokeOpacity="0.1" strokeWidth="0.5" />
                  <path d={areaPath} fill="url(#gradient)" opacity="0.2" />
                  <defs>
                    <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#D4AF37" />
                      <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                  </defs>
                  <path d={pathData} fill="none" stroke="#D4AF37" strokeWidth="2" className="drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]" strokeLinecap="round" strokeLinejoin="round" />
                  {dataPoints.map((d, i) => (
                    <circle key={i} cx={getX(i)} cy={getY(Number(d.fat_percentage || d.body_fat || 0))} r="2" fill="#D4AF37" />
                  ))}
                </svg>
              );
            })()}
          </div>
        ) : (
          <div className="py-12 flex flex-col items-center text-center px-4">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 text-slate-500 border border-white/5"><TrendingUp size={32} strokeWidth={1.5} /></div>
            <p className="text-sm font-bold text-slate-500 leading-tight">Aguardando seu primeiro resultado.</p>
          </div>
        )}
      </div>

      {/* Assessment History List */}
      <div className="mb-8">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2 mb-4">Histórico de Avaliações</p>
        <div className="space-y-3">
          {assessments.slice().reverse().map((assess, idx) => (
            <div key={assess.id} className={`${textureCardClass} p-4 rounded-3xl flex items-center justify-between group cursor-pointer hover:border-[#D4AF37]/30 transition-all`} onClick={() => navigate(`/assessment/results/${assess.id}`)}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 text-[#D4AF37]">
                  <span className="text-xs font-black">{new Date(assess.created_at).getDate()}</span>
                  <span className="text-[8px] font-bold uppercase ml-1 opacity-60">{new Date(assess.created_at).toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-white mb-0.5">{assess.type === 'pollock7' ? 'Protocolo Pollock 7' : 'Avaliação Física'}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-medium text-slate-400">{assess.weight}kg</span>
                    <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                    <span className="text-[10px] font-medium text-slate-400">{assess.fat_percentage || assess.body_fat}% Gordura</span>
                  </div>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-white group-hover:bg-[#D4AF37] transition-all">
                <ChevronRight size={14} />
              </div>
            </div>
          ))}
          {assessments.length === 0 && (
            <div className="text-center py-8 opacity-50">
              <p className="text-xs text-slate-500">Nhuma avaliação encontrada.</p>
            </div>
          )}
        </div>
      </div>

      {/* Floating CTA */}
      <Button variant="primary" className="w-full h-16 rounded-[2rem] bg-[#D4AF37] text-black font-black text-xs gap-3 shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:shadow-2xl transition-all sticky bottom-8 z-30 tracking-widest uppercase hover:bg-white hover:scale-[1.02]" onClick={() => setActiveTab('schedule')}>
        <Plus size={24} strokeWidth={3} />Novo Agendamento
      </Button>

      {/* Footer */}
      <footer className="mt-8 mb-16 flex justify-between items-center py-6 border-t border-white/5">
        <div className="flex items-center gap-2.5 opacity-80">
          <div className="w-9 h-9 bg-white/5 rounded-lg flex items-center justify-center shadow-sm border border-white/10"><span className="text-[#D4AF37] font-black text-sm text-shadow">M</span></div>
          <div><p className="text-[10px] font-black text-slate-400 tracking-[0.15em] leading-none mb-0.5">METRIK</p><p className="text-[7px] font-bold text-[#D4AF37] tracking-[0.2em] uppercase opacity-60">Gold Standard</p></div>
        </div>
        <div className="flex flex-col items-end gap-1.5 text-right">
          <p className="text-[9px] text-slate-600 font-bold tracking-tight opacity-60">@METRIK.oficial</p>
          <div className="flex items-center gap-1.5 bg-[#D4AF37]/10 px-2.5 py-1 rounded-lg border border-[#D4AF37]/10"><ShieldCheck size={11} className="text-[#D4AF37]" /><span className="text-[8px] font-extrabold text-[#D4AF37] uppercase tracking-wider">Verificado</span></div>
        </div>
      </footer>
    </div>
  );

  return (
    <FluidBackground variant="luminous" className="pb-40 font-sans px-5 relative overflow-hidden min-h-screen">
      {activeTab === 'home' && renderHome()}
      {activeTab === 'schedule' && <ScheduleScreen embedded />}
      {activeTab === 'profile' && <ProfileScreen embedded />}
      {activeTab === 'results' && <ResultsScreen isEmbedded />}

      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </FluidBackground>
  );
};