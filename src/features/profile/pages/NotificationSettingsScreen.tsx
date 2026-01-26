import React, { useState } from 'react';
import { FluidBackground } from '@/components/layout/FluidBackground';
import {
    ChevronLeft,
    Bell,
    Mail,
    Info,
    CheckCircle2,
    Loader2,
    Smartphone,
    Shield,
    Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { BottomNav } from '@/components/layout/BottomNav';
import { Toast } from '@/components/ui/Toast';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/Switch';
import { usePushNotifications } from '@/hooks/usePushNotifications';

export const NotificationSettingsScreen: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { permission, requestPermission, loading: pushLoading } = usePushNotifications();
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' | 'loading' });

    // Default preferences
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

    // Glassy, Transparent, Luminous
    const textureCardClass = "bg-black/40 bg-[radial-gradient(120%_120%_at_50%_0%,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent backdrop-blur-3xl border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] relative overflow-hidden";
    const headerButtonClass = "w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 shadow-sm hover:text-white text-slate-400 active:scale-95 transition-all";

    return (
        <FluidBackground variant="luminous" className="pb-40 font-sans px-5 relative overflow-hidden min-h-screen">
            <Toast
                isVisible={toast.show}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ ...toast, show: false })}
            />
            <header className="pt-8 flex items-center mb-8 relative z-10">
                <button
                    onClick={() => navigate(-1)}
                    className={headerButtonClass}
                >
                    <ChevronLeft size={24} />
                </button>
                <h1 className="ml-4 text-sm font-bold text-white">
                    Preferências de <span className="text-[#CCFF00]">Notificação</span>
                </h1>
            </header>

            <div className="relative z-10 space-y-8">

                {/* Main Enable Card */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
                    <div className="flex items-center gap-4 mb-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${permission === 'granted' ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'bg-white/5 text-slate-400'}`}>
                            <Bell size={24} />
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-lg">Push Notifications</h3>
                            <p className="text-slate-400 text-xs mt-1">
                                {permission === 'granted'
                                    ? 'Ativado: Você receberá alertas no dispositivo.'
                                    : permission === 'denied'
                                        ? 'Bloqueado: Habilite nas configurações do navegador.'
                                        : 'Desativado: Toque para ativar alertas.'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => requestPermission()}
                        disabled={permission === 'granted' || pushLoading}
                        className={cn(
                            "w-full py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-all",
                            permission === 'granted'
                                ? 'bg-green-500/10 text-green-500 cursor-default'
                                : 'bg-[#D4AF37] text-black hover:scale-[1.02]'
                        )}
                    >
                        {pushLoading ? 'Solicitando...' : permission === 'granted' ? 'Ativado ✅' : 'Ativar no Dispositivo'}
                    </button>

                    {permission === 'granted' && (
                        <button
                            onClick={async () => {
                                setLoading(true);
                                try {
                                    const { error } = await supabase.functions.invoke('send-push', {
                                        body: {
                                            user_id: user?.id,
                                            title: "Teste Metrik",
                                            body: "Se você leu isso, o sistema funcionou! 🚀"
                                        }
                                    });
                                    if (error) throw error;
                                    setToast({ show: true, message: 'Notificação enviada! Verifique seu celular.', type: 'success' });
                                } catch (e) {
                                    setToast({ show: true, message: 'Erro ao enviar teste.', type: 'error' });
                                    console.error(e);
                                } finally {
                                    setLoading(false);
                                }
                            }}
                            className="w-full mt-3 py-3 border border-white/10 rounded-xl text-white/50 font-bold uppercase tracking-widest text-[10px] hover:bg-white/5 hover:text-white transition-all"
                        >
                            {loading ? 'Enviando...' : 'Enviar notificação de teste'}
                        </button>
                    )}
                </div>

                {/* Push Notifications Section */}
                <section>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2 mb-4">Canais de Push</p>
                    <div className={`${textureCardClass} rounded-[2rem]`}>
                        <div className="p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-white">Lembretes de Avaliação</span>
                                <Switch checked={prefs.push_evaluation} onCheckedChange={() => toggle('push_evaluation')} />
                            </div>
                            <div className="h-px bg-white/5" />
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-white">Dicas de Saúde</span>
                                <Switch checked={prefs.push_tips} onCheckedChange={() => toggle('push_tips')} />
                            </div>
                            <div className="h-px bg-white/5" />
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-white">Atualizações do App</span>
                                <Switch checked={prefs.push_updates} onCheckedChange={() => toggle('push_updates')} />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Email Notifications Section */}
                <section>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2 mb-4">Notificações por E-mail</p>
                    <div className={`${textureCardClass} rounded-[2rem]`}>
                        <div className="p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-white">Resumo Mensal</span>
                                <Switch checked={prefs.email_summary} onCheckedChange={() => toggle('email_summary')} />
                            </div>
                            <div className="h-px bg-white/5" />
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-white">Promoções</span>
                                <Switch checked={prefs.email_promo} onCheckedChange={() => toggle('email_promo')} />
                            </div>
                            <div className="h-px bg-white/5" />
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="text-sm font-bold text-white block">Segurança da Conta</span>
                                    <span className="text-[8px] font-black text-[#CCFF00] uppercase">Recomendado</span>
                                </div>
                                <Switch checked={prefs.email_security} onCheckedChange={() => toggle('email_security')} />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Info Card */}
                <div className="bg-[#CCFF00]/5 p-6 rounded-[2rem] flex gap-4 border border-[#CCFF00]/10">
                    <div className="w-10 h-10 bg-[#CCFF00] rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-[#CCFF00]/20 text-black">
                        <Info size={20} />
                    </div>
                    <p className="text-[11px] font-medium text-[#CCFF00]/80 leading-relaxed">
                        As notificações da <span className="font-extrabold text-[#CCFF00]">METRIK</span> garantem que você nunca perca uma janela de avaliação importante para seus resultados.
                    </p>
                </div>

                {/* Save Button */}
                <Button
                    onClick={handleSave}
                    disabled={loading}
                    className="w-full h-16 rounded-[2rem] bg-[#CCFF00] text-black font-black tracking-tight gap-3 shadow-lg shadow-[#CCFF00]/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 mt-4 hover:bg-white"
                >
                    {loading ? (
                        <Loader2 className="w-6 h-6 animate-spin text-black" />
                    ) : (
                        <CheckCircle2 size={24} strokeWidth={3} />
                    )}
                    {loading ? 'SALVANDO...' : 'SALVAR PREFERÊNCIAS'}
                </Button>
            </div>

            <BottomNav />
        </FluidBackground>
    );
};
