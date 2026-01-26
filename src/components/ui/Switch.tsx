import React from 'react';
import { cn } from '@/lib/utils';

interface SwitchProps {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    disabled?: boolean;
    className?: string;
}

export const Switch: React.FC<SwitchProps> = ({ checked, onCheckedChange, disabled = false, className }) => {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => !disabled && onCheckedChange(!checked)}
            disabled={disabled}
            className={cn(
                "w-12 h-6 rounded-full transition-colors relative flex items-center px-1 border border-white/10 shadow-inner",
                checked ? "bg-[#CCFF00]" : "bg-black/40",
                disabled && "opacity-50 cursor-not-allowed",
                className
            )}
        >
            <div className={cn(
                "w-4 h-4 rounded-full shadow-sm transition-transform duration-200 bg-black",
                checked ? "translate-x-6" : "translate-x-0 bg-slate-500"
            )} />
        </button>
    );
};
