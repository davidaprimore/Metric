import React, { useState } from 'react';
import {
  Bell,
  Calendar as CalendarIcon,
  Clock,
  ChevronRight,
  Plus,
  AlertCircle,
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

  // Mock profile completeness check
  const isProfileComplete = user?.user_metadata?.height && user?.user_metadata?.weight;
  const firstName = user?.user_metadata?.first_name || 'Usuário';

  return (
    <div className="min-h-screen bg-[#F1F3F5] pb-32 font-sans px-5">
      {/* Header */}
      <header className="pt-8 flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full border-2 border-secondary p-0.5 bg-white shadow-sm overflow-hidden">
            <img src="https://i.pravatar.cc/150?u=alex" alt="Profile" className="w-full h-full rounded-full object-cover" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-dark leading-tight">Olá, {firstName}</h1>
            <span className="text-[10px] font-extrabold text-secondary uppercase tracking-[0.1em]">Plano Pro</span>
          </div>
        </div>
        <button className="w-11 h-11 bg-gray-200/50 rounded-full flex items-center justify-center text-dark relative">
          <Bell size={20} fill="currentColor" className="text-dark" />
          <div className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-[#F1F3F5]"></div>
        </button>
      </header>

      {/* Profile Incomplete Alert */}
      {!isProfileComplete && (
        <div className="mb-6 bg-secondary/5 border border-secondary/10 p-4 rounded-3xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="w-10 h-10 rounded-2xl bg-secondary/10 flex items-center justify-center shrink-0">
            <AlertCircle className="text-secondary" size={20} />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-dark">Perfil Incompleto</p>
            <p className="text-[10px] text-gray-500">Complete seus dados para habilitar agendamentos.</p>
          </div>
          <button
            onClick={() => navigate('/onboarding')}
            className="text-[10px] font-bold text-secondary uppercase tracking-tight hover:underline"
          >
            Completar
          </button>
        </div>
      )}

      {/* Main Appointment Card */}
      <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100 mb-6 group hover:shadow-md transition-all duration-300">
        <div className="flex justify-between items-start mb-4">
          <span className="bg-secondary/10 text-secondary text-[10px] font-extrabold px-3 py-1 rounded-lg uppercase tracking-wider">Compromisso</span>
          <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center">
            <CalendarIcon className="text-secondary" size={24} />
          </div>
        </div>

        <h3 className="text-xl font-bold text-dark mb-4">Próxima Avaliação</h3>

        <div className="flex items-center gap-6 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
              <Clock className="text-secondary" size={16} />
            </div>
            <div>
              <p className="text-sm font-bold text-dark leading-none">24 Out, 2023</p>
              <p className="text-[10px] text-gray-400 font-medium">às 10:00 AM</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            className="flex-1 h-14 rounded-2xl bg-dark text-white font-bold text-sm hover:bg-dark/90 transition-all shadow-none"
            onClick={() => isProfileComplete ? navigate('/appointments') : alert('Complete seu perfil para agendar!')}
          >
            Ver Detalhes
          </Button>
          <button className="w-14 h-14 bg-secondary/60 text-white rounded-2xl flex items-center justify-center hover:bg-secondary transition-all">
            <ExternalLink size={20} />
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {[
          { label: 'Gordura Corporal', value: user?.user_metadata?.body_fat || '18.5', unit: '%', trend: '-1.2%', up: false },
          { label: 'Peso Atual', value: user?.user_metadata?.weight || '78.4', unit: 'kg', trend: '-0.5kg', up: false },
          { label: 'Massa Magra', value: user?.user_metadata?.lean_mass || '63.9', unit: 'kg' },
          { label: 'Massa Gorda', value: user?.user_metadata?.fat_mass || '14.5', unit: 'kg' }
        ].map((item, idx) => (
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

      {/* Evolution Chart */}
      <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-dark">Minha Evolução</h3>
        </div>

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
      </div>

      {/* Floating CTA */}
      <Button
        variant="primary"
        className="w-full h-16 rounded-[2rem] bg-primary text-dark font-black text-lg gap-3 shadow-lg shadow-primary/20 hover:shadow-xl transition-all sticky bottom-8 z-30"
        onClick={() => isProfileComplete ? navigate('/assessment') : alert('Complete seu perfil primeiro!')}
      >
        <Plus size={24} strokeWidth={3} />
        Nova Avaliação
      </Button>

      {/* Footer Branded Content - Side by Side */}
      <footer className="mt-8 mb-16 flex justify-between items-center py-6 border-t border-gray-200/50">
        <div className="flex items-center gap-2.5 opacity-80">
          <div className="w-9 h-9 bg-black rounded-lg flex items-center justify-center">
            <span className="text-secondary font-black text-sm">M</span>
          </div>
          <div>
            <p className="text-[10px] font-black text-dark tracking-[0.15em] leading-none mb-0.5">METRIK</p>
            <p className="text-[7px] font-bold text-secondary tracking-[0.2em] uppercase opacity-60">Precision Lab</p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1.5">
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