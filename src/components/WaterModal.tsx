import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface WaterModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const WATER_GOAL_DEFAULT = 2000; // ml
const CUP_SIZE = 250; // ml por copo

const tips = [
    "💡 Beber água antes das refeições ajuda na saciedade",
    "🧠 75% do cérebro é composto por água. Hidrate-se para melhor foco!",
    "✨ Pele hidratada é pele saudável. Beba pelo menos 8 copos por dia",
    "🚀 A desidratação reduz a performance física em até 30%",
    "😴 Cansaço pode ser sinal de desidratação. Experimente um copo de água!"
];

export function WaterModal({ isOpen, onClose }: WaterModalProps) {
    const [consumed, setConsumed] = useState(1200);
    const [goal, setGoal] = useState(WATER_GOAL_DEFAULT);
    const [showSettings, setShowSettings] = useState(false);
    const [currentTip, setCurrentTip] = useState(0);

    const percentage = Math.min((consumed / goal) * 100, 100);
    const remaining = Math.max(goal - consumed, 0);
    const cups = Math.floor(consumed / CUP_SIZE);

    useEffect(() => {
        if (isOpen) {
            const interval = setInterval(() => {
                setCurrentTip(prev => (prev + 1) % tips.length);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [isOpen]);

    const addWater = (amount: number) => {
        setConsumed(prev => Math.min(prev + amount, goal + 1000));
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-[#3D2646]/60 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ scale: 0.9, y: 100, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.9, y: 100, opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-[400px] bg-white rounded-t-[32px] sm:rounded-[32px] overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="relative bg-gradient-to-b from-blue-50 to-white p-6 pb-8">
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center text-[#3D2646] z-10"
                            >
                                ✕
                            </button>

                            <div className="text-center mb-2">
                                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-bold mb-2">
                                    💧 Hidratação Diária
                                </span>
                                <h2 className="font-[Outfit] text-2xl font-bold text-[#3D2646]">
                                    {remaining > 0 ? 'Falta pouco!' : 'Meta batida! 🎉'}
                                </h2>
                                <p className="text-[#8B8591] text-sm mt-1">
                                    {remaining > 0
                                        ? `Faltam ${remaining}ml para atingir sua meta`
                                        : 'Você superou sua meta diária!'}
                                </p>
                            </div>

                            {/* Garrafa/Copo Animado - Centro */}
                            <div className="flex justify-center items-center py-6 relative">
                                {/* Container da garrafa */}
                                <div className="relative w-32 h-48">
                                    {/* Bolhas animadas */}
                                    {[...Array(5)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            className="absolute w-2 h-2 bg-blue-300/50 rounded-full"
                                            style={{ left: `${20 + i * 20}%`, bottom: '20%' }}
                                            animate={{
                                                y: [-20, -100],
                                                opacity: [0, 1, 0],
                                                scale: [0.5, 1, 0.5]
                                            }}
                                            transition={{
                                                duration: 2 + i * 0.5,
                                                repeat: Infinity,
                                                delay: i * 0.3,
                                                ease: "easeOut"
                                            }}
                                        />
                                    ))}

                                    {/* Garrafa */}
                                    <div className="absolute inset-x-4 top-0 bottom-0 border-4 border-blue-200 rounded-b-3xl rounded-t-lg bg-white/30 backdrop-blur-sm overflow-hidden">
                                        {/* Água animada */}
                                        <motion.div
                                            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-500 to-blue-400"
                                            initial={{ height: '0%' }}
                                            animate={{ height: `${percentage}%` }}
                                            transition={{ type: "spring", damping: 20, stiffness: 100 }}
                                        >
                                            {/* Superfície da água */}
                                            <motion.div
                                                className="absolute top-0 left-0 right-0 h-2 bg-blue-300"
                                                animate={{
                                                    scaleX: [1, 1.1, 1],
                                                    opacity: [0.5, 1, 0.5]
                                                }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Infinity,
                                                    ease: "easeInOut"
                                                }}
                                            />
                                        </motion.div>

                                        {/* Marcadores */}
                                        <div className="absolute inset-0 flex flex-col justify-between py-4 px-1 pointer-events-none">
                                            {[75, 50, 25].map(mark => (
                                                <div key={mark} className="flex items-center gap-1">
                                                    <div className="w-2 h-0.5 bg-blue-200"></div>
                                                    <span className="text-[10px] text-blue-300 font-bold">{mark}%</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Bocal da garrafa */}
                                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-4 bg-blue-200 rounded-t-xl"></div>
                                </div>

                                {/* Estatísticas ao lado */}
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 space-y-3">
                                    <div className="bg-blue-50 px-3 py-2 rounded-xl text-center">
                                        <div className="text-2xl font-bold text-blue-600">{cups}</div>
                                        <div className="text-[10px] text-blue-400 uppercase font-bold">Copos</div>
                                    </div>
                                    <div className="bg-lavender-50 px-3 py-2 rounded-xl text-center">
                                        <div className="text-xl font-bold text-[#9B6AB0]">{Math.round(percentage)}%</div>
                                        <div className="text-[10px] text-[#9B6AB0] uppercase font-bold">Meta</div>
                                    </div>
                                </div>
                            </div>

                            {/* Botões de ação rápida */}
                            <div className="flex gap-3 justify-center mt-4">
                                {[200, 250, 500].map(amount => (
                                    <motion.button
                                        key={amount}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => addWater(amount)}
                                        className="flex-1 bg-blue-500 text-white py-3 rounded-2xl font-bold text-sm shadow-lg shadow-blue-200"
                                    >
                                        +{amount}ml
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Corpo */}
                        <div className="p-6 space-y-6">
                            {/* Dica rotativa */}
                            <motion.div
                                key={currentTip}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="bg-gradient-to-r from-blue-50 to-lavender-50 p-4 rounded-2xl border border-blue-100"
                            >
                                <p className="text-sm text-[#3D2646] leading-relaxed font-medium">
                                    {tips[currentTip]}
                                </p>
                            </motion.div>

                            {/* Configurações */}
                            <div>
                                <button
                                    onClick={() => setShowSettings(!showSettings)}
                                    className="flex items-center justify-between w-full text-left mb-3"
                                >
                                    <span className="font-semibold text-[#3D2646]">⚙️ Configurar Meta</span>
                                    <motion.span animate={{ rotate: showSettings ? 180 : 0 }}>▼</motion.span>
                                </button>

                                <AnimatePresence>
                                    {showSettings && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="p-4 bg-[#F5F0F7] rounded-2xl space-y-4">
                                                <div>
                                                    <label className="text-sm text-[#8B8591] mb-2 block">Meta diária (ml)</label>
                                                    <div className="flex gap-2 mb-3">
                                                        {[1500, 2000, 2500, 3000].map(val => (
                                                            <button
                                                                key={val}
                                                                onClick={() => setGoal(val)}
                                                                className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${goal === val
                                                                        ? 'bg-[#9B6AB0] text-white'
                                                                        : 'bg-white text-[#3D2646] border border-[#E8D5F0]'
                                                                    }`}
                                                            >
                                                                {val / 1000}L
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <input
                                                        type="range"
                                                        min="1000"
                                                        max="4000"
                                                        step="100"
                                                        value={goal}
                                                        onChange={(e) => setGoal(Number(e.target.value))}
                                                        className="w-full accent-[#9B6AB0]"
                                                    />
                                                    <div className="text-center text-sm font-bold text-[#9B6AB0] mt-2">
                                                        {goal}ml
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="text-sm text-[#8B8591] mb-2 block">Lembretes</label>
                                                    <div className="flex items-center justify-between p-3 bg-white rounded-xl">
                                                        <span className="text-sm text-[#3D2646]">Notificar a cada 1 hora</span>
                                                        <div className="w-12 h-6 bg-[#9B6AB0] rounded-full relative cursor-pointer">
                                                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Histórico rápido */}
                            <div>
                                <h3 className="font-semibold text-[#3D2646] mb-3 text-sm">Hoje</h3>
                                <div className="space-y-2">
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-[#FAF8FC] rounded-xl border border-[#E8D5F0]">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-500">
                                                    💧
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold text-[#3D2646]">+250ml</div>
                                                    <div className="text-xs text-[#8B8591]">{10 + i * 3}:00</div>
                                                </div>
                                            </div>
                                            <button className="text-red-400 text-xs font-bold hover:text-red-600">
                                                Desfazer
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
