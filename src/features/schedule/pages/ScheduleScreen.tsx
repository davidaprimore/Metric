import React from 'react';
import { BottomNav } from '@/components/layout/BottomNav';

export const ScheduleScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-light pb-24 font-sans">
      <header className="bg-surface/80 backdrop-blur-md sticky top-0 z-20 px-6 py-4 border-b border-gray-200">
        <h1 className="text-xl font-bold font-display text-dark">Agenda</h1>
      </header>
      <div className="p-6">
        <div className="bg-white rounded-3xl p-4 shadow-soft mb-6">
          {/* Calendar Strip Mock */}
          <div className="flex justify-between items-center">
            {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((day, i) => (
              <div key={i} className={`flex flex-col items-center p-2 rounded-xl transition-all cursor-pointer hover:bg-gray-50 ${i === 3 ? 'bg-black text-primary shadow-lg scale-110 hover:bg-black' : 'text-gray-400'}`}>
                <span className="text-[10px] font-bold">{day}</span>
                <span className="text-lg font-bold">{10 + i}</span>
              </div>
            ))}
          </div>
        </div>

        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 px-2">Hoje, 13 Out</h3>

        <div className="space-y-4">
          {[
            { time: '09:00', name: 'João Silva', type: 'Avaliação Inicial', status: 'confirmado' },
            { time: '10:30', name: 'Maria Santos', type: 'Retorno', status: 'pendente' },
            { time: '14:00', name: 'Pedro Costa', type: 'Bioimpedância', status: 'confirmado' }
          ].map((slot, idx) => (
            <div key={idx} className="flex gap-4 group cursor-pointer">
              <div className="flex flex-col items-center pt-2">
                <span className="text-sm font-bold text-dark">{slot.time}</span>
                <div className="h-full w-0.5 bg-gray-200 mt-2 group-last:hidden"></div>
              </div>
              <div className="flex-1 bg-surface p-4 rounded-2xl border border-white shadow-sm flex justify-between items-center transition-shadow hover:shadow-md">
                <div>
                  <h4 className="font-bold text-dark">{slot.name}</h4>
                  <p className="text-xs text-gray-500">{slot.type}</p>
                </div>
                <div className={`w-3 h-3 rounded-full ${slot.status === 'confirmado' ? 'bg-green-400' : 'bg-orange-400'}`}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
};