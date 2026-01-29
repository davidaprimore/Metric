import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '@/components/Layout';

const quickActions = [
    { icon: 'fa-heartbeat', label: 'Minha Saúde', color: 'from-red-400 to-pink-500', route: '/health' },
    { icon: 'fa-calendar-alt', label: 'Agendar', color: 'from-lavender-400 to-lavender-600', route: '/search' },
    { icon: 'fa-pills', label: 'Remédios', color: 'from-blue-400 to-blue-600', route: '/meds' },
    { icon: 'fa-file-medical', label: 'Exames', color: 'from-teal-400 to-teal-600', route: '/exams' },
];

const upcomingAppointments = [
    { id: 1, doctor: 'Dra. Ana Paula', type: 'Nutrição', time: '14:00', date: 'Hoje', status: 'confirmed' },
    { id: 2, doctor: 'Dr. Carlos', type: 'Fisioterapia', time: '10:00', date: 'Quarta', status: 'pending' },
];

const recommendations = [
    { id: 1, title: 'Yoga para ansiedade', duration: '20 min', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400', type: 'video' },
    { id: 2, title: 'Meditação guiada', duration: '10 min', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400', type: 'audio' },
];

export default function HomeScreen() {
    const [greeting, setGreeting] = useState('');
    const [selectedTab, setSelectedTab] = useState('upcoming');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Bom dia');
        else if (hour < 18) setGreeting('Boa tarde');
        else setGreeting('Boa noite');
    }, []);

    return (
        <Layout header="default" showNav={true}>
            {/* Header Personalizado */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <p className="text-ink-muted mb-1">{greeting},</p>
                <h1 className="font-display text-3xl font-bold text-lavender-900">
                    David <motion.span
                        animate={{ rotate: [0, 20, -20, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        className="inline-block"
                    >👋</motion.span>
                </h1>
            </motion.div>

            {/* Métricas de Saúde (Gamificação) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-3 gap-4 mb-8"
            >
                {[
                    { label: 'Dias Seguidos', value: 12, icon: 'fa-fire', color: 'text-orange-500', bg: 'bg-orange-50' },
                    { label: 'Consultas', value: 8, icon: 'fa-calendar-check', color: 'text-lavender-600', bg: 'bg-lavender-50' },
                    { label: 'Saúde', value: '85%', icon: 'fa-heart', color: 'text-green-500', bg: 'bg-green-50' },
                ].map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="bg-white rounded-2xl p-4 shadow-soft text-center border border-lavender-100"
                    >
                        <div className={`w-10 h-10 ${stat.bg} rounded-full flex items-center justify-center mx-auto mb-2`}>
                            <i className={`fas ${stat.icon} ${stat.color}`}></i>
                        </div>
                        <motion.p
                            className="text-2xl font-bold text-lavender-900"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3 + i * 0.1, type: 'spring' }}
                        >
                            {stat.value}
                        </motion.p>
                        <p className="text-xs text-ink-muted">{stat.label}</p>
                    </motion.div>
                ))}
            </motion.div>

            {/* Ações Rápidas */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
            >
                <h3 className="font-display font-bold text-lg text-lavender-900 mb-4">Ações Rápidas</h3>
                <div className="grid grid-cols-4 gap-4">
                    {quickActions.map((action, i) => (
                        <motion.button
                            key={action.label}
                            whileHover={{ scale: 1.1, y: -5 }}
                            whileTap={{ scale: 0.9 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + i * 0.05 }}
                            className="flex flex-col items-center gap-2 cursor-pointer"
                        >
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${action.color} 
                            flex items-center justify-center text-white shadow-lg`}>
                                <i className={`fas ${action.icon} text-xl`}></i>
                            </div>
                            <span className="text-xs font-medium text-ink-muted">{action.label}</span>
                        </motion.button>
                    ))}
                </div>
            </motion.div>

            {/* Tabs: Próximos vs Recomendações */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-6"
            >
                <div className="flex gap-6 mb-4 border-b border-lavender-200">
                    {[
                        { id: 'upcoming', label: 'Próximos', count: 2 },
                        { id: 'recommendations', label: 'Para Você', count: null }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setSelectedTab(tab.id)}
                            className={`pb-3 relative font-semibold text-sm transition-colors cursor-pointer
                ${selectedTab === tab.id ? 'text-lavender-900' : 'text-ink-muted'}`}
                        >
                            {tab.label}
                            {tab.count && (
                                <span className="ml-2 px-2 py-0.5 bg-lavender-200 rounded-full text-xs text-lavender-800">
                                    {tab.count}
                                </span>
                            )}
                            {selectedTab === tab.id && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-lavender-600"
                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                />
                            )}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {selectedTab === 'upcoming' ? (
                        <motion.div
                            key="upcoming"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-3"
                        >
                            {upcomingAppointments.map((apt, i) => (
                                <motion.div
                                    key={apt.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    whileHover={{ x: 5 }}
                                    className="bg-white rounded-2xl p-4 shadow-soft border border-lavender-100 flex items-center gap-4 cursor-pointer"
                                >
                                    <div className={`w-16 h-16 rounded-xl flex flex-col items-center justify-center
                    ${apt.status === 'confirmed' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                                        <span className="text-xs font-medium uppercase">{apt.date}</span>
                                        <span className="text-lg font-bold">{apt.time}</span>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-lavender-900">{apt.doctor}</h4>
                                        <p className="text-sm text-ink-muted">{apt.type}</p>
                                        <span className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full
                      ${apt.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {apt.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
                                        </span>
                                    </div>
                                    <button className="w-10 h-10 rounded-full bg-lavender-50 flex items-center justify-center text-lavender-600">
                                        <i className="fas fa-video"></i>
                                    </button>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="recommendations"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 snap-x"
                        >
                            {recommendations.map((rec) => (
                                <motion.div
                                    key={rec.id}
                                    whileHover={{ scale: 1.02 }}
                                    className="flex-shrink-0 w-64 snap-center cursor-pointer"
                                >
                                    <div className="relative h-40 rounded-2xl overflow-hidden mb-3">
                                        <img src={rec.image} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                        <div className="absolute bottom-3 left-3 text-white">
                                            <span className="text-xs opacity-80 flex items-center gap-1">
                                                <i className={`fas fa-${rec.type === 'video' ? 'play-circle' : 'headphones'}`}></i>
                                                {rec.duration}
                                            </span>
                                        </div>
                                    </div>
                                    <h4 className="font-semibold text-lavender-900 text-sm">{rec.title}</h4>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </Layout>
    );
}
