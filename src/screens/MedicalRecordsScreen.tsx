import { motion } from 'framer-motion';
import {
    ArrowLeft,
    ChevronRight,
    Download,
    Stethoscope,
    Pill,
    FileSearch
} from 'lucide-react';

const records = [
    {
        id: 1,
        date: '15 Jan 2026',
        type: 'consultation',
        title: 'Consulta Nutricionista',
        doctor: 'Dra. Ana Paula',
        specialty: 'Nutrição',
        summary: 'Ajuste no plano alimentar. Redução de 200kcal no dia de treino. Manter suplementação BCAA.',
        attachments: 2,
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop',
        color: 'bg-green-500',
    },
    {
        id: 2,
        date: '02 Jan 2026',
        type: 'exam',
        title: 'Hemograma Completo',
        doctor: 'Dr. Carlos Mendes',
        specialty: 'Clínico Geral',
        summary: 'Todos os índices dentro da normalidade. Ferro levemente elevado (128 mg/dL). Reteste em 6 meses.',
        attachments: 1,
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop',
        color: 'bg-blue-500',
    },
    {
        id: 3,
        date: '20 Dez 2025',
        type: 'prescription',
        title: 'Prescrição de Suplementos',
        doctor: 'Dra. Marina Costa',
        specialty: 'Nutrição Esportiva',
        summary: 'Whey Protein Isolado 30g pós-treino. Creatina 5g diária. Ômega 3 1g após almoço.',
        attachments: 1,
        image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=100&h=100&fit=crop',
        color: 'bg-purple-500',
    },
];

export function MedicalRecordsScreen({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
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
                    <h1 className="text-xl font-bold text-gray-800">Meu Prontuário</h1>
                </div>

                {/* Search/Filters */}
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                    <button className="px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-semibold">
                        Todos
                    </button>
                    <button className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-full text-sm font-semibold flex items-center gap-2">
                        <Stethoscope className="w-4 h-4" />
                        Consultas
                    </button>
                    <button className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-full text-sm font-semibold flex items-center gap-2">
                        <FileSearch className="w-4 h-4" />
                        Exames
                    </button>
                    <button className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-full text-sm font-semibold flex items-center gap-2">
                        <Pill className="w-4 h-4" />
                        Receitas
                    </button>
                </div>
            </div>

            {/* Timeline/List */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                    {records.map((record, idx) => (
                        <motion.div
                            key={record.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="relative"
                        >
                            {/* Timeline Line */}
                            {idx !== records.length - 1 && (
                                <div className="absolute left-6 top-14 bottom-[-24px] w-0.5 bg-gray-200" />
                            )}

                            <div className="flex gap-4">
                                {/* Date Column */}
                                <div className="flex flex-col items-center min-w-[60px]">
                                    <span className="text-xs text-gray-400 font-medium">{record.date.split(' ')[1]}</span>
                                    <span className="text-lg font-bold text-gray-800">{record.date.split(' ')[0]}</span>
                                    <div className={`w-3 h-3 rounded-full ${record.color} mt-2 ring-4 ring-white`} />
                                </div>

                                {/* Card */}
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    className="flex-1 bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <img src={record.image} className="w-10 h-10 rounded-full object-cover" />
                                            <div>
                                                <h3 className="font-bold text-gray-800 text-sm">{record.title}</h3>
                                                <p className="text-xs text-gray-500">{record.doctor} • {record.specialty}</p>
                                            </div>
                                        </div>
                                        <button className="p-2 hover:bg-gray-50 rounded-full">
                                            <ChevronRight className="w-4 h-4 text-gray-400" />
                                        </button>
                                    </div>

                                    <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-3">
                                        {record.summary}
                                    </p>

                                    {record.attachments > 0 && (
                                        <button className="flex items-center gap-2 text-purple-600 text-xs font-semibold bg-purple-50 px-3 py-2 rounded-xl w-full justify-center">
                                            <Download className="w-4 h-4" />
                                            Baixar anexo ({record.attachments})
                                        </button>
                                    )}
                                </motion.div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
