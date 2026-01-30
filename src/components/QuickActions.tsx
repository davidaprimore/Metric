import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const actions = [
    { id: 'health', icon: '❤️', label: 'Minha Saúde', bg: 'bg-[#FFF0E0]' },
    { id: 'schedule', icon: '📅', label: 'Agendar', bg: 'bg-[#F3E8F7]' },
    { id: 'diet', icon: '🥗', label: 'Dieta', bg: 'bg-[#E6F7F0]' },
    { id: 'meds', icon: '💊', label: 'Remédios', bg: 'bg-[#E6F0FF]' },
    { id: 'exams', icon: '📋', label: 'Exames', bg: 'bg-[#FFF9E6]' },
    { id: 'evolution', icon: '📈', label: 'Evolução', bg: 'bg-[#F0E6FF]' },
    { id: 'chat', icon: '💬', label: 'Chat', bg: 'bg-[#FFE6F0]' },
    { id: 'emergency', icon: '🚨', label: 'Emergência', bg: 'bg-[#FFE6E6]' },
];

interface QuickActionsProps {
    onActionClick?: (actionId: string) => void;
}

export function QuickActions({ onActionClick }: QuickActionsProps) {
    const [showMore, setShowMore] = useState(false);

    return (
        <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-[Outfit] text-[18px] font-bold text-[#3D2646]">Ações Rápidas</h3>
                <button
                    onClick={() => setShowMore(!showMore)}
                    className="text-[13px] text-[#9B6AB0] font-semibold flex items-center gap-1 px-3 py-1 rounded-full hover:bg-[#F3E8F7]"
                >
                    {showMore ? 'Ver menos' : 'Mostrar mais'}
                    <span className={`transition-transform inline-block ${showMore ? 'rotate-180' : ''}`}>↓</span>
                </button>
            </div>

            <div className="grid grid-cols-4 gap-3 mb-2">
                {actions.slice(0, 4).map((action, i) => (
                    <ActionBtn key={action.id} action={action} delay={i * 0.05} onClick={() => onActionClick?.(action.id)} />
                ))}
            </div>

            <AnimatePresence>
                {showMore && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="grid grid-cols-4 gap-3 pt-3 border-t border-[#E8D5F0] mt-3">
                            {actions.slice(4).map((action, i) => (
                                <ActionBtn key={action.id} action={action} delay={i * 0.05} onClick={() => onActionClick?.(action.id)} />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function ActionBtn({ action, delay, onClick }: { action: typeof actions[0], delay: number, onClick: () => void }) {
    return (
        <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            onClick={onClick}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center gap-2"
        >
            <div className={`w-full aspect-square ${action.bg} rounded-[18px] flex items-center justify-center text-[28px]`}>
                {action.icon}
            </div>
            <span className="text-[11px] font-semibold text-[#2D2A32] text-center leading-tight">{action.label}</span>
        </motion.button>
    );
}
