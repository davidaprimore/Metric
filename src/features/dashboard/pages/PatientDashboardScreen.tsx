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
  METRIK ORIGINS THEME: "ELITE TEXTURE" (Patient)
  - Cards: Textured dark backgrounds + Glass styling
  - Padding: Corrected to prevent Nav overlap (pb-40)
*/

// Glassy, Transparent, Luminous
const textureCardClass = "bg-black/40 bg-[radial-gradient(120%_120%_at_50%_0%,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent backdrop-blur-3xl border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] relative overflow-hidden";

export const PatientDashboardScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
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

      const { data: appts } = await supabase.from('appointments').select('*').eq('patient_id', user.id).eq('status', 'confirmed').gte('start_time', new Date().toISOString()).order('start_time', { ascending: true }).limit(1);
      if (appts) setUpcomingAppointments(appts);

      const { data: notifs } = await supabase.from('notifications').select('*').eq('user_id', user.id).eq('read', false).order('created_at', { ascending: false });
      if (notifs) setNotifications(notifs);
    };
    fetchUserData();
  }, [user]);

  const assessmentCount = assessments.length;
  const firstName = user?.user_metadata?.first_name || 'Usuário';
  const latestAssessment = assessmentCount > 0 ? assessments[assessmentCount - 1] : null;
  const userWeight = user?.user_metadata?.weight || '0.0';

  const metrics = [
    { label: 'Gordura Corporal', value: latestAssessment?.body_fat || '0.0', unit: '%', trend: assessmentCount >= 2 ? '-1.2%' : null, up: false, icon: "/assets/3d/caliper.png" },
    { label: 'Peso Atual', value: userWeight, unit: 'kg', trend: assessmentCount >= 2 ? '-0.5kg' : null, up: false, icon: "/assets/3d/scale.png" }
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
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveTab('profile')}>
          <div className="w-12 h-12 rounded-full border border-white/5 p-0.5 bg-black/60 shadow-lg overflow-hidden group-hover:scale-105 transition-transform backdrop-blur-xl">
            {(userProfile?.avatar_url || (user?.user_metadata?.avatar_url && !user.user_metadata.avatar_url.includes('pravatar.cc'))) ? (
              <img src={userProfile?.avatar_url || user?.user_metadata?.avatar_url} alt="Profile" className="w-full h-full rounded-full object-cover" />
            ) : (
              <DefaultAvatar gender={userProfile?.gender || user?.user_metadata?.gender} className="w-full h-full rounded-full" />
            )}
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-white leading-tight drop-shadow-sm">Olá, {firstName}</h1>
            <span className="text-[10px] font-extrabold text-[#CCFF00] uppercase tracking-[0.1em] group-hover:underline shadow-[#CCFF00]/50 drop-shadow-sm">Ver Perfil</span>
          </div>
        </div>

        <button onClick={() => setShowNotifications(!showNotifications)} className="w-11 h-11 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-slate-300 relative">
          <Bell size={20} className={cn("text-slate-400 opacity-80", notifications.length > 0 && "text-[#CCFF00]")} />
          {notifications.length > 0 && <div className="absolute top-2.5 right-3 w-2 h-2 bg-[#FFC107] rounded-full animate-pulse"></div>}
        </button>
      </header>

      {/* HERO SECTION - Texture */}
      <div className={`${textureCardClass} w-full h-40 rounded-[2rem] mb-8 overflow-hidden flex items-center justify-between px-6 shadow-lg`}>
        <div className="absolute inset-0 bg-gradient-to-r from-[#CCFF00]/10 to-transparent pointer-events-none"></div>
        <div className="relative z-10 max-w-[50%]">
          <h2 className="text-lg font-bold text-white leading-tight mb-1">Seu corpo,<br />sua jornada.</h2>
          <p className="text-[10px] text-slate-400 font-medium">Vamos medir seu progresso hoje?</p>
        </div>
        <div className="relative z-10 w-32 h-32 -mr-4 animate-in fade-in zoom-in duration-1000">
          <img src="/assets/3d/tape_measure.png" className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(204,255,0,0.3)]" alt="Tape Measure Friend" />
        </div>
      </div>

      {/* COMPROMISSOS & PENDING TASKS SECTION */}
      <div className="mb-8 space-y-4">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Centro de Avisos</p>

        {profileIncomplete && (
          <div className={`${textureCardClass} p-5 rounded-[2rem] flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500 border-[#FFC107]/20`}>
            <div className="w-12 h-12 rounded-2xl bg-[#FFC107]/20 flex items-center justify-center shrink-0 border border-[#FFC107]/30">
              <ShieldCheck className="text-[#FFC107]" size={24} />
            </div>
            <div className="flex-1">
              <p className="text-xs font-black text-[#FFC107] uppercase tracking-tight">Perfil Incompleto</p>
              <p className="text-[10px] text-slate-400 font-medium leading-tight mt-0.5">Faltando: <span className="font-bold text-slate-200">{missingFields.join(', ')}</span>.</p>
            </div>
            <button onClick={() => navigate('/profile/data')} className="w-10 h-10 bg-[#FFC107] text-black rounded-full flex items-center justify-center shadow-lg"><ArrowRight size={18} /></button>
          </div>
        )}

        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2 pt-2">Meus Compromissos</p>

        {upcomingAppointments.length > 0 ? (
          <div className={`${textureCardClass} rounded-[2.5rem] p-6 shadow-md transition-all duration-300 group`}>
            <div className="flex justify-between items-start mb-4">
              <span className="bg-[#CCFF00]/10 text-[#CCFF00] text-[10px] font-extrabold px-3 py-1 rounded-lg uppercase tracking-wider border border-[#CCFF00]/20 shadow-sm">Próximo Agendamento</span>
              <div className="w-10 h-10 bg-[#CCFF00]/10 rounded-2xl flex items-center justify-center"><CalendarIcon className="text-[#CCFF00]" size={20} /></div>
            </div>
            <h3 className="text-lg font-bold text-white mb-4">Consulta Agendada</h3>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center border border-white/10"><Clock className="text-[#CCFF00]" size={14} /></div>
                <div>
                  <p className="text-sm font-bold text-slate-200 leading-none">{new Date(upcomingAppointments[0].start_time).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</p>
                  <p className="text-[10px] text-slate-500 font-medium">às {new Date(upcomingAppointments[0].start_time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            </div>
            <Button onClick={() => setActiveTab('schedule')} className="w-full h-12 rounded-xl bg-white text-black font-bold text-xs hover:bg-slate-200 transition-colors shadow-lg">Ver Detalhes</Button>
          </div>
        ) : (
          <div className={`${textureCardClass} rounded-[2rem] p-6 shadow-sm flex items-center gap-4`}>
            <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5"><CalendarDays className="text-slate-600" size={20} /></div>
            <div className="flex-1"><p className="text-xs font-bold text-slate-500">Nenhum agendamento futuro.</p></div>
            <button onClick={() => setActiveTab('schedule')} className="text-[10px] font-bold text-[#FFC107] uppercase tracking-wider hover:underline">Agendar</button>
          </div>
        )}
      </div>

      {/* Metrics Grid */}
      <div className="mb-8 relative">
        <div className="grid grid-cols-2 gap-4">
          {metrics.map((item, idx) => (
            <div key={idx} className={`${textureCardClass} rounded-[2rem] p-5 shadow-sm group`}>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight mb-2 relative z-10">{item.label}</p>
              {item.icon && <div className="absolute -bottom-4 -right-4 w-20 h-20 opacity-20 group-hover:opacity-40 transition-opacity grayscale group-hover:grayscale-0 contrast-125"><img src={item.icon} className="w-full h-full object-contain" /></div>}
              <div className="flex items-baseline gap-1 relative z-10">
                <span className="text-2xl font-black text-white tracking-tighter drop-shadow-sm">{item.value}</span>
                <span className="text-xs font-bold text-slate-500">{item.unit}</span>
              </div>
              {item.trend && (
                <div className={cn("flex items-center gap-1 mt-2 text-[10px] font-bold relative z-10", item.up ? "text-[#FFC107]" : "text-[#CCFF00]")}>
                  {item.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {item.trend}
                </div>
              )}
            </div>
          ))}
        </div>
        {assessmentCount === 0 && <div className="mt-4 px-2"><p className="text-[10px] text-slate-600 font-bold italic leading-relaxed">* Os dados de avaliação serão exibidos automaticamente após a sua <span className="text-[#CCFF00] font-black">primeira consulta</span>.</p></div>}
      </div>

      <div className={`${textureCardClass} rounded-[2.5rem] p-6 shadow-md mb-8`}>
        <div className="flex justify-between items-center mb-6"><h3 className="text-lg font-bold text-white">Minha Evolução</h3></div>
        <div className="py-12 flex flex-col items-center text-center px-4">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 text-slate-500 border border-white/5"><TrendingUp size={32} strokeWidth={1.5} /></div>
          <p className="text-sm font-bold text-slate-500 leading-tight">{assessmentCount === 0 ? "Aguardando seu primeiro resultado para gerar gráficos." : "A Minha Evolução será exibida assim que você realizar a segunda avaliação."}</p>
        </div>
      </div>

      {/* Floating CTA */}
      <Button variant="primary" className="w-full h-16 rounded-[2rem] bg-[#CCFF00] text-black font-black text-xs gap-3 shadow-xl hover:shadow-2xl transition-all sticky bottom-8 z-30 tracking-widest uppercase hover:bg-white" onClick={() => setActiveTab('schedule')}>
        <Plus size={24} strokeWidth={3} />Novo Agendamento
      </Button>

      {/* Footer */}
      <footer className="mt-8 mb-16 flex justify-between items-center py-6 border-t border-white/5">
        <div className="flex items-center gap-2.5 opacity-80">
          <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center shadow-sm border border-white/10"><span className="text-[#CCFF00] font-black text-sm text-shadow">M</span></div>
          <div><p className="text-[10px] font-black text-slate-400 tracking-[0.15em] leading-none mb-0.5">METRIK</p><p className="text-[7px] font-bold text-[#CCFF00] tracking-[0.2em] uppercase opacity-60">Precision Lab</p></div>
        </div>
        <div className="flex flex-col items-end gap-1.5 text-right">
          <p className="text-[9px] text-slate-600 font-bold tracking-tight opacity-60">@METRIK.oficial</p>
          <div className="flex items-center gap-1.5 bg-[#CCFF00]/10 px-2.5 py-1 rounded-lg border border-[#CCFF00]/10"><ShieldCheck size={11} className="text-[#CCFF00]" /><span className="text-[8px] font-extrabold text-[#CCFF00] uppercase tracking-wider">Avaliação Certificada</span></div>
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