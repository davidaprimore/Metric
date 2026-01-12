import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';
import { Logo1, ColorWaveform } from '@/components/shared/WelcomeBranding';

export const WelcomeScreen: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#1a1c1e] flex flex-col items-center justify-between p-8 font-sans overflow-hidden relative">
            {/* Background radial gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#2a2c2e_0%,_#1a1c1e_70%)] opacity-50" />

            {/* Header / Logo Section */}
            <div className="w-full flex flex-col items-center z-10 pt-16 animate-in fade-in slide-in-from-top-4 duration-1000">
                <Logo1 />

                <p className="text-gray-200 text-lg font-medium text-center max-w-[280px] mt-10 leading-relaxed">
                    Precisão clínica para sua <br />
                    <span className="text-white font-bold italic">evolução física</span>
                </p>
            </div>

            {/* Central Visual Section */}
            <div className="w-full flex items-center justify-center z-10 py-12">
                <div className="relative w-full max-w-sm flex items-center justify-center">
                    <ColorWaveform />
                </div>
            </div>

            {/* Actions Section */}
            <div className="w-full space-y-4 z-10 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
                <Button
                    variant="primary"
                    className="w-full h-16 rounded-2xl text-lg font-bold group shadow-neon"
                    onClick={() => navigate('/register')}
                >
                    Começar Agora
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>

                <Button
                    variant="ghost"
                    className="w-full h-16 rounded-2xl text-white border border-secondary/30 hover:bg-secondary/10 hover:border-secondary/50 font-bold tracking-widest uppercase transition-all"
                    onClick={() => navigate('/login')}
                >
                    ENTRAR
                </Button>

                <div className="text-center pt-2">
                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                        ESQUECI A SENHA. <button onClick={() => navigate('/forgot-password')} className="text-secondary hover:underline transition-all">Clique aqui para redefinir</button>
                    </p>
                </div>

                <div className="pt-8 flex flex-col items-center gap-1 opacity-40">
                    <p className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase">
                        Professional Assessment Suite
                    </p>
                    <p className="text-[10px] text-gray-500 font-medium">v1.0.42</p>
                </div>
            </div>
        </div>
    );
};
