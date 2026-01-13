import React, { useState } from 'react';
import {
    ChevronLeft,
    Eye,
    EyeOff,
    CheckCircle2,
    Lock,
    RefreshCw,
    Dot
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { BottomNav } from '@/components/layout/BottomNav';
import { cn } from '@/lib/utils';

export const SecurityScreen: React.FC = () => {
    const navigate = useNavigate();
    const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });

    const toggleShow = (key: keyof typeof showPasswords) => {
        setShowPasswords(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const requirements = [
        { label: 'Minimo de 8 caracteres', met: true },
        { label: 'Pelo menos uma letra maiúscula', met: true },
        { label: 'Pelo menos um caractere especial (!@#$)', met: false },
        { label: 'Pelo menos um número', met: false }
    ];

    return (
        <div className="min-h-screen bg-[#F1F3F5] pb-32 font-sans px-5">
            {/* Simple White Header with Back Arrow */}
            <header className="pt-8 flex items-center mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm border border-gray-100"
                >
                    <ChevronLeft size={24} className="text-dark" />
                </button>
                <h1 className="ml-4 text-sm font-bold text-dark flex items-center gap-1">
                    Segurança e <span className="text-secondary">Senha</span>
                </h1>
            </header>

            <div className="mb-10">
                <h2 className="text-[2.5rem] font-black text-dark leading-tight tracking-tighter mb-4">Alterar Credenciais</h2>
                <p className="text-sm font-medium text-gray-500 leading-relaxed">
                    Mantenha sua conta METRIK protegida com uma senha forte.
                </p>
            </div>

            {/* Input Fields */}
            <div className="space-y-4 mb-8">
                {[
                    { id: 'current', label: 'SENHA ATUAL' },
                    { id: 'new', label: 'NOVA SENHA' },
                    { id: 'confirm', label: 'CONFIRMAR NOVA SENHA' }
                ].map((input) => (
                    <div key={input.id} className="bg-white p-6 rounded-[1.5rem] border border-gray-50 shadow-sm space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">{input.label}</label>
                        <div className="flex items-center justify-between">
                            <input
                                type={showPasswords[input.id as keyof typeof showPasswords] ? 'text' : 'password'}
                                className="bg-transparent flex-1 text-lg font-black tracking-widest text-dark outline-none py-1"
                                defaultValue="••••••••"
                            />
                            <button
                                onClick={() => toggleShow(input.id as keyof typeof showPasswords)}
                                className="text-gray-400 hover:text-secondary p-1"
                            >
                                {showPasswords[input.id as keyof typeof showPasswords] ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Password Requirements */}
            <div className="space-y-4 mb-10">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1 mb-2">Critérios de Segurança</p>
                {requirements.map((req, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                        <div className={cn(
                            "w-5 h-5 rounded-full flex items-center justify-center border",
                            req.met ? "bg-primary border-primary text-dark" : "bg-transparent border-gray-200 text-transparent"
                        )}>
                            <CheckCircle2 size={12} strokeWidth={3} />
                        </div>
                        <span className={cn(
                            "text-xs font-bold",
                            req.met ? "text-dark" : "text-gray-400"
                        )}>{req.label}</span>
                    </div>
                ))}
            </div>

            {/* Update Button */}
            <Button
                className="w-full h-16 rounded-[2rem] bg-primary text-dark font-black gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all"
            >
                <Lock size={20} strokeWidth={3} />
                ATUALIZAR SENHA
            </Button>

            <BottomNav />
        </div>
    );
};
