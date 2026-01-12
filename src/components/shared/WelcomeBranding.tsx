import React, { useEffect, useState } from 'react';

export const MetrikLogo: React.FC<{ className?: string }> = ({ className = "" }) => {
    return (
        <div className={`flex items-center gap-4 ${className}`}>
            {/* Icon Part */}
            <div className="relative group">
                <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center relative z-10 border border-white/10 group-hover:scale-105 transition-transform duration-500">
                    <span className="text-primary text-4xl font-bold tracking-tighter">M</span>
                </div>
                {/* Animated Glow behind icon */}
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-2xl animate-pulse" />
            </div>

            {/* Text Part */}
            <div className="flex flex-col">
                <h1 className="text-white text-4xl font-display font-black tracking-tight leading-none">
                    METRIK
                </h1>
                <p className="text-secondary text-base font-bold tracking-[0.15em] leading-tight">
                    PRECISION LAB
                </p>
            </div>
        </div>
    );
};

export const ColorWaveform: React.FC = () => {
    const [bars, setBars] = useState<number[]>([]);
    const [isPurple, setIsPurple] = useState(false);

    useEffect(() => {
        setBars(Array.from({ length: 45 }, () => Math.random() * 60 + 20));

        const waveInterval = setInterval(() => {
            setBars(prev => prev.map(h => {
                const change = (Math.random() - 0.5) * 30;
                return Math.min(Math.max(h + change, 10), 100);
            }));
        }, 150);

        const colorInterval = setInterval(() => {
            setIsPurple(prev => !prev);
        }, 3000);

        return () => {
            clearInterval(waveInterval);
            clearInterval(colorInterval);
        };
    }, []);

    return (
        <div className="flex items-center justify-center gap-[3px] h-32 w-full px-4">
            {bars.map((h, i) => (
                <div
                    key={i}
                    className={`w-[3px] rounded-full transition-all duration-1000 ease-in-out ${isPurple ? 'bg-secondary' : 'bg-primary'}`}
                    style={{
                        height: `${h}%`,
                        opacity: 0.3 + (h / 150)
                    }}
                />
            ))}
        </div>
    );
};
