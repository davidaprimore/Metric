import { motion } from 'framer-motion';
import {
    ArrowLeft,
    User,
    CreditCard,
    Bell,
    HelpCircle,
    Shield,
    LogOut,
    ChevronRight,
    Moon,
    Mail
} from 'lucide-react';

export function SettingsScreen({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    if (!isOpen) return null;

    const menuItems = [
        { icon: User, label: 'Editar Perfil', color: 'text-purple-600', bg: 'bg-purple-100' },
        { icon: CreditCard, label: 'Formas de Pagamento', color: 'text-blue-600', bg: 'bg-blue-100' },
        { icon: Bell, label: 'Notificações', color: 'text-orange-600', bg: 'bg-orange-100', badge: '2' },
        { icon: Moon, label: 'Tema Escuro', color: 'text-indigo-600', bg: 'bg-indigo-100', toggle: true },
        { icon: Shield, label: 'Privacidade e Segurança', color: 'text-green-600', bg: 'bg-green-100' },
        { icon: HelpCircle, label: 'Ajuda e Suporte', color: 'text-pink-600', bg: 'bg-pink-100' },
    ];

    return (
        <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-gray-50 z-50 flex flex-col"
        >
            {/* Header */}
            <div className="bg-white px-6 pt-safe pb-4 border-b border-gray-100 flex items-center gap-4 sticky top-0 z-10">
                <button onClick={onClose} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft className="w-6 h-6 text-gray-700" />
                </button>
                <h1 className="text-xl font-bold text-gray-800">Configurações</h1>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Profile Card */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-4"
                >
                    <div className="relative">
                        <img
                            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop"
                            className="w-20 h-20 rounded-full object-cover border-4 border-purple-50"
                        />
                        <button className="absolute bottom-0 right-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        </button>
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-gray-800">David Oliveira</h2>
                        <p className="text-gray-500 text-sm mb-1">Paciente desde 2024</p>
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                            <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> david@email.com</span>
                        </div>
                    </div>
                </motion.div>

                {/* Menu Items */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
                >
                    {menuItems.map((item, idx) => (
                        <motion.button
                            key={item.label}
                            whileHover={{ x: 4 }}
                            whileTap={{ scale: 0.98 }}
                            className={`w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors ${idx !== menuItems.length - 1 ? 'border-b border-gray-100' : ''
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 ${item.bg} rounded-xl flex items-center justify-center ${item.color}`}>
                                    <item.icon className="w-5 h-5" />
                                </div>
                                <span className="font-semibold text-gray-700">{item.label}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {item.badge && (
                                    <span className="w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                        {item.badge}
                                    </span>
                                )}
                                {item.toggle ? (
                                    <div className="w-10 h-6 bg-gray-200 rounded-full relative">
                                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow" />
                                    </div>
                                ) : (
                                    <ChevronRight className="w-5 h-5 text-gray-400" />
                                )}
                            </div>
                        </motion.button>
                    ))}
                </motion.div>

                {/* Logout Button */}
                <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 bg-red-50 text-red-600 font-bold rounded-2xl flex items-center justify-center gap-2 border border-red-100"
                >
                    <LogOut className="w-5 h-5" />
                    Sair da Conta
                </motion.button>

                <p className="text-center text-xs text-gray-400">Versão 1.0.2 Build 235</p>
            </div>
        </motion.div>
    );
}
