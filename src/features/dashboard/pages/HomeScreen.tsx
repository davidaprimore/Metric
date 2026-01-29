import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ÍCONES SVG INLINE (funciona 100% garantido)
const Icons = {
    bell: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
    ),
    video: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 7l-7 5 7 5V7z" />
            <rect x="1" y="5" width="15" height="14" rx="2" />
        </svg>
    ),
    chart: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 3v18h18" />
            <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
        </svg>
    ),
    utensils: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
            <path d="M7 2v20" />
            <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
        </svg>
    ),
    fire: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-3-2.5-3-5.5a5.5 5.5 0 0 1 11 0c0 3.5-2 4.5-3 7a2.5 2.5 0 0 0 2.5 2.5 5.48 5.48 0 0 0 1.5-3.5" />
        </svg>
    ),
    droplet: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
        </svg>
    ),
    plus: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
    ),
    chevronRight: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
        </svg>
    ),
    grid: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>,
    heart: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>,
    calendar: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
    fileText: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>,
    activity: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>,
    trendUp: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>,
    pill: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.5 20.5l10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" /><path d="m8.5 8.5l7 7" /></svg>,
};

export default function HomeScreen() {
    const [greeting, setGreeting] = useState('');
    const [activeTab, setActiveTab] = useState('upcoming');
    const [showMoreActions, setShowMoreActions] = useState(false);
    const [selectedMetric, setSelectedMetric] = useState(0);

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Bom dia');
        else if (hour < 18) setGreeting('Boa tarde');
        else setGreeting('Boa noite');
    }, []);

    // Métricas de saúde REAIS (substitua por dados do Supabase)
    const healthMetrics = [
        {
            id: 'fat',
            value: '18.5%',
            label: 'Gordura',
            sublabel: 'Corporal',
            icon: <span className="text-2xl">📊</span>,
            color: 'from-orange-400 to-red-400',
            bg: 'bg-orange-50',
            progress: 65, // 65% da meta
            trend: '-2%',
            alert: false
        },
        {
            id: 'menu',
            value: '1.450',
            label: 'kcal',
            sublabel: 'Cardápio hoje',
            icon: <span className="text-2xl">🥗</span>,
            color: 'from-green-400 to-emerald-500',
            bg: 'bg-green-50',
            progress: 80,
            trend: 'na meta',
            alert: false
        },
        {
            id: 'hydration',
            value: '1.2L',
            label: 'Água',
            sublabel: 'Meta: 2L',
            icon: <span className="text-2xl">💧</span>,
            color: 'from-blue-400 to-cyan-400',
            bg: 'bg-blue-50',
            progress: 60,
            trend: '+500ml',
            alert: true
        },
    ];

    // Ações rápidas EXPANSÍVEIS (estilo C6 Bank)
    const quickActions = [
        { id: 'health', icon: '❤️', label: 'Minha Saúde', color: 'from-red-400 to-pink-500', fullLabel: 'Relatório Completo de Saúde' },
        { id: 'schedule', icon: '📅', label: 'Agendar', color: 'from-lavender-400 to-lavender-600', fullLabel: 'Agendar Nova Consulta' },
        { id: 'diet', icon: '🥗', label: 'Dieta', color: 'from-green-400 to-emerald-500', fullLabel: 'Plano Alimentar' },
        { id: 'meds', icon: '💊', label: 'Remédios', color: 'from-blue-400 to-blue-600', fullLabel: 'Gestão de Medicamentos' },
        // Ocultas inicialmente (aparecem ao expandir)
        { id: 'exams', icon: '📋', label: 'Exames', color: 'from-teal-400 to-teal-600', fullLabel: 'Resultados de Exames' },
        { id: 'evolution', icon: '📈', label: 'Evolução', color: 'from-purple-400 to-purple-600', fullLabel: 'Gráficos de Evolução' },
        { id: 'chat', icon: '💬', label: 'Chat', color: 'from-yellow-400 to-orange-500', fullLabel: 'Conversar com Especialista' },
        { id: 'emergency', icon: '🚨', label: 'Emergência', color: 'from-red-500 to-red-700', fullLabel: 'Contatos de Emergência' },
    ];

    const visibleActions = quickActions.slice(0, 4);
    const hiddenActions = quickActions.slice(4);

    // Consultas (mock)
    const appointments = [
        { id: 1, doctor: 'Dra. Ana Paula', type: 'Nutricionista', time: '14:00', date: 'Hoje', status: 'confirmed', hasVideo: true },
        { id: 2, doctor: 'Dr. Carlos', type: 'Fisioterapeuta', time: '10:00', date: 'Qua', status: 'pending', hasVideo: false },
    ];

    return (
        <div className="min-h-screen bg-background pb-24 max-w-md mx-auto shadow-2xl relative overflow-x-hidden">
            {/* Header com Notificação Funcional */}
            <header className="px-5 pt-6 pb-2 flex justify-between items-center bg-background sticky top-0 z-30">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-lavender-400 to-lavender-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        M
                    </div>
                    <span className="font-display font-bold text-xl text-lavender-900">Metrika</span>
                </div>

                <button className="w-10 h-10 rounded-full bg-white border border-lavender-200 flex items-center justify-center text-lavender-800 hover:bg-lavender-50 transition-colors relative">
                    {Icons.bell}
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
            </header>

            <main className="px-5 pt-4 space-y-6">
                {/* Saudação */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <p className="text-ink-muted text-sm mb-1">{greeting},</p>
                    <h1 className="font-display text-3xl font-bold text-lavender-900 flex items-center gap-2">
                        David <motion.span animate={{ rotate: [0, 20, -20, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}>👋</motion.span>
                    </h1>
                </motion.div>

                {/* CAROUSEL DE MÉTRICAS CLÍNICAS (C6 Bank style) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="relative -mx-5 px-5"
                >
                    <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-8 pt-2 px-1 snap-x snap-mandatory">
                        {healthMetrics.map((metric, index) => (
                            <motion.div
                                key={metric.id}
                                onClick={() => setSelectedMetric(index)}
                                className={`flex-shrink-0 w-40 snap-center rounded-3xl p-4 cursor-pointer transition-all border-2 ${selectedMetric === index ? 'border-lavender-500 shadow-lg scale-105' : 'border-transparent'
                                    } bg-white shadow-soft`}
                                whileHover={{ y: -4 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {/* Header do card */}
                                <div className="flex justify-between items-start mb-3">
                                    <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${metric.color} flex items-center justify-center text-white shadow-md`}>
                                        {metric.icon}
                                    </div>
                                    {metric.alert && (
                                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                                    )}
                                </div>

                                {/* Valor principal */}
                                <div className="mb-2">
                                    <span className="text-2xl font-bold text-lavender-900">{metric.value}</span>
                                    <span className="text-xs text-ink-muted ml-1">{metric.label}</span>
                                </div>

                                {/* Barra de progresso */}
                                <div className="w-full h-1.5 bg-lavender-100 rounded-full overflow-hidden mb-2">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${metric.progress}%` }}
                                        transition={{ duration: 1, delay: 0.5 }}
                                        className={`h-full bg-gradient-to-r ${metric.color}`}
                                    />
                                </div>

                                {/* Trend */}
                                <p className={`text-xs font-medium ${metric.trend.includes('-') ? 'text-green-600' : 'text-lavender-600'}`}>
                                    {metric.trend} {metric.sublabel}
                                </p>
                            </motion.div>
                        ))}

                        {/* Card "Ver Mais" */}
                        <motion.div
                            className="flex-shrink-0 w-24 snap-center rounded-3xl p-4 bg-lavender-50 border-2 border-dashed border-lavender-300 flex flex-col items-center justify-center cursor-pointer"
                            whileHover={{ backgroundColor: '#E8D5F0' }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-lavender-500 mb-2">
                                {Icons.plus}
                            </div>
                            <span className="text-xs font-medium text-lavender-700 text-center">Ver<br />Mais</span>
                        </motion.div>
                    </div>

                    {/* Indicador de página */}
                    <div className="flex justify-center gap-1.5 mt-3">
                        {healthMetrics.map((_, i) => (
                            <div
                                key={i}
                                className={`h-1.5 rounded-full transition-all ${selectedMetric === i ? 'w-6 bg-lavender-600' : 'w-1.5 bg-lavender-200'}`}
                            />
                        ))}
                    </div>
                </motion.div>

                {/* AÇÕES RÁPIDAS - EXPANSÍVEIS (Estilo C6 Bank) */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-display font-bold text-lg text-lavender-900">Ações Rápidas</h3>
                        <motion.button
                            onClick={() => setShowMoreActions(!showMoreActions)}
                            className="text-xs font-semibold text-lavender-600 flex items-center gap-1 bg-lavender-50 px-3 py-1.5 rounded-full"
                            whileTap={{ scale: 0.95 }}
                        >
                            {showMoreActions ? 'Ver menos' : 'Mostrar mais'}
                            <motion.span animate={{ rotate: showMoreActions ? 180 : 0 }}>{Icons.chevronRight}</motion.span>
                        </motion.button>
                    </div>

                    <div className="grid grid-cols-4 gap-4 mb-2">
                        {visibleActions.map((action, i) => (
                            <motion.button
                                key={action.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                                whileHover={{ y: -5, scale: 1.05 }}
                                whileTap={{ scale: 0.9 }}
                                className="flex flex-col items-center gap-2 group"
                            >
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center text-2xl shadow-lg group-hover:shadow-xl transition-shadow`}>
                                    {action.icon}
                                </div>
                                <span className="text-xs font-medium text-ink text-center leading-tight">{action.label}</span>
                            </motion.button>
                        ))}
                    </div>

                    {/* Linha expansível (estilo C6 Bank) */}
                    <AnimatePresence>
                        {showMoreActions && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="grid grid-cols-4 gap-4 pt-4 border-t border-lavender-100 mt-4">
                                    {hiddenActions.map((action, i) => (
                                        <motion.button
                                            key={action.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            transition={{ delay: i * 0.05 }}
                                            whileHover={{ y: -3 }}
                                            className="flex flex-col items-center gap-2 group"
                                        >
                                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center text-2xl shadow-md`}>
                                                {action.icon}
                                            </div>
                                            <span className="text-xs font-medium text-ink">{action.label}</span>
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* TABS FUNCIONANDO */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <div className="flex items-center gap-6 border-b border-lavender-200 pb-1">
                        <button
                            onClick={() => setActiveTab('upcoming')}
                            className={`pb-3 relative font-semibold text-sm transition-colors ${activeTab === 'upcoming' ? 'text-lavender-900' : 'text-ink-muted'}`}
                        >
                            <span>Próximos</span>
                            <span className="ml-2 bg-lavender-200 text-lavender-800 text-xs w-5 h-5 rounded-full inline-flex items-center justify-center font-bold">2</span>
                            {activeTab === 'upcoming' && (
                                <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-lavender-600 rounded-full" />
                            )}
                        </button>

                        <button
                            onClick={() => setActiveTab('foryou')}
                            className={`pb-3 relative font-semibold text-sm transition-colors ${activeTab === 'foryou' ? 'text-lavender-900' : 'text-ink-muted'}`}
                        >
                            Para Você
                            {activeTab === 'foryou' && (
                                <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-lavender-600 rounded-full" />
                            )}
                        </button>
                    </div>

                    {/* CONTEÚDO DAS TABS */}
                    <div className="mt-4 space-y-3">
                        {activeTab === 'upcoming' ? (
                            appointments.map((apt, i) => (
                                <motion.div
                                    key={apt.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    whileHover={{ x: 8 }}
                                    className="bg-white rounded-3xl p-4 shadow-soft border border-lavender-100 flex items-center gap-4 cursor-pointer group"
                                >
                                    <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center flex-shrink-0 ${apt.status === 'confirmed' ? 'bg-green-50 border-2 border-green-200' : 'bg-yellow-50 border-2 border-yellow-200'
                                        }`}>
                                        <span className={`text-[10px] font-bold uppercase ${apt.status === 'confirmed' ? 'text-green-600' : 'text-yellow-600'}`}>{apt.date}</span>
                                        <span className="text-lg font-bold text-lavender-900">{apt.time}</span>
                                    </div>

                                    <div className="flex-1">
                                        <h4 className="font-bold text-lavender-900 text-lg">{apt.doctor}</h4>
                                        <p className="text-ink-muted text-sm mb-1">{apt.type}</p>
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${apt.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {apt.status === 'confirmed' ? '✓ Confirmado' : '⏳ Pendente'}
                                        </span>
                                    </div>

                                    {
                                        apt.hasVideo && (
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="w-12 h-12 rounded-full bg-lavender-50 text-lavender-600 flex items-center justify-center hover:bg-lavender-100 transition-colors"
                                            >
                                                {Icons.video}
                                            </motion.button>
                                        )
                                    }
                                </motion.div>
                            ))
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-8 text-ink-muted"
                            >
                                <div className="text-4xl mb-2">🎯</div>
                                <p>Recomendações personalizadas em breve!</p>
                            </motion.div>
                        )}
                    </div>
                </motion.div >
            </main >

            {/* Bottom Nav - ÚNICA E FUNCIONAL */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
                <div className="max-w-md mx-auto bg-white/95 backdrop-blur-lg border-t border-lavender-100 pb-safe pointer-events-auto shadow-lg-up">
                    <div className="flex justify-around items-center py-3 relative">
                        {/* Item 1 */}
                        <button className="flex flex-col items-center gap-1 text-lavender-600 w-16">
                            <div className="text-xl">{Icons.grid}</div>
                            <span className="text-[10px] font-medium">Início</span>
                        </button>

                        {/* Item 2 */}
                        <button className="flex flex-col items-center gap-1 text-ink-muted hover:text-lavender-600 transition-colors w-16">
                            <div className="text-xl">{Icons.calendar}</div>
                            <span className="text-[10px] font-medium">Buscar</span>
                        </button>

                        {/* FAB Central */}
                        <div className="relative -top-8">
                            <motion.button
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9, rotate: 90 }}
                                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                className="w-14 h-14 rounded-full bg-gradient-to-br from-lavender-400 to-lavender-600 text-white shadow-lg shadow-lavender-500/30 flex items-center justify-center text-2xl"
                            >
                                {Icons.plus}
                            </motion.button>
                        </div>

                        {/* Item 4 */}
                        <button className="flex flex-col items-center gap-1 text-ink-muted hover:text-lavender-600 transition-colors w-16">
                            <div className="text-xl">{Icons.fileText}</div>
                            <span className="text-[10px] font-medium">Agenda</span>
                        </button>

                        {/* Item 5 */}
                        <button className="flex flex-col items-center gap-1 text-ink-muted hover:text-lavender-600 transition-colors w-16">
                            <div className="text-xl">{Icons.heart}</div>
                            <span className="text-[10px] font-medium">Perfil</span>
                        </button>
                    </div>
                </div>
            </nav>
        </div >
    );
}
