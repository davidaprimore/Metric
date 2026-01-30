// src/screens/BodyAssessmentScreen.tsx
import { motion } from 'framer-motion';
import { useState } from 'react';
import {
    ArrowLeft,
    Camera,
    TrendingDown,
    TrendingUp,
    Calendar,
    AlertCircle
} from 'lucide-react';

const measures = [
    { id: 1, name: 'Peso', value: 78.5, unit: 'kg', prev: 80.2, date: '30 dias atrás', status: 'down', color: 'blue', icon: '⚖️' },
    { id: 2, name: 'Cintura', value: 82, unit: 'cm', prev: 86, date: '30 dias atrás', status: 'down', color: 'green', icon: '📏' },
    { id: 3, name: 'Quadril', value: 98, unit: 'cm', prev: 97, date: '30 dias atrás', status: 'up', color: 'orange', icon: '🍐' },
    { id: 4, name: 'Braço (D)', value: 32, unit: 'cm', prev: 30, date: '30 dias atrás', status: 'up', color: 'purple', icon: '💪' },
    { id: 5, name: 'Coxa (D)', value: 56, unit: 'cm', prev: 58, date: '30 dias atrás', status: 'down', color: 'pink', icon: '🦵' },
    { id: 6, name: '% Gordura', value: 18.5, unit: '%', prev: 20.2, date: '30 dias atrás', status: 'down', color: 'red', icon: '📊' },
];

export function BodyAssessmentScreen({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [activeTab, setActiveTab] = useState<'measures' | 'photos' | 'history'>('measures');

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
                <div className="flex items-center gap-4 mb-4">
                    <button onClick={onClose} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
                        <ArrowLeft className="w-6 h-6 text-gray-700" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-800">Composição Corporal</h1>
                </div>

                {/* Resumo Card */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-3xl p-5 text-white shadow-lg"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-purple-200 text-sm">Última atualização</p>
                            <p className="font-bold flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Hoje, 08:30
                            </p>
                        </div>
                        <div className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-bold">
                            IMC: 24.2 (Normal)
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-sm">
                            <p className="text-2xl font-bold">78.5 kg</p>
                            <p className="text-purple-200 text-xs flex items-center gap-1">
                                <TrendingDown className="w-3 h-3" />
                                -1.7kg este mês
                            </p>
                        </div>
                        <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-sm">
                            <p className="text-2xl font-bold">18.5%</p>
                            <p className="text-purple-200 text-xs">Gordura corporal</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Tabs */}
            <div className="px-6 py-4 bg-white border-b border-gray-100">
                <div className="flex gap-2 bg-gray-100 p-1 rounded-2xl">
                    {['measures', 'photos', 'history'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === tab ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500'
                                }`}
                        >
                            {tab === 'measures' && 'Medidas'}
                            {tab === 'photos' && 'Fotos'}
                            {tab === 'history' && 'Histórico'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
                {activeTab === 'measures' && (
                    <div className="grid grid-cols-2 gap-4">
                        {measures.map((m, idx) => (
                            <motion.div
                                key={m.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                whileHover={{ scale: 1.02 }}
                                className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100"
                            >
                                <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-xl mb-3">
                                    {m.icon}
                                </div>
                                <div className="flex items-baseline gap-1 mb-1">
                                    <span className="text-2xl font-bold text-gray-800">{m.value}</span>
                                    <span className="text-gray-400 text-sm">{m.unit}</span>
                                </div>
                                <p className="text-gray-500 text-xs mb-2">{m.name}</p>
                                <div className={`flex items-center gap-1 text-xs font-medium ${m.status === 'down' ? 'text-green-600' : 'text-orange-600'
                                    }`}>
                                    {m.status === 'down' ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                                    vs {m.prev} {m.unit}
                                </div>
                            </motion.div>
                        ))}

                        {/* Botão Adicionar Medida */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-purple-50 rounded-3xl p-4 border-2 border-dashed border-purple-200 flex flex-col items-center justify-center gap-2 text-purple-600 min-h-[150px]"
                        >
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-2xl">
                                +
                            </div>
                            <span className="font-semibold text-sm">Nova Medida</span>
                        </motion.button>
                    </div>
                )}

                {activeTab === 'photos' && (
                    <div className="space-y-6">
                        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-3">
                            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                            <p className="text-amber-800 text-sm">
                                <strong>Dica:</strong> Use a mesma roupa, iluminação e ângulo para comparar melhor sua evolução.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <p className="text-sm font-bold text-gray-700 text-center">Hoje</p>
                                <div className="aspect-[3/4] bg-gray-100 rounded-3xl overflow-hidden border-2 border-purple-500 relative">
                                    <img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=600&fit=crop" className="w-full h-full object-cover" />
                                    <div className="absolute top-2 right-2 bg-purple-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                                        ATUAL
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm font-bold text-gray-400 text-center">30 dias atrás</p>
                                <div className="aspect-[3/4] bg-gray-100 rounded-3xl overflow-hidden opacity-60">
                                    <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop" className="w-full h-full object-cover grayscale" />
                                </div>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
                        >
                            <Camera className="w-5 h-5" />
                            Tirar Foto de Progresso
                        </motion.button>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
