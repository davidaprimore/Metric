import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';

const Waveform = () => {
    const [bars, setBars] = useState<number[]>([]);

    useEffect(() => {
        // Generate 40 initial bars
        setBars(Array.from({ length: 40 }, () => Math.random() * 60 + 20));

        const interval = setInterval(() => {
            setBars(prev => prev.map(h => {
                const change = (Math.random() - 0.5) * 40;
                return Math.min(Math.max(h + change, 10), 100);
            }));
        }, 150);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center justify-center gap-[2px] h-32 w-full opacity-40">
            {bars.map((h, i) => (
                <div
                    key={i}
                    className="w-1 bg-white rounded-full transition-all duration-300 ease-in-out"
                    style={{ height: `${h}%` }}
                />
            ))}
        </div>
    );
};

export const WelcomeScreen: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#1a1c1e] flex flex-col items-center justify-between p-8 font-sans overflow-hidden relative">
            {/* Background radial gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#2a2c2e_0%,_#1a1c1e_70%)] opacity-50" />

            {/* Header / Logo Section */}
            <div className="w-full flex flex-col items-center z-10 pt-12 animate-in fade-in slide-in-from-top-4 duration-1000">
                <div className="relative mb-6">
                    <div className="border border-white/10 rounded-[4rem] px-12 py-6 backdrop-blur-sm animate-pulse shadow-[0_0_30px_rgba(255,255,255,0.02)]">
                        <h1 className="text-white text-5xl font-display font-bold tracking-[0.15em] opacity-80">
                            METRIK
                        </h1>
                    </div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-primary rounded-full shadow-neon" />
                </div>

                <p className="text-gray-200 text-lg font-medium text-center max-w-[280px] leading-relaxed">
                    Precisão clínica para sua <br />
                    <span className="text-white font-bold italic">evolução física</span>
                </p>
            </div>

            {/* Central Visual Section */}
            <div className="w-full flex items-center justify-center z-10 py-12">
                <div className="relative w-full max-w-sm aspect-square flex items-center justify-center bg-white/[0.02] rounded-3xl border border-white/[0.05] shadow-inner overflow-hidden">
                    <Waveform />
                    {/* Scan Line Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent h-20 w-full animate-scan-line" />
                </div>
            </div>

            {/* Actions Section */}
            <div className="w-full space-y-4 z-10 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
                <Button
                    variant="primary"
                    className="w-full h-16 rounded-2xl text-lg font-bold group shadow-neon"
                    onClick={() => navigate('/login')}
                >
                    Começar Agora
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>

                <Button
                    variant="ghost"
                    className="w-full h-16 rounded-2xl text-white border border-secondary/30 hover:bg-secondary/10 hover:border-secondary/50 font-bold tracking-widest uppercase transition-all"
                    onClick={() => navigate('/login')}
                >
                    Entrar
                </Button>

                <div className="pt-8 flex flex-col items-center gap-1 opacity-40">
                    <p className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase">
                        Professional Assessment Suite
                    </p>
                    <p className="text-[10px] text-gray-500 font-medium">v1.0.42</p>
                </div>
            </div>

            {/* Global CSS for custom animations if needed (or added to index.css) */}
            <style>{`
        @keyframes scan-line {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(400%); }
        }
        .animate-scan-line {
          animation: scan-line 4s linear infinite;
        }
      `}</style>
        </div>
    );
};
