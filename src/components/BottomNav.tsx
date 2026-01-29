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
                                className="relative -top-6 w-14 h-14 rounded-full bg-gradient-to-br from-lavender-400 
                         to-lavender-600 text-white shadow-glow flex items-center justify-center
                         hover:shadow-lift transition-shadow cursor-pointer"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                            >
                                <i className={`${item.icon} text-xl`}></i>
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
