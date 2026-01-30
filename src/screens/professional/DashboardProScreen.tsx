import { motion } from 'framer-motion';
import {
    TrendingUp,
    Users,
    DollarSign,
    Clock,
    ChevronRight,
    Star,
    AlertCircle,
    Video,
    MapPin
} from 'lucide-react';

const stats = [
    { id: 1, label: 'Hoje', value: '4', subtext: 'consultas', icon: Clock, color: 'bg-blue-500', trend: '+1' },
    { id: 2, label: 'Semana', value: 'R$ 2.4k', subtext: 'receita', icon: DollarSign, color: 'bg-green-500', trend: '+12%' },
    { id: 3, label: 'Pacientes', value: '28', subtext: 'novos', icon: Users, color: 'bg-purple-500', trend: '+5' },
    { id: 4, label: 'Avaliação', value: '4.9', subtext: 'estrelas', icon: Star, color: 'bg-yellow-500', trend: '98%' },
];

const todayAppointments = [
    {
        id: '1',
        patient: 'Marina Silva',
        time: '09:00',
        duration: '60min',
        type: 'online',
        status: 'confirmed',
        avatar: 'https://i.pravatar.cc/150?img=1',
        isNext: true
    },
    {
        id: '2',
        patient: 'João Pedro',
        time: '10:30',
        duration: '30min',
        type: 'presential',
        status: 'confirmed',
        avatar: 'https://i.pravatar.cc/150?img=3'
    },
    {
        id: '3',
        patient: 'Ana Paula',
        time: '14:00',
        duration: '60min',
        type: 'online',
        status: 'pending',
        avatar: 'https://i.pravatar.cc/150?img=5'
    },
    {
        id: '4',
        patient: 'Carlos Eduardo',
        time: '16:30',
        duration: '30min',
        type: 'presential',
        status: 'confirmed',
        avatar: 'https://i.pravatar.cc/150?img=8'
    },
];

export function DashboardProScreen({
    onSwitchMode
}: {
    onSwitchMode?: () => void
}) {
    return (
        <div className="min-h-screen bg-gray-50 pb-24 max-w-[430px] mx-auto relative overflow-x-hidden">
            {/* Header */}
            <div className="bg-white px-6 pt-safe pb-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <p className="text-gray-500 text-sm">Bom dia,</p>
                        <h1 className="text-2xl font-bold text-gray-800">Dr. Ricardo</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Botão Temporário para voltar ao Modo Cliente */}
                        <button
                            onClick={onSwitchMode}
                            className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-bold hover:bg-gray-200 transition-colors"
                        >
                            MODO CLIENTE
                        </button>
                        <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center relative">
                            <AlertCircle className="w-5 h-5 text-red-500" />
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                2
                            </span>
                        </div>
                        <img
                            src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop"
                            className="w-10 h-10 rounded-full object-cover border-2 border-purple-100"
                            alt="Profile"
                        />
                    </div>
                </div>

                {/* Status Card */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-4 text-white shadow-lg shadow-purple-600/25"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-200 text-xs font-medium mb-1">Status da agenda</p>
                            <p className="font-bold">Você está disponível</p>
                        </div>
                        <div className="w-12 h-6 bg-white/20 rounded-full relative cursor-pointer">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="p-6 space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={stat.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ y: -2 }}
                            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
                        >
                            <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center text-white mb-3`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <div className="flex items-end justify-between">
                                <div>
                                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                                    <p className="text-xs text-gray-500">{stat.subtext}</p>
                                </div>
                                <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full">
                                    {stat.trend}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Próxima Consulta Destaque */}
                {todayAppointments[0] && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 text-white relative overflow-hidden shadow-xl"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl -mr-10 -mt-10" />

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <span className="bg-white/10 backdrop-blur text-xs font-bold px-3 py-1 rounded-full">
                                    PRÓXIMA CONSULTA
                                </span>
                                <span className="text-3xl font-bold">{todayAppointments[0].time}</span>
                            </div>

                            <div className="flex items-center gap-4 mb-6">
                                <img src={todayAppointments[0].avatar} className="w-16 h-16 rounded-full border-2 border-white/20 object-cover" alt="Patient" />
                                <div>
                                    <h3 className="font-bold text-lg">{todayAppointments[0].patient}</h3>
                                    <p className="text-white/70 text-sm flex items-center gap-1">
                                        {todayAppointments[0].type === 'online' ? <Video className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                                        {todayAppointments[0].duration} • {todayAppointments[0].type === 'online' ? 'Online' : 'Presencial'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button className="flex-1 bg-white text-gray-900 py-3 rounded-xl font-bold text-sm">
                                    Iniciar Consulta
                                </button>
                                <button className="px-4 bg-white/10 backdrop-blur rounded-xl font-bold text-sm border border-white/20">
                                    Ver Prontuário
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Lista de Consultas de Hoje */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-gray-800">Agenda de Hoje</h2>
                        <button className="text-purple-600 text-sm font-semibold flex items-center gap-1">
                            Ver todas <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="space-y-3">
                        {todayAppointments.slice(1).map((apt, idx) => (
                            <motion.div
                                key={apt.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + idx * 0.1 }}
                                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4"
                            >
                                <div className="text-center min-w-[60px]">
                                    <p className="text-lg font-bold text-gray-800">{apt.time}</p>
                                    <p className="text-xs text-gray-500">{apt.duration}</p>
                                </div>
                                <div className={`w-0.5 h-10 rounded-full ${apt.status === 'confirmed' ? 'bg-green-400' : 'bg-orange-400'}`} />
                                <img src={apt.avatar} className="w-10 h-10 rounded-full object-cover" alt="Patient" />
                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-800 text-sm">{apt.patient}</h4>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        {apt.type === 'online' ? <Video className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                                        <span>{apt.type === 'online' ? 'Online' : 'Presencial'}</span>
                                    </div>
                                </div>
                                <button className="px-3 py-1.5 bg-purple-50 text-purple-600 rounded-full text-xs font-bold">
                                    Detalhes
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Acesso Rápido */}
                <div>
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Acesso Rápido</h2>
                    <div className="grid grid-cols-4 gap-3">
                        {[
                            { icon: '⏰', label: 'Disponibilidade', color: 'bg-blue-50 text-blue-600' },
                            { icon: '💰', label: 'Financeiro', color: 'bg-green-50 text-green-600' },
                            { icon: '📊', label: 'Relatórios', color: 'bg-purple-50 text-purple-600' },
                            { icon: '⚙️', label: 'Configurações', color: 'bg-gray-50 text-gray-600' },
                        ].map((item, idx) => (
                            <motion.button
                                key={idx}
                                whileTap={{ scale: 0.95 }}
                                className="flex flex-col items-center gap-2"
                            >
                                <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center text-2xl shadow-sm`}>
                                    {item.icon}
                                </div>
                                <span className="text-[11px] font-medium text-gray-600 text-center leading-tight">
                                    {item.label}
                                </span>
                            </motion.button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
