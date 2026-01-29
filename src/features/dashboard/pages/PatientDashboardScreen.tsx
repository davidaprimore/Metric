import React, { useState, useEffect } from 'react';
import { FluidBackground } from '@/components/layout/FluidBackground';
import { supabase } from '@/lib/supabase';
import {
  Bell,
  Calendar as CalendarIcon,
  Clock,
  ChevronRight,
  Plus,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  ShieldCheck,
  CalendarDays,
  Dumbbell,
  Layers,
  Weight,
  Activity,
  Utensils,
  Apple,
  FileText
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
  METRIK THEME: ORGANIC ICE
  - Background: Ice Grey/Blue (Slate-50) with Streaked Texture
  - Cards: Pastel Colors & White with Shadows (Colorful/Image focus)
*/

// Base Card Style (White/Paper)
const paperCardClass = "bg-white border border-slate-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] relative overflow-hidden text-slate-900";

export const PatientDashboardScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user, userProfile, refreshProfile } = useAuth();

  // Sync Avatar from Auth to Profile if missing (Self-Healing)
  useEffect(() => {
    const syncAvatar = async () => {
      if (user?.user_metadata?.avatar_url && userProfile && !userProfile.avatar_url) {
        await supabase.from('profiles').update({
          avatar_url: user.user_metadata.avatar_url
        }).eq('id', user.id);
        if (refreshProfile) refreshProfile();
      }
    };
    syncAvatar();
  }, [user, userProfile]);

  const [activeTab, setActiveTab] = useState('home');

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

      // Ghost Check
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

      const { data: notifs } = await supabase.from('notifications').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5);
      if (notifs) setNotifications(notifs);

      const { data: assess } = await supabase.from('assessments').select('*').eq('patient_id', user.id).order('created_at', { ascending: true });
      if (assess) setAssessments(assess);
    };
    fetchUserData();
  }, [user]);

  const assessmentCount = assessments.length;
  const firstName = user?.user_metadata?.first_name || 'Usuário';
  const latestAssessment = assessmentCount > 0 ? assessments[assessmentCount - 1] : null;
  const userWeight = user?.user_metadata?.weight || '0.0';

  // Trend Helper
  const getTrendPct = (key: string, current: string | number) => {
    if (assessmentCount < 2) return null;
    const prev = assessments[assessmentCount - 2];
    const prevFatPct = Number(prev.fat_percentage || prev.body_fat || 0);
    const prevWeight = Number(prev.weight || 0);

    let prevVal = 0;
    if (key === 'fat_mass') prevVal = prevWeight * (prevFatPct / 100);
    else if (key === 'lean_mass') prevVal = prevWeight * (1 - prevFatPct / 100);
    else prevVal = Number(prev[key] || (key === 'fat_percentage' ? prevFatPct : prevWeight));

    const currVal = Number(current);
    if (!prevVal) return null;
    const diffPct = ((currVal - prevVal) / prevVal) * 100;
    return (diffPct > 0 ? '+' : '') + diffPct.toFixed(1) + '%';
  };

  const getTrendConfig = (key: string, current: string | number) => {
    if (assessmentCount < 2) return { color: "text-slate-400", isUp: false, label: '' };
    const trendStr = getTrendPct(key, current);
    if (!trendStr) return { color: "text-slate-400", isUp: false, label: '' };
    const val = parseFloat(trendStr);
    const isUp = val > 0;
    const label = trendStr;

    if (key === 'fat_percentage' || key === 'fat_mass') {
      return { color: isUp ? "text-red-600" : "text-emerald-700", isUp, label };
    }
    if (key === 'lean_mass') {
      return { color: isUp ? "text-emerald-700" : "text-red-600", isUp, label };
    }
    if (key === 'weight') {
      return { color: isUp ? "text-amber-700" : "text-blue-700", isUp, label };
    }
    return { color: "text-slate-500", isUp, label };
  };

  const currentWeight = Number(latestAssessment?.weight || userWeight || 0);
  const currentFatPct = Number(latestAssessment?.fat_percentage || latestAssessment?.body_fat || 0);
  const currentFatMass = (currentWeight * (currentFatPct / 100)).toFixed(1);
  const currentLeanMass = (currentWeight - parseFloat(currentFatMass)).toFixed(1);

  const metrics = [
    {
      label: 'Gordura Corporal',
      value: currentFatPct || '0.0',
      unit: '%',
      config: getTrendConfig('fat_percentage', currentFatPct),
      Icon: Activity,
      bgColor: 'bg-[#FFEDD5]', // Orange-100
      textColor: 'text-orange-900',
      iconColor: 'text-orange-600'
    },
    {
      label: 'Peso Atual',
      value: currentWeight || '0.0',
      unit: 'kg',
      config: getTrendConfig('weight', currentWeight),
      Icon: Weight,
      bgColor: 'bg-[#DBEAFE]', // Blue-100
      textColor: 'text-blue-900',
      iconColor: 'text-blue-600'
    },
    {
      label: 'Massa Magra',
      value: currentLeanMass || '0.0',
      unit: 'kg',
      config: getTrendConfig('lean_mass', currentLeanMass),
      Icon: Dumbbell,
      bgColor: 'bg-[#F3E8FF]', // Purple-100
      textColor: 'text-purple-900',
      iconColor: 'text-purple-600'
    },
    {
      label: 'Massa Gorda',
      value: currentFatMass || '0.0',
      unit: 'kg',
      config: getTrendConfig('fat_mass', currentFatMass),
      Icon: Layers,
      bgColor: 'bg-[#DCFCE7]', // Green-100
      textColor: 'text-emerald-900',
      iconColor: 'text-emerald-600'
    }
  ];

  const handleTabChange = (tab: string) => {
    if (tab === 'assessment') {
      navigate('/assessment');
    } else {
      setActiveTab(tab);
      window.scrollTo(0, 0);
    }
  };

  const renderHome = () => (
    <div className="relative z-10 text-slate-800 animate-in fade-in slide-in-from-bottom-4 duration-500 pt-6">
      {/* Brand & Notifications Header */}
      <header className="flex justify-between items-center mb-8">
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full overflow-hidden border border-slate-200">
              {(userProfile?.avatar_url || (user?.user_metadata?.avatar_url && !user.user_metadata.avatar_url.includes('pravatar.cc'))) ? (
                <img src={userProfile?.avatar_url || user?.user_metadata?.avatar_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <DefaultAvatar gender={userProfile?.gender || user?.user_metadata?.gender} className="w-full h-full" />
              )}
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 mb-0.5">
                {(userProfile?.gender === 'female' || userProfile?.gender === 'feminino') ? 'Seja bem vinda,' : 'Seja bem vindo,'}
              </p>
              <h2 className="text-xl font-black text-slate-800 leading-none tracking-tight">{firstName}</h2>
            </div>
          </div>
        </div>

        <div className="relative">
          <button onClick={() => setShowNotifications(!showNotifications)} className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-600 relative hover:bg-slate-50 transition-all shadow-sm hover:shadow-md active:scale-95">
            <Bell size={22} className={cn("text-slate-600", notifications.some(n => !n.read) && "text-blue-600")} />
            {notifications.some(n => !n.read) && <div className="absolute top-3 right-3.5 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_red]"></div>}
          </button>

          {/* Functional Notification Dropdown */}
          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>
              <div className="absolute right-0 top-14 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-100 z-50 p-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-bold text-slate-800">Notificações</h4>
                  <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded-full">{notifications.length}</span>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1 scrollbar-hide">
                  {notifications.length > 0 ? notifications.map((n, i) => (
                    <div key={i} className="p-3 bg-slate-50/50 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                      <p className="text-xs font-semibold text-slate-700 leading-tight mb-1">{n.title}</p>
                      <p className="text-[10px] text-slate-400 leading-relaxed">{n.message}</p>
                    </div>
                  )) : (
                    <div className="text-center py-6">
                      <Bell size={24} className="text-slate-300 mx-auto mb-2 opacity-50" />
                      <p className="text-xs text-slate-400">Nenhuma notificação nova</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </header>

      {/* Welcome Section Removed (Integrated into Header) */}
      <div className="mb-6"></div>

      {/* PAINEL INFORMATIVO / ALERTS */}
      <div className="space-y-4 mb-8">
        {profileIncomplete && (
          <div className="bg-orange-50/80 backdrop-blur-xl border border-orange-100 p-5 rounded-[2rem] flex items-center gap-4 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full -mr-8 -mt-8 blur-2xl group-hover:bg-orange-500/20 transition-all"></div>
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 text-orange-500 shadow-sm relative z-10">
              <ShieldCheck size={20} />
            </div>
            <div className="flex-1 relative z-10">
              <p className="text-xs font-black text-orange-600 uppercase tracking-tight">Complete seu Perfil</p>
              <p className="text-[10px] text-orange-800/60 font-medium leading-tight mt-0.5">Preencha seus dados para uma análise precisa.</p>
            </div>
            <button onClick={() => navigate('/profile/data')} className="w-9 h-9 bg-white text-orange-500 rounded-full flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all shadow-sm z-10"><ArrowRight size={16} /></button>
          </div>
        )}

        {upcomingAppointments.length > 0 ? (
          <div className="bg-slate-900 rounded-[2.5rem] p-6 shadow-xl shadow-slate-300 text-white relative overflow-hidden group">
            {/* Dark Card for Contrast against Light Theme */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl -mr-16 -mt-16"></div>

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-5">
                <span className="bg-blue-600 text-white text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider shadow-md">Próximo</span>
                <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md"><CalendarIcon className="text-blue-400" size={20} /></div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Consulta Confirmada</h3>
              <div className="flex items-center gap-3 mb-6 opacity-90">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><Clock className="text-blue-300" size={14} /></div>
                <div>
                  <p className="text-sm font-bold text-white leading-none">{new Date(upcomingAppointments[0].start_time).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">As {new Date(upcomingAppointments[0].start_time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
              <Button onClick={() => setActiveTab('schedule')} className="w-full h-12 rounded-xl bg-white text-slate-900 font-black text-xs hover:bg-blue-50 transition-all shadow-lg shadow-black/20 tracking-widest uppercase">Ver Detalhes</Button>
            </div>
          </div>
        ) : (
          <div className={`${paperCardClass} p-6 flex items-center gap-4`}>
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0 text-slate-500 border border-slate-200"><CalendarDays size={20} /></div>
            <div className="flex-1">
              <p className="text-xs font-bold text-slate-800">Agenda Livre</p>
              <p className="text-[10px] text-slate-500">Nenhum compromisso futuro.</p>
            </div>
            <button onClick={() => setActiveTab('schedule')} className="text-[10px] font-black text-blue-600 uppercase tracking-wider hover:bg-slate-50 px-3 py-2 rounded-lg transition-colors">Agendar</button>
          </div>
        )}
      </div>

      {/* Metrics Grid - COLORFUL CARDS (Organic Theme) */}
      <div className="mb-8 relative z-10">
        <div className="flex justify-between items-end mb-5 px-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Suas Métricas</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {metrics.map((item, idx) => (
            <div key={idx} className={`${item.bgColor} p-5 rounded-[2.5rem] relative overflow-hidden group hover:-translate-y-1 transition-transform duration-500 min-h-[180px] flex flex-col justify-between shadow-sm border border-white/50`}>

              {/* Background Wireframe Icon - Darker blend for aesthetics */}
              <div className="absolute -right-6 -bottom-6 text-slate-900/[0.05] rotate-[-15deg] pointer-events-none transition-transform duration-700 group-hover:scale-105 group-hover:rotate-[-5deg] z-0 mix-blend-multiply">
                <item.Icon size={160} strokeWidth={1} style={{ filter: 'drop-shadow(0 1px 0 rgba(255,255,255,0.5))' }} />
              </div>

              {/* Top Row: Icon Left */}
              <div className="flex justify-between items-start relative z-10">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm border border-white/40 backdrop-blur-sm bg-white/60 ${item.iconColor}`}>
                  <item.Icon size={18} strokeWidth={2.5} />
                </div>
              </div>

              {/* Middle/Right: Values */}
              <div className="flex flex-col items-end relative z-10 mt-2">
                <p className={cn("text-[9px] font-bold uppercase tracking-tight mb-0.5 text-right opacity-70", item.textColor)}>{item.label}</p>
                <div className="flex items-baseline gap-0.5">
                  <span className={cn("text-4xl font-black tracking-tighter drop-shadow-sm", item.textColor)}>{item.value}</span>
                  <span className={cn("text-[10px] font-bold mb-1.5 opacity-70", item.textColor)}>{item.unit}</span>
                </div>
              </div>

              {/* Bottom: Trend/Evolution */}
              <div className="relative z-10 mt-auto pt-2 flex justify-start">
                {item.config.label ? (
                  <div className={cn("inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full border shadow-sm backdrop-blur-md bg-white/50 border-white/60", item.config.isUp ? "text-red-600" : "text-emerald-700")}>
                    {item.config.isUp ? <TrendingUp size={12} strokeWidth={3} /> : <TrendingDown size={12} strokeWidth={3} />}
                    <span className="text-[10px] font-black tracking-wide">{item.config.label.replace('+', '')}</span>
                  </div>
                ) : (
                  <div className="h-6"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating CTA - Main Action */}
      <Button variant="primary" className="w-full h-16 rounded-[2rem] bg-slate-900 text-white font-black text-xs gap-3 shadow-xl shadow-slate-900/30 hover:shadow-2xl hover:shadow-slate-900/40 transition-all z-30 tracking-widest uppercase hover:scale-[1.02] border-none mb-10" onClick={() => setActiveTab('schedule')}>
        <Plus size={24} strokeWidth={3} />Novo Agendamento
      </Button>

      {/* 🍎 DIET SESSION - Clean White + Gradient Visual */}
      <div className="mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
        <div className="flex justify-between items-end mb-5 px-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nutrição & Dieta</p>
          <button className="text-[10px] font-bold text-green-600 uppercase tracking-wider">Ver Plano</button>
        </div>

        {/* Card with Gradient Top */}
        <div className="bg-white rounded-[2.5rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] relative overflow-hidden group">
          <div className="h-24 bg-gradient-to-tr from-green-400 to-emerald-600 relative overflow-hidden">
            {/* Pattern/Image Placeholder */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
            <div className="absolute -right-6 -bottom-10 text-white/20 rotate-12">
              <Apple size={140} strokeWidth={1} />
            </div>
          </div>

          <div className="p-6 relative">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg -mt-14 mb-4 relative z-10 border border-green-50">
              <Utensils size={28} className="text-green-500" strokeWidth={2} />
            </div>

            <h3 className="text-lg font-black text-slate-800 mb-2">Combustível Diário</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-[240px] mb-6">
              "A alimentação é a base da sua performance. Mantenha o equilíbrio."
            </p>

            <Button className="w-full bg-green-50 text-green-700 hover:bg-green-100 rounded-xl text-[10px] font-bold uppercase tracking-widest h-10 shadow-sm border border-green-200">
              Acessar Dieta
            </Button>
          </div>
        </div>
      </div>

      {/* 🧬 EXAMS & RESULTS SESSION */}
      <div className="mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
        <div className="flex justify-between items-end mb-5 px-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Exames & Analises</p>
        </div>

        <div className="bg-white rounded-[2.5rem] p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] relative overflow-hidden flex items-center justify-between group cursor-pointer hover:bg-slate-50 transition-colors border border-slate-100">
          <div className="flex items-center gap-5 z-10">
            <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 border border-purple-100 shadow-inner">
              <FileText size={28} strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-800 leading-tight mb-1">Central de Exames</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">0 Documentos Arquivados</p>
            </div>
          </div>
          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 shadow-sm group-hover:text-purple-600 group-hover:scale-110 transition-all z-10">
            <ChevronRight size={20} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 mb-24 flex flex-col justify-center items-center py-6 opacity-40">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-6 bg-slate-800 rounded-md flex items-center justify-center text-white font-black text-xs shadow-sm">M</div>
          <h1 className="text-lg font-black text-slate-800 tracking-tight">METRIK</h1>
        </div>
        <p className="text-[9px] text-slate-600 font-bold uppercase tracking-[0.2em]">Health Intelligence</p>
      </footer>
    </div>
  );

  return (
    <FluidBackground variant="marble" className="pb-40 font-sans px-5 relative overflow-hidden min-h-screen">
      {activeTab === 'home' && renderHome()}
      {activeTab === 'schedule' && <ScheduleScreen embedded />}
      {activeTab === 'profile' && <ProfileScreen embedded />}
      {activeTab === 'results' && <ResultsScreen isEmbedded />}
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </FluidBackground>
  );
};