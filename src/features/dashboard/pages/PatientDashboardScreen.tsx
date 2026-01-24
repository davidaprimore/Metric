import React, { useState, useEffect } from 'react';
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
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { BottomNav } from '@/components/layout/BottomNav';
import { DefaultAvatar } from '@/components/shared/DefaultAvatar';

const chartData = [
  { name: 'JUN', weight: 81 },
  { name: 'JUL', weight: 80.5 },
  { name: 'AGO', weight: 79.8 },
  { name: 'SET', weight: 82.5 },
  { name: 'OUT', weight: 81.2 },
];

export const PatientDashboardScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'peso' | 'gordura'>('peso');

  const [pendingAnamnesis, setPendingAnamnesis] = useState(false);
  const [profileIncomplete, setProfileIncomplete] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [assessments, setAssessments] = useState<any[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      // 1. Check Anamnesis
      const { data: anamnesisData } = await supabase
        .from('anamnesis')
        .select('id')
        .eq('user_id', user.id);

      setPendingAnamnesis(!anamnesisData || anamnesisData.length === 0);

      // 2. Check Profile Completeness (Metadata)
      const meta = user.user_metadata || {};
      const missing = [];
      if (!meta.phone) missing.push('Telefone');
      if (!meta.weight) missing.push('Peso');
      if (!meta.height) missing.push('Altura');
      if (!meta.avatar_url || meta.avatar_url.includes('pravatar.cc')) missing.push('Foto de Perfil');

      setMissingFields(missing);
      setProfileIncomplete(missing.length > 0);

      // 3. Fetch (future) Appointments - Fixed: ASC to show the SOONEST
      const { data: appts } = await supabase
        .from('appointments')
        .select('*')
        .eq('patient_id', user.id)
        .eq('status', 'confirmed')
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true })
        .limit(1);

      if (appts) setUpcomingAppointments(appts);

      // 4. Fetch Notifications
      const { data: notifs } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .eq('read', false)
        .order('created_at', { ascending: false });

      if (notifs) setNotifications(notifs);
      setAssessments([]); // Still mocked/empty until we have real assessments
    };

    fetchUserData();
  }, [user]);

  const assessmentCount = assessments.length;
  const firstName = user?.user_metadata?.first_name || 'Usuário';

  // Metrics Logic
  const latestAssessment = assessmentCount > 0 ? assessments[assessmentCount - 1] : null;
  const userWeight = user?.user_metadata?.weight || '0.0';

  const metrics = [
    {
      label: 'Gordura Corporal',
      value: latestAssessment?.body_fat || '0.0',
      unit: '%',
      trend: assessmentCount >= 2 ? '-1.2%' : null,
      up: false
    },
    {
      label: 'Peso Atual',
      value: userWeight,
      unit: 'kg',
      trend: assessmentCount >= 2 ? '-0.5kg' : null,
      up: false
    },
    { label: 'Massa Magra', value: latestAssessment?.lean_mass || '0.0', unit: 'kg' },
    { label: 'Massa Gorda', value: latestAssessment?.fat_mass || '0.0', unit: 'kg' }
  ];

  return (
    <div className="min-h-screen bg-[#020502] pb-32 font-sans px-5 relative overflow-hidden">
      {/* INLINE STYLES FOR FOG MOTION */}
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
                background: radial-gradient(circle at center, rgba(57, 255, 20, 0.4), transparent 60%);
                filter: blur(50px);
            }
            .liquid-layer-2 {
                animation: liquid-fog-2 25s infinite ease-in-out alternate;
                /* HAZMAT YELLOW MIXED WITH DARK GREEN */
                background: radial-gradient(circle at center, rgba(200, 180, 0, 0.3), rgba(5, 40, 5, 0.6) 70%);
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
        {/* Header */}
        <header className="pt-8 flex justify-between items-center mb-8">
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate('/profile')}
          >
            <div className="w-12 h-12 rounded-full border border-[#39FF14]/50 p-0.5 bg-black/50 shadow-[0_0_15px_rgba(57,255,20,0.2)] overflow-hidden group-hover:scale-105 transition-transform backdrop-blur-md">
              {(userProfile?.avatar_url || (user?.user_metadata?.avatar_url && !user.user_metadata.avatar_url.includes('pravatar.cc'))) ? (
                <img src={userProfile?.avatar_url || user?.user_metadata?.avatar_url} alt="Profile" className="w-full h-full rounded-full object-cover" />
              ) : (
                <DefaultAvatar gender={userProfile?.gender || user?.user_metadata?.gender} className="w-full h-full rounded-full" />
              )}
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-white leading-tight drop-shadow-md">Olá, {firstName}</h1>
              <span className="text-[10px] font-extrabold text-[#39FF14] uppercase tracking-[0.1em] group-hover:underline drop-shadow-[0_0_5px_rgba(57,255,20,0.5)]">Ver Perfil</span>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-11 h-11 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white relative active:scale-95 transition-transform hover:bg-white/10 shadow-lg backdrop-blur-md"
            >
              <Bell size={20} fill={notifications.length > 0 ? "white" : "none"} className={cn("text-white opacity-80", notifications.length > 0 && "text-[#39FF14]")} />
              {notifications.length > 0 && (
                <div className="absolute top-2.5 right-3 w-2 h-2 bg-[#FBBF24] rounded-full border border-black shadow-[0_0_8px_#FBBF24]"></div>
              )}
            </button>

            {/* Notifications Popover */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-[#111] border border-[#39FF14]/20 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 backdrop-blur-xl">
                <h3 className="text-xs font-bold text-white mb-3 px-2 uppercase tracking-widest">Avisos</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                  {notifications.length > 0 ? notifications.map(n => (
                    <div key={n.id} className="p-3 bg-white/5 rounded-xl border border-white/5 hover:border-[#39FF14]/30 transition-colors">
                      <p className="text-xs font-bold text-white">{n.title}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{n.message}</p>
                    </div>
                  )) : (
                    <p className="text-[10px] text-slate-500 text-center py-4 uppercase font-bold">Nenhuma novidade.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* COMPROMISSOS & PENDING TASKS SECTION */}
        <div className="mb-8 space-y-4">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Centro de Avisos</p>

          {/* Profile Incomplete Alert */}
          {profileIncomplete && (
            <div className="bg-[#FBBF24]/10 border border-[#FBBF24]/20 p-5 rounded-[2rem] flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-2xl bg-black/40 flex items-center justify-center shrink-0 shadow-sm border border-[#FBBF24]/20">
                <ShieldCheck className="text-[#FBBF24]" size={24} strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-black text-[#FBBF24] uppercase tracking-tight">Perfil Incompleto</p>
                <p className="text-[10px] text-slate-400 font-medium leading-tight mt-0.5">
                  Faltando: <span className="font-bold text-white">{missingFields.join(', ')}</span>.
                </p>
              </div>
              <button
                onClick={() => navigate('/profile/data')}
                className="w-10 h-10 bg-[#FBBF24] text-black rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(251,191,36,0.2)] active:scale-95 transition-transform hover:bg-[#f59e0b]"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          )}

          {/* Pending Anamnesis Alert */}
          {pendingAnamnesis && (
            <div className="bg-[#39FF14]/10 border border-[#39FF14]/30 p-5 rounded-[2rem] flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500 delay-75 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-2xl bg-black/40 flex items-center justify-center shrink-0 shadow-sm border border-[#39FF14]/20">
                <AlertCircle className="text-[#39FF14]" size={24} strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-black text-[#39FF14] uppercase tracking-tight">Anamnese Pendente</p>
                <p className="text-[10px] text-slate-400 font-medium leading-tight mt-0.5">Complete sua entrevista prévia.</p>
              </div>
              <button
                onClick={() => navigate('/assessment/anamnesis')}
                className="w-10 h-10 bg-[#39FF14] text-black rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(57,255,20,0.2)] active:scale-95 transition-transform hover:bg-[#32d411]"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          )}

          {/* Appointment Section */}
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2 pt-2">Meus Compromissos</p>

          {upcomingAppointments.length > 0 ? (
            <div className="bg-black/40 backdrop-blur-xl rounded-[2.5rem] p-6 shadow-xl border border-white/5 group hover:border-[#39FF14]/30 transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <span className="bg-[#39FF14]/10 text-[#39FF14] text-[10px] font-extrabold px-3 py-1 rounded-lg uppercase tracking-wider border border-[#39FF14]/20 shadow-[0_0_10px_rgba(57,255,20,0.1)]">Próximo Agendamento</span>
                <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center">
                  <CalendarIcon className="text-white" size={20} />
                </div>
              </div>

              <h3 className="text-lg font-bold text-white mb-4">Consulta Agendada</h3>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#39FF14]/10 flex items-center justify-center border border-[#39FF14]/20">
                    <Clock className="text-[#39FF14]" size={14} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white leading-none">
                      {new Date(upcomingAppointments[0].start_time).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">
                      às {new Date(upcomingAppointments[0].start_time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => navigate('/schedule')}
                className="w-full h-12 rounded-xl bg-white text-black font-bold text-xs hover:bg-[#39FF14] transition-colors"
              >
                Ver Detalhes
              </Button>
            </div>
          ) : (
            <div className="bg-black/40 backdrop-blur-xl rounded-[2rem] p-6 shadow-sm border border-white/5 flex items-center gap-4 hover:bg-black/60 transition-colors">
              <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5">
                <CalendarDays className="text-slate-500" size={20} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-400">Nenhum agendamento futuro.</p>
              </div>
              <button
                onClick={() => navigate('/schedule')}
                className="text-[10px] font-bold text-[#FBBF24] uppercase tracking-wider hover:underline"
              >
                Agendar
              </button>
            </div>
          )}
        </div>

        {/* Metrics Grid */}
        <div className="mb-8 relative">
          <div className="grid grid-cols-2 gap-4">
            {metrics.map((item, idx) => (
              <div key={idx} className="bg-black/40 backdrop-blur-sm rounded-[2rem] p-5 shadow-sm border border-white/5 hover:border-[#39FF14]/20 transition-colors">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight mb-2">{item.label}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-white tracking-tighter drop-shadow-sm">{item.value}</span>
                  <span className="text-xs font-bold text-slate-400">{item.unit}</span>
                </div>
                {item.trend && (
                  <div className={cn(
                    "flex items-center gap-1 mt-2 text-[10px] font-bold",
                    item.up ? "text-red-500" : "text-[#39FF14]"
                  )}>
                    {item.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {item.trend}
                  </div>
                )}
              </div>
            ))}
          </div>

          {assessmentCount === 0 && (
            <div className="mt-4 px-2">
              <p className="text-[10px] text-slate-500 font-bold italic leading-relaxed">
                * Os dados de avaliação serão exibidos automaticamente após a sua <span className="text-[#39FF14] font-black">primeira consulta</span>.
              </p>
            </div>
          )}
        </div>

        {/* Evolution Chart Section */}
        <div className="bg-black/40 backdrop-blur-xl rounded-[2.5rem] p-6 shadow-xl border border-white/5 mb-8 overflow-hidden relative">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">Minha Evolução</h3>
          </div>

          {assessmentCount >= 2 ? (
            <>
              {/* Chart Code (Simplified for Toxic Theme) */}
              <div className="flex gap-1 bg-black/50 p-1 rounded-2xl mb-6 border border-white/5">
                {['PESO', 'GORDURA %'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab.startsWith('P') ? 'peso' : 'gordura')}
                    className={cn(
                      "flex-1 py-3 text-[10px] font-extrabold rounded-xl transition-all uppercase tracking-[0.1em]",
                      activeTab === (tab.startsWith('P') ? 'peso' : 'gordura')
                        ? "bg-[#39FF14] text-black shadow-[0_0_10px_rgba(57,255,20,0.3)]"
                        : "text-slate-500 hover:text-white"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              {/* ... Chart Placeholder (Keeping it simple for this step) ... */}
              <div className="h-48 w-full mt-4 flex items-center justify-center text-slate-600 text-xs">
                [Gráfico Neon Renderizado Aqui]
              </div>
            </>
          ) : (
            <div className="py-12 flex flex-col items-center text-center px-4">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 text-slate-600 border border-white/5">
                <TrendingUp size={32} strokeWidth={1.5} />
              </div>
              <p className="text-sm font-bold text-slate-400 leading-tight">
                {assessmentCount === 0
                  ? "Aguardando seu primeiro resultado para gerar gráficos."
                  : "A Minha Evolução será exibida assim que você realizar a segunda avaliação."}
              </p>
            </div>
          )}
        </div>

        {/* Floating CTA - FIXED TO LEAD TO SCHEDULE */}
        <Button
          variant="primary"
          className="w-full h-16 rounded-[2rem] bg-[#FBBF24] text-black font-black text-xs gap-3 shadow-[0_0_20px_rgba(251,191,36,0.2)] hover:shadow-[0_0_30px_rgba(251,191,36,0.4)] transition-all sticky bottom-8 z-30 tracking-widest uppercase hover:bg-[#f59e0b] border-2 border-[#fff7ed]/10"
          onClick={() => navigate('/schedule')} // CHANGED FROM /assessment TO /schedule
        >
          <Plus size={24} strokeWidth={3} />
          Novo Agendamento
        </Button>

        {/* Footer Branded Content - Side by Side */}
        <footer className="mt-8 mb-16 flex justify-between items-center py-6 border-t border-white/5">
          <div className="flex items-center gap-2.5 opacity-80">
            <div className="w-9 h-9 bg-black rounded-lg flex items-center justify-center shadow-lg border border-white/10">
              <span className="text-[#39FF14] font-black text-sm text-shadow">M</span>
            </div>
            <div>
              <p className="text-[10px] font-black text-white tracking-[0.15em] leading-none mb-0.5">METRIK</p>
              <p className="text-[7px] font-bold text-[#39FF14] tracking-[0.2em] uppercase opacity-60">Precision Lab</p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5 text-right">
            <p className="text-[9px] text-slate-500 font-bold tracking-tight opacity-60">@METRIK.oficial</p>
            <div className="flex items-center gap-1.5 bg-[#39FF14]/5 px-2.5 py-1 rounded-lg border border-[#39FF14]/10">
              <ShieldCheck size={11} className="text-[#39FF14]" />
              <span className="text-[8px] font-extrabold text-[#39FF14] uppercase tracking-wider">Avaliação Certificada</span>
            </div>
          </div>
        </footer>

        {/* Modern Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  );
};