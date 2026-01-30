// src/screens/ProfessionalOnboardingScreen.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
    ArrowLeft,
    ChevronRight,
    Check,
    Camera,
    Building2,
    GraduationCap,
    Award,
    FileText,
    MapPin,
    Star,
    Plus
} from 'lucide-react';

const steps = [
    { id: 1, title: 'Dados Pessoais', icon: Building2 },
    { id: 2, title: 'Formação', icon: GraduationCap },
    { id: 3, title: 'Especialidades', icon: Award },
    { id: 4, title: 'Documentos', icon: FileText },
    { id: 5, title: 'Local', icon: MapPin },
    { id: 6, title: 'Concluir', icon: Check },
];

export function ProfessionalOnboarding({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        crm: '',
        specialty: '',
        bio: '',
        atendeOnline: true,
        atendePresencial: true,
    });

    if (!isOpen) return null;

    const nextStep = () => {
        if (currentStep < steps.length) setCurrentStep(c => c + 1);
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(c => c - 1);
    };

    const progress = ((currentStep - 1) / (steps.length - 1)) * 100;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white z-50 flex flex-col pt-safe"
        >
            {/* Header com Progresso */}
            <div className="px-6 pb-4 border-b border-gray-100 bg-white sticky top-0 z-10 transition-all">
                <div className="flex items-center justify-between mb-4">
                    <button
                        onClick={currentStep === 1 ? onClose : prevStep}
                        className="p-2 -ml-2 hover:bg-gray-100 rounded-full"
                    >
                        <ArrowLeft className="w-6 h-6 text-gray-700" />
                    </button>
                    <h1 className="text-lg font-bold text-gray-800">
                        {steps.find(s => s.id === currentStep)?.title}
                    </h1>
                    <div className="w-10 text-right text-sm text-gray-400 font-medium">
                        {currentStep}/{steps.length}
                    </div>
                </div>

                {/* Barra de Progresso */}
                <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    />
                </div>

                {/* Steps Indicators */}
                <div className="flex justify-between mt-4 px-2">
                    {steps.map((step) => (
                        <div key={step.id} className="flex flex-col items-center gap-1">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-colors ${step.id < currentStep ? 'bg-green-500 text-white' :
                                    step.id === currentStep ? 'bg-purple-600 text-white' :
                                        'bg-gray-100 text-gray-400'
                                }`}>
                                {step.id < currentStep ? <Check className="w-4 h-4" /> : <step.icon className="w-4 h-4" />}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Conteúdo do Step */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                <AnimatePresence mode='wait'>
                    {currentStep === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="text-center mb-8">
                                <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center border-4 border-dashed border-gray-300 relative overflow-hidden">
                                    <Camera className="w-8 h-8 text-gray-400" />
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-[10px] font-medium opacity-0 hover:opacity-100 transition-opacity">
                                        Adicionar foto
                                    </div>
                                </div>
                                <p className="text-gray-500 text-sm">Adicione uma foto profissional</p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Nome completo</label>
                                    <input
                                        type="text"
                                        placeholder="Como deseja ser chamado?"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-purple-500 focus:bg-white transition-all text-sm"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Registro Profissional (CRM/CRN)</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: CRM-SP 123456"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-purple-500 focus:bg-white transition-all text-sm"
                                        value={formData.crm}
                                        onChange={(e) => setFormData({ ...formData, crm: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Mini bio</label>
                                    <textarea
                                        placeholder="Fale um pouco sobre sua experiência..."
                                        rows={4}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-purple-500 focus:bg-white transition-all resize-none text-sm"
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    />
                                    <p className="text-right text-[10px] text-gray-400 mt-1">{formData.bio.length}/280</p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4"
                        >
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Sua formação acadêmica</h2>

                            {[1].map((idx) => (
                                <div key={idx} className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="font-bold text-gray-700 text-sm">Formação {idx}</h3>
                                    </div>

                                    <div className="space-y-3">
                                        <input
                                            type="text"
                                            placeholder="Instituição (ex: USP)"
                                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Título (ex: Nutrição)"
                                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm"
                                        />
                                        <div className="flex gap-2">
                                            <select className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-600 outline-none">
                                                <option>Ano início</option>
                                            </select>
                                            <select className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-600 outline-none">
                                                <option>Ano fim</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <button className="w-full py-3 border-2 border-dashed border-purple-200 text-purple-600 rounded-2xl font-medium hover:bg-purple-50 transition-colors flex items-center justify-center gap-2 text-sm">
                                <Plus className="w-4 h-4" />
                                Adicionar outra formação
                            </button>
                        </motion.div>
                    )}

                    {currentStep === 6 && (
                        <motion.div
                            key="step6"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center h-full text-center py-10"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", delay: 0.2 }}
                                className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6"
                            >
                                <Check className="w-12 h-12 text-green-600" />
                            </motion.div>

                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Parabéns!</h2>
                            <p className="text-gray-600 mb-8 max-w-xs text-sm">
                                Seu perfil foi criado com sucesso. Agora você pode começar a atender seus pacientes pela plataforma.
                            </p>

                            <div className="bg-purple-50 rounded-2xl p-4 w-full mb-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <Star className="w-5 h-5 text-purple-600" />
                                    <span className="font-bold text-purple-800 text-sm">Dica Profissional</span>
                                </div>
                                <p className="text-xs text-purple-700 text-left">
                                    Complete seu calendário de disponibilidade para aparecer nas buscas dos pacientes.
                                </p>
                            </div>

                            <button
                                onClick={onClose}
                                className="w-full bg-purple-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-purple-600/25 transition-transform active:scale-95"
                            >
                                Ir para meu perfil
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Footer com Botão Próximo */}
            {currentStep < 6 && (
                <div className="p-6 border-t border-gray-100 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
                    <button
                        onClick={nextStep}
                        className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors active:scale-95"
                    >
                        Continuar
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            )}
        </motion.div>
    );
}
