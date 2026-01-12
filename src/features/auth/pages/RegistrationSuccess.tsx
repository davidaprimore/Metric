import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, PartyPopper } from 'lucide-react';

export const RegistrationSuccess: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/dashboard');
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="min-h-screen bg-[#1a1c1e] flex flex-col items-center justify-center p-8 text-center font-sans overflow-hidden relative">
            {/* Background radial gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#2a2c2e_0%,_#1a1c1e_70%)] opacity-50" />

            <div className="z-10 animate-in fade-in zoom-in duration-700">
                <div className="w-24 h-24 bg-primary/20 rounded-[2rem] flex items-center justify-center mx-auto mb-8 relative">
                    <CheckCircle2 className="text-primary w-12 h-12" />
                    <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse" />
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-center gap-2">
                        <PartyPopper className="text-secondary w-6 h-6" />
                        <h1 className="text-4xl font-display font-bold text-white tracking-tight">Parabéns!</h1>
                        <PartyPopper className="text-secondary w-6 h-6" />
                    </div>

                    <h2 className="text-xl font-bold text-gray-200">
                        Seu cadastro foi realizado <br />
                        <span className="text-primary italic">com sucesso!</span>
                    </h2>

                    <p className="text-gray-400 text-sm max-w-[260px] mx-auto leading-relaxed">
                        Estamos preparando tudo para você começar sua jornada de precisão.
                    </p>
                </div>

                <div className="mt-16 flex flex-col items-center gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 rounded-full bg-primary animate-bounce"></div>
                    </div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Iniciando Dashboard</span>
                </div>
            </div>

            {/* Decorative background elements */}
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-secondary/5 rounded-full blur-3xl"></div>
        </div>
    );
};
