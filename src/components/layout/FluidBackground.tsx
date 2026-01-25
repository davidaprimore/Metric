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
            bg: 'bg-[#122216]', // Richer Green Base
            noise: 'opacity-[0.06]'
        },
        patient: {
            bg: 'bg-[#122216]',
            noise: 'opacity-[0.06]'
        },
        auth: {
            bg: 'bg-[#122216]',
            noise: 'opacity-[0.06]'
        },
        luminous: {
            bg: 'bg-[#122216]',
            noise: 'opacity-[0.06]'
        }
    };

    const theme = themes[variant];

    return (
        <div className={`relative min-h-screen w-full overflow-hidden transition-colors duration-700 bg-[#122216] ${className}`}>

            {/* 0. Global Smoke Styles */}
            <style>{`
                @keyframes smokeMove {
                    0% { transform: translate(0, 0) rotate(0deg) scale(1.0); opacity: 0.3; }
                    25% { transform: translate(10%, -5%) rotate(5deg) scale(1.1); opacity: 0.2; }
                    50% { transform: translate(20%, 0) rotate(0deg) scale(1.2); opacity: 0.3; }
                    75% { transform: translate(10%, 5%) rotate(-5deg) scale(1.1); opacity: 0.4; }
                    100% { transform: translate(0, 0) rotate(0deg) scale(1.0); opacity: 0.3; }
                }

                .smoke-blob {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(80px);
                    mix-blend-mode: color-dodge;
                    animation: smokeMove 20s infinite ease-in-out alternate;
                    pointer-events: none;
                }
                
                .smoke-1 { width: 60vw; height: 60vh; background: rgba(57, 255, 20, 0.10); top: -20%; right: -10%; animation-duration: 25s; } /* Neon Green */
                .smoke-2 { width: 70vw; height: 70vh; background: rgba(204, 255, 0, 0.08); bottom: -10%; left: -20%; animation-duration: 30s; animation-delay: -5s; } /* Chemical Yellow */
                .smoke-3 { width: 50vw; height: 50vh; background: rgba(10, 30, 10, 0.6); top: 30%; left: 30%; animation-duration: 40s; animation-delay: -10s; mix-blend-mode: overlay; } /* Dark Deep Fog */

            `}</style>

            {/* 1. Base Layer - Rich Green */}
            <div className={`absolute inset-0 ${theme.bg}`}></div>

            {/* 2. Atmospheric Flows (Enhanced Smoke) */}
            <div className={`absolute inset-0 overflow-hidden pointer-events-none`}>
                <div className="smoke-blob smoke-1"></div>
                <div className="smoke-blob smoke-2"></div>
                <div className="smoke-blob smoke-3"></div>
            </div>

            {/* 3. Texture */}
            <div className={`absolute inset-0 ${theme.noise} pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]`}></div>

            {/* 4. Vignette - Heavy edges to focus center */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.6)_100%)] pointer-events-none"></div>

            {/* Content */}
            <div className="relative z-10 w-full h-full">
                {children}
            </div>
        </div>
    );
};
