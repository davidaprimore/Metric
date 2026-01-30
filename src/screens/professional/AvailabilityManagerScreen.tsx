import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
    ArrowLeft,
    Plus,
    ChevronDown,
    X,
    AlertCircle
} from 'lucide-react';

const weekDays = [
    { id: 0, name: 'Domingo', short: 'Dom' },
    { id: 1, name: 'Segunda', short: 'Seg' },
    { id: 2, name: 'Terça', short: 'Ter' },
    { id: 3, name: 'Quarta', short: 'Qua' },
    { id: 4, name: 'Quinta', short: 'Qui' },
    { id: 5, name: 'Sexta', short: 'Sex' },
    { id: 6, name: 'Sábado', short: 'Sáb' },
];

const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'
];

export function AvailabilityManagerScreen({
    isOpen,
    onClose
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const [availability, setAvailability] = useState<Record<number, string[]>>({
        1: ['09:00', '10:00', '11:00', '14:00', '15:00'],
        2: ['09:00', '10:00', '11:00', '14:00', '15:00'],
        3: ['09:00', '10:00', '11:00', '14:00', '15:00'],
        4: ['09:00', '10:00', '11:00', '14:00', '15:00'],
        5: ['09:00', '10:00', '11:00'],
    });
    const [blockedDates] = useState<string[]>(['2026-02-10', '2026-02-15']);

    if (!isOpen) return null;

    const toggleTimeSlot = (dayId: number, time: string) => {
        setAvailability(prev => ({
            ...prev,
            [dayId]: prev[dayId]?.includes(time)
                ? prev[dayId].filter(t => t !== time)
                : [...(prev[dayId] || []), time].sort()
        }));
    };

    const copyToAllDays = (sourceDay: number) => {
        const slots = availability[sourceDay] || [];
        const newAvailability: Record<number, string[]> = {};
        [1, 2, 3, 4, 5].forEach(day => {
            newAvailability[day] = [...slots];
        });
        setAvailability(newAvailability);
    };

    return (
        <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed inset-0 bg-gray-50 z-50 flex flex-col max-w-[430px] mx-auto overflow-hidden"
        >
            {/* Header */}
            <div className="bg-white px-6 pt-safe pb-4 border-b border-gray-100 sticky top-0 z-10">
                <div className="flex items-center justify-between mb-4">
                    <button onClick={onClose} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft className="w-6 h-6 text-gray-700" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-800">Disponibilidade</h1>
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-xl font-semibold text-sm shadow-sm active:scale-95 transition-all">
                        Salvar
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 bg-gray-100 p-1 rounded-2xl">
                    <button className="flex-1 py-2 rounded-xl text-sm font-bold bg-white text-purple-600 shadow-sm">
                        Horários Semanais
                    </button>
                    <button className="flex-1 py-2 rounded-xl text-sm font-bold text-gray-500">
                        Datas Bloqueadas
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 pb-24">
                {/* Dias da Semana */}
                <div className="space-y-4">
                    {weekDays.filter(d => d.id !== 0 && d.id !== 6).map((day) => (
                        <motion.div
                            key={day.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                        >
                            <div
                                className="p-4 flex items-center justify-between cursor-pointer bg-gray-50"
                                onClick={() => setSelectedDay(selectedDay === day.id ? null : day.id)}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${availability[day.id]?.length > 0
                                            ? 'bg-green-100 text-green-600'
                                            : 'bg-gray-200 text-gray-400'
                                        }`}>
                                        {day.short}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800 text-[15px]">{day.name}</h3>
                                        <p className="text-[11px] text-gray-500">
                                            {availability[day.id]?.length > 0
                                                ? `${availability[day.id].length} horários disponíveis`
                                                : 'Indisponível'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            copyToAllDays(day.id);
                                        }}
                                        className="text-[10px] text-purple-600 font-bold px-2.5 py-1 bg-purple-50 rounded-full active:scale-95 transition-transform"
                                    >
                                        Copiar p/ todos
                                    </button>
                                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${selectedDay === day.id ? 'rotate-180' : ''
                                        }`} />
                                </div>
                            </div>

                            <AnimatePresence>
                                {selectedDay === day.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="border-t border-gray-100 p-4"
                                    >
                                        <div className="flex flex-wrap gap-2">
                                            {timeSlots.map(time => {
                                                const isSelected = availability[day.id]?.includes(time);
                                                return (
                                                    <button
                                                        key={time}
                                                        onClick={() => toggleTimeSlot(day.id, time)}
                                                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${isSelected
                                                                ? 'bg-purple-600 text-white shadow-md'
                                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                            }`}
                                                    >
                                                        {time}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                                            <button
                                                onClick={() => setAvailability(prev => ({ ...prev, [day.id]: [] }))}
                                                className="flex-1 py-2.5 text-red-600 text-xs font-bold bg-red-50 rounded-xl"
                                            >
                                                Limpar todos
                                            </button>
                                            <button
                                                onClick={() => setAvailability(prev => ({ ...prev, [day.id]: timeSlots }))}
                                                className="flex-1 py-2.5 text-purple-600 text-xs font-bold bg-purple-50 rounded-xl"
                                            >
                                                Selecionar todos
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>

                {/* Datas Bloqueadas */}
                <div className="mt-8 pb-10">
                    <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        Datas Bloqueadas
                    </h2>

                    <div className="space-y-3">
                        {blockedDates.map(date => (
                            <div key={date} className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-red-500 font-bold text-sm">
                                        {new Date(date).getDate()}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800 text-[14px]">
                                            {new Date(date).toLocaleDateString('pt-BR', { weekday: 'long' })}
                                        </p>
                                        <p className="text-[11px] text-red-600 font-medium">Bloqueado</p>
                                    </div>
                                </div>
                                <button className="p-2 hover:bg-red-100 rounded-full text-red-500">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        ))}

                        <button className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-500 font-semibold flex items-center justify-center gap-2 hover:border-purple-300 hover:text-purple-600 transition-colors">
                            <Plus className="w-5 h-5" />
                            Bloquear nova data
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
