import React, { useEffect } from 'react';
import { CheckCircle2, XCircle, Loader, X, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToastProps {
    message: string;
    type?: 'success' | 'error' | 'loading' | 'warning';
    isVisible: boolean;
    onClose: () => void;
    duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
    message,
    type = 'success',
    isVisible,
    onClose,
    duration = 3000
}) => {
    useEffect(() => {
        // Only auto-dismiss if NOT an error and NOT loading
        if (isVisible && type !== 'loading' && type !== 'error' && type !== 'warning') {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, type, onClose, duration]);

    if (!isVisible) return null;

    const isError = type === 'error';

    return (
        <>
            {/* Backdrop for Errors to increase Prominence */}
            {isError && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-[4px] z-[99] animate-in fade-in duration-500"
                    onClick={onClose}
                />
            )}

            <div className={cn(
                "fixed left-5 right-5 z-[100] animate-in fade-in slide-in-from-top-10 duration-500 transition-all",
                isError ? "top-1/2 -translate-y-1/2" : "top-8"
            )}>
                <div className={cn(
                    "rounded-[2rem] p-5 flex items-center gap-5 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] border transition-all mx-auto backdrop-blur-xl relative overflow-hidden bg-gradient-to-r from-[#0B1120] to-[#151B2E]",
                    isError ? "border-red-500/30 max-w-sm flex-col text-center p-8 shadow-red-900/10" : "border-[#D4AF37]/30 max-w-md w-full shadow-[#D4AF37]/10"
                )}>
                    {/* Decorative Top Line */}
                    <div className={cn(
                        "absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[2px] bg-gradient-to-r from-transparent to-transparent opacity-50",
                        isError ? "via-red-500" : "via-[#D4AF37]"
                    )}></div>

                    <div className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg border",
                        type === 'success' && "bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/20 shadow-[#D4AF37]/5",
                        type === 'error' && "bg-red-500/10 text-red-500 border-red-500/20 shadow-red-500/5",
                        type === 'warning' && "bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-blue-500/5",
                        type === 'loading' && "bg-[#D4AF37]/5 text-[#D4AF37] border-[#D4AF37]/10 shadow-none"
                    )}>
                        {type === 'success' && <CheckCircle2 size={28} strokeWidth={2.5} />}
                        {type === 'error' && <XCircle size={32} strokeWidth={2.5} />}
                        {type === 'warning' && <AlertCircle size={28} strokeWidth={2.5} />}
                        {type === 'loading' && <Loader size={28} className="animate-spin" />}
                    </div>

                    <div className={cn("flex-1 min-w-0", isError && "w-full")}>
                        <h4 className={cn(
                            "text-[10px] font-black uppercase tracking-[0.2em] mb-1.5",
                            type === 'success' && "text-[#D4AF37]",
                            type === 'error' && "text-red-500",
                            type === 'loading' && "text-[#D4AF37] animate-pulse",
                            type === 'warning' && "text-blue-400"
                        )}>
                            {type === 'success' ? 'Sucesso' : type === 'error' ? 'Atenção' : type === 'warning' ? 'Info' : 'Processando'}
                        </h4>
                        <p className={cn(
                            "font-bold leading-tight",
                            isError ? "text-base text-white" : "text-sm text-slate-200"
                        )}>
                            {message}
                        </p>
                    </div>

                    {isError ? (
                        <button
                            onClick={onClose}
                            className="w-full h-12 bg-red-500 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-red-900/20 active:scale-95 transition-all mt-4 hover:bg-red-600"
                        >
                            Fechar
                        </button>
                    ) : type !== 'loading' && (
                        <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full text-slate-500 hover:text-white hover:bg-white/10 transition-all shrink-0">
                            <X size={20} />
                        </button>
                    )}
                </div>
            </div>
        </>
    );
};
