import { motion, AnimatePresence } from 'framer-motion';
import { BottomNav } from './BottomNav';
import { Logo } from './Logo';
import { useState, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
    children: ReactNode;
    header?: 'default' | 'minimal' | 'hidden';
    showNav?: boolean;
}

export function Layout({ children, header = 'default', showNav = true }: LayoutProps) {
    const [activeTab, setActiveTab] = useState('home');
    const location = useLocation();

    return (
        <div className="min-h-screen bg-background max-w-md mx-auto relative shadow-2xl overflow-hidden">
            {/* Header fixo com blur */}
            {header !== 'hidden' && (
                <motion.header
                    className="fixed top-0 left-0 right-0 max-w-md mx-auto z-40 bg-white/80 backdrop-blur-md 
                     border-b border-lavender-100 px-5 py-4"
                    initial={{ y: -100 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className="flex justify-between items-center">
                        {header === 'default' ? (
                            <>
                                <Logo size="sm" />
                                <button className="w-10 h-10 rounded-full bg-lavender-50 flex items-center justify-center 
                                 text-lavender-600 hover:bg-lavender-100 transition-colors relative cursor-pointer">
                                    <i className="fas fa-bell"></i>
                                    <span className="absolute top-2 right-2 w-2 h-2 bg-coral-500 rounded-full border-2 border-white"></span>
                                </button>
                            </>
                        ) : (
                            <button className="text-lavender-800 cursor-pointer">
                                <i className="fas fa-arrow-left text-xl"></i>
                            </button>
                        )}
                    </div>
                </motion.header>
            )}

            {/* Conteúdo principal com padding para header e nav */}
            <main className={showNav ? 'safe-container' : 'pt-20 px-5 pb-10 min-h-screen'}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Navegação inferior (sempre por cima de tudo) */}
            {showNav && (
                <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
            )}
        </div>
    );
}
