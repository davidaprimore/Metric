import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
    ArrowLeft,
    Calendar as CalendarIcon,
    Video,
    MapPin,
    ChevronRight,
    AlertCircle,
    CheckCircle2,
    XCircle,
    Hourglass
} from 'lucide-react';

type AppointmentStatus = 'upcoming' | 'completed' | 'cancelled' | 'pending';

interface Appointment {
    id: string;
    professionalName: string;
    specialty: string;
    date: string;
    time: string;
    type: 'online' | 'presential';
    status: AppointmentStatus;
    price: number;
    image: string;
    address?: string;
    meetingLink?: string;
    canCancelUntil: string;
    canRescheduleUntil: string;
}

const appointments: Appointment[] = [
    {
        id: '1',
        professionalName: 'Dra. Ana Paula',
        specialty: 'Nutricionista',
        date: 'Hoje, 16:00',
        time: '16:00',
        type: 'online',
        status: 'upcoming',
        price: 300,
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop',
        meetingLink: 'https://meet.google.com/abc-123',
        canCancelUntil: '15 minutos antes',
        canRescheduleUntil: '2 horas antes',
    },
    {
        id: '2',
        professionalName: 'Dr. Ricardo Silva',
        specialty: 'Fisioterapeuta',
        date: 'Amanhã, 09:00',
        time: '09:00',
        type: 'presential',
        status: 'upcoming',
        price: 200,
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop',
        address: 'Rua Augusta, 100 - Consolação',
        canCancelUntil: '24 horas antes',
        canRescheduleUntil: '12 horas antes',
    },
    {
        id: '3',
        professionalName: 'Dra. Marina Costa',
        specialty: 'Nutricionista Esportiva',
        date: 'Ontem, 14:00',
        time: '14:00',
        type: 'online',
        status: 'completed',
        price: 280,
        image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop',
        canCancelUntil: '',
        canRescheduleUntil: '',
    },
    {
        id: '4',
        professionalName: 'Dr. João Pedro',
        specialty: 'Médico do Esporte',
        date: '12 Jan, 10:00',
        time: '10:00',
        type: 'presential',
        status: 'cancelled',
        price: 350,
        image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&h=200&fit=crop',
        canCancelUntil: '',
        canRescheduleUntil: '',
    },
];

export function ClientAgendaScreen({
    isOpen,
    onClose,
    onSelectAppointment
}: {
    isOpen: boolean;
    onClose: () => void;
    onSelectAppointment: (apt: Appointment) => void;
}) {
    const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

    if (!isOpen) return null;

    const upcoming = appointments.filter(a => a.status === 'upcoming' || a.status === 'pending');
    const past = appointments.filter(a => a.status === 'completed' || a.status === 'cancelled');

    const getStatusConfig = (status: AppointmentStatus) => {
        switch (status) {
            case 'upcoming': return { color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle2, text: 'Confirmado' };
            case 'pending': return { color: 'text-orange-600', bg: 'bg-orange-50', icon: Hourglass, text: 'Pendente' };
            case 'completed': return { color: 'text-gray-600', bg: 'bg-gray-50', icon: CheckCircle2, text: 'Realizado' };
            case 'cancelled': return { color: 'text-red-600', bg: 'bg-red-50', icon: XCircle, text: 'Cancelado' };
        }
    };

    return (
        <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed inset-0 bg-gray-50 z-50 flex flex-col"
        >
            {/* Header */}
            <div className="bg-white px-6 pt-safe pb-4 border-b border-gray-100 sticky top-0 z-10">
                <div className="flex items-center justify-between mb-4">
                    <button onClick={onClose} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
                        <ArrowLeft className="w-6 h-6 text-gray-700" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-800">Minha Agenda</h1>
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                        <CalendarIcon className="w-6 h-6 text-purple-600" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 bg-gray-100 p-1 rounded-2xl">
                    <button
                        onClick={() => setActiveTab('upcoming')}
                        className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'upcoming' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500'
                            }`}
                    >
                        Próximos ({upcoming.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('past')}
                        className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'past' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500'
                            }`}
                    >
                        Anteriores ({past.length})
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
                <AnimatePresence mode="wait">
                    {activeTab === 'upcoming' ? (
                        <motion.div
                            key="upcoming"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-4"
                        >
                            {upcoming.length === 0 ? (
                                <div className="text-center py-10 text-gray-400">
                                    <CalendarIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                    <p>Nenhuma consulta agendada</p>
                                </div>
                            ) : (
                                <>
                                    <p className="text-sm text-gray-500 mb-4">Você tem {upcoming.length} consulta{upcoming.length > 1 ? 's' : ''} agendada{upcoming.length > 1 ? 's' : ''}</p>
                                    {upcoming.map((apt, idx) => {
                                        const status = getStatusConfig(apt.status);
                                        return (
                                            <motion.div
                                                key={apt.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                onClick={() => onSelectAppointment(apt)}
                                                className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 cursor-pointer active:scale-95 transition-transform"
                                            >
                                                {/* Header com data destacada */}
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="bg-purple-100 text-purple-600 px-4 py-2 rounded-2xl text-center min-w-[70px]">
                                                            <p className="text-xs font-bold uppercase">{apt.date.split(',')[0]}</p>
                                                            <p className="text-lg font-bold">{apt.time}</p>
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-gray-800">{apt.professionalName}</h3>
                                                            <p className="text-purple-600 text-sm">{apt.specialty}</p>
                                                        </div>
                                                    </div>
                                                    <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${status.bg} ${status.color}`}>
                                                        <status.icon className="w-3 h-3" />
                                                        <span className="text-[10px] font-bold">{status.text}</span>
                                                    </div>
                                                </div>

                                                {/* Detalhes */}
                                                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                                    <span className="flex items-center gap-1">
                                                        {apt.type === 'online' ? <Video className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                                                        {apt.type === 'online' ? 'Consulta Online' : 'Presencial'}
                                                    </span>
                                                    <span>•</span>
                                                    <span className="font-bold text-gray-700">R$ {apt.price}</span>
                                                </div>

                                                {/* Botões de ação rápida (só se puder) */}
                                                <div className="flex gap-2">
                                                    {apt.type === 'online' && apt.status === 'upcoming' && (
                                                        <button className="flex-1 bg-green-500 text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
                                                            <Video className="w-4 h-4" />
                                                            Entrar na Consulta
                                                        </button>
                                                    )}
                                                    <button className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold text-sm">
                                                        Ver Detalhes
                                                    </button>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="past"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-4"
                        >
                            {past.map((apt, idx) => {
                                const status = getStatusConfig(apt.status);
                                return (
                                    <motion.div
                                        key={apt.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        onClick={() => onSelectAppointment(apt)}
                                        className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 opacity-70 cursor-pointer"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <img src={apt.image} className="w-12 h-12 rounded-full object-cover grayscale" />
                                                <div>
                                                    <h3 className="font-bold text-gray-800">{apt.professionalName}</h3>
                                                    <p className="text-gray-500 text-sm">{apt.date}</p>
                                                </div>
                                            </div>
                                            <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${status.bg} ${status.color}`}>
                                                <status.icon className="w-3 h-3" />
                                                <span className="text-[10px] font-bold">{status.text}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
