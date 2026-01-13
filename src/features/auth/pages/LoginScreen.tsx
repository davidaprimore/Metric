import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Logo1, ColorWaveform } from '@/components/shared/WelcomeBranding';
import { useAuth } from '@/contexts/AuthContext';
import { Toast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';

export const LoginScreen: React.FC = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' | 'loading' });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setToast({ show: true, message: 'Por favor, preencha todos os campos.', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const { error } = await signIn(formData.email, formData.password);
      if (error) throw error;

      setToast({ show: true, message: 'Login realizado! Bem-vindo de volta. 🚀', type: 'success' });
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error: any) {
      setToast({
        show: true,
        message: error.message === 'Invalid login credentials'
          ? 'E-mail ou senha incorretos.'
          : (error.message || 'Erro ao entrar. Tente novamente.'),
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1c1e] flex flex-col items-center justify-between p-8 font-sans overflow-hidden relative">
      <Toast
        isVisible={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />

      {/* Background radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#2a2c2e_0%,_#1a1c1e_70%)] opacity-50" />

      {/* Header / Logo Section */}
      <div className="w-full flex flex-col items-center z-10 pt-10 animate-in fade-in slide-in-from-top-4 duration-1000">
        <Logo1 />
        <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mt-2">Acesso Restrito</p>
      </div>

      {/* Form Section */}
      <div className="w-full max-w-sm z-10 py-8 animate-in fade-in zoom-in-95 duration-700 delay-200">
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email Input */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 focus-within:border-primary/50 transition-all group">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">E-mail</label>
            <div className="flex items-center gap-3">
              <Mail size={18} className="text-gray-500 group-focus-within:text-primary transition-colors" />
              <input
                type="email"
                placeholder="seu@email.com"
                className="bg-transparent flex-1 text-white outline-none font-medium placeholder:text-white/10"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 focus-within:border-primary/50 transition-all group">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">Senha</label>
            <div className="flex items-center gap-3">
              <Lock size={18} className="text-gray-500 group-focus-within:text-primary transition-colors" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="bg-transparent flex-1 text-white outline-none font-medium tracking-widest placeholder:text-white/10"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex justify-end px-2">
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="text-[10px] font-bold text-gray-500 hover:text-secondary uppercase tracking-widest transition-colors"
            >
              Esqueci minha senha
            </button>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-16 rounded-2xl text-lg font-bold group shadow-neon mt-4"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                ENTRAR
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>
        </form>

        <div className="mt-8 flex flex-col items-center gap-4">
          <p className="text-gray-500 text-xs font-medium">Não possui uma conta?</p>
          <Button
            variant="ghost"
            className="w-full h-16 rounded-2xl text-white border border-white/10 hover:bg-white/5 font-bold tracking-widest uppercase transition-all"
            onClick={() => navigate('/register')}
          >
            CRIAR CONTA
          </Button>
        </div>
      </div>

      {/* Footer Visual */}
      <div className="w-full flex flex-col items-center z-10 pb-8 opacity-40">
        <div className="scale-75 mb-4">
          <ColorWaveform />
        </div>
        <p className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase">
          METRIK PRECISION LAB
        </p>
        <p className="text-[10px] text-gray-500 font-medium">v1.0.42</p>
      </div>
    </div>
  );
};