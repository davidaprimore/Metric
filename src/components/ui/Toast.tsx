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
                    "bg-white rounded-[2.5rem] p-6 flex flex-col items-center text-center gap-5 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border-2 transition-all mx-auto",
                    isError ? "border-red-100 max-w-sm p-8" : "border-gray-50 flex-row text-left max-w-md"
                )}>
                    <div className={cn(
                        "w-16 h-16 rounded-[2.5rem] flex items-center justify-center shrink-0 shadow-lg",
                        type === 'success' && "bg-[#C6FF00] text-dark shadow-[#C6FF00]/20",
                        type === 'error' && "bg-red-500 text-white shadow-red-200",
                        type === 'warning' && "bg-secondary text-white shadow-secondary/20",
                        type === 'loading' && "bg-gray-100 text-gray-400 shadow-none"
                    )}>
                        {type === 'success' && <CheckCircle2 size={32} strokeWidth={3} />}
                        {type === 'error' && <XCircle size={32} strokeWidth={3} />}
                        {type === 'warning' && <AlertCircle size={32} strokeWidth={3} />}
                        {type === 'loading' && <Loader size={32} className="animate-spin" />}
                    </div>

                    <div className="flex-1 min-w-0 w-full">
                        <h4 className={cn(
                            "text-[10px] font-black uppercase tracking-[0.3em] mb-2",
                            type === 'success' && "text-[#16A34A]",
                            type === 'error' && "text-red-500",
                            type === 'loading' && "text-gray-400"
                        )}>
                            {type === 'success' ? 'Sucesso Total!' : type === 'error' ? 'Ops! Atenção' : 'Aguarde...'}
                        </h4>
                        <p className={cn(
                            "font-bold text-dark leading-snug break-words",
                            isError ? "text-base" : "text-sm"
                        )}>
                            {message}
                        </p>
                    </div>

                    {isError ? (
                        <button
                            onClick={onClose}
                            className="w-full h-14 bg-red-500 text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-lg shadow-red-200 active:scale-95 transition-all mt-2"
                        >
                            ENTENDI, OK
                        </button>
                    ) : type !== 'loading' && (
                        <button onClick={onClose} className="p-2 text-gray-300 hover:text-gray-500 shrink-0">
                            <X size={24} />
                        </button>
                    )}
                </div>
            </div>
        </>
    );
};
