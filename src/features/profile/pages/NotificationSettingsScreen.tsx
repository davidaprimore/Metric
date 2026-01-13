import React, { useState } from 'react';
import {
    ChevronLeft,
    Bell,
    Mail,
    Info,
    CheckCircle2,
    Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { BottomNav } from '@/components/layout/BottomNav';
import { Toast } from '@/components/ui/Toast';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

export const NotificationSettingsScreen: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' | 'loading' });

    // Default preferences - all enabled by default now
    const [prefs, setPrefs] = useState({
        push_evaluation: user?.user_metadata?.prefs?.push_evaluation ?? true,
        push_tips: user?.user_metadata?.prefs?.push_tips ?? true,
        push_updates: user?.user_metadata?.prefs?.push_updates ?? true,
        email_summary: user?.user_metadata?.prefs?.email_summary ?? true,
        email_promo: user?.user_metadata?.prefs?.email_promo ?? true,
        email_security: user?.user_metadata?.prefs?.email_security ?? true
    });

    const toggle = (key: keyof typeof prefs) => {
        setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({
                data: {
                    prefs: prefs
                }
            });

            if (error) throw error;

            setToast({
                show: true,
                message: 'Tudo pronto! Suas preferências de notificação foram atualizadas. ✨',
                type: 'success'
            });
            setTimeout(() => navigate('/profile'), 2000);
        } catch (error: any) {
            setToast({
                show: true,
                message: 'Não foi possível salvar: ' + (error.message || 'Erro desconhecido'),
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const Switch = ({ active, onClick }: { active: boolean, onClick: () => void }) => (
        <button
            onClick={onClick}
            className={cn(
                "w-12 h-6 rounded-full transition-colors relative flex items-center px-1",
                active ? "bg-primary" : "bg-gray-200"
            )}
        >
            <div className={cn(
                "w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200",
                active ? "translate-x-6" : "translate-x-0"
            )} />
        </button>
    );

    return (
        <div className="min-h-screen bg-[#F1F3F5] pb-32 font-sans">
            <Toast
                isVisible={toast.show}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ ...toast, show: false })}
            />
            <header className="pt-8 px-5 flex items-center mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm border border-gray-100"
                >
                    <ChevronLeft size={24} className="text-dark" />
                </button>
                <h1 className="ml-4 text-sm font-bold text-dark">
                    Preferências de <span className="text-secondary">Notificação</span>
                </h1>
            </header>

            <div className="px-5 space-y-8">
                {/* Push Notifications Section */}
                <section>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2 mb-4">Notificações Push</p>
                    <div className="bg-white rounded-[2rem] overflow-hidden border border-gray-100/50 shadow-sm">
                        <div className="p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-dark">Lembretes de Avaliação</span>
                                <Switch active={prefs.push_evaluation} onClick={() => toggle('push_evaluation')} />
                            </div>
                            <div className="h-px bg-gray-50" />
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-dark">Dicas de Saúde</span>
                                <Switch active={prefs.push_tips} onClick={() => toggle('push_tips')} />
                            </div>
                            <div className="h-px bg-gray-50" />
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-dark">Atualizações do App</span>
                                <Switch active={prefs.push_updates} onClick={() => toggle('push_updates')} />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Email Notifications Section */}
                <section>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2 mb-4">Notificações por E-mail</p>
                    <div className="bg-white rounded-[2rem] overflow-hidden border border-gray-100/50 shadow-sm">
                        <div className="p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-dark">Resumo Mensal</span>
                                <Switch active={prefs.email_summary} onClick={() => toggle('email_summary')} />
                            </div>
                            <div className="h-px bg-gray-50" />
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-dark">Promoções</span>
                                <Switch active={prefs.email_promo} onClick={() => toggle('email_promo')} />
                            </div>
                            <div className="h-px bg-gray-50" />
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="text-sm font-bold text-dark block">Segurança da Conta</span>
                                    <span className="text-[8px] font-black text-primary uppercase">Recomendado</span>
                                </div>
                                <Switch active={prefs.email_security} onClick={() => toggle('email_security')} />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Info Card */}
                <div className="bg-secondary/10 p-6 rounded-[2rem] flex gap-4 border border-secondary/20">
                    <div className="w-10 h-10 bg-secondary rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-secondary/20">
                        <Info size={20} className="text-white" />
                    </div>
                    <p className="text-[11px] font-medium text-secondary/80 leading-relaxed">
                        As notificações da <span className="font-extrabold text-secondary">METRIK</span> garantem que você nunca perca uma janela de avaliação importante para seus resultados.
                    </p>
                </div>

                {/* Save Button */}
                <Button
                    onClick={handleSave}
                    disabled={loading}
                    className="w-full h-16 rounded-[2rem] bg-primary text-dark font-black tracking-tight gap-3 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 mt-4"
                >
                    {loading ? (
                        <Loader2 className="w-6 h-6 animate-spin text-dark" />
                    ) : (
                        <CheckCircle2 size={24} strokeWidth={3} />
                    )}
                    {loading ? 'SALVANDO...' : 'SALVAR PREFERÊNCIAS'}
                </Button>
            </div>

            <BottomNav />
        </div>
    );
};
