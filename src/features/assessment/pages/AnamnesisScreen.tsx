import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    MoreVertical,
    ArrowRight,
    CheckCircle2,
    Target,
    Zap,
    Activity,
    Heart,
    Move,
    AlertCircle,
    Moon,
    Droplets,
    Utensils,
    Smile,
    ShieldCheck,
    Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Toast } from '@/components/ui/Toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

export const AnamnesisScreen: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' | 'loading' });

    const [formData, setFormData] = useState({
        focus: '',
        has_injury: false,
        injury_description: '',
        uses_medication: false,
        medication_details: '',
        family_heart_history: false,
        activity_level: '',
        sleep_quality: 3,
        sleep_hours: '',
        water_intake: '',
        meal_frequency: '',
        has_food_restriction: false,
        food_restriction_details: '',
        stress_level: 3,
        motivation_level: '',
        has_anxiety_depression: false,
        mental_health_details: '',
        agreed_to_terms: false
    });

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => step > 1 ? setStep(prev => prev - 1) : navigate(-1);

    const handleSubmit = async () => {
        if (!formData.agreed_to_terms) {
            setToast({ show: true, message: 'Você precisa aceitar os termos para finalizar.', type: 'error' });
            return;
        }

        setLoading(true);
        try {
            // Remove locally used fields that don't exist in DB
            const { agreed_to_terms, ...dataToSave } = formData;

            const { error } = await supabase.from('anamnesis').insert([{
                user_id: user?.id,
                ...dataToSave,
                token_auth: `MK-${Math.random().toString(36).substr(2, 4).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`
            }]);

            if (error) throw error;

            setToast({ show: true, message: 'Anamnese finalizada com sucesso! ✨', type: 'success' });
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (error: any) {
            console.error('Error saving anamnesis:', error);
            setToast({
                show: true,
                message: 'Erro ao salvar. Verifique se a tabela foi criada no banco de dados.',
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1: return <Step1 data={formData} update={setFormData} onNext={handleNext} />;
            case 2: return <Step2 data={formData} update={setFormData} onNext={handleNext} />;
            case 3: return <Step3 data={formData} update={setFormData} onNext={handleNext} />;
            case 4: return <Step4 data={formData} update={setFormData} onNext={handleNext} />;
            case 5: return <Step5 data={formData} update={setFormData} onFinish={handleSubmit} loading={loading} user={user} />;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-[#F1F3F5] pb-12 font-sans overflow-x-hidden">
            <Toast
                isVisible={toast.show}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ ...toast, show: false })}
            />

            {/* Header */}
            <header className="px-5 pt-8 pb-4 flex justify-between items-center mb-6">
                <button
                    onClick={handleBack}
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-gray-100 shadow-sm active:scale-95"
                >
                    <ChevronLeft size={24} className="text-dark" />
                </button>
                <div className="flex-1 text-center">
                    <p className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">Etapa 0{step}/05</p>
                </div>
                <button className="w-10 h-10 flex items-center justify-center opacity-30">
                    <MoreVertical size={24} className="text-dark" />
                </button>
            </header>

            <div className="px-5 animate-in fade-in slide-in-from-right-4 duration-500">
                {renderStep()}
            </div>
        </div>
    );
};

/* --- STEP COMPONENTS --- */

const Step1 = ({ data, update, onNext }: any) => {
    const focuses = [
        { id: 'emagrecer', label: 'Emagrecer', icon: Target },
        { id: 'hipertrofia', label: 'Hipertrofia', icon: Zap },
        { id: 'performance', label: 'Performance', icon: Activity },
        { id: 'saude', label: 'Saúde', icon: Heart },
        { id: 'flexibilidade', label: 'Flexibilidade', icon: Move },
        { id: 'reabilitacao', label: 'Reabilitação', icon: AlertCircle },
    ];

    return (
        <div className="space-y-8 pb-10">
            <div>
                <h1 className="text-3xl font-black text-dark leading-tight">Objetivos e <span className="text-secondary">Histórico</span></h1>
                <p className="text-gray-400 text-sm mt-2 font-medium">Configure as bases da sua jornada profissional.</p>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                    <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Qual o seu foco?</h2>
                    <span className="text-[9px] font-bold text-secondary uppercase bg-secondary/10 px-2 py-0.5 rounded">Selecione um</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                    {focuses.map(f => (
                        <button
                            key={f.id}
                            onClick={() => update({ ...data, focus: f.id })}
                            className={cn(
                                "aspect-square flex flex-col items-center justify-center p-3 rounded-2xl border transition-all",
                                data.focus === f.id
                                    ? "bg-white border-secondary shadow-lg shadow-secondary/10"
                                    : "bg-white/50 border-gray-100 opacity-60 grayscale hover:grayscale-0 hover:bg-white"
                            )}
                        >
                            <f.icon size={24} className={data.focus === f.id ? "text-secondary" : "text-gray-400"} />
                            <span className={cn(
                                "text-[9px] font-bold mt-2 text-center",
                                data.focus === f.id ? "text-dark" : "text-gray-400"
                            )}>{f.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-6">
                <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Histórico Clínico</h2>

                {/* Injury Toggle */}
                <div className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
                    <div className="flex justify-between items-center">
                        <p className="text-xs font-bold text-dark w-2/3">Possui alguma lesão ou limitação física?</p>
                        <div className="flex bg-gray-100 p-1 rounded-xl">
                            <button
                                onClick={() => update({ ...data, has_injury: true })}
                                className={cn("px-4 py-1.5 text-[9px] font-black rounded-lg transition-all", data.has_injury ? "bg-white text-secondary shadow-sm" : "text-gray-400")}
                            >SIM</button>
                            <button
                                onClick={() => update({ ...data, has_injury: false })}
                                className={cn("px-4 py-1.5 text-[9px] font-black rounded-lg transition-all", !data.has_injury ? "bg-white text-secondary shadow-sm" : "text-gray-400")}
                            >NÃO</button>
                        </div>
                    </div>
                    {data.has_injury && (
                        <textarea
                            className="w-full bg-gray-50 border border-secondary/20 rounded-xl p-3 text-xs font-medium outline-none focus:border-secondary transition-all"
                            placeholder="Descreva a lesão..."
                            value={data.injury_description}
                            onChange={(e) => update({ ...data, injury_description: e.target.value })}
                        />
                    )}
                </div>

                {/* Medication Toggle */}
                <div className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm flex justify-between items-center">
                    <p className="text-xs font-bold text-dark w-2/3">Uso de medicamento contínuo?</p>
                    <div className="flex bg-gray-100 p-1 rounded-xl">
                        <button
                            onClick={() => update({ ...data, uses_medication: true })}
                            className={cn("px-4 py-1.5 text-[9px] font-black rounded-lg transition-all", data.uses_medication ? "bg-white text-secondary shadow-sm" : "text-gray-400")}
                        >SIM</button>
                        <button
                            onClick={() => update({ ...data, uses_medication: false })}
                            className={cn("px-4 py-1.5 text-[9px] font-black rounded-lg transition-all", !data.uses_medication ? "bg-white text-secondary shadow-sm" : "text-gray-400")}
                        >NÃO</button>
                    </div>
                </div>

                {/* Heart History Toggle */}
                <div className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm flex justify-between items-center">
                    <p className="text-xs font-bold text-dark w-2/3">Histórico cardíaco na família?</p>
                    <div className="flex bg-gray-100 p-1 rounded-xl">
                        <button
                            onClick={() => update({ ...data, family_heart_history: true })}
                            className={cn("px-4 py-1.5 text-[9px] font-black rounded-lg transition-all", data.family_heart_history ? "bg-white text-secondary shadow-sm" : "text-gray-400")}
                        >SIM</button>
                        <button
                            onClick={() => update({ ...data, family_heart_history: false })}
                            className={cn("px-4 py-1.5 text-[9px] font-black rounded-lg transition-all", !data.family_heart_history ? "bg-white text-secondary shadow-sm" : "text-gray-400")}
                        >NÃO</button>
                    </div>
                </div>
            </div>

            <Button
                variant="primary"
                className="w-full h-16 rounded-[2rem] bg-secondary text-white font-black text-xs gap-3 shadow-lg shadow-secondary/20 tracking-widest uppercase"
                onClick={onNext}
                disabled={!data.focus}
            >
                PRÓXIMO PASSO <ArrowRight size={18} strokeWidth={3} />
            </Button>
        </div>
    );
};

const Step2 = ({ data, update, onNext }: any) => {
    const levels = [
        { id: 'sedentario', label: 'Sedentário', sub: 'Pouco ou nenhum exercício diário' },
        { id: 'leve', label: 'Leve', sub: 'Exercícios 1-3 dias por semana' },
        { id: 'moderado', label: 'Moderado', sub: 'Exercícios 3-5 dias por semana' },
        { id: 'intenso', label: 'Intenso', sub: 'Exercícios 6-7 dias por semana' },
    ];

    return (
        <div className="space-y-8 pb-10">
            <div>
                <h1 className="text-3xl font-black text-dark leading-tight">Estilo de Vida <br /><span className="text-secondary">e Sono</span></h1>
            </div>

            <div className="space-y-4">
                <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nível de atividade física</h2>
                <div className="space-y-3">
                    {levels.map(l => (
                        <button
                            key={l.id}
                            onClick={() => update({ ...data, activity_level: l.id })}
                            className={cn(
                                "w-full flex items-center justify-between p-5 rounded-[1.5rem] border text-left transition-all",
                                data.activity_level === l.id
                                    ? "bg-white border-secondary shadow-md"
                                    : "bg-white/50 border-gray-100"
                            )}
                        >
                            <div>
                                <p className={cn("text-xs font-black uppercase", data.activity_level === l.id ? "text-dark" : "text-gray-400")}>{l.label}</p>
                                <p className="text-[10px] text-gray-400 font-medium">{l.sub}</p>
                            </div>
                            <div className={cn(
                                "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                                data.activity_level === l.id ? "border-secondary bg-secondary" : "border-gray-200"
                            )}>
                                {data.activity_level === l.id && <CheckCircle2 size={12} className="text-white" />}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Qualidade do sono</h2>
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm text-center">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-6">Como você avalia seu descanso?</p>
                    <div className="flex justify-between px-2">
                        {[1, 2, 3, 4, 5].map(v => (
                            <button
                                key={v}
                                onClick={() => update({ ...data, sleep_quality: v })}
                                className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
                                    data.sleep_quality === v ? "bg-secondary text-white border-secondary scale-125" : "bg-gray-50 text-gray-200 border-transparent"
                                )}
                            >
                                <Moon size={16} fill={data.sleep_quality === v ? "currentColor" : "none"} />
                            </button>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-[8px] font-black text-gray-300 uppercase px-2">
                        <span>Muito Ruim</span>
                        <span>Excelente</span>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Horas de sono por noite</h2>
                <div className="grid grid-cols-2 gap-3">
                    {['Menos de 5h', '5h - 6h', '7h - 8h', 'Mais de 8h'].map(h => (
                        <button
                            key={h}
                            onClick={() => update({ ...data, sleep_hours: h })}
                            className={cn(
                                "py-4 rounded-xl border font-black text-[10px] transition-all",
                                data.sleep_hours === h ? "bg-secondary/5 border-secondary text-secondary shadow-sm" : "bg-white border-gray-100 text-gray-400"
                            )}
                        >
                            {h}
                        </button>
                    ))}
                </div>
            </div>

            <Button
                variant="primary"
                className="w-full h-16 rounded-[2rem] bg-secondary text-white font-black text-xs gap-3 shadow-lg shadow-secondary/20 tracking-widest uppercase mt-4"
                onClick={onNext}
                disabled={!data.activity_level || !data.sleep_hours}
            >
                PRÓXIMO PASSO <ArrowRight size={18} strokeWidth={3} />
            </Button>
        </div>
    );
};

const Step3 = ({ data, update, onNext }: any) => {
    return (
        <div className="space-y-8 pb-10">
            <div>
                <h1 className="text-3xl font-black text-dark leading-tight">Hábitos <br /><span className="text-secondary">Alimentares</span></h1>
            </div>

            <div className="space-y-4">
                <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Consumo diário de água</h2>
                <div className="grid grid-cols-2 gap-4">
                    {['Menos de 1L', '1-2 Litros', '2-3 Litros', 'Mais de 3L'].map(w => (
                        <button
                            key={w}
                            onClick={() => update({ ...data, water_intake: w })}
                            className={cn(
                                "p-5 rounded-[1.5rem] bg-white border flex flex-col items-center gap-3 transition-all",
                                data.water_intake === w ? "border-secondary shadow-md ring-2 ring-secondary/10" : "border-gray-100"
                            )}
                        >
                            <Droplets size={24} className={data.water_intake === w ? "text-secondary" : "text-gray-300"} />
                            <span className={cn("text-[10px] font-black uppercase", data.water_intake === w ? "text-dark" : "text-gray-400")}>{w}</span>
                            {data.water_intake === w && <div className="w-4 h-4 rounded-full bg-secondary flex items-center justify-center"><CheckCircle2 size={10} className="text-white" /></div>}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Frequência de refeições</h2>
                <div className="flex justify-between gap-2">
                    {['1-2', '3-4', '5-6', '6+'].map(f => (
                        <button
                            key={f}
                            onClick={() => update({ ...data, meal_frequency: f })}
                            className={cn(
                                "flex-1 py-4 rounded-2xl border font-black text-[11px] transition-all",
                                data.meal_frequency === f ? "bg-secondary text-white border-secondary shadow-md scale-105" : "bg-white border-gray-100 text-gray-400"
                            )}
                        >
                            {f}
                        </button>
                    ))}
                </div>
                <p className="text-[8px] font-bold text-gray-300 uppercase tracking-widest text-center mt-2">Refeições sólidas por dia</p>
            </div>

            <div className="space-y-6">
                <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Restrições ou Alergias</h2>
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
                    <div className="flex justify-between items-center">
                        <p className="text-xs font-bold text-dark w-2/3 leading-tight">Possui alguma restrição alimentar ou alergia conhecida?</p>
                        <div className="flex bg-gray-100 p-1 rounded-xl shrink-0">
                            <button
                                onClick={() => update({ ...data, has_food_restriction: true })}
                                className={cn("px-4 py-1.5 text-[9px] font-black rounded-lg transition-all", data.has_food_restriction ? "bg-white text-secondary shadow-sm" : "text-gray-400")}
                            >SIM</button>
                            <button
                                onClick={() => update({ ...data, has_food_restriction: false })}
                                className={cn("px-4 py-1.5 text-[9px] font-black rounded-lg transition-all", !data.has_food_restriction ? "bg-white text-secondary shadow-sm" : "text-gray-400")}
                            >NÃO</button>
                        </div>
                    </div>
                    {data.has_food_restriction && (
                        <textarea
                            className="w-full bg-gray-50 border border-secondary/20 rounded-xl p-4 text-xs font-medium outline-none focus:border-secondary transition-all min-h-[100px]"
                            placeholder="Descreva aqui (ex: Intolerância à lactose, alergia a amendoim...)"
                            value={data.food_restriction_details}
                            onChange={(e) => update({ ...data, food_restriction_details: e.target.value })}
                        />
                    )}
                </div>
            </div>

            <Button
                variant="primary"
                className="w-full h-16 rounded-[2rem] bg-secondary text-white font-black text-xs gap-3 shadow-lg shadow-secondary/20 tracking-widest uppercase mt-4"
                onClick={onNext}
                disabled={!data.water_intake || !data.meal_frequency}
            >
                PRÓXIMO PASSO <ArrowRight size={18} strokeWidth={3} />
            </Button>
        </div>
    );
};

const Step4 = ({ data, update, onNext }: any) => {
    return (
        <div className="space-y-8 pb-10">
            <div>
                <h1 className="text-3xl font-black text-dark leading-tight">Bem-estar <br /><span className="text-secondary">e Estresse</span></h1>
                <p className="text-gray-400 text-sm mt-2 font-medium">Fatores psicológicos e nível de estresse atual.</p>
            </div>

            <div className="space-y-4">
                <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nível de estresse diário</h2>
                <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center justify-between px-6">
                    {[1, 2, 3, 4, 5].map(v => (
                        <button
                            key={v}
                            onClick={() => update({ ...data, stress_level: v })}
                            className={cn(
                                "w-10 h-14 rounded-xl border flex flex-col items-center justify-center transition-all",
                                data.stress_level === v ? "bg-secondary text-white border-secondary shadow-lg scale-110" : "bg-gray-50 border-gray-100 text-gray-300"
                            )}
                        >
                            <span className="text-sm font-black">{v}</span>
                        </button>
                    ))}
                </div>
                <div className="flex justify-between px-6 text-[8px] font-black text-gray-300 uppercase">
                    <span>Muito Baixo</span>
                    <span>Muito Alto</span>
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Como você avalia sua motivação atual?</h2>
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { id: 'baixa', label: 'BAIXA', icon: Smile },
                        { id: 'media', label: 'MÉDIA', icon: Smile },
                        { id: 'alta', label: 'ALTA', icon: Smile },
                    ].map(m => (
                        <button
                            key={m.id}
                            onClick={() => update({ ...data, motivation_level: m.id })}
                            className={cn(
                                "p-4 rounded-2xl bg-white border flex flex-col items-center justify-center gap-2 transition-all",
                                data.motivation_level === m.id ? "border-secondary shadow-md scale-105" : "border-gray-100 opacity-60 grayscale"
                            )}
                        >
                            <m.icon size={20} className={data.motivation_level === m.id ? "text-secondary" : "text-gray-300"} />
                            <span className={cn("text-[9px] font-black", data.motivation_level === m.id ? "text-dark" : "text-gray-400")}>{m.label}</span>
                            {data.motivation_level === m.id && <div className="w-3 h-3 rounded-full bg-secondary flex items-center justify-center"><CheckCircle2 size={8} className="text-white" /></div>}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-6">
                <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-loose">Possui histórico de ansiedade ou depressão?</h2>
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
                    <div className="flex bg-gray-100 p-1 rounded-xl w-32 mx-auto">
                        <button
                            onClick={() => update({ ...data, has_anxiety_depression: true })}
                            className={cn("flex-1 py-1.5 text-[9px] font-black rounded-lg transition-all", data.has_anxiety_depression ? "bg-white text-secondary shadow-sm" : "text-gray-400")}
                        >SIM</button>
                        <button
                            onClick={() => update({ ...data, has_anxiety_depression: false })}
                            className={cn("flex-1 py-1.5 text-[9px] font-black rounded-lg transition-all", !data.has_anxiety_depression ? "bg-white text-secondary shadow-sm" : "text-gray-400")}
                        >NÃO</button>
                    </div>
                    {data.has_anxiety_depression && (
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-gray-300 uppercase tracking-widest ml-2">Detalhes do Histórico</label>
                            <textarea
                                className="w-full bg-gray-50 border border-secondary/20 rounded-xl p-4 text-xs font-medium outline-none focus:border-secondary transition-all min-h-[100px]"
                                placeholder="Descreva brevemente seu histórico clínico..."
                                value={data.mental_health_details}
                                onChange={(e) => update({ ...data, mental_health_details: e.target.value })}
                            />
                        </div>
                    )}
                </div>
            </div>

            <Button
                variant="primary"
                className="w-full h-16 rounded-[2rem] bg-secondary text-white font-black text-xs gap-3 shadow-lg shadow-secondary/20 tracking-widest uppercase mt-4"
                onClick={onNext}
                disabled={!data.motivation_level}
            >
                PRÓXIMO PASSO <ArrowRight size={18} strokeWidth={3} />
            </Button>
        </div>
    );
};

const Step5 = ({ data, update, onFinish, loading, user }: any) => {
    return (
        <div className="space-y-8 pb-10">
            <div>
                <h1 className="text-3xl font-black text-dark leading-tight">Termos e <br /><span className="text-secondary">Finalização</span></h1>
            </div>

            <div className="space-y-4">
                <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Termo de Consentimento</h2>
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <h3 className="text-xs font-black text-dark">1. PRIVACIDADE DE DADOS</h3>
                            <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
                                Ao utilizar a plataforma METRIK, você concorda que seus dados biométricos, respostas de anamnese e resultados de avaliações físicas sejam processados e armazenados com segurança, seguindo as diretrizes da LGPD (Lei Geral de Proteção de Dados).
                            </p>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-xs font-black text-dark">2. PRECISÃO DOS RESULTADOS</h3>
                            <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
                                Os resultados gerados dependem da precisão das informações fornecidas por você. A plataforma utiliza algoritmos avançados para...
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => update({ ...data, agreed_to_terms: !data.agreed_to_terms })}
                        className="flex items-center gap-3 text-left group"
                    >
                        <div className={cn(
                            "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                            data.agreed_to_terms ? "bg-secondary border-secondary scale-110 shadow-lg shadow-secondary/20" : "border-gray-200"
                        )}>
                            {data.agreed_to_terms && <CheckCircle2 size={14} className="text-white" />}
                        </div>
                        <span className={cn("text-[10px] font-bold leading-tight", data.agreed_to_terms ? "text-dark" : "text-gray-400")}>
                            Li e concordo com os termos de uso e política de privacidade.
                        </span>
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Identificação do Avaliado</h2>
                <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest mb-1 ml-1">Nome do Paciente</p>
                        <p className="text-sm font-black text-dark">{user?.user_metadata?.first_name} {user?.user_metadata?.last_name}</p>
                    </div>
                </div>
                <div className="flex items-center justify-between px-4 opacity-50">
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={12} className="text-secondary" />
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Token de Autenticação</span>
                    </div>
                    <span className="text-[9px] font-bold text-gray-400 uppercase">Aguardando Envio</span>
                </div>
            </div>

            <Button
                variant="primary"
                className="w-full h-16 rounded-[2rem] bg-secondary text-white font-black text-xs gap-3 shadow-lg shadow-secondary/20 tracking-widest uppercase mt-4"
                onClick={onFinish}
                disabled={loading || !data.agreed_to_terms}
            >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                    <>FINALIZAR ANAMNESE <ArrowRight size={18} strokeWidth={3} /></>
                )}
            </Button>
        </div>
    );
};
