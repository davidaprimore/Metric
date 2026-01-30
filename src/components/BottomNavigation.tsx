import { motion } from 'framer-motion';
import { Home, Search, User, FileText } from 'lucide-react';
import { useEffect, useState } from 'react';

// Ícone de Calendário Dinâmico (estilo iOS)
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

// Ícones estilo Airbnb (stroke fino, minimalista)
const navItems = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'agenda', label: 'Agenda', icon: CalendarIcon, isCustom: true },
    { id: 'search', label: 'Buscar', icon: Search, isCenter: true },
    { id: 'records', label: 'Histórico', icon: FileText },
    { id: 'profile', label: 'Perfil', icon: User },
];

interface BottomNavigationProps {
    currentScreen: string;
    onNavigate: (screen: string) => void;
}

export function BottomNavigation({ currentScreen, onNavigate }: BottomNavigationProps) {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
            {/* Background blur */}
            <div className="absolute inset-0 bg-white/80 backdrop-blur-xl border-t border-gray-200/50" />

            <nav className="relative flex items-center justify-around px-2 py-2 max-w-lg mx-auto">
                {navItems.map((item) => {
                    const isActive = currentScreen === item.id;
                    const isCenter = item.id === 'search';

                    if (isCenter) {
                        return (
                            <motion.button
                                key={item.id}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => onNavigate(item.id)}
                                className="relative -mt-8 group"
                            >
                                <div className="w-14 h-14 bg-gradient-to-tr from-purple-600 to-purple-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-600/30 border-4 border-white">
                                    <Search className="w-6 h-6 text-white" strokeWidth={2.5} />
                                </div>
                                <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-purple-600">
                                    {item.label}
                                </span>

                                {/* Ripple effect quando ativo */}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeCenter"
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
                            onClick={() => onNavigate(item.id)}
                            whileTap={{ scale: 0.9 }}
                            className="flex flex-col items-center gap-1 py-2 px-3 relative"
                        >
                            {item.isCustom ? (
                                <CalendarIcon isActive={isActive} />
                            ) : (
                                <item.icon
                                    className={`w-6 h-6 transition-all duration-300 ${isActive
                                            ? 'text-purple-600 stroke-[2.5px]'
                                            : 'text-gray-400 stroke-[1.5px] group-hover:text-gray-600'
                                        }`}
                                />
                            )}

                            <span className={`text-[10px] font-semibold transition-colors duration-300 ${isActive ? 'text-purple-600' : 'text-gray-400'
                                }`}>
                                {item.label}
                            </span>

                            {/* Indicador de ativo (ponto) */}
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
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
