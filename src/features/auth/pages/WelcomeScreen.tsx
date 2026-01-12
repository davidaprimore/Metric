import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';

const DynamicGraph = () => {
    const [points, setPoints] = useState<number[]>([]);
    const [colorIndex, setColorIndex] = useState(0);

    useEffect(() => {
        setPoints(Array.from({ length: 20 }, () => Math.random() * 60 + 20));

        const interval = setInterval(() => {
            setPoints(prev => {
                const next = [...prev.slice(1), Math.random() * 60 + 20];
                return next;
            });
            // Toggle color index periodically
            setColorIndex(prev => (prev + 1) % 200);
        }, 200);

        return () => clearInterval(interval);
    }, []);

    // Calculate interpolation between Green (#C6FF00) and Purple (#8A7AD0)
    const isGreenToPurple = colorIndex < 100;
    const ratio = (colorIndex % 100) / 100;

    return (
        <div className="relative w-full h-40 flex items-center justify-center">
            <svg viewBox="0 0 200 100" className="w-full h-full preserve-3d">
                <path
                    d={`M ${points.map((p, i) => `${i * 10.5},${100 - p}`).join(' L ')}`}
                    fill="none"
                    stroke={isGreenToPurple ? '#C6FF00' : '#8A7AD0'}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-all duration-500 ease-in-out"
                    style={{
                        filter: 'drop-shadow(0 0 8px currentColor)',
                        opacity: 0.8
                    }}
                />
                {/* Animated gradients for "life" */}
                {points.map((p, i) => (
                    <circle
                        key={i}
                        cx={i * 10.5}
                        cy={100 - p}
                        r="2"
                        fill="white"
                        className="opacity-50 animate-pulse"
                    />
                ))}
            </svg>
        </div>
    );
};

const MeasuringTape = ({ children }: { children: React.ReactNode }) => (
    <div className="relative p-1">
        {/* Inner Label Container */}
        <div className="border border-white/5 rounded-[4rem] px-12 py-6 backdrop-blur-sm shadow-[0_0_30px_rgba(255,255,255,0.02)] relative z-10">
            {children}
        </div>

        {/* Measuring Tape Border */}
        <div className="absolute inset-0 rounded-[4.2rem] border-[3px] border-dashed border-primary/40 animate-[spin_20s_linear_infinite]" />
        <div className="absolute inset-[-4px] rounded-[4.5rem] border border-secondary/20" />

        {/* Tick Marks Effect */}
        <div className="absolute inset-0 rounded-[4.2rem] flex items-center justify-center opacity-30 pointer-events-none">
            {Array.from({ length: 36 }).map((_, i) => (
                <div
                    key={i}
                    className="absolute w-1 h-2 bg-primary/60"
                    style={{ transform: `rotate(${i * 10}deg) translateY(-54px)` }}
                />
            ))}
        </div>
    </div>
);

export const WelcomeScreen: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#1a1c1e] flex flex-col items-center justify-between p-8 font-sans overflow-hidden relative">
            {/* Background radial gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#2a2c2e_0%,_#1a1c1e_70%)] opacity-50" />

            {/* Header / Logo Section */}
            <div className="w-full flex flex-col items-center z-10 pt-12 animate-in fade-in slide-in-from-top-4 duration-1000">
                <MeasuringTape>
                    <h1 className="text-white text-5xl font-display font-bold tracking-[0.15em] opacity-80">
                        METRIK
                    </h1>
                </MeasuringTape>

                <p className="text-gray-200 text-lg font-medium text-center max-w-[280px] mt-8 leading-relaxed">
                    Precisão clínica para sua <br />
                    <span className="text-white font-bold italic">evolução física</span>
                </p>
            </div>

            {/* Central Visual Section */}
            <div className="w-full flex items-center justify-center z-10 py-12">
                <div className="relative w-full max-w-sm aspect-video flex items-center justify-center bg-white/[0.02] rounded-3xl border border-white/[0.05] shadow-inner overflow-hidden px-4">
                    <DynamicGraph />
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

            {/* Global CSS for custom animations */}
            <style>{`
        @keyframes scan-line {
          0% { transform: translateY(-300%); }
          100% { transform: translateY(300%); }
        }
        .animate-scan-line {
          animation: scan-line 6s linear infinite;
        }
      `}</style>
        </div>
    );
};
