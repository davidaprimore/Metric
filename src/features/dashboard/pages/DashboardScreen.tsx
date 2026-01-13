import React, { useState } from 'react';
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
  ShieldCheck
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

const chartData = [
  { name: 'JUN', weight: 81 },
  { name: 'JUL', weight: 80.5 },
  { name: 'AGO', weight: 79.8 },
  { name: 'SET', weight: 82.5 },
  { name: 'OUT', weight: 81.2 },
];

export const DashboardScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'peso' | 'gordura'>('peso');

  // MOCK DATA FOR HONESTY DEMONSTRATION
  // These should eventually come from Supabase tables
  const upcomingAppointments = []; // Set to [] to test empty state
  const pendingAnamnesis = true;    // Set to true to test pending anamnesis
  const assessments = [];           // Set to [] to test no assessments state

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
    <div className="min-h-screen bg-[#F1F3F5] pb-32 font-sans px-5">
      {/* Header */}
      <header className="pt-8 flex justify-between items-center mb-8">
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => navigate('/profile')}
        >
          <div className="w-12 h-12 rounded-full border-2 border-secondary p-0.5 bg-white shadow-sm overflow-hidden group-hover:scale-105 transition-transform">
            <img src="https://i.pravatar.cc/150?u=alex" alt="Profile" className="w-full h-full rounded-full object-cover" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-dark leading-tight">Olá, {firstName}</h1>
            <span className="text-[10px] font-extrabold text-secondary uppercase tracking-[0.1em] group-hover:underline">Ver Perfil</span>
          </div>
        </div>
        <button className="w-11 h-11 bg-gray-200/50 rounded-full flex items-center justify-center text-dark relative">
          <Bell size={20} fill="currentColor" className="text-dark" />
          {upcomingAppointments.length > 0 || pendingAnamnesis ? (
            <div className="absolute top-3.5 right-3.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#F1F3F5]"></div>
          ) : null}
        </button>
      </header>

      {/* COMPROMISSOS & PENDING TASKS SECTION */}
      <div className="mb-8 space-y-4">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Meus Compromissos</p>

        {/* Next Appointment Card */}
        {upcomingAppointments.length > 0 ? (
          <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100 group hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <span className="bg-secondary/10 text-secondary text-[10px] font-extrabold px-3 py-1 rounded-lg uppercase tracking-wider">Próximo Agendamento</span>
              <div className="w-10 h-10 bg-secondary/10 rounded-2xl flex items-center justify-center">
                <CalendarIcon className="text-secondary" size={20} />
              </div>
            </div>

            <h3 className="text-lg font-bold text-dark mb-4">Avaliação Antropométrica</h3>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
                  <Clock className="text-secondary" size={14} />
                </div>
                <div>
                  <p className="text-sm font-bold text-dark leading-none">{upcomingAppointments[0].date}</p>
                  <p className="text-[10px] text-gray-400 font-medium">às {upcomingAppointments[0].time}h</p>
                </div>
              </div>
            </div>

            <Button
              onClick={() => navigate('/profile/appointments')}
              className="w-full h-12 rounded-xl bg-dark text-white font-bold text-xs"
            >
              Ver Detalhes
            </Button>
          </div>
        ) : !pendingAnamnesis ? (
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex items-center gap-4 opacity-70">
            <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0">
              <ShieldCheck className="text-gray-400" size={20} />
            </div>
            <p className="text-xs font-bold text-gray-400">Sua agenda está em dia!</p>
          </div>
        ) : null}

        {/* Pending Anamnesis Alert */}
        {pendingAnamnesis && (
          <div className="bg-primary/20 border border-primary/30 p-5 rounded-[2rem] flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-sm">
              <AlertCircle className="text-dark" size={24} strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <p className="text-xs font-black text-dark uppercase tracking-tight">Anamnese Pendente</p>
              <p className="text-[10px] text-dark/60 font-medium leading-tight mt-0.5">Clique para completar sua entrevista prévia.</p>
            </div>
            <button
              onClick={() => navigate('/assessment/anamnesis')}
              className="w-10 h-10 bg-dark text-white rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Metrics Grid */}
      <div className="mb-8 relative">
        <div className="grid grid-cols-2 gap-4">
          {metrics.map((item, idx) => (
            <div key={idx} className="bg-gray-200/40 rounded-[2rem] p-5 shadow-sm border border-white/50">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tight mb-2">{item.label}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-dark tracking-tighter">{item.value}</span>
                <span className="text-xs font-bold text-gray-400">{item.unit}</span>
              </div>
              {item.trend && (
                <div className={cn(
                  "flex items-center gap-1 mt-2 text-[10px] font-bold",
                  item.up ? "text-red-500" : "text-green-500"
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
            <p className="text-[10px] text-gray-400 font-bold italic leading-relaxed">
              * Os dados de avaliação serão exibidos automaticamente após a sua <span className="text-secondary font-black">primeira consulta</span>.
            </p>
          </div>
        )}
      </div>

      {/* Evolution Chart Section */}
      <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100 mb-8 overflow-hidden relative">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-dark">Minha Evolução</h3>
        </div>

        {assessmentCount >= 2 ? (
          <>
            <div className="flex gap-1 bg-gray-100 p-1 rounded-2xl mb-6">
              {['PESO', 'GORDURA %'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.startsWith('P') ? 'peso' : 'gordura')}
                  className={cn(
                    "flex-1 py-3 text-[10px] font-extrabold rounded-xl transition-all uppercase tracking-[0.1em]",
                    activeTab === (tab.startsWith('P') ? 'peso' : 'gordura')
                      ? "bg-white text-secondary shadow-sm"
                      : "text-gray-400 hover:text-gray-600"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="h-48 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8A7AD0" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#8A7AD0" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F3F5" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#9CA3AF' }}
                    dy={10}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
                    itemStyle={{ color: '#8A7AD0', fontWeight: 'bold' }}
                  />
                  <Area
                    type="smooth"
                    dataKey="weight"
                    stroke="#9F91E3"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorVal)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <button className="w-full mt-8 py-3 rounded-2xl border border-gray-100 text-secondary text-[11px] font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
              Ver Histórico Completo <ExternalLink size={14} />
            </button>
          </>
        ) : (
          <div className="py-12 flex flex-col items-center text-center px-4">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
              <TrendingUp size={32} strokeWidth={1.5} />
            </div>
            <p className="text-sm font-bold text-gray-400 leading-tight">
              {assessmentCount === 0
                ? "Aguardando seu primeiro resultado para gerar gráficos."
                : "A Minha Evolução será exibida assim que você realizar a segunda avaliação."}
            </p>
            <p className="text-[10px] text-gray-300 font-medium mt-2">Continue seu progresso para liberar os dados de tendência.</p>
          </div>
        )}
      </div>

      {/* Floating CTA */}
      <Button
        variant="primary"
        className="w-full h-16 rounded-[2rem] bg-primary text-dark font-black text-xs gap-3 shadow-lg shadow-primary/20 hover:shadow-xl transition-all sticky bottom-8 z-30 tracking-widest uppercase"
        onClick={() => navigate('/assessment')}
      >
        <Plus size={24} strokeWidth={3} />
        Nova Avaliação
      </Button>

      {/* Footer Branded Content - Side by Side */}
      <footer className="mt-8 mb-16 flex justify-between items-center py-6 border-t border-gray-200/50">
        <div className="flex items-center gap-2.5 opacity-80">
          <div className="w-9 h-9 bg-black rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-secondary font-black text-sm">M</span>
          </div>
          <div>
            <p className="text-[10px] font-black text-dark tracking-[0.15em] leading-none mb-0.5">METRIK</p>
            <p className="text-[7px] font-bold text-secondary tracking-[0.2em] uppercase opacity-60">Precision Lab</p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1.5 text-right">
          <p className="text-[9px] text-gray-400 font-bold tracking-tight opacity-60">@METRIK.oficial</p>
          <div className="flex items-center gap-1.5 bg-secondary/5 px-2.5 py-1 rounded-lg border border-secondary/10">
            <ShieldCheck size={11} className="text-secondary" />
            <span className="text-[8px] font-extrabold text-secondary uppercase tracking-wider">Avaliação Certificada</span>
          </div>
        </div>
      </footer>

      {/* Modern Bottom Navigation */}
      <BottomNav />
    </div>
  );
};