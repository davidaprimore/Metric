import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AssessmentResults } from '@/components/assessment/AssessmentResults';
import { ChevronRight, ChevronLeft, Check, Weight, Save, Ruler, Activity } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { FluidBackground } from '@/components/layout/FluidBackground';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// --- COMPONENTS ---

const InputCard = ({
    label,
    value,
    onChange,
    unit = 'mm',
    icon: Icon
}: {
    label: string,
    value: number | string,
    onChange: (val: string) => void,
    unit?: string,
    icon?: any
}) => (
    <div className="bg-black/50 backdrop-blur-md border border-white/5 rounded-2xl p-4 flex flex-col justify-between hover:border-[#D4AF37]/30 transition-all group active:scale-[0.98]">
        <div className="flex items-center gap-3 mb-2">
            {Icon && (
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-[#D4AF37] transition-colors">
                    <Icon size={14} />
                </div>
            )}
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">{label}</span>
        </div>
        <div className="flex items-baseline gap-1 self-end">
            <input
                type="number"
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder="0"
                className="bg-transparent text-right text-2xl font-black text-white w-24 outline-none border-b border-white/10 focus:border-[#D4AF37] transition-colors placeholder:text-white/10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <span className="text-[10px] text-slate-600 font-bold lowercase">{unit}</span>
        </div>
    </div>
);

const StepHeader = ({ title, subtitle }: { title: string, subtitle: string }) => (
    <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-1">{title}</h2>
        <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">{subtitle}</p>
    </div>
);

// --- MAIN SCREEN ---

export const AssessmentWizardScreen: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { patientId, appointmentId } = location.state || {};

    // WIZARD STATE
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [isSaving, setIsSaving] = useState(false);

    // DATA STATE
    const [weightInput, setWeightInput] = useState<string>('70');

    // Pollock 7 Fields
    const [skinfolds, setSkinfolds] = useState<Record<string, string>>({
        chest: '', axilla: '', triceps: '', subscapular: '',
        abdomen: '', suprailiac: '', thigh: ''
    });

    // Perimeter Fields
    const [perimeters, setPerimeters] = useState<Record<string, string>>({
        neck: '', shoulder: '', chest_perim: '', waist: '', abdomen_perim: '', hips: '',
        arm_right_relaxed: '', arm_right_contracted: '', arm_left_relaxed: '', arm_left_contracted: '',
        forearm_right: '', forearm_left: '',
        thigh_right: '', thigh_left: '', calf_right: '', calf_left: ''
    });

    // Derived Patient Data
    const [patientData, setPatientData] = useState<any>({ weight: 70, height: 175, age: 30, gender: 'male' });

    useEffect(() => {
        const load = async () => {
            if (!patientId) return;
            const { data } = await supabase.from('profiles').select('*').eq('id', patientId).single();
            if (data) {
                setPatientData({
                    ...data,
                    gender: (data.gender === 'feminine' || data.gender === 'female') ? 'female' : 'male',
                    weight: data.weight || 70
                });
                setWeightInput(data.weight?.toString() || '70');
            }
        };
        load();
    }, [patientId]);

    const handleSkinfoldChange = (key: string, val: string) => {
        setSkinfolds(prev => ({ ...prev, [key]: val }));
    };

    const handlePerimeterChange = (key: string, val: string) => {
        setPerimeters(prev => ({ ...prev, [key]: val }));
    };

    const handleFinish = async () => {
        setIsSaving(true);
        try {
            // Convert strings to numbers
            const cleanSkinfolds: Record<string, number> = {};
            Object.entries(skinfolds).forEach(([k, v]) => cleanSkinfolds[k] = parseFloat(v as string) || 0);

            const cleanPerimeters: Record<string, number> = {};
            Object.entries(perimeters).forEach(([k, v]) => cleanPerimeters[k] = parseFloat(v as string) || 0);

            const sum7 = Object.values(cleanSkinfolds).reduce((a, b) => a + b, 0);

            const fullData = {
                weight: parseFloat(weightInput),
                skinfolds: cleanSkinfolds,
                perimeters: cleanPerimeters
            };

            const { error } = await supabase.from('assessments').insert({
                patient_id: patientId,
                professional_id: (await supabase.auth.getUser()).data.user?.id,
                appointment_id: appointmentId,
                measurements: fullData,
                type: 'pollock7',
                status: 'completed',
                fat_percentage: sum7 * 0.2, // Mock Algo
                weight: parseFloat(weightInput),
                created_at: new Date().toISOString()
            });

            if (error) throw error;
            navigate(`/appointment/${appointmentId}`);
        } catch (err: any) {
            console.error('Error saving assessment:', err);
            alert(`Erro ao salvar: ${err.message || JSON.stringify(err)}`);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <FluidBackground variant="professional" className="flex flex-col relative overflow-hidden pb-10">

            {/* Header */}
            <div className="p-6 flex items-center justify-between z-10 glass-header">
                <button onClick={() => step > 1 ? setStep(s => s - 1 as any) : navigate(-1)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/5 active:scale-95 transition-transform">
                    <ChevronLeft className="text-slate-400" />
                </button>

                {/* Progress Dots */}
                <div className="flex gap-2">
                    {[1, 2, 3].map(i => (
                        <div key={i} className={cn("w-2 h-2 rounded-full transition-all", step === i ? "bg-[#D4AF37] w-6" : "bg-white/10")} />
                    ))}
                </div>

                <div className="w-10"></div>
            </div>

            {/* CONTENT */}
            <div className="flex-1 overflow-y-auto px-6 pb-24 scrollbar-hide">
                <AnimatePresence mode="wait">

                    {/* STEP 1: COMPOSITION */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="w-full max-w-lg mx-auto"
                        >
                            <StepHeader title="Composição Corporal" subtitle="Peso e Dobras Cutâneas (Pollock 7)" />

                            {/* Weight */}
                            <div className="mb-8">
                                <InputCard
                                    label="Peso Corporal Atual"
                                    value={weightInput}
                                    onChange={setWeightInput}
                                    unit="kg"
                                    icon={Weight}
                                />
                            </div>

                            {/* Skinfolds Grid */}
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] mb-4 flex items-center gap-2">
                                <Activity size={12} />
                                Dobras Cutâneas
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                <InputCard label="Peitoral" value={skinfolds.chest} onChange={(v) => handleSkinfoldChange('chest', v)} />
                                <InputCard label="Axilar Média" value={skinfolds.axilla} onChange={(v) => handleSkinfoldChange('axilla', v)} />
                                <InputCard label="Tríceps" value={skinfolds.triceps} onChange={(v) => handleSkinfoldChange('triceps', v)} />
                                <InputCard label="Subescapular" value={skinfolds.subscapular} onChange={(v) => handleSkinfoldChange('subscapular', v)} />
                                <InputCard label="Abdomen" value={skinfolds.abdomen} onChange={(v) => handleSkinfoldChange('abdomen', v)} />
                                <InputCard label="Supra-ilíaca" value={skinfolds.suprailiac} onChange={(v) => handleSkinfoldChange('suprailiac', v)} />
                                <div className="col-span-2">
                                    <InputCard label="Coxa Medial" value={skinfolds.thigh} onChange={(v) => handleSkinfoldChange('thigh', v)} />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: PERIMETERS */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="w-full max-w-lg mx-auto"
                        >
                            <StepHeader title="Perimetria" subtitle="Medidas de Circunferência" />

                            <div className="space-y-6">
                                {/* Upper Body */}
                                <div>
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] mb-3">Superior</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        <InputCard label="Pescoço" value={perimeters.neck} onChange={(v) => handlePerimeterChange('neck', v)} unit="cm" />
                                        <InputCard label="Ombro" value={perimeters.shoulder} onChange={(v) => handlePerimeterChange('shoulder', v)} unit="cm" />
                                        <InputCard label="Peitoral" value={perimeters.chest_perim} onChange={(v) => handlePerimeterChange('chest_perim', v)} unit="cm" />
                                    </div>
                                </div>

                                {/* Arms */}
                                <div>
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] mb-3">Braços</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        <InputCard label="Braço Dir. (Rel)" value={perimeters.arm_right_relaxed} onChange={(v) => handlePerimeterChange('arm_right_relaxed', v)} unit="cm" />
                                        <InputCard label="Braço Esq. (Rel)" value={perimeters.arm_left_relaxed} onChange={(v) => handlePerimeterChange('arm_left_relaxed', v)} unit="cm" />
                                        <InputCard label="Braço Dir. (Cont)" value={perimeters.arm_right_contracted} onChange={(v) => handlePerimeterChange('arm_right_contracted', v)} unit="cm" />
                                        <InputCard label="Braço Esq. (Cont)" value={perimeters.arm_left_contracted} onChange={(v) => handlePerimeterChange('arm_left_contracted', v)} unit="cm" />
                                        <InputCard label="Antebraço Dir." value={perimeters.forearm_right} onChange={(v) => handlePerimeterChange('forearm_right', v)} unit="cm" />
                                        <InputCard label="Antebraço Esq." value={perimeters.forearm_left} onChange={(v) => handlePerimeterChange('forearm_left', v)} unit="cm" />
                                    </div>
                                </div>

                                {/* Torso */}
                                <div>
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] mb-3">Tronco</h3>
                                    <div className="grid grid-cols-3 gap-3">
                                        <InputCard label="Cintura" value={perimeters.waist} onChange={(v) => handlePerimeterChange('waist', v)} unit="cm" />
                                        <InputCard label="Abdomen" value={perimeters.abdomen_perim} onChange={(v) => handlePerimeterChange('abdomen_perim', v)} unit="cm" />
                                        <InputCard label="Quadril" value={perimeters.hips} onChange={(v) => handlePerimeterChange('hips', v)} unit="cm" />
                                    </div>
                                </div>

                                {/* Legs */}
                                <div>
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] mb-3">Inferior</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        <InputCard label="Coxa Dir." value={perimeters.thigh_right} onChange={(v) => handlePerimeterChange('thigh_right', v)} unit="cm" />
                                        <InputCard label="Coxa Esq." value={perimeters.thigh_left} onChange={(v) => handlePerimeterChange('thigh_left', v)} unit="cm" />
                                        <InputCard label="Panturrilha Dir." value={perimeters.calf_right} onChange={(v) => handlePerimeterChange('calf_right', v)} unit="cm" />
                                        <InputCard label="Panturrilha Esq." value={perimeters.calf_left} onChange={(v) => handlePerimeterChange('calf_left', v)} unit="cm" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: RESULTS */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full max-w-md mx-auto"
                        >
                            <div className="mb-8 flex flex-col items-center">
                                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                                    <Check size={32} className="text-emerald-500" />
                                </div>
                                <h3 className="text-xl font-bold text-white text-center">Avaliação Finalizada</h3>
                                <p className="text-xs text-slate-500">Dados processados com sucesso.</p>
                            </div>

                            {/* Pass flattened data to results */}
                            <AssessmentResults
                                patientData={{ ...patientData, weight: parseFloat(weightInput) }}
                                measurements={{
                                    ...Object.fromEntries(Object.entries(skinfolds).map(([k, v]) => [k, parseFloat(v as string) || 0])),
                                    ...Object.fromEntries(Object.entries(perimeters).map(([k, v]) => [k, parseFloat(v as string) || 0]))
                                }}
                            />
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>

            {/* FOOTER ACTIONS */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/95 to-transparent z-20 flex justify-center">
                {step < 3 ? (
                    <button
                        onClick={() => setStep(s => s + 1 as any)}
                        className="h-12 w-full max-w-md rounded-xl bg-[#D4AF37] text-black font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-gold"
                    >
                        Próximo
                        <ChevronRight size={18} />
                    </button>
                ) : (
                    <button
                        onClick={handleFinish}
                        disabled={isSaving}
                        className="h-12 w-full max-w-md rounded-xl bg-emerald-600 text-white font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-500 active:scale-95 transition-all shadow-lg"
                    >
                        <Save size={18} />
                        {isSaving ? 'Salvando...' : 'Salvar Avaliação'}
                    </button>
                )}
            </div>

        </FluidBackground>
    );
};
