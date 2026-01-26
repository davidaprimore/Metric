import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SpatialBodyMap } from '@/components/assessment/SpatialBodyMap';
import { MeasurementHUD } from '@/components/assessment/MeasurementHUD';
import { AssessmentResults } from '@/components/assessment/AssessmentResults';
import { ChevronLeft, Save, RotateCcw, Activity, Ruler } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { FluidBackground } from '@/components/layout/FluidBackground';

export const AssessmentSpatialScreen: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { patientId, appointmentId } = location.state || {};

    // State
    const [activeTab, setActiveTab] = useState<'measurements' | 'results'>('measurements');
    const [gender, setGender] = useState<'male' | 'female'>('male');
    const [measurements, setMeasurements] = useState<Record<string, number>>({});
    const [activeZone, setActiveZone] = useState<{ id: string, name: string } | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Derived State for Patient Data (Mock for now, would fetch profile real data)
    const [patientData, setPatientData] = useState<any>({ weight: 70, height: 175, age: 30, gender: 'male' });

    // Load gender & profile
    useEffect(() => {
        const loadProfile = async () => {
            if (!patientId) return;
            const { data } = await supabase.from('profiles').select('*').eq('id', patientId).single();
            if (data) {
                setGender((data.gender === 'feminine' || data.gender === 'female') ? 'female' : 'male');
                setPatientData({
                    weight: data.weight || 70,
                    height: data.height || 175,
                    age: 30, // Calc from birthdate if needed
                    gender: (data.gender === 'feminine' || data.gender === 'female') ? 'female' : 'male'
                });
            }
        };
        loadProfile();
    }, [patientId]);

    const handleZoneSelect = (zoneId: string, side?: string) => {
        // Name Map
        const nameMap: Record<string, string> = {
            'neck': 'Pescoço', 'chest': 'Peitoral', 'abdomen': 'Abdomen', 'hips': 'Quadril',
            'back': 'Costas', 'arm_left': 'Bíceps (E)', 'arm_right': 'Bíceps (D)',
            'thigh_left': 'Coxa (E)', 'thigh_right': 'Coxa (D)', 'calf_left': 'Panturrilha (E)', 'calf_right': 'Panturrilha (D)',
            'triceps_left': 'Tríceps (E)', 'triceps_right': 'Tríceps (D)',
            'suprailiac_left': 'Supra-ilíaca (E)', 'suprailiac_right': 'Supra-ilíaca (D)',
            'delt_left': 'Ombro (E)', 'delt_right': 'Ombro (D)',
            'forearm_left': 'Antebraço (E)', 'forearm_right': 'Antebraço (D)'
        };
        setActiveZone({ id: zoneId, name: nameMap[zoneId] || zoneId });
    };

    const handleSaveMeasurement = (val: number, type?: 'relaxed' | 'contracted') => {
        if (!activeZone) return;

        let key = activeZone.id;
        if (type) key = `${activeZone.id}_${type}`;

        setMeasurements(prev => ({ ...prev, [key]: val }));
    };

    const handleFinish = async () => {
        setIsSaving(true);
        try {
            const vals = Object.values(measurements) as number[];
            const sum = vals.reduce((a, b) => a + b, 0);

            const { error } = await supabase.from('assessments').insert({
                patient_id: patientId,
                professional_id: (await supabase.auth.getUser()).data.user?.id,
                appointment_id: appointmentId,
                measurements: measurements,
                type: 'anthropometry',
                status: 'completed',
                fat_percentage: sum > 0 ? (sum * 0.2) : 0,
                created_at: new Date().toISOString()
            });

            if (error) throw error;
            navigate(`/appointment/${appointmentId}`);
        } catch (err) {
            console.error(err);
            alert('Erro ao salvar avaliação');
        } finally {
            setIsSaving(false);
        }
    };

    const filledCount = Object.keys(measurements).length;

    return (
        <FluidBackground variant="professional" className="flex flex-col relative overflow-hidden pb-10">

            {/* Header */}
            <div className="p-6 flex items-center justify-between z-10 glass-header">
                <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                    <ChevronLeft />
                </button>

                {/* TABS - Floating Island Style */}
                <div className="bg-[#111] border border-white/10 rounded-full p-1.5 flex gap-1 shadow-lg">
                    <button
                        onClick={() => setActiveTab('measurements')}
                        className={cn("px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2", activeTab === 'measurements' ? "bg-[#D4AF37] text-black shadow-gold" : "text-slate-500 hover:text-white")}
                    >
                        <Ruler size={14} />
                        Medidas
                    </button>
                    <button
                        onClick={() => setActiveTab('results')}
                        className={cn("px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2", activeTab === 'results' ? "bg-[#D4AF37] text-black shadow-gold" : "text-slate-500 hover:text-white")}
                    >
                        <Activity size={14} />
                        Resultados
                    </button>
                </div>

                <div className="w-10"></div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto px-6 pb-20 scrollbar-hide">
                {activeTab === 'measurements' ? (
                    <div className="w-full flex justify-center py-4 animate-in slide-in-from-left-4 fade-in duration-500">
                        {/* Mannequin */}
                        <SpatialBodyMap
                            gender={gender}
                            onSelectZone={handleZoneSelect}
                            highlightedZones={Object.keys(measurements).map(k => k.split('_')[0])}
                        />
                    </div>
                ) : (
                    <div className="w-full max-w-md mx-auto py-4">
                        <AssessmentResults patientData={patientData} measurements={measurements} />
                    </div>
                )}
            </div>

            {/* Footer Action (Only on Measurements Tab or Persistent?) */}
            {activeTab === 'measurements' && (
                <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent z-20 flex justify-center">
                    <div className="w-full max-w-md bg-[#111] border border-white/10 p-4 rounded-3xl flex items-center justify-between shadow-2xl backdrop-blur-md">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Progresso</span>
                            <span className="text-xl font-black text-white">{filledCount} <span className="text-xs text-[#D4AF37]">Zonas</span></span>
                        </div>

                        <div className="flex gap-2">
                            <button onClick={() => setMeasurements({})} className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-red-500 hover:bg-red-500/10 transition-colors">
                                <RotateCcw size={20} />
                            </button>
                            <button
                                onClick={handleFinish}
                                disabled={filledCount === 0 || isSaving}
                                className="h-12 px-6 rounded-full bg-[#D4AF37] text-black font-black uppercase tracking-widest flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-gold disabled:opacity-50 disabled:grayscale"
                            >
                                <Save size={18} />
                                Salvar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* HUD Overlay */}
            {activeZone && (
                <MeasurementHUD
                    zoneId={activeZone.id}
                    zoneName={activeZone.name}
                    initialValue={measurements[activeZone.id] || 0}
                    onSave={handleSaveMeasurement}
                    onClose={() => setActiveZone(null)}
                />
            )}

        </FluidBackground>
    );
};
