import React, { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToastProps {
    message: string;
    type?: 'success' | 'error' | 'loading';
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
        if (isVisible && type !== 'loading') {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, type, onClose, duration]);

    if (!isVisible) return null;

    return (
        <div className="fixed top-8 left-5 right-5 z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
            <div className={cn(
                "bg-white rounded-[1.5rem] p-4 flex items-center gap-4 shadow-[0_20px_40px_rgba(0,0,0,0.1)] border border-gray-100",
                type === 'error' && "border-red-100"
            )}>
                <div className={cn(
                    "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg",
                    type === 'success' && "bg-primary text-dark shadow-primary/20",
                    type === 'error' && "bg-red-500 text-white shadow-red-200",
                    type === 'loading' && "bg-gray-100 text-gray-400 shadow-none"
                )}>
                    {type === 'success' && <CheckCircle2 size={20} strokeWidth={3} />}
                    {type === 'error' && <XCircle size={20} />}
                    {type === 'loading' && <Loader2 size={20} className="animate-spin" />}
                </div>
                <div className="flex-1">
                    <h4 className={cn(
                        "text-xs font-black uppercase tracking-wider mb-0.5",
                        type === 'success' && "text-primary",
                        type === 'error' && "text-red-500",
                        type === 'loading' && "text-gray-400"
                    )}>
                        {type === 'success' ? 'Sucesso!' : type === 'error' ? 'Ops!' : 'Aguarde...'}
                    </h4>
                    <p className="text-sm font-bold text-dark leading-tight">{message}</p>
                </div>
            </div>
        </div>
    );
};
