import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
    ArrowLeft,
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Video,
    MapPin,
    MoreVertical,
    Clock
} from 'lucide-react';

const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const appointments = [
    { id: 1, patient: 'Marina Silva', time: '09:00', duration: '60min', type: 'online', status: 'confirmed', image: 'https://i.pravatar.cc/150?img=1' },
    { id: 2, patient: 'João Pedro', time: '10:30', duration: '30min', type: 'presential', status: 'confirmed', image: 'https://i.pravatar.cc/150?img=3' },
    { id: 3, patient: 'Ana Paula', time: '14:00', duration: '60min', type: 'online', status: 'pending', image: 'https://i.pravatar.cc/150?img=5' },
    { id: 4, patient: 'Carlos Eduardo', time: '16:30', duration: '30min', type: 'presential', status: 'confirmed', image: 'https://i.pravatar.cc/150?img=8' },
];

export function ProfessionalAgendaScreen({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [selectedDate, setSelectedDate] = useState(15); // Dia selecionado
    const [currentMonth] = useState('Janeiro 2026');

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed inset-0 bg-gray-50 z-50 flex flex-col"
        >
            {/* Header */}
            <div className="bg-white px-6 pt-safe pb-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <button onClick={onClose} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
                        <ArrowLeft className="w-6 h-6 text-gray-700" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-800">Minha Agenda</h1>
                    <button className="p-2 bg-purple-50 text-purple-600 rounded-full">
                        <CalendarIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Month Navigation */}
                <div className="flex items-center justify-between mb-4">
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <h2 className="text-lg font-bold text-gray-800">{currentMonth}</h2>
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* Days Strip */}
                <div className="flex justify-between gap-2 overflow-x-auto scrollbar-hide">
                    {[14, 15, 16, 17, 18, 19, 20].map((day, idx) => (
                        <motion.button
                            key={day}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedDate(day)}
                            className={`flex flex-col items-center gap-1 p-3 rounded-2xl min-w-[56px] transition-colors ${selectedDate === day
                                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                                    : 'bg-gray-100 text-gray-600'
                                }`}
                        >
                            <span className="text-[10px] font-medium opacity-80">{weekDays[idx]}</span>
                            <span className="text-lg font-bold">{day}</span>
                            {selectedDate === day && (
                                <span className="w-1 h-1 bg-white rounded-full mt-1" />
                            )}
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Stats Summary */}
            <div className="px-6 py-4">
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-4 text-white flex justify-between items-center shadow-lg shadow-purple-600/20">
                    <div>
                        <p className="text-purple-200 text-xs mb-1">Consultas hoje</p>
                        <p className="text-2xl font-bold">4 agendadas</p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold">R$ 1.140</p>
                        <p className="text-purple-200 text-xs">Receita prevista</p>
                    </div>
                </div>
            </div>

            {/* Appointments List */}
            <div className="flex-1 overflow-y-auto px-6 pb-6">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    Horários agendados
                </h3>

                <div className="space-y-3">
                    <AnimatePresence>
                        {appointments.map((apt, idx) => (
                            <motion.div
                                key={apt.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                whileHover={{ scale: 1.02 }}
                                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4"
                            >
                                {/* Time Column */}
                                <div className="text-center min-w-[60px]">
                                    <p className="text-lg font-bold text-gray-800">{apt.time}</p>
                                    <p className="text-xs text-gray-400">{apt.duration}</p>
                                </div>

                                {/* Divider */}
                                <div className={`w-1 h-12 rounded-full ${apt.status === 'confirmed' ? 'bg-green-400' : 'bg-orange-400'
                                    }`} />

                                {/* Content */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-bold text-gray-800">{apt.patient}</h4>
                                        {apt.status === 'pending' && (
                                            <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-bold">
                                                PENDENTE
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-gray-500">
                                        <span className="flex items-center gap-1">
                                            {apt.type === 'online' ? <Video className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                                            {apt.type === 'online' ? 'Online' : 'Presencial'}
                                        </span>
                                        <span>•</span>
                                        <span className="text-green-600 font-medium">R$ {apt.duration === '60min' ? '300' : '180'}</span>
                                    </div>
                                </div>

                                {/* Avatar */}
                                <img src={apt.image} className="w-12 h-12 rounded-full object-cover border-2 border-gray-100" />

                                {/* Actions */}
                                <button className="p-2 hover:bg-gray-50 rounded-full">
                                    <MoreVertical className="w-4 h-4 text-gray-400" />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}
