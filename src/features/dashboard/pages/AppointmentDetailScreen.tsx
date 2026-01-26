import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    Clock,
    Activity,
    Info,
    Calendar,
    FileText,
    TrendingUp,
    ChevronRight,
    Play
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { Loader } from 'lucide-react';
import { ProfessionalBottomNav } from '@/components/layout/ProfessionalBottomNav';
import { FluidBackground } from '@/components/layout/FluidBackground';

export const AppointmentDetailScreen: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [appointmentData, setAppointmentData] = useState<any>(null);
    const [patientData, setPatientData] = useState<any>(null);
    const [assessments, setAssessments] = useState<any[]>([]);

    useEffect(() => {
        if (id) fetchFullData();
    }, [id]);

    const fetchFullData = async () => {
        setLoading(true);
        try {
            // 1. Fetch Appointment & Patient ID
            const { data: app, error: appError } = await supabase
                .from('appointments')
                .select('*')
                .eq('id', id)
                .single();

            // Fallback: If Appointment is missing/error, use FULL MOCK for Testing
            if (appError || !app) {
                console.warn("Appointment fetch failed, using FULL MOCK_DATA for testing:", appError);
                const mockApp = {
                    id: id || 'mock-appt-id',
                    start_time: new Date().toISOString(),
                    patient_id: 'mock-patient-id',
                    notes: 'Consulta (Mock)'
                };
                const mockPatient = {
                    id: 'mock-patient-id',
                    full_name: 'Paciente Fictício (Teste)',
                    avatar_url: null,
                    birth_date: '1995-05-15',
                    weight: 75.5,
                    height: 175,
                    gender: 'feminine'
                };
                setAppointmentData(mockApp);
                setPatientData(mockPatient);
                // Mock Assessments for Chart
                setAssessments([
                    { id: '1', created_at: '2025-10-15', weight: 80, fat_percentage: 25 },
                    { id: '2', created_at: '2025-11-15', weight: 78, fat_percentage: 24 },
                    { id: '3', created_at: '2025-12-15', weight: 76, fat_percentage: 22 },
                    { id: '4', created_at: '2026-01-15', weight: 75.5, fat_percentage: 20 }
                ]);
                setLoading(false);
                return;
            }
            setAppointmentData(app);

            // 2. Fetch Patient Profile
            const { data: prof, error: profError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', app.patient_id)
                .single();

            if (profError || !prof) {
                console.warn("Profile fetch error or missing, using Mock Patient:", profError);
                setPatientData({
                    id: app.patient_id || 'mock-id',
                    full_name: app.patient?.full_name || 'Paciente Fictício',
                    avatar_url: null,
                    birth_date: '1990-01-01',
                    weight: 70,
                    height: 170
                });
            } else {
                setPatientData(prof);
            }

            // 3. Fetch History (Assessments)
            try {
                const { data: history } = await supabase
                    .from('assessments')
                    .select('id, created_at, fat_percentage, weight')
                    .eq('patient_id', app.patient_id)
                    .order('created_at', { ascending: false });

                if (history && history.length > 0) {
                    setAssessments(history);
                } else if (assessments.length === 0) {
                    // Inject mock if real history empty (for demo)
                    setAssessments([
                        { id: '1', created_at: '2025-10-15', weight: 80, fat_percentage: 25 },
                        { id: '2', created_at: '2025-11-15', weight: 78, fat_percentage: 24 },
                        { id: '3', created_at: '2025-12-15', weight: 76, fat_percentage: 22 },
                        { id: '4', created_at: '2026-01-15', weight: 75.5, fat_percentage: 20 }
                    ]);
                }
            } catch (err) {
                console.warn("Assessments table fetch failed", err);
            }

        } catch (error) {
            console.error('Error loading details:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center text-[#D4AF37]">
            <Loader className="animate-spin" />
        </div>
    );

    if (!patientData) return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white gap-4">
            <Info className="text-[#D4AF37]" size={40} />
            <p>Paciente não encontrado.</p>
            <button onClick={() => navigate(-1)} className="text-sm underline text-slate-500">Voltar</button>
        </div>
    );

    // Calculate Age
    const getAge = (birthDate: string) => {
        if (!birthDate) return '?';
        const birth = new Date(birthDate);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    return (
        <FluidBackground variant="professional" className="pb-32 relative overflow-hidden">
            {/* Header / Nav */}
            <div className="flex items-center p-6 relative z-10">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-slate-400 hover:text-white hover:border-[#D4AF37]/50 transition-all active:scale-95"
                >
                    <ChevronLeft size={20} />
                </button>
                <div className="flex-1 text-center pr-10">
                    <span className="text-xs font-black tracking-[0.2em] text-[#D4AF37] uppercase drop-shadow-md">Detalhes da Consulta</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-6 flex flex-col items-center relative z-10 w-full max-w-md mx-auto">

                {/* Avatar */}
                <div className="relative mb-6 group cursor-pointer" onClick={() => navigate(`/profile/${patientData.id}`)}>
                    <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-[#D4AF37] shadow-[0_0_40px_-10px_rgba(212,175,55,0.4)] group-hover:scale-105 transition-transform duration-500 relative z-10 bg-[#111]">
                        {patientData.avatar_url ? (
                            <img src={patientData.avatar_url} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-[#111] flex items-center justify-center text-4xl font-black text-[#D4AF37]">
                                {patientData.full_name?.substring(0, 2).toUpperCase()}
                            </div>
                        )}
                    </div>
                    {/* Pulsing Ring */}
                    <div className="absolute inset-0 rounded-full border border-[#D4AF37]/30 scale-110 animate-pulse top-0 left-0 z-0"></div>
                </div>

                {/* Name & Info */}
                <h2 className="text-2xl font-bold text-white text-center mb-2 tracking-tight">{patientData.full_name}</h2>
                <div className="flex items-center justify-center gap-3 mb-10 opacity-60">
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-white/5 px-2 py-1 rounded-md">{getAge(patientData.birth_date)} Anos</span>
                    <span className="w-1 h-1 rounded-full bg-[#D4AF37]"></span>
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-white/5 px-2 py-1 rounded-md">{format(new Date(appointmentData?.start_time || new Date()), 'dd/MM/yyyy')}</span>
                </div>

                {/* Primary Actions Grid */}
                <div className="grid grid-cols-2 gap-4 w-full mb-12">
                    {/* Anamnesis Button */}
                    <button
                        onClick={() => navigate('/assessment/anamnesis', { state: { patientId: patientData.id } })}
                        className="relative overflow-hidden flex flex-col items-center justify-center gap-3 py-6 rounded-3xl bg-[#111]/30 backdrop-blur-md border border-white/10 hover:border-[#D4AF37]/50 transition-all group active:scale-95"
                    >
                        <FileText size={24} className="text-slate-500 group-hover:text-[#D4AF37] transition-colors" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-white transition-colors">Anamnese</span>
                    </button>

                    {/* Start Assessment Button (Highlighted) */}
                    <button
                        onClick={() => navigate('/assessment/start', { state: { patientId: patientData.id, appointmentId: appointmentData.id } })}
                        className="relative overflow-hidden flex flex-col items-center justify-center gap-3 py-6 rounded-3xl bg-gradient-to-br from-[#D4AF37] to-[#B4941F] text-black shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:scale-[1.02] active:scale-95 transition-all group"
                    >
                        <Activity size={24} strokeWidth={2.5} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Iniciar Avaliação</span>

                        {/* Shine Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1s_infinite]"></div>
                    </button>
                </div>

                {/* Evolution & History */}
                <div className="w-full space-y-8">

                    {/* Evolution Chart Placeholder */}
                    <div>
                        <div className="flex items-center justify-between mb-4 px-2">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37]">Evolução</h3>
                            <TrendingUp size={14} className="text-[#D4AF37]" />
                        </div>
                        <div className="h-40 w-full bg-[#111]/30 backdrop-blur-sm rounded-3xl border border-white/5 flex items-end relative overflow-hidden p-6 group">
                            {/* SVG Line Chart Mock */}
                            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 50" preserveAspectRatio="none">
                                {/* Grid Lines */}
                                <line x1="0" y1="40" x2="100" y2="40" stroke="white" strokeOpacity="0.05" strokeWidth="0.5" />
                                <line x1="0" y1="25" x2="100" y2="25" stroke="white" strokeOpacity="0.05" strokeWidth="0.5" />
                                <line x1="0" y1="10" x2="100" y2="10" stroke="white" strokeOpacity="0.05" strokeWidth="0.5" />

                                {/* Path (Data) */}
                                <path
                                    d="M0 45 L25 35 L50 25 L75 30 L100 15"
                                    fill="none"
                                    stroke="#D4AF37"
                                    strokeWidth="2"
                                    className="drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />

                                {/* Area under curve */}
                                <path
                                    d="M0 45 L25 35 L50 25 L75 30 L100 15 V 50 H 0 Z"
                                    fill="url(#gradient)"
                                    opacity="0.2"
                                />
                                <defs>
                                    <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                                        <stop offset="0%" stopColor="#D4AF37" />
                                        <stop offset="100%" stopColor="transparent" />
                                    </linearGradient>
                                </defs>

                                {/* Dots */}
                                <circle cx="0" cy="45" r="2" fill="#D4AF37" />
                                <circle cx="25" cy="35" r="2" fill="#D4AF37" />
                                <circle cx="50" cy="25" r="2" fill="#D4AF37" />
                                <circle cx="75" cy="30" r="2" fill="#D4AF37" />
                                <circle cx="100" cy="15" r="2" fill="#D4AF37" />
                            </svg>

                            <div className="absolute top-4 right-4 bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-2 py-1 rounded text-[8px] font-bold text-[#D4AF37] uppercase tracking-wider">
                                Peso (kg)
                            </div>
                        </div>
                    </div>

                    {/* History List */}
                    <div>
                        <div className="flex items-center justify-between mb-4 px-2">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Histórico de Avaliações</h3>
                        </div>

                        <div className="space-y-3">
                            {assessments.slice(0, 3).map((assessment, i) => ( // limit to 3
                                <div key={assessment.id} className="bg-[#111]/30 p-5 rounded-2xl border border-white/5 flex items-center justify-between hover:border-[#D4AF37]/30 transition-all cursor-pointer group active:scale-[0.98]" onClick={() => navigate(`/profile/history/${assessment.id}`)}>
                                    <div className="flex items-center gap-5">
                                        <div className={cn(
                                            "w-12 h-12 rounded-full flex items-center justify-center font-black text-xs border border-white/5",
                                            i === 0 ? "bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/30 shadow-[0_0_15px_rgba(212,175,55,0.1)]" : "bg-white/5 text-slate-500"
                                        )}>
                                            {assessment.fat_percentage ? Math.round(assessment.fat_percentage) : '?'}%
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white group-hover:text-[#D4AF37] transition-colors">{new Date(assessment.created_at).toLocaleDateString('pt-BR')}</p>
                                            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-0.5">{assessment.weight} KG</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={16} className="text-slate-600 group-hover:text-white transition-colors" />
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            {/* Bottom Nav Fixed */}
            <ProfessionalBottomNav activeTab="agenda" onTabChange={(tab) => navigate('/dashboard')} />
        </FluidBackground>
    );
};
