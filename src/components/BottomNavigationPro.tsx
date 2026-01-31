import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
    Home,
    Users,
    DollarSign,
    UserCircle,
    Search
} from 'lucide-react';

// Calendário dinâmico estilo iOS
function CalendarIcon({ isActive }: { isActive: boolean }) {
    const [day, setDay] = useState('');

    useEffect(() => {
        setDay(new Date().getDate().toString());
    }, []);

    return (
        <div className="relative flex flex-col items-center">
            <div className={`w-6 h-6 rounded-md border-2 flex flex-col items-center justify-center transition-colors ${isActive ? 'border-purple-600 bg-purple-50' : 'border-gray-400'
                }`}>
                <div className={`w-full h-1.5 rounded-t-[2px] ${isActive ? 'bg-purple-600' : 'bg-gray-400'}`} />
                <span className={`text-[10px] font-bold leading-none mt-0.5 ${isActive ? 'text-purple-600' : 'text-gray-600'}`}>
                    {day}
                </span>
            </div>
        </div>
    );
}

const navItems = [
    { id: 'dashboard', label: 'Início', icon: Home },
    { id: 'agenda', label: 'Agenda', icon: CalendarIcon, isCustom: true },
    { id: 'patients', label: 'Pacientes', icon: Users, isCenter: true },
    { id: 'finance', label: 'Financeiro', icon: DollarSign },
    { id: 'profile', label: 'Perfil', icon: UserCircle },
];

export function BottomNavigationPro({
    currentScreen,
    onNavigate
}: {
    currentScreen: string;
    onNavigate: (screen: string) => void;
}) {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
            {/* Background blur style matching Client */}
            <div className="absolute inset-0 bg-white/80 backdrop-blur-xl border-t border-gray-200/50" />

            <nav className="relative flex items-center justify-around px-2 py-2 max-w-lg mx-auto">
                {navItems.map((item) => {
                    const isActive = currentScreen === item.id;
                    const isCenter = item.isCenter;

                    if (isCenter) {
                        return (
                            <motion.button
                                key={item.id}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => onNavigate(item.id)}
                                className="relative -mt-8 group"
                            >
                                <div className={`w-14 h-14 bg-gradient-to-tr from-purple-600 to-purple-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white transition-all ${isActive ? 'shadow-purple-600/40' : 'shadow-purple-600/20'
                                    }`}>
                                    <Users className="w-6 h-6 text-white" strokeWidth={2.5} />
                                </div>
                                <span className={`absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-semibold ${isActive ? 'text-purple-600' : 'text-gray-400'
                                    }`}>
                                    {item.label}
                                </span>

                                {isActive && (
                                    <motion.div
                                        layoutId="activeCenterPro"
                                        className="absolute inset-0 rounded-full border-4 border-purple-200"
                                        initial={{ scale: 1 }}
                                        animate={{ scale: 1.2, opacity: 0 }}
                                        transition={{ repeat: Infinity, duration: 1.5 }}
                                    />
                                )}
                            </motion.button>
                        );
                    }

                    return (
                        <motion.button
                            key={item.id}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => onNavigate(item.id)}
                            className="flex flex-col items-center gap-1 py-2 px-3 relative flex-1"
                        >
                            {item.isCustom ? (
                                <item.icon isActive={isActive} />
                            ) : (
                                <item.icon
                                    className={`w-6 h-6 transition-all duration-300 ${isActive
                                            ? 'text-purple-600 stroke-[2.5px]'
                                            : 'text-gray-400 stroke-[1.5px]'
                                        }`}
                                />
                            )}

                            <span className={`text-[10px] font-semibold transition-colors ${isActive ? 'text-purple-600' : 'text-gray-400'
                                }`}>
                                {item.label}
                            </span>

                            {isActive && (
                                <motion.div
                                    layoutId="activeTabPro"
                                    className="absolute -bottom-1 w-1 h-1 bg-purple-600 rounded-full"
                                />
                            )}
                        </motion.button>
                    );
                })}
            </nav>
        </div>
    );
}
