import { motion } from 'framer-motion';

interface NavItem {
    icon: string;
    label: string;
    id: string;
    isAction?: boolean;
}

const navItems: NavItem[] = [
    { icon: 'fas fa-home', label: 'Início', id: 'home' },
    { icon: 'fas fa-search', label: 'Buscar', id: 'search' },
    { icon: 'fas fa-plus', label: 'Agendar', id: 'book', isAction: true },
    { icon: 'fas fa-calendar', label: 'Agenda', id: 'calendar' },
    { icon: 'fas fa-user', label: 'Perfil', id: 'profile' },
];

export function BottomNav({ activeTab = 'home', onTabChange }: {
    activeTab: string;
    onTabChange: (tab: string) => void;
}) {
    return (
        <div className="bottom-nav-fixed">
            <div className="max-w-md mx-auto flex justify-around items-center py-3 px-2 relative">
                {navItems.map((item) => {
                    const isActive = activeTab === item.id;

                    // Botão de ação central (flutuante)
                    if (item.isAction) {
                        return (
                            <motion.button
                                key={item.id}
                                onClick={() => onTabChange(item.id)}
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.8 }}
                                className="btn-floating relative -top-8 w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl"
                            >
                                <i className="fas fa-plus"></i>
                            </motion.button>
                        );
                    }

                    // Itens normais
                    return (
                        <motion.button
                            key={item.id}
                            onClick={() => onTabChange(item.id)}
                            className={`flex flex-col items-center gap-1 p-2 relative cursor-pointer ${isActive ? 'text-lavender-600' : 'text-lavender-400'
                                }`}
                            whileTap={{ scale: 0.9 }}
                        >
                            <motion.i
                                className={`${item.icon} text-xl`}
                                animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                            />
                            <span className="text-[10px] font-medium">{item.label}</span>

                            {/* Indicador de ativo */}
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute -bottom-1 w-1 h-1 rounded-full bg-lavender-600"
                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                />
                            )}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
