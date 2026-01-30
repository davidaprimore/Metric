import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
    ArrowLeft,
    Info,
    X,
    Calendar,
    Video,
    MapPin,
    MessageCircle,
    CheckCircle2,
    AlertTriangle,
    Clock
} from 'lucide-react';

export interface AppointmentDetail {
    id: string;
    professionalName: string;
    specialty: string;
    date: string;
    time: string;
    type: 'online' | 'presential';
    price: number;
    image: string;
    status: string;
    address?: string;
    meetingLink?: string;
    canCancelUntil: string;
    canRescheduleUntil: string;
    cancellationFee?: string;
}

export function AppointmentDetailScreen({
    isOpen,
    onClose,
    appointment,
    onCancel,
    onReschedule
}: {
    isOpen: boolean;
    onClose: () => void;
    appointment?: AppointmentDetail;
    onCancel: () => void;
    onReschedule: () => void;
}) {
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const [showRescheduleConfirm, setShowRescheduleConfirm] = useState(false);
    const [showRules, setShowRules] = useState<'cancel' | 'reschedule' | null>(null);
    const [actionResult, setActionResult] = useState<'success-cancel' | 'success-reschedule' | 'error-time' | null>(null);

    if (!isOpen || !appointment) return null;

    // Mock de validação de tempo
    const canCancel = true; // Na prática, calcular com base em appointment.canCancelUntil
    const canReschedule = true;

    const handleCancel = () => {
        if (!canCancel) {
            setActionResult('error-time');
        } else {
            setActionResult('success-cancel');
            setTimeout(() => {
                onCancel();
                setActionResult(null);
                setShowCancelConfirm(false);
                onClose();
            }, 2000);
        }
    };

    const handleReschedule = () => {
        if (!canReschedule) {
            setActionResult('error-time');
        } else {
            setActionResult('success-reschedule');
            setTimeout(() => {
                onReschedule();
                setActionResult(null);
                setShowRescheduleConfirm(false);
            }, 2000);
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
            <div className="bg-white px-6 pt-safe pb-4 border-b border-gray-100 flex items-center gap-4 sticky top-0 z-10">
                <button onClick={onClose} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
                    <ArrowLeft className="w-6 h-6 text-gray-700" />
                </button>
                <h1 className="text-xl font-bold text-gray-800">Detalhes da Consulta</h1>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                {/* Card Principal */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
                    <div className="flex items-center gap-4 mb-6">
                        <img src={appointment.image} className="w-20 h-20 rounded-full object-cover border-4 border-purple-50" />
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">{appointment.professionalName}</h2>
                            <p className="text-purple-600 font-medium">{appointment.specialty}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-purple-50 rounded-2xl p-4 text-center">
                            <p className="text-purple-600 text-xs font-bold uppercase mb-1">Data</p>
                            <p className="text-lg font-bold text-gray-800">{appointment.date}</p>
                        </div>
                        <div className="bg-purple-50 rounded-2xl p-4 text-center">
                            <p className="text-purple-600 text-xs font-bold uppercase mb-1">Horário</p>
                            <p className="text-lg font-bold text-gray-800">{appointment.time}</p>
                        </div>
                    </div>

                    <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-3 text-gray-600">
                            {appointment.type === 'online' ? <Video className="w-5 h-5 text-purple-600" /> : <MapPin className="w-5 h-5 text-purple-600" />}
                            <span>{appointment.type === 'online' ? 'Consulta Online' : appointment.address}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600">
                            <MessageCircle className="w-5 h-5 text-purple-600" />
                            <span>Você pode conversar com o profissional até 24h após a consulta</span>
                        </div>
                    </div>
                </div>

                {/* Regras e Ações */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
                    <h3 className="font-bold text-gray-800 mb-4">Gerenciar Agendamento</h3>

                    {/* Reagendar */}
                    <div className="mb-4 pb-4 border-b border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-gray-700">Reagendar</span>
                            <button
                                onClick={() => setShowRules('reschedule')}
                                className="flex items-center gap-1 text-purple-600 text-xs font-bold hover:bg-purple-50 px-2 py-1 rounded-full transition-colors"
                            >
                                <Info className="w-3 h-3" />
                                Regras
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mb-3">
                            Pode ser reagendado até: <span className="font-bold text-gray-700">{appointment.canRescheduleUntil}</span>
                        </p>
                        <button
                            onClick={() => setShowRescheduleConfirm(true)}
                            className="w-full py-3 bg-orange-50 text-orange-600 font-bold rounded-xl border border-orange-200 hover:bg-orange-100 transition-colors flex items-center justify-center gap-2"
                        >
                            <Calendar className="w-4 h-4" />
                            Reagendar Consulta
                        </button>
                    </div>

                    {/* Cancelar */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-gray-700">Cancelar</span>
                            <button
                                onClick={() => setShowRules('cancel')}
                                className="flex items-center gap-1 text-purple-600 text-xs font-bold hover:bg-purple-50 px-2 py-1 rounded-full transition-colors"
                            >
                                <Info className="w-3 h-3" />
                                Regras
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mb-3">
                            Cancelamento gratuito até: <span className="font-bold text-gray-700">{appointment.canCancelUntil}</span>
                        </p>
                        <button
                            onClick={() => setShowCancelConfirm(true)}
                            className="w-full py-3 bg-red-50 text-red-600 font-bold rounded-xl border border-red-200 hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                        >
                            <X className="w-4 h-4" />
                            Cancelar Consulta
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal de Regras */}
            <AnimatePresence>
                {showRules && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4"
                        onClick={() => setShowRules(null)}
                    >
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            className="bg-white rounded-3xl p-6 max-w-sm w-full"
                            onClick={e => e.stopPropagation()}
                        >
                            <h3 className="font-bold text-lg mb-4">
                                {showRules === 'cancel' ? 'Regras de Cancelamento' : 'Regras de Reagendamento'}
                            </h3>
                            {showRules === 'cancel' ? (
                                <ul className="space-y-3 text-sm text-gray-600 mb-6">
                                    <li className="flex gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                                        Cancelamento gratuito até 24h antes
                                    </li>
                                    <li className="flex gap-2">
                                        <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0" />
                                        Cancelamento entre 24h e 2h: taxa de 30%
                                    </li>
                                    <li className="flex gap-2">
                                        <X className="w-5 h-5 text-red-500 flex-shrink-0" />
                                        Menos de 2h: não é possível cancelar
                                    </li>
                                </ul>
                            ) : (
                                <ul className="space-y-3 text-sm text-gray-600 mb-6">
                                    <li className="flex gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                                        Reagendamento gratuito até 12h antes
                                    </li>
                                    <li className="flex gap-2">
                                        <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0" />
                                        Reagendamento entre 12h e 2h: taxa de 15%
                                    </li>
                                    <li className="flex gap-2">
                                        <X className="w-5 h-5 text-red-500 flex-shrink-0" />
                                        Menos de 2h: não é possível reagendar
                                    </li>
                                </ul>
                            )}
                            <button
                                onClick={() => setShowRules(null)}
                                className="w-full py-3 bg-gray-100 text-gray-800 font-bold rounded-xl"
                            >
                                Entendi
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Confirmações */}
            <AnimatePresence>
                {(showCancelConfirm || showRescheduleConfirm) && !actionResult && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className="bg-white rounded-3xl p-6 max-w-sm w-full"
                        >
                            <h3 className="font-bold text-lg mb-2">
                                {showCancelConfirm ? 'Confirmar Cancelamento?' : 'Reagendar Consulta?'}
                            </h3>
                            <p className="text-gray-500 text-sm mb-6">
                                {showCancelConfirm
                                    ? 'Você receberá o reembolso conforme as regras de cancelamento.'
                                    : 'Você será redirecionado para escolher uma nova data.'}
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowCancelConfirm(false);
                                        setShowRescheduleConfirm(false);
                                    }}
                                    className="flex-1 py-3 bg-gray-100 text-gray-800 font-bold rounded-xl"
                                >
                                    Voltar
                                </button>
                                <button
                                    onClick={showCancelConfirm ? handleCancel : handleReschedule}
                                    className={`flex-1 py-3 text-white font-bold rounded-xl ${showCancelConfirm ? 'bg-red-500' : 'bg-orange-500'
                                        }`}
                                >
                                    Confirmar
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Resultados de Ação */}
            <AnimatePresence>
                {actionResult && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                    >
                        <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center">
                            {actionResult === 'success-cancel' && (
                                <>
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                                    </div>
                                    <h3 className="font-bold text-lg mb-2">Cancelado com sucesso!</h3>
                                    <p className="text-gray-500 text-sm">O reembolso será processado em até 3 dias úteis.</p>
                                </>
                            )}
                            {actionResult === 'success-reschedule' && (
                                <>
                                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Calendar className="w-8 h-8 text-orange-600" />
                                    </div>
                                    <h3 className="font-bold text-lg mb-2">Reagendamento liberado!</h3>
                                    <p className="text-gray-500 text-sm">Escolha uma nova data para sua consulta.</p>
                                </>
                            )}
                            {actionResult === 'error-time' && (
                                <>
                                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Clock className="w-8 h-8 text-red-600" />
                                    </div>
                                    <h3 className="font-bold text-lg mb-2">Prazo expirado</h3>
                                    <p className="text-gray-500 text-sm">Não é mais possível realizar esta ação. Entre em contato com o suporte.</p>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
