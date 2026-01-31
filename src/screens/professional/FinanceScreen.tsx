import { motion } from 'framer-motion';
import {
    ArrowLeft,
    TrendingUp,
    ArrowUpRight,
    ArrowDownLeft,
    Download,
    Filter,
    CalendarDays,
    CreditCard,
    Wallet
} from 'lucide-react';

const history = [
    { id: 1, type: 'income', title: 'Marina Silva', date: 'Hoje, 09:00', amount: 280, method: 'Pix' },
    { id: 2, type: 'income', title: 'João Pedro', date: 'Hoje, 10:30', amount: 330, method: 'Cartão' },
    { id: 3, type: 'income', title: 'Ana Paula', date: 'Ontem', amount: 280, method: 'Pix' },
    { id: 4, type: 'outcome', title: 'Taxa Metrika', date: 'Ontem', amount: -28, method: 'Taxa' },
    { id: 5, type: 'income', title: 'Carlos Eduardo', date: '21 Jan', amount: 330, method: 'Cartão' },
];

export function FinanceScreen({ onClose }: { onClose?: () => void }) {
    return (
        <div className="min-h-screen bg-gray-50 pb-24 max-w-[430px] mx-auto overflow-x-hidden">
            {/* Header com Saldo em Destaque */}
            <div className="bg-gradient-to-br from-purple-700 to-purple-900 px-6 pt-safe pb-10 text-white rounded-b-[40px] shadow-xl">
                <div className="flex items-center justify-between mb-8">
                    <button onClick={onClose} className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                        <ArrowLeft className="w-5 h-5 text-white" />
                    </button>
                    <h1 className="text-lg font-bold">Financeiro</h1>
                    <button className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                        <Download className="w-5 h-5 text-white" />
                    </button>
                </div>

                <div className="text-center">
                    <p className="text-purple-200 text-sm font-medium mb-1">Saldo Disponível</p>
                    <h2 className="text-4xl font-bold mb-6">R$ 4.280,50</h2>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 text-left border border-white/10">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="p-1 bg-green-500/20 rounded-lg">
                                    <ArrowUpRight className="w-3 h-3 text-green-400" />
                                </div>
                                <span className="text-[10px] font-bold text-purple-200">ENTRADAS</span>
                            </div>
                            <p className="text-lg font-bold">R$ 5.120</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 text-left border border-white/10">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="p-1 bg-red-500/20 rounded-lg">
                                    <ArrowDownLeft className="w-3 h-3 text-red-400" />
                                </div>
                                <span className="text-[10px] font-bold text-purple-200">SAÍDAS</span>
                            </div>
                            <p className="text-lg font-bold">R$ 840</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-6 -mt-6">
                <button className="w-full bg-white text-purple-600 font-bold py-4 rounded-2xl shadow-lg shadow-purple-900/10 flex items-center justify-center gap-2 active:scale-95 transition-transform border border-purple-50">
                    <Wallet className="w-5 h-5" />
                    Solicitar Saque
                </button>
            </div>

            <div className="p-6">
                {/* Gráfico Mock/Indicador */}
                <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-800">Desempenho Semanal</h3>
                        <span className="text-green-500 text-xs font-bold flex items-center gap-1">
                            +12% <TrendingUp className="w-3 h-3" />
                        </span>
                    </div>
                    <div className="flex items-end justify-between h-24 pt-4">
                        {[35, 65, 45, 80, 55, 90, 70].map((height, i) => (
                            <div key={i} className="flex flex-col items-center gap-2">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${height}%` }}
                                    className={`w-3 rounded-full ${i === 5 ? 'bg-purple-600' : 'bg-purple-200'}`}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Extrato */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-800">Extrato Detalhado</h3>
                        <button className="p-2 bg-gray-100 rounded-xl text-gray-500">
                            <Filter className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="space-y-3">
                        {history.map((item, idx) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4"
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.type === 'income' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                    }`}>
                                    {item.type === 'income' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-800 text-sm">{item.title}</h4>
                                    <p className="text-[11px] text-gray-500">{item.date} • {item.method}</p>
                                </div>
                                <p className={`font-bold ${item.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
                                    {item.amount > 0 ? '+' : ''} R$ {item.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
