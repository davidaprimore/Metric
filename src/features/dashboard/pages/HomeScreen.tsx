import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/Layout';

export default function HomeScreen() {
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Bom dia');
        else if (hour < 18) setGreeting('Boa tarde');
        else setGreeting('Boa noite');
    }, []);

    // Container de animação - tudo nasce subindo
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
    };

    return (
        <Layout>
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="bg-lavender-bg min-h-screen p-5 pb-32"
            >
                {/* Header com emoji animado */}
                <motion.div variants={item} className="mb-8 pt-4">
                    <p className="text-ink-muted text-lg mb-1">{greeting},</p>
                    <h1 className="text-4xl font-display font-bold text-lavender-900 flex items-center gap-3">
                        David
                        <motion.span
                            animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        >
                            👋
                        </motion.span>
                    </h1>
                </motion.div>

                {/* Métricas com "glass effect" sutil */}
                <motion.div variants={item} className="grid grid-cols-3 gap-3 mb-8">
                    {[
                        { val: '12', label: 'Dias', color: 'from-orange-400 to-red-400' },
                        { val: '8', label: 'Consultas', color: 'from-lavender-400 to-lavender-600' },
                        { val: '85%', label: 'Saúde', color: 'from-green-400 to-emerald-400' }
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -8, transition: { duration: 0.2 } }}
                            whileTap={{ scale: 0.95 }}
                            className="card-alive p-4 text-center cursor-pointer"
                        >
                            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${stat.color} mx-auto mb-2 opacity-80`} />
                            <p className="text-2xl font-bold text-lavender-900">{stat.val}</p>
                            <p className="text-xs text-ink-muted font-medium uppercase tracking-wider">{stat.label}</p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Ações Rápidas - ICÔNICAS */}
                <motion.div variants={item} className="mb-8">
                    <h3 className="font-display font-bold text-xl text-lavender-900 mb-4">Ações Rápidas</h3>
                    <div className="grid grid-cols-4 gap-4">
                        {[
                            { icon: 'fa-heartbeat', label: 'Saúde', cls: 'icon-health' },
                            { icon: 'fa-calendar-alt', label: 'Agendar', cls: 'icon-schedule' },
                            { icon: 'fa-pills', label: 'Remédios', cls: 'icon-meds' },
                            { icon: 'fa-clipboard-check', label: 'Exames', cls: 'icon-exams' }
                        ].map((action, i) => (
                            <motion.button
                                key={i}
                                whileHover={{ scale: 1.15, y: -5 }}
                                whileTap={{ scale: 0.9 }}
                                className="flex flex-col items-center gap-2"
                            >
                                <div className={`w-14 h-14 rounded-2xl ${action.cls} flex items-center justify-center text-white shadow-lg`}>
                                    <i className={`fas ${action.icon} text-xl`}></i>
                                </div>
                                <span className="text-xs font-semibold text-ink">{action.label}</span>
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                {/* Tabs eleganets */}
                <motion.div variants={item} className="mb-6">
                    <div className="flex items-center gap-4 mb-4">
                        <h3 className="font-bold text-lg text-lavender-900">Próximos</h3>
                        <span className="bg-lavender-200 text-lavender-800 text-xs font-bold px-2 py-1 rounded-full">2</span>
                        <span className="text-ink-muted text-sm ml-auto">Para Você</span>
                    </div>
                </motion.div>

                {/* CARDS DE CONSULTA COM "VIDA" */}
                <motion.div variants={item} className="space-y-4">
                    <motion.div
                        whileHover={{ x: 8, transition: { duration: 0.2 } }}
                        className="card-alive p-5 flex items-center gap-4 cursor-pointer"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-100 to-green-50 flex flex-col items-center justify-center border-2 border-green-200">
                            <span className="text-[10px] font-bold text-green-600 uppercase">HOJE</span>
                            <span className="text-xl font-bold text-green-700">14:00</span>
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-lg text-lavender-900">Dra. Ana Paula</h4>
                            <p className="text-ink-muted text-sm mb-1">Nutricionista</p>
                            <span className="inline-block bg-green-100 text-green-700 text-[10px] font-bold px-3 py-1 rounded-full">
                                ✓ Confirmado
                            </span>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-12 h-12 rounded-full bg-lavender-100 text-lavender-600 flex items-center justify-center"
                        >
                            <i className="fas fa-video"></i>
                        </motion.button>
                    </motion.div>

                    <motion.div
                        whileHover={{ x: 8, transition: { duration: 0.2 } }}
                        className="card-alive p-5 flex items-center gap-4 cursor-pointer opacity-70"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-100 to-yellow-50 flex flex-col items-center justify-center border-2 border-yellow-200">
                            <span className="text-[10px] font-bold text-yellow-600 uppercase">QUA</span>
                            <span className="text-xl font-bold text-yellow-700">10:00</span>
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-lg text-lavender-900">Dr. Carlos</h4>
                            <p className="text-ink-muted text-sm mb-1">Fisioterapia</p>
                            <span className="inline-block bg-yellow-100 text-yellow-700 text-[10px] font-bold px-3 py-1 rounded-full">
                                ⏳ Pendente
                            </span>
                        </div>
                    </motion.div>
                </motion.div>
            </motion.div>
        </Layout>
    );
}
