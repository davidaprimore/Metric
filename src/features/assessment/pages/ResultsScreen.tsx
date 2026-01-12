import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Share2 } from 'lucide-react';

export const ResultsScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-light relative overflow-hidden flex flex-col items-center justify-center p-6 font-sans">
      {/* Background Elements */}
      <div className="absolute top-0 w-full h-[60%] bg-gradient-to-b from-gray-200 to-transparent opacity-50"></div>

      <div className="w-full max-w-sm relative z-10">
        <div className="bg-surface rounded-[2.5rem] shadow-2xl p-8 text-center border border-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-secondary"></div>

          <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mb-8">Resultado Final</p>

          <div className="relative inline-block mb-8">
            <svg className="w-48 h-48 transform -rotate-90">
              <circle cx="96" cy="96" r="88" stroke="#f3f4f6" strokeWidth="12" fill="transparent" />
              <circle cx="96" cy="96" r="88" stroke="#C6FF00" strokeWidth="12" fill="transparent" strokeDasharray="552" strokeDashoffset="100" strokeLinecap="round" />
            </svg>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <span className="text-5xl font-display font-bold text-dark block">18%</span>
              <span className="text-xs font-bold text-gray-400 uppercase">Atual</span>
            </div>
          </div>

          <div className="bg-dark text-white py-3 px-6 rounded-full inline-block shadow-neon mb-8">
            <span className="text-sm font-bold uppercase tracking-widest text-primary">ELITE STATUS</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-2xl">
              <p className="text-[10px] text-gray-400 uppercase font-bold">Anterior</p>
              <p className="text-xl font-bold text-dark">22%</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl">
              <p className="text-[10px] text-gray-400 uppercase font-bold">Redução</p>
              <p className="text-xl font-bold text-green-600">-4.0%</p>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <Button onClick={() => navigate('/')} fullWidth variant="secondary">
            VOLTAR AO INÍCIO
          </Button>
          <button className="w-full text-center text-gray-500 text-sm font-bold flex items-center justify-center gap-2 hover:text-dark transition-colors">
            <Share2 className="w-4 h-4" />
            Compartilhar Relatório
          </button>
        </div>
      </div>
    </div>
  );
};