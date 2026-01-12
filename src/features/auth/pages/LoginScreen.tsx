import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Activity } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export const LoginScreen: React.FC = () => {
  const navigate = useNavigate();
  const { session } = useAuth(); // Will use this later for redirect if already logged in
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    // TODO: Implement actual Supabase login
    setTimeout(() => {
      setLoading(false);
      navigate('/');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-dark flex flex-col justify-between p-8 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/20 rounded-full blur-[100px] -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/10 rounded-full blur-[120px] -ml-20 -mb-20"></div>

      <div className="flex-1 flex flex-col justify-center items-center z-10">
        <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center mb-8 shadow-neon rotate-3">
          <Activity className="text-black w-10 h-10" />
        </div>
        <h1 className="text-white text-5xl font-display font-bold tracking-tighter text-center mb-2">
          METRIK
        </h1>
        <p className="text-gray-400 text-center text-sm font-medium tracking-widest uppercase">
          Precision Clinical Lab
        </p>
      </div>

      <div className="w-full space-y-4 z-10 mb-8">
        <Button
          variant="primary"
          className="w-full h-14 text-sm font-bold tracking-wide"
          onClick={handleLogin}
          isLoading={loading}
        >
          ENTRAR
        </Button>
        <Button
          variant="ghost"
          className="w-full text-white/50 hover:text-white"
          onClick={() => { }}
        >
          CRIAR CONTA
        </Button>
        <p className="text-center text-gray-600 text-xs mt-6">v2.4.0 • Metrik Technologies</p>
      </div>
    </div>
  );
};