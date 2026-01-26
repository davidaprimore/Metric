import React, { useState, useEffect } from 'react';
import { X, Check, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface MeasurementHUDProps {
    zoneId: string;
    zoneName: string;
    onSave: (value: number, type?: 'relaxed' | 'contracted') => void;
    onClose: () => void;
    initialValue?: number;
}

export const MeasurementHUD: React.FC<MeasurementHUDProps> = ({ zoneId, zoneName, onSave, onClose, initialValue }) => {
    const [inputValue, setInputValue] = useState(initialValue?.toString() || '');
    const [subType, setSubType] = useState<'relaxed' | 'contracted' | null>(null);

    // Auto-detect if we need subtypes (Biceps)
    useEffect(() => {
        if (zoneId.includes('arm') || zoneId.includes('biceps')) {
            if (!subType) setSubType('relaxed');
        }
    }, [zoneId]);

    const handleNumClick = (num: string) => {
        if (inputValue.length > 5) return;
        setInputValue(prev => prev + num);
    };

    const handleBackspace = () => {
        setInputValue(prev => prev.slice(0, -1));
    };

    const handleSubmit = () => {
        const val = parseFloat(inputValue);
        if (!isNaN(val)) {
            onSave(val, subType || undefined);

            // If it's a dual-type zone (Arm), auto-switch to next type or close
            if (subType === 'relaxed') {
                setSubType('contracted');
                setInputValue(''); // Clear for next input
            } else {
                onClose();
            }
        }
    };

    // Validation Ranges (Mock Logic)
    const val = parseFloat(inputValue);
    const isHigh = val > 40 && zoneId.includes('fold'); // simple heuristic
    const isLow = val < 3 && zoneId.includes('fold');

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                className="fixed bottom-0 left-0 right-0 bg-[#111] border-t border-[#D4AF37]/30 rounded-t-3xl p-6 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.8)]"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-[#D4AF37] text-xs font-black uppercase tracking-[0.2em]">Medida</h3>
                        <h2 className="text-2xl font-bold text-white uppercase">{zoneName} {subType === 'relaxed' ? '(Repouso)' : subType === 'contracted' ? '(Contraído)' : ''}</h2>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400">
                        <X size={20} />
                    </button>
                </div>

                {/* Display */}
                <div className="bg-black/50 border border-white/10 rounded-2xl h-20 flex items-center justify-center mb-6 relative overflow-hidden">
                    <span className="text-4xl font-mono text-white tracking-widest">{inputValue}<span className="animate-pulse">|</span></span>
                    <span className="absolute right-4 bottom-2 text-xs font-bold text-slate-600 uppercase">mm</span>

                    {/* Validation Warning */}
                    {(isHigh || isLow) && (
                        <div className="absolute top-2 right-2 flex items-center gap-1 text-yellow-500">
                            <AlertTriangle size={12} />
                            <span className="text-[9px] font-black uppercase">Atípico</span>
                        </div>
                    )}
                </div>

                {/* Keypad */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0].map((num) => (
                        <button
                            key={num}
                            onClick={() => handleNumClick(num.toString())}
                            className="h-14 rounded-xl bg-white/5 border border-white/5 text-xl font-bold text-white hover:bg-[#D4AF37]/20 active:bg-[#D4AF37]/40 transition-colors"
                        >
                            {num}
                        </button>
                    ))}
                    <button onClick={handleBackspace} className="h-14 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center">
                        ⌫
                    </button>
                </div>

                {/* Submit Action */}
                <button
                    onClick={handleSubmit}
                    className="w-full h-16 rounded-2xl bg-[#D4AF37] text-black text-lg font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                >
                    <Check size={24} strokeWidth={3} />
                    {subType === 'relaxed' ? 'Próximo (Contraído)' : 'Confirmar'}
                </button>

            </motion.div>
        </AnimatePresence>
    );
};
