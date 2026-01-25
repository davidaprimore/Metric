import React, { useState } from 'react';
import { FluidBackground } from '@/components/layout/FluidBackground';
import {
    ChevronLeft,
    Eye,
    EyeOff,
    CheckCircle2,
    Lock,
    Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { BottomNav } from '@/components/layout/BottomNav';
import { Toast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

export const SecurityScreen: React.FC = () => {
    const navigate = useNavigate();
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
    const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' | 'loading' });

    const toggleShow = (key: keyof typeof showPasswords) => {
        setShowPasswords(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleUpdate = async () => {
        if (!passwords.new || passwords.new !== passwords.confirm) {
            setToast({ show: true, message: 'As senhas digitadas não coincidem!', type: 'error' });
            return;
        }
        if (passwords.new.length < 8) {
            setToast({ show: true, message: 'Sua nova senha precisa ter pelo menos 8 caracteres.', type: 'error' });
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({
                password: passwords.new
            });

            if (error) throw error;

            setToast({
                show: true,
                message: 'Segurança atualizada! Sua nova senha já está valendo. 🔒',
                type: 'success'
            });
            setTimeout(() => navigate('/profile'), 2000);
        } catch (error: any) {
            setToast({
                show: true,
                message: 'Erro ao trocar senha: ' + (error.message || 'Erro desconhecido'),
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const requirements = [
        { label: 'Minimo de 8 caracteres', met: passwords.new.length >= 8 },
        { label: 'Pelo menos uma letra maiúscula', met: /[A-Z]/.test(passwords.new) },
        { label: 'Pelo menos um caractere especial (!@#$)', met: /[!@#$%^&*]/.test(passwords.new) },
        { label: 'Pelo menos um número', met: /[0-9]/.test(passwords.new) }
    ];

    // Glassy, Transparent, Luminous
    const textureCardClass = "bg-black/40 bg-[radial-gradient(120%_120%_at_50%_0%,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent backdrop-blur-3xl border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] relative overflow-hidden";

    return (
        <FluidBackground variant="luminous" className="pb-40 font-sans px-5 relative overflow-hidden min-h-screen">
            <Toast
                isVisible={toast.show}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ ...toast, show: false })}
            />

            <div className="relative z-10 text-white">
                <header className="pt-8 flex items-center mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 shadow-sm hover:text-white text-slate-400 active:scale-95 transition-all"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <h1 className="ml-4 text-sm font-bold text-white flex items-center gap-1">
                        Segurança e <span className="text-[#CCFF00]">Senha</span>
                    </h1>
                </header>

                <div className="mb-10">
                    <h2 className="text-[2.5rem] font-black text-white leading-tight tracking-tighter mb-4">Alterar Credenciais</h2>
                    <p className="text-sm font-medium text-slate-400 leading-relaxed">
                        Mantenha sua conta METRIK protegida com uma senha forte.
                    </p>
                </div>

                <div className="space-y-4 mb-8">
                    {[
                        { id: 'current', label: 'SENHA ATUAL' },
                        { id: 'new', label: 'NOVA SENHA' },
                        { id: 'confirm', label: 'CONFIRMAR NOVA SENHA' }
                    ].map((input) => (
                        <div key={input.id} className={`${textureCardClass} p-6 rounded-[1.5rem] space-y-2`}>
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">{input.label}</label>
                            <div className="flex items-center justify-between">
                                <input
                                    type={showPasswords[input.id as keyof typeof showPasswords] ? 'text' : 'password'}
                                    className="bg-transparent flex-1 text-lg font-black tracking-widest text-white outline-none py-1 placeholder:text-slate-700"
                                    placeholder="••••••••"
                                    value={passwords[input.id as keyof typeof passwords]}
                                    onChange={(e) => setPasswords({ ...passwords, [input.id]: e.target.value })}
                                />
                                <button
                                    onClick={() => toggleShow(input.id as keyof typeof showPasswords)}
                                    className="text-slate-500 hover:text-[#CCFF00] p-1 transition-colors"
                                >
                                    {showPasswords[input.id as keyof typeof showPasswords] ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="space-y-4 mb-10">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1 mb-2">Critérios de Segurança</p>
                    {requirements.map((req, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                            <div className={cn(
                                "w-5 h-5 rounded-full flex items-center justify-center border transition-colors",
                                req.met ? "bg-[#CCFF00] border-[#CCFF00] text-black" : "bg-transparent border-slate-700 text-transparent"
                            )}>
                                <CheckCircle2 size={12} strokeWidth={3} />
                            </div>
                            <span className={cn(
                                "text-xs font-bold transition-colors",
                                req.met ? "text-white" : "text-slate-500"
                            )}>{req.label}</span>
                        </div>
                    ))}
                </div>

                <Button
                    onClick={handleUpdate}
                    disabled={loading}
                    className="w-full h-16 rounded-[2rem] bg-[#CCFF00] text-black font-black gap-3 shadow-xl shadow-[#CCFF00]/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 hover:bg-white"
                >
                    {loading ? (
                        <Loader2 className="w-6 h-6 animate-spin text-black" />
                    ) : (
                        <CheckCircle2 size={24} strokeWidth={3} />
                    )}
                    {loading ? 'ATUALIZANDO...' : 'ATUALIZAR SENHA'}
                </Button>
            </div>

            <BottomNav />
        </FluidBackground>
    );
};
