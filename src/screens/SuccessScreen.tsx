import { motion } from 'framer-motion';
import { CheckCircle2, Calendar, FileText, Home, Clock } from 'lucide-react';

interface SuccessScreenProps {
    isOpen: boolean;
    bookingData: any;
    onGoToAnamnese: () => void;
    onGoToHome: () => void;
}

export function SuccessScreen({
    isOpen,
    bookingData,
    onGoToAnamnese,
    onGoToHome
}: SuccessScreenProps) {
    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white z-50 flex flex-col"
        >
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6"
                >
                    <CheckCircle2 className="w-12 h-12 text-green-600" />
                </motion.div>

                <h2 className="text-3xl font-bold text-gray-800 mb-2">Agendado!</h2>
                <p className="text-gray-600 mb-8">
                    Sua consulta está confirmada e o pagamento foi processado.
                </p>

                <div className="bg-gray-50 rounded-2xl p-6 w-full max-w-sm mb-8">
                    <div className="flex items-center gap-3 mb-3">
                        <Calendar className="w-5 h-5 text-purple-600" />
                        <span className="font-semibold text-gray-800">
                            {bookingData?.date?.toLocaleDateString('pt-BR', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long'
                            })}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-purple-600" />
                        <span className="font-semibold text-gray-800">{bookingData?.time}</span>
                    </div>
                </div>

                <p className="text-sm text-gray-500 mb-6">
                    Ajude seu profissional a te conhecer melhor preenchendo a anamnese.
                </p>

                <div className="w-full max-w-sm space-y-3">
                    <button
                        onClick={onGoToAnamnese}
                        className="w-full py-4 bg-purple-600 text-white font-bold rounded-2xl shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2"
                    >
                        <FileText className="w-5 h-5" />
                        Preencher Anamnese
                    </button>

                    <button
                        onClick={onGoToHome}
                        className="w-full py-4 bg-gray-100 text-gray-700 font-bold rounded-2xl flex items-center justify-center gap-2"
                    >
                        <Home className="w-5 h-5" />
                        Voltar ao Início
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
