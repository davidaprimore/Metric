import { motion } from 'framer-motion';
import { useState } from 'react';
import {
    ArrowLeft,
    CheckCircle2,
    Activity,
    Heart,
    Utensils,
    Moon,
    AlertCircle
} from 'lucide-react';

const sections = [
    {
        id: 'health',
        title: 'Histórico de Saúde',
        icon: Activity,
        questions: [
            { id: 'diseases', label: 'Possui alguma condição de saúde diagnosticada?', type: 'multiselect', options: ['Diabetes', 'Hipertensão', 'Hipotireoidismo', 'Asma', 'Nenhuma'] },
            { id: 'medications', label: 'Toma algum medicamento regularmente?', type: 'textarea', placeholder: 'Liste os medicamentos...' },
            { id: 'allergies', label: 'Alergias alimentares ou medicamentosas?', type: 'textarea', placeholder: 'Descreva as alergias...' },
            { id: 'surgeries', label: 'Já realizou alguma cirurgia?', type: 'textarea', placeholder: 'Quando e qual procedimento?' },
        ]
    },
    {
        id: 'lifestyle',
        title: 'Estilo de Vida',
        icon: Utensils,
        questions: [
            { id: 'activity', label: 'Nível de atividade física atual', type: 'select', options: ['Sedentário', 'Leve (1x semana)', 'Moderado (3x semana)', 'Intenso (5x+ semana)'] },
            { id: 'sleep', label: 'Média de horas de sono', type: 'select', options: ['Menos de 5h', '5-6h', '7-8h', 'Mais de 8h'] },
            { id: 'stress', label: 'Nível de estresse', type: 'select', options: ['Baixo', 'Moderado', 'Alto', 'Muito Alto'] },
            { id: 'objective', label: 'Qual seu principal objetivo?', type: 'select', options: ['Emagrecer', 'Ganhar massa muscular', 'Manter peso', 'Melhorar performance', 'Saúde geral'] },
        ]
    },
    {
        id: 'diet',
        title: 'Hábitos Alimentares',
        icon: Heart,
        questions: [
            { id: 'meals', label: 'Quantas refeições faz por dia?', type: 'select', options: ['2-3', '4-5', '6+'] },
            { id: 'water', label: 'Litros de água por dia', type: 'select', options: ['Menos de 1L', '1-2L', '2-3L', 'Mais de 3L'] },
            { id: 'restrictions', label: 'Restrições alimentares', type: 'multiselect', options: ['Vegetariano', 'Vegano', 'Sem glúten', 'Sem lactose', 'Low carb', 'Nenhuma'] },
        ]
    }
];

export function AnamneseScreen({
    isOpen,
    onClose,
    onComplete
}: {
    isOpen: boolean;
    onClose: () => void;
    onComplete: () => void;
}) {
    const [currentSection, setCurrentSection] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [isCompleted, setIsCompleted] = useState(false);

    if (!isOpen) return null;

    const section = sections[currentSection];
    const progress = ((currentSection + 1) / sections.length) * 100;

    const handleNext = () => {
        if (currentSection < sections.length - 1) {
            setCurrentSection(c => c + 1);
        } else {
            setIsCompleted(true);
            setTimeout(onComplete, 2000);
        }
    };

    if (isCompleted) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 bg-purple-600 z-50 flex items-center justify-center"
            >
                <div className="text-center text-white p-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring" }}
                        className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                        <CheckCircle2 className="w-12 h-12 text-white" />
                    </motion.div>
                    <h2 className="text-3xl font-bold mb-2">Anamnese Concluída!</h2>
                    <p className="text-purple-100">Seu profissional já pode ver suas informações.</p>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed inset-0 bg-white z-50 flex flex-col"
        >
            {/* Header */}
            <div className="bg-white px-6 pt-safe pb-4 border-b border-gray-100 sticky top-0 z-10">
                <div className="flex items-center justify-between mb-4">
                    <button onClick={onClose} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
                        <ArrowLeft className="w-6 h-6 text-gray-700" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-800">Anamnese</h1>
                    <span className="text-sm text-purple-600 font-bold">{currentSection + 1}/{sections.length}</span>
                </div>

                {/* Progresso */}
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-purple-600"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600">
                        <section.icon className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">{section.title}</h2>
                </div>

                <div className="space-y-6">
                    {section.questions.map((q, idx) => (
                        <motion.div
                            key={q.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-gray-50 rounded-2xl p-4"
                        >
                            <label className="block text-sm font-bold text-gray-700 mb-3">
                                {q.label}
                            </label>

                            {q.type === 'select' && (
                                <div className="space-y-2">
                                    {q.options?.map(opt => (
                                        <button
                                            key={opt}
                                            onClick={() => setAnswers({ ...answers, [q.id]: opt })}
                                            className={`w-full py-3 px-4 rounded-xl text-left text-sm font-medium transition-colors ${answers[q.id] === opt
                                                    ? 'bg-purple-600 text-white'
                                                    : 'bg-white border border-gray-200 text-gray-700 hover:border-purple-300'
                                                }`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {q.type === 'multiselect' && (
                                <div className="flex flex-wrap gap-2">
                                    {q.options?.map(opt => {
                                        const isSelected = (answers[q.id] || []).includes(opt);
                                        return (
                                            <button
                                                key={opt}
                                                onClick={() => {
                                                    const current = answers[q.id] || [];
                                                    const updated = isSelected
                                                        ? current.filter((item: string) => item !== opt)
                                                        : [...current, opt];
                                                    setAnswers({ ...answers, [q.id]: updated });
                                                }}
                                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${isSelected
                                                        ? 'bg-purple-600 text-white'
                                                        : 'bg-white border border-gray-200 text-gray-600'
                                                    }`}
                                            >
                                                {opt}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            {q.type === 'textarea' && (
                                <textarea
                                    value={answers[q.id] || ''}
                                    onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                                    placeholder={q.placeholder}
                                    className="w-full p-3 rounded-xl border border-gray-200 resize-none h-24 focus:outline-none focus:border-purple-500 text-sm"
                                />
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100">
                <button
                    onClick={handleNext}
                    className="w-full bg-purple-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2"
                >
                    {currentSection < sections.length - 1 ? 'Próxima Etapa' : 'Finalizar Anamnese'}
                </button>
            </div>
        </motion.div>
    );
}
