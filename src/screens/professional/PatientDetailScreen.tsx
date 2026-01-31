import { motion } from 'framer-motion';
import {
    ArrowLeft,
    MessageCircle,
    Calendar,
    FileText,
    Scale,
    Utensils,
    History,
    ClipboardList
} from 'lucide-react';

export function PatientDetailScreen({
    patientId,
    onClose
}: {
    patientId: string;
    onClose: () => void;
}) {
    // Mock de dados do paciente
    const patient = {
        name: 'Marina Silva',
        age: 28,
        goal: 'Emagrecimento',
        avatar: 'https://i.pravatar.cc/150?img=1',
        metrics: { imc: 24.5, fat: '18.5%', weight: '64kg' },
        lastVisit: '10 Jan, 2026',
        nextVisit: '10 Fev, 2026'
    };

    return (
        <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed inset-0 bg-gray-50 z-[60] flex flex-col max-w-[430px] mx-auto overflow-hidden shadow-2xl"
        >
            {/* Header */}
            <div className="bg-white px-6 pt-safe pb-6 border-b border-gray-100 sticky top-0 z-10">
                <div className="flex items-center justify-between mb-6">
                    <button onClick={onClose} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
                        <ArrowLeft className="w-6 h-6 text-gray-700" />
                    </button>
                    <div className="flex gap-2">
                        <button className="w-10 h-10 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center">
                            <MessageCircle className="w-5 h-5" />
                        </button>
                        <button className="px-4 bg-purple-600 text-white rounded-full font-bold text-sm shadow-md">
                            Agendar Retorno
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <img src={patient.avatar} className="w-20 h-20 rounded-3xl object-cover border-4 border-purple-50 shadow-sm" alt={patient.name} />
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">{patient.name}</h1>
                        <p className="text-gray-500 font-medium">{patient.age} anos • {patient.goal}</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Metrics Grid */}
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { label: 'Peso', value: patient.metrics.weight, icon: Scale, color: 'text-blue-600', bg: 'bg-blue-50' },
                        { label: 'Gordura', value: patient.metrics.fat, icon: History, color: 'text-orange-600', bg: 'bg-orange-50' },
                        { label: 'IMC', value: patient.metrics.imc, icon: FileText, color: 'text-green-600', bg: 'bg-green-50' },
                    ].map((m, idx) => (
                        <div key={idx} className="bg-white p-3 rounded-2xl border border-gray-100 text-center shadow-sm">
                            <div className={`w-8 h-8 ${m.bg} ${m.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                                <m.icon className="w-4 h-4" />
                            </div>
                            <p className="text-sm font-bold text-gray-800">{m.value}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase">{m.label}</p>
                        </div>
                    ))}
                </div>

                {/* Proxima/Ultima Consulta */}
                <div className="flex gap-3">
                    <div className="flex-1 bg-white p-4 rounded-2xl border border-gray-100">
                        <p className="text-[10px] text-gray-400 font-bold mb-2 uppercase">Última Consulta</p>
                        <div className="flex items-center gap-2 text-gray-700">
                            <Calendar className="w-4 h-4 text-purple-600" />
                            <span className="font-bold text-sm">{patient.lastVisit}</span>
                        </div>
                    </div>
                    <div className="flex-1 bg-purple-600 p-4 rounded-2xl text-white shadow-lg shadow-purple-600/20">
                        <p className="text-[10px] text-purple-100 font-bold mb-2 uppercase">Próximo Retorno</p>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-purple-200" />
                            <span className="font-bold text-sm">{patient.nextVisit}</span>
                        </div>
                    </div>
                </div>

                {/* Menu de Seções */}
                <div className="space-y-3">
                    <h2 className="text-lg font-bold text-gray-800 mb-2">Histórico do Paciente</h2>
                    {[
                        { label: 'Anamnese Completa', icon: ClipboardList, color: 'bg-blue-500', count: 'Finalizada' },
                        { label: 'Diário Alimentar', icon: Utensils, color: 'bg-green-500', count: '12 logs' },
                        { label: 'Avaliações Corporais', icon: Scale, color: 'bg-orange-500', count: '3 registros' },
                        { label: 'Exames Laboratoriais', icon: FileText, color: 'bg-red-500', count: '2 novos' },
                    ].map((item, idx) => (
                        <div
                            key={idx}
                            className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between group cursor-pointer active:scale-[0.98] transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center text-white`}>
                                    <item.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800 text-sm">{item.label}</h4>
                                    <p className="text-xs text-gray-400">{item.count}</p>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-purple-600 transition-colors" />
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

function ChevronRight(props: any) {
    return (
        <svg
            {...props}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m9 18 6-6-6-6" />
        </svg>
    );
}
