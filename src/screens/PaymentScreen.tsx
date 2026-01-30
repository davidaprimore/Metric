import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
    ArrowLeft,
    Shield,
    ChevronRight,
    QrCode,
    CreditCard,
    CheckCircle2,
    Lock,
    ArrowRight
} from 'lucide-react';

export function PaymentScreen({
    isOpen,
    onClose,
    amount = 300,
    professionalName = 'Dra. Ana Paula',
    onSuccess
}: {
    isOpen: boolean;
    onClose: () => void;
    amount?: number;
    professionalName?: string;
    onSuccess: () => void;
}) {
    const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit'>('pix');
    const [isProcessing, setIsProcessing] = useState(false);
    const [pixCode, setPixCode] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);

    if (!isOpen) return null;

    const handlePay = () => {
        setIsProcessing(true);

        if (paymentMethod === 'pix') {
            // Simular geração do QR Code
            setTimeout(() => {
                setPixCode('00020126580014BR.GOV.BCB.PIX0136a629532e-7693-4846-b028-f142...');
                setIsProcessing(false);
            }, 1000);
        } else {
            // Simular processamento do cartão
            setTimeout(() => {
                setShowSuccess(true);
                setTimeout(() => {
                    onSuccess();
                }, 2000);
            }, 2000);
        }
    };

    if (showSuccess) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 bg-green-500 z-50 flex items-center justify-center"
            >
                <div className="text-center text-white p-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm"
                    >
                        <CheckCircle2 className="w-12 h-12 text-white" />
                    </motion.div>
                    <h2 className="text-3xl font-bold mb-2">Pagamento confirmado!</h2>
                    <p className="text-green-100">Sua consulta foi agendada com sucesso.</p>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed inset-0 bg-gray-50 z-50 flex flex-col"
        >
            {/* Header */}
            <div className="bg-white px-6 pt-safe pb-4 border-b border-gray-100 sticky top-0 z-10">
                <div className="flex items-center justify-between">
                    <button onClick={onClose} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
                        <ArrowLeft className="w-6 h-6 text-gray-700" />
                    </button>
                    <h1 className="text-lg font-bold text-gray-800">Pagamento</h1>
                    <div className="w-10" />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                {/* Resumo do Pedido */}
                <div className="bg-white p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-500">Consulta com {professionalName}</span>
                        <span className="font-bold text-gray-800">R$ {amount.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-600 text-sm">
                        <Shield className="w-4 h-4" />
                        <span>Pagamento seguro criptografado</span>
                    </div>
                </div>

                {/* Métodos de Pagamento */}
                <div className="p-6">
                    <h2 className="font-bold text-gray-800 mb-4">Escolha como pagar</h2>

                    {/* Pix (Destaque) */}
                    <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setPaymentMethod('pix')}
                        className={`w-full p-4 rounded-2xl border-2 mb-4 flex items-center justify-between transition-all ${paymentMethod === 'pix'
                                ? 'border-purple-600 bg-purple-50'
                                : 'border-gray-200 bg-white'
                            }`}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${paymentMethod === 'pix' ? 'bg-purple-600 text-white' : 'bg-green-100 text-green-600'
                                }`}>
                                <QrCode className="w-6 h-6" />
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-gray-800">Pix</p>
                                <p className="text-xs text-gray-500">Aprovação imediata</p>
                            </div>
                        </div>
                        {paymentMethod === 'pix' && <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center"><CheckCircle2 className="w-4 h-4 text-white" /></div>}
                    </motion.button>

                    {/* Cartão */}
                    <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setPaymentMethod('credit')}
                        className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${paymentMethod === 'credit'
                                ? 'border-purple-600 bg-purple-50'
                                : 'border-gray-200 bg-white'
                            }`}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${paymentMethod === 'credit' ? 'bg-purple-600 text-white' : 'bg-blue-100 text-blue-600'
                                }`}>
                                <CreditCard className="w-6 h-6" />
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-gray-800">Cartão de Crédito</p>
                                <p className="text-xs text-gray-500">1x de R$ {amount.toFixed(2)}</p>
                            </div>
                        </div>
                        {paymentMethod === 'credit' && <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center"><CheckCircle2 className="w-4 h-4 text-white" /></div>}
                    </motion.button>
                </div>

                {/* Detalhes do método selecionado */}
                <AnimatePresence mode="wait">
                    {paymentMethod === 'credit' && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="px-6 pb-6"
                        >
                            <div className="bg-white rounded-2xl p-4 border border-gray-200 space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Número do Cartão</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="0000 0000 0000 0000"
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 font-mono focus:outline-none focus:border-purple-500"
                                        />
                                        <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Validade</label>
                                        <input
                                            type="text"
                                            placeholder="MM/AA"
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 font-mono focus:outline-none focus:border-purple-500"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">CVV</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="123"
                                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 font-mono focus:outline-none focus:border-purple-500"
                                            />
                                            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Nome no Cartão</label>
                                    <input
                                        type="text"
                                        placeholder="Como está no cartão"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">CPF do Titular</label>
                                    <input
                                        type="text"
                                        placeholder="000.000.000-00"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 font-mono focus:outline-none focus:border-purple-500"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {paymentMethod === 'pix' && pixCode && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="px-6 pb-6"
                        >
                            <div className="bg-white rounded-2xl p-6 border border-gray-200 text-center">
                                <div className="w-48 h-48 bg-gray-900 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                                    {/* Mock QR Code */}
                                    <div className="w-40 h-40 bg-white p-2 rounded-lg">
                                        <div className="w-full h-full border-2 border-gray-900 grid grid-cols-6 gap-1 p-1">
                                            {Array.from({ length: 36 }).map((_, i) => (
                                                <div key={i} className={`rounded-sm ${Math.random() > 0.5 ? 'bg-gray-900' : 'bg-white'}`} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 mb-4">Escaneie com app do seu banco</p>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(pixCode);
                                        alert('Código Pix copiado!');
                                    }}
                                    className="w-full py-3 bg-gray-100 text-gray-800 font-bold rounded-xl flex items-center justify-center gap-2"
                                >
                                    Copiar código Pix
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                                <p className="text-xs text-gray-400 mt-4">
                                    Assim que o pagamento for confirmado, você receberá uma notificação.
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Footer com botão de ação */}
            <div className="bg-white border-t border-gray-100 p-6 pb-safe">
                {!pixCode ? (
                    <button
                        onClick={handlePay}
                        disabled={isProcessing}
                        className="w-full bg-purple-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {isProcessing ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1 }}
                                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                            />
                        ) : (
                            <>
                                Pagar R$ {amount.toFixed(2)}
                                <ChevronRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                ) : (
                    <button
                        onClick={() => setShowSuccess(true)}
                        className="w-full bg-green-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-green-500/25"
                    >
                        Já paguei • Confirmar agendamento
                    </button>
                )}
            </div>
        </motion.div>
    );
}
