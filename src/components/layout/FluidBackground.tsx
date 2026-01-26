import React, { useEffect, useState } from 'react';

type FluidVariant = 'professional' | 'patient' | 'auth' | 'luminous';

interface FluidBackgroundProps {
    variant?: FluidVariant;
    className?: string;
    children?: React.ReactNode;
}

export const FluidBackground: React.FC<FluidBackgroundProps> = ({
    variant = 'professional',
    className = '',
    children
}) => {

    // THEME: "INVERTED DEEP FOREST" (User Correction)
    // Background: Rich Forest Green (Previously the card color) -> #0F2215 or slightly lighter #12291A to be visible
    // Cards: Smoked Glass (Dark/Black Transparent)

    const themes = {
        professional: {
            bg: 'bg-[#0A1A2F]',
            noise: 'opacity-[0.03]'
        },
        patient: {
            bg: 'bg-[#0A1A2F]',
            noise: 'opacity-[0.03]'
        },
        auth: {
            bg: 'bg-[#0A1A2F]',
            noise: 'opacity-[0.03]'
        },
        luminous: {
            bg: 'bg-[#0A1A2F]',
            noise: 'opacity-[0.03]'
        }
    };

    const theme = themes[variant];

    return (
        <div className={`relative min-h-screen w-full transition-colors duration-700 ${className}`}>

            {/* 1. FIXED Background Layer (Does not scroll) */}
            <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0 bg-[#0A1A2F]">
                {/* Background Base - Deep Navy */}
                <div className="absolute inset-0 bg-[#0A1A2F]"></div>

                {/* --- GEOMETRIC BANDS (Sharp Base) --- */}
                {/* Band 1 - Deep Blue/Gray */}
                <div
                    className="absolute top-0 left-0 w-[150%] h-[150%] bg-[#0F172A]"
                    style={{ clipPath: 'polygon(0 0, 35% 0, 0 85%)' }}
                ></div>

                {/* Band 2 - Dark Bronze */}
                <div
                    className="absolute top-0 left-0 w-[150%] h-[150%] bg-[#3D3A2C]"
                    style={{ clipPath: 'polygon(37% 0, 42% 0, 0 92%, 0 87%)' }}
                ></div>

                {/* Band 3 - Aged Gold */}
                <div
                    className="absolute top-0 left-0 w-[150%] h-[150%] bg-[#8B7C41]"
                    style={{ clipPath: 'polygon(44% 0, 49% 0, 0 99%, 0 94%)' }}
                ></div>

                {/* Band 4 - Muted Gold */}
                <div
                    className="absolute top-0 left-0 w-[150%] h-[150%] bg-[#B5A55D]"
                    style={{ clipPath: 'polygon(51% 0, 56% 0, 0 106%, 0 101%)' }}
                ></div>

                {/* Band 5 - Metrik Gold */}
                <div
                    className="absolute top-0 left-0 w-[150%] h-[150%] bg-[#D4AF37]"
                    style={{ clipPath: 'polygon(59% 0, 68% 0, 0 118%, 0 109%)' }}
                ></div>

                {/* --- FROSTED OVERLAY (Global Blur) --- */}
                {/* Simulates the 'Availability Modal' background effect */}
                <div className="absolute inset-0 backdrop-blur-[60px] bg-black/10 pointer-events-none"></div>

                {/* Subtle Globe Logo Overlay (Placeholder effect) */}
                <div className="absolute bottom-[20%] right-[10%] opacity-10">
                    <div className="w-64 h-64 border-2 border-[#D4AF37] rounded-full flex items-center justify-center">
                        <div className="w-48 h-px bg-[#D4AF37]/50 rotate-45 absolute"></div>
                        <div className="w-48 h-px bg-[#D4AF37]/50 -rotate-45 absolute"></div>
                    </div>
                </div>

                {/* 2. Texture Layer (Fixed with background) */}
                <div className={`absolute inset-0 ${theme.noise} pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]`}></div>
            </div>

            {/* 3. Global Styles (Removed Smoke, kept basic necessities) */}
            <style>{`
                .bento-grid-item {
                    border-radius: 2rem;
                    background: rgba(255, 255, 255, 0.95);
                    box-shadow: 0 10px 30px -10px rgba(0,0,0,0.15);
                    color: #1e3a8a;
                }
                .bento-grid-item-dark {
                    border-radius: 2rem;
                    background: #0A1A2F;
                    box-shadow: 0 10px 30px -10px rgba(0,0,0,0.3);
                    color: white;
                }
            `}</style>

            {/* Content - Scrolls normally */}
            <div className="relative z-10 w-full h-full">
                {children}
            </div>
        </div>
    );
};
