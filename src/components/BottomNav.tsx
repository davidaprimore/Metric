import { useState } from 'react';
import { motion } from 'framer-motion';

const navItems = [
    { id: 'home', icon: '🏠', label: 'Início' },
    { id: 'search', icon: '🔍', label: 'Buscar' },
    { id: 'add', icon: '+', label: '', isFab: true },
    { id: 'calendar', icon: '📅', label: 'Agenda' },
    { id: 'profile', icon: '👤', label: 'Perfil' },
];

export function BottomNav() {
    const [activeTab, setActiveTab] = useState('home');

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-[#E8D5F0] px-6 py-2 max-w-[430px] mx-auto z-50 pb-safe">
            <div className="flex justify-between items-end relative">
                {navItems.map((item) => {
                    const isActive = activeTab === item.id;

                    if (item.isFab) {
                        return (
                            <div key={item.id} className="relative -top-6">
                                <motion.button
                                    whileHover={{ scale: 1.1, rotate: 180 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setActiveTab(item.id)}
                                    className="w-16 h-16 bg-gradient-to-br from-[#C8A4D4] to-[#9B6AB0] rounded-full flex items-center justify-center text-white text-3xl shadow-lg shadow-[#9B6AB0]/40 border-4 border-[#FAF8FC] relative overflow-hidden"
                                >
                                    {/* Ripple effect no botão */}
                                    <motion.div
                                        className="absolute inset-0 bg-white/20"
                                        initial={false}
                                        animate={activeTab === item.id ? { scale: [0, 2], opacity: [0.5, 0] } : {}}
                                        transition={{ duration: 0.6 }}
                                    />
                                    <span className="relative z-10 font-light">{item.icon}</span>
                                </motion.button>
                            </div>
                        );
                    }

                    return (
                        <motion.button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className="flex flex-col items-center gap-1 py-2 px-3 relative"
                            whileTap={{ scale: 0.9 }}
                        >
                            <motion.div
                                animate={isActive ? { y: -2, scale: 1.1 } : { y: 0, scale: 1 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                className={`text-2xl ${isActive ? 'filter drop-shadow-lg' : 'grayscale opacity-60'}`}
                            >
                                {item.icon}
                            </motion.div>

                            <motion.span
                                animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.6, y: 0 }}
                                className={`text-[10px] font-bold ${isActive ? 'text-[#9B6AB0]' : 'text-[#8B8591]'}`}
                            >
                                {item.label}
                            </motion.span>

                            {/* Indicador de ativo */}
                            {isActive && (
                                <motion.div
                                    layoutId="tab-indicator"
                                    className="absolute -bottom-2 w-1 h-1 bg-[#9B6AB0] rounded-full"
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}
                        </motion.button>
                    );
                })}
            </div>
        </nav>
    );
}
