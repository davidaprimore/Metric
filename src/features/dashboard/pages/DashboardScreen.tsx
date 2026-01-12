import React from 'react';
import { MetricCard } from '@/components/shared/MetricCard';
import {
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Bell, BadgeCheck, Scale, Droplets } from 'lucide-react';
import { BottomNav } from '@/components/layout/BottomNav';

const chartData = [
  { name: 'Jan', weight: 82, bodyFat: 24 },
  { name: 'Fev', weight: 81, bodyFat: 23 },
  { name: 'Mar', weight: 79.5, bodyFat: 21 },
  { name: 'Abr', weight: 78, bodyFat: 19.5 },
  { name: 'Mai', weight: 77.2, bodyFat: 18.5 },
  { name: 'Jun', weight: 76, bodyFat: 17 },
];

export const DashboardScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-light pb-24 font-sans">
      {/* Header */}
      <header className="bg-surface/80 backdrop-blur-md sticky top-0 z-20 px-6 py-4 flex justify-between items-center border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-primary p-0.5">
            <img src="https://picsum.photos/100/100?random=10" alt="User" className="w-full h-full rounded-full object-cover" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Bem-vindo</p>
            <h2 className="text-lg font-bold font-display text-dark">Dr. Ricardo</h2>
          </div>
        </div>
        <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-dark hover:bg-gray-50 transition-colors">
          <Bell className="w-5 h-5" />
        </button>
      </header>

      <div className="p-6 space-y-8">
        {/* Main Status Card */}
        <div className="bg-dark rounded-[2rem] p-6 text-white relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/30 rounded-full blur-3xl -mr-10 -mt-10"></div>

          <div className="flex justify-between items-start mb-6">
            <span className="bg-white/10 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">Avaliação Clínica</span>
            <BadgeCheck className="text-primary w-6 h-6" />
          </div>

          <div className="text-center relative z-10">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Paciente em Foco</p>
            <h2 className="text-3xl font-display font-bold mb-1">Alex Rivera</h2>
            <div className="flex items-center justify-center gap-2 text-primary">
              <span className="text-5xl font-bold font-display">12.4%</span>
              <span className="text-sm font-medium mt-4">Gordura</span>
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <div className="flex-1 bg-white/10 rounded-xl p-3 backdrop-blur-sm">
              <p className="text-[10px] text-gray-400 uppercase">Massa Magra</p>
              <p className="text-xl font-bold">42.5kg</p>
            </div>
            <div className="flex-1 bg-white/10 rounded-xl p-3 backdrop-blur-sm">
              <p className="text-[10px] text-gray-400 uppercase">Status</p>
              <p className="text-xl font-bold text-primary">Atleta</p>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold font-display text-dark">Métricas Detalhadas</h3>
            <span className="text-secondary text-xs font-bold cursor-pointer hover:text-secondary/80">Ver todas</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <MetricCard
              title="Peso Total"
              value="78.4"
              unit="kg"
              trend="-0.5kg"
              isPositive={true}
              icon={<Scale className="w-6 h-6" />}
            />
            <MetricCard
              title="Hidratação"
              value="3.2"
              unit="L"
              trend="Ideal"
              isPositive={true}
              icon={<Droplets className="w-6 h-6" />}
            />
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-surface p-6 rounded-[2rem] shadow-soft border border-white/60">
          <h3 className="text-lg font-bold font-display text-dark mb-4">Evolução Recente</h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorBf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8A7AD0" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8A7AD0" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                  itemStyle={{ color: '#8A7AD0', fontWeight: 'bold' }}
                />
                <Area
                  type="monotone"
                  dataKey="bodyFat"
                  stroke="#8A7AD0"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorBf)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};