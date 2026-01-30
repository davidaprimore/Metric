import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';
import {
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    Clock,
    Calendar as CalendarIcon,
    Video,
    MapPin,
    Info
} from 'lucide-react';

const availabilityMock = {
    availableDays: [1, 2, 3, 6, 7, 8, 9, 10, 13, 14, 15],
    slots: {
        '2026-02-03': ['09:00', '10:00', '11:00', '14:00', '15:30', '16:00'],
        '2026-02-04': ['08:00', '09:30', '11:00', '14:00'],
        '2026-02-06': ['10:00', '11:00', '15:00', '16:00', '17:00'],
    }
};

const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho'];

export function BookingScreen({
    isOpen,
    onClose,
    onAdvance
}: {
    isOpen: boolean;
    onClose: () => void;
    onAdvance: (bookingData: any) => void;
}) {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [selectedModality, setSelectedModality] = useState<'online' | 'presential'>('online');
    const [currentMonth, setCurrentMonth] = useState(new Date(2026, 1, 1)); // Fevereiro 2026

    const daysInMonth = useMemo(() => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const lastDay = new Date(year, month + 1, 0);
        const days: Date[] = [];

        for (let i = 1; i <= lastDay.getDate(); i++) {
            days.push(new Date(year, month, i));
        }
        return days;
    }, [currentMonth]);

    if (!isOpen) return null;

    const formatDateKey = (date: Date) => {
        return date.toISOString().split('T')[0];
    };

    const hasAvailability = (date: Date) => {
        return availabilityMock.availableDays.includes(date.getDate());
    };

    const isPastDate = (date: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    };

    const changeMonth = (delta: number) => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + delta, 1));
        setSelectedDate(null);
        setSelectedTime(null);
    };

    const availableSlots = selectedDate ? (availabilityMock.slots[formatDateKey(selectedDate)] || []) : [];

    const handleAdvance = () => {
        if (!selectedDate || !selectedTime) return;

        const bookingData = {
            date: selectedDate,
            time: selectedTime,
            modality: selectedModality,
            price: selectedModality === 'online' ? 300 : 350,
            professionalName: 'Dr. Ricardo Silva',
        };

        onAdvance(bookingData);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white z-50 flex flex-col"
        >
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                <button onClick={onClose} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft className="w-6 h-6 text-gray-600" />
                </button>
                <h1 className="text-lg font-bold">Escolha a data</h1>
                <div className="w-10" />
            </div>

            <div className="flex-1 overflow-y-auto">
                <div className="p-6">
                    {/* Navegação do Mês */}
                    <div className="flex items-center justify-between mb-6">
                        <button
                            onClick={() => changeMonth(-1)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <h2 className="text-lg font-bold text-gray-800">
                            {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                        </h2>
                        <button
                            onClick={() => changeMonth(1)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <ChevronRight className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>

                    {/* Grid de Dias */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {weekDays.map(day => (
                            <div key={day} className="text-center text-xs font-medium text-gray-400 py-2">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {daysInMonth.map((date, idx) => {
                            const isAvailable = hasAvailability(date);
                            const isSelected = selectedDate?.toDateString() === date.toDateString();
                            const isToday = new Date().toDateString() === date.toDateString();
                            const isPast = isPastDate(date);

                            return (
                                <motion.button
                                    key={idx}
                                    whileHover={isAvailable && !isPast ? { scale: 1.1 } : {}}
                                    whileTap={isAvailable && !isPast ? { scale: 0.95 } : {}}
                                    onClick={() => isAvailable && !isPast && setSelectedDate(date)}
                                    disabled={!isAvailable || isPast}
                                    className={`
                    aspect-square flex flex-col items-center justify-center rounded-2xl text-sm relative
                    ${isSelected ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : ''}
                    ${isAvailable && !isSelected && !isPast ? 'bg-white text-gray-800 hover:bg-purple-50 border border-gray-200' : ''}
                    ${(!isAvailable || isPast) ? 'text-gray-200 cursor-not-allowed bg-gray-50' : ''}
                    ${isToday && !isSelected ? 'border-2 border-purple-600 text-purple-600 font-bold' : ''}
                  `}
                                >
                                    <span className="font-semibold">{date.getDate()}</span>
                                    {isAvailable && !isSelected && !isPast && (
                                        <span className="w-1 h-1 bg-green-500 rounded-full mt-1" />
                                    )}
                                </motion.button>
                            );
                        })}
                    </div>

                    {/* Legenda */}
                    <div className="flex items-center gap-6 mt-6 text-xs text-gray-500 justify-center">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full" />
                            <span>Disponível</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-gray-200 rounded-full" />
                            <span>Indisponível</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-purple-600 rounded-full" />
                            <span>Selecionado</span>
                        </div>
                    </div>
                </div>

                {/* Horários Disponíveis */}
                <AnimatePresence>
                    {selectedDate && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="border-t border-gray-100 bg-gray-50 p-6"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-purple-600" />
                                    Horários disponíveis
                                </h3>
                                <span className="text-sm text-gray-500">
                                    {selectedDate.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' })}
                                </span>
                            </div>

                            {availableSlots.length > 0 ? (
                                <div className="grid grid-cols-3 gap-3">
                                    {availableSlots.map((time) => (
                                        <motion.button
                                            key={time}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setSelectedTime(time)}
                                            className={`
                        py-3 px-4 rounded-xl text-sm font-semibold transition-all
                        ${selectedTime === time
                                                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                                                    : 'bg-white text-gray-700 border border-gray-200 hover:border-purple-300'
                                                }
                      `}
                                        >
                                            {time}
                                        </motion.button>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <Info className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    <p>Sem horários disponíveis neste dia</p>
                                </div>
                            )}

                            {/* Opções de Modalidade */}
                            {selectedTime && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="mt-6 space-y-3"
                                >
                                    <p className="text-sm font-bold text-gray-800 mb-3">Como deseja atendimento?</p>

                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => setSelectedModality('online')}
                                            className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${selectedModality === 'online'
                                                    ? 'border-purple-600 bg-purple-50 shadow-sm'
                                                    : 'border-gray-200 bg-white'
                                                }`}
                                        >
                                            <Video className={`w-6 h-6 ${selectedModality === 'online' ? 'text-purple-600' : 'text-gray-400'}`} />
                                            <span className={`text-sm font-semibold ${selectedModality === 'online' ? 'text-gray-800' : 'text-gray-600'}`}>Online</span>
                                            <span className="text-xs text-gray-500">R$ 300</span>
                                        </button>

                                        <button
                                            onClick={() => setSelectedModality('presential')}
                                            className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${selectedModality === 'presential'
                                                    ? 'border-purple-600 bg-purple-50 shadow-sm'
                                                    : 'border-gray-200 bg-white opacity-60'
                                                }`}
                                        >
                                            <MapPin className={`w-6 h-6 ${selectedModality === 'presential' ? 'text-purple-600' : 'text-gray-400'}`} />
                                            <span className={`text-sm font-semibold ${selectedModality === 'presential' ? 'text-gray-800' : 'text-gray-600'}`}>Presencial</span>
                                            <span className="text-xs text-gray-500">R$ 350</span>
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-100 bg-white p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <p className="text-xs text-gray-500">Valor total</p>
                        <p className="text-xl font-bold text-gray-800">
                            R$ {selectedModality === 'online' ? '300,00' : '350,00'}
                        </p>
                    </div>
                    {selectedDate && selectedTime && (
                        <div className="text-right">
                            <p className="text-xs text-gray-500">Data e hora</p>
                            <p className="text-sm font-semibold text-purple-600">
                                {selectedDate.getDate()}/{selectedDate.getMonth() + 1} às {selectedTime}
                            </p>
                        </div>
                    )}
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={!selectedDate || !selectedTime}
                    onClick={handleAdvance}
                    className={`
            w-full py-4 rounded-2xl font-bold text-white transition-all
            ${selectedDate && selectedTime
                            ? 'bg-purple-600 shadow-lg shadow-purple-600/25'
                            : 'bg-gray-300 cursor-not-allowed'
                        }
          `}
                >
                    Avançar para Pagamento
                </motion.button>
            </div>
        </motion.div>
    );
}
