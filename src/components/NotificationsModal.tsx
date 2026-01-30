import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface Notification {
    id: string;
    type: 'appointment' | 'reminder' | 'achievement' | 'promo';
    title: string;
    message: string;
    time: string;
    read: boolean;
    icon: string;
    color: string;
}

const mockNotifications: Notification[] = [
    { id: '1', type: 'appointment', title: 'Consulta em 30min', message: 'Dra. Ana Paula - Nutricionista', time: 'Agora', read: false, icon: '📅', color: 'bg-lavender-100 text-lavender-600' },
    { id: '2', type: 'reminder', title: 'Hora de beber água!', message: 'Você está há 2h sem se hidratar', time: '10min', read: false, icon: '💧', color: 'bg-blue-100 text-blue-600' },
    { id: '3', type: 'achievement', title: 'Meta atingida!', message: 'Você completou 7 dias seguidos', time: '2h', read: true, icon: '🏆', color: 'bg-yellow-100 text-yellow-600' },
    { id: '4', type: 'promo', title: 'Growth Suplementos', message: 'Whey com 30% OFF exclusivo', time: '5h', read: true, icon: '💪', color: 'bg-green-100 text-green-600' },
];

export function NotificationsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [notifications, setNotifications] = useState(mockNotifications);

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const clearAll = () => {
        setNotifications([]);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed inset-x-0 bottom-0 top-[10%] bg-[#FAF8FC] rounded-t-[32px] z-50 max-w-[430px] mx-auto overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="px-5 pt-6 pb-4 bg-white border-b border-[#E8D5F0] flex justify-between items-center sticky top-0 z-10">
                            <div>
                                <h2 className="font-[Outfit] text-2xl font-bold text-[#3D2646]">Notificações</h2>
                                <p className="text-sm text-[#8B8591] mt-1">Você tem {notifications.filter(n => !n.read).length} não lidas</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 bg-[#F3E8F7] rounded-full flex items-center justify-center text-[#3D2646]"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Actions */}
                        <div className="px-5 py-3 flex gap-3 bg-white border-b border-[#E8D5F0]">
                            <button
                                onClick={markAllRead}
                                className="flex-1 py-2 text-sm font-semibold text-[#9B6AB0] bg-[#F3E8F7] rounded-xl hover:bg-[#E8D5F0] transition-colors"
                            >
                                Marcar todas lidas
                            </button>
                            <button
                                onClick={clearAll}
                                className="flex-1 py-2 text-sm font-semibold text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
                            >
                                Limpar tudo
                            </button>
                        </div>

                        {/* List */}
                        <div className="flex-1 overflow-y-auto p-5 space-y-3">
                            <AnimatePresence mode="popLayout">
                                {notifications.map((notif, index) => (
                                    <motion.div
                                        key={notif.id}
                                        layout
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 100 }}
                                        transition={{ delay: index * 0.05 }}
                                        className={`p-4 rounded-2xl border transition-all cursor-pointer ${notif.read
                                                ? 'bg-white border-[#E8D5F0] opacity-70'
                                                : 'bg-white border-[#9B6AB0] shadow-md shadow-lavender-100'
                                            }`}
                                    >
                                        <div className="flex gap-3">
                                            <div className={`w-12 h-12 ${notif.color} rounded-2xl flex items-center justify-center text-2xl flex-shrink-0`}>
                                                {notif.icon}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h3 className="font-bold text-[#3D2646] text-sm truncate pr-2">{notif.title}</h3>
                                                    <span className="text-xs text-[#8B8591] whitespace-nowrap">{notif.time}</span>
                                                </div>
                                                <p className="text-sm text-[#8B8591] leading-snug">{notif.message}</p>
                                            </div>
                                            {!notif.read && (
                                                <div className="w-2 h-2 bg-[#9B6AB0] rounded-full flex-shrink-0 mt-2"></div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {notifications.length === 0 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-12 text-[#8B8591]"
                                >
                                    <div className="text-6xl mb-4">🔔</div>
                                    <p className="font-[Outfit] text-lg font-semibold text-[#3D2646] mb-2">Tudo limpo!</p>
                                    <p className="text-sm">Você não tem notificações pendentes</p>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
