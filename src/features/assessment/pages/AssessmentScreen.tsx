import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, HelpCircle, CheckCircle2 } from 'lucide-react';

export const AssessmentScreen: React.FC = () => {
  const navigate = useNavigate();
  const [skinfolds, setSkinfolds] = useState({
    triceps: '8.4',
    subescapular: '',
    suprailiaca: '',
    abdominal: '',
    coxa: '',
    peitoral: '',
    axilar: ''
  });

  const handleChange = (key: string, value: string) => {
    setSkinfolds(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-light pb-24 font-sans">
      <header className="bg-surface/80 backdrop-blur-md sticky top-0 z-20 px-6 py-4 flex items-center gap-4 border-b border-gray-200">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
          <ChevronLeft className="w-6 h-6 text-dark" />
        </button>
        <div>
          <h1 className="text-lg font-bold font-display text-dark">Protocolo 7 Dobras</h1>
          <p className="text-xs text-secondary font-bold uppercase tracking-wider">Pollock Method</p>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Patient Card */}
        <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-soft">
          <img src="https://picsum.photos/100/100?random=1" className="w-14 h-14 rounded-full border-2 border-primary object-cover" alt="Patient" />
          <div>
            <h2 className="font-bold text-dark text-lg">Alex Rivera</h2>
            <span className="inline-block bg-primary text-[10px] font-bold px-2 py-0.5 rounded text-black uppercase">Atleta</span>
          </div>
        </div>

        <div className="space-y-4">
          {Object.keys(skinfolds).map((key) => (
            <div key={key} className="bg-surface p-4 rounded-2xl border border-white shadow-sm transition-all focus-within:ring-2 focus-within:ring-secondary/50 focus-within:shadow-lg">
              <label className="text-xs font-bold uppercase text-gray-500 mb-2 tracking-wider flex justify-between">
                {key.charAt(0).toUpperCase() + key.slice(1)} (mm)
                <HelpCircle className="text-gray-300 w-4 h-4 cursor-help" />
              </label>
              <div className="flex justify-between items-center">
                <input
                  type="number"
                  placeholder="0.0"
                  value={skinfolds[key as keyof typeof skinfolds]}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className="w-full text-2xl font-bold font-display text-dark bg-transparent outline-none placeholder:text-gray-300"
                />
                {skinfolds[key as keyof typeof skinfolds] && (
                  <CheckCircle2 className="text-secondary w-6 h-6 animate-in fade-in zoom-in duration-200" />
                )}
              </div>
            </div>
          ))}
        </div>

        <Button onClick={() => navigate('/results')} className="w-full mt-8 shadow-xl">
          FINALIZAR AVALIAÇÃO
        </Button>
      </div>
    </div>
  );
};