import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FluidBackground } from '@/components/layout/FluidBackground';
import { supabase } from '@/lib/supabase';
import {
    Bell,
    Calendar as CalendarIcon,
    Clock,
    ChevronRight,
    Plus,
    ArrowRight,
    TrendingDown,
    TrendingUp,
    ShieldCheck,
    CalendarDays,
    Dumbbell,
    Layers,
    Weight,
    Activity,
    ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { DefaultAvatar } from '@/components/shared/DefaultAvatar';
import { ProfessionalBottomNav } from '@/components/layout/ProfessionalBottomNav';

/* 
  PATIENT DETAIL SCREEN (Professional View)
  - Reuses the "Glass Pro" theme from PatientDashboardScreen.
  - Fetches data for a specific :id instead of current user.
*/

// Glassy, Premium, Minimalist
const textureCardClass = "bg-[#0A0A0A]/40 backdrop-blur-xl border border-white/5 relative overflow-hidden shadow-2xl";

const MOTIVATIONAL_MESSAGES = [
    { title: "Seu corpo,", subtitle: "sua obra de arte.", text: "Vamos medir seu progresso hoje?" },
    { title: "Foco total,", subtitle: "resultado real.", text: "A persistência é o caminho do êxito." },
    { title: "Cada dia,", subtitle: "mais forte.", text: "Sua evolução é constante." },
    { title: "Sua meta,", subtitle: "nosso desafio.", text: "Pequenos passos, grandes vitórias." },
    { title: "Excelência,", subtitle: "é um hábito.", text: "Continue firme no seu propósito." }
];

export const PatientDetailScreen: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [motivator, setMotivator] = useState(MOTIVATIONAL_MESSAGES[0]);

    useEffect(() => {
        // Randomly select a motivator on load
        const randomIdx = Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length);
        setMotivator(MOTIVATIONAL_MESSAGES[randomIdx]);
    }, []);

    // Patient Data
    const [patientProfile, setPatientProfile] = useState<any>(null);
    const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
    const [assessments, setAssessments] = useState<any[]>([]);
    const [missingFields, setMissingFields] = useState<string[]>([]);
    const [profileIncomplete, setProfileIncomplete] = useState(false);

    useEffect(() => {
        if (id) fetchPatientData();
    }, [id]);

    const fetchPatientData = async () => {
        setLoading(true);
        try {
            // 1. Fetch Profile
            const { data: profile } = await supabase.from('profiles').select('*').eq('id', id).single();
            if (profile) setPatientProfile(profile);

            // 2. Check Completeness
            const missing = [];
            if (!profile?.phone) missing.push('Telefone');
            if (!profile?.birth_date) missing.push('Data de Nascimento');
            if (!profile?.avatar_url) missing.push('Foto de Perfil');
            setMissingFields(missing);
            setProfileIncomplete(missing.length > 0);

            // 3. Fetch Appointments (Confirmed & Future)
            const { data: appts } = await supabase.from('appointments')
                .select('*')
                .eq('patient_id', id)
                .eq('status', 'confirmed')
                .gte('start_time', new Date().toISOString())
                .order('start_time', { ascending: true });

            if (appts) setUpcomingAppointments(appts.slice(0, 1));

            // 4. Fetch Assessments
            const { data: assess } = await supabase.from('assessments')
                .select('*')
                .eq('patient_id', id)
                .order('created_at', { ascending: true });

            if (assess) setAssessments(assess);

        } catch (error) {
            console.error('Error fetching patient data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#080C09] flex items-center justify-center text-[#D4AF37]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37]"></div>
        </div>
    );

    if (!patientProfile) return (
        <div className="min-h-screen bg-[#080C09] flex flex-col items-center justify-center text-white gap-4">
            <p>Paciente não encontrado.</p>
            <button onClick={() => navigate(-1)} className="text-[#D4AF37] underline">Voltar</button>
        </div>
    );

    // --- Metrics Logic ---
    const assessmentCount = assessments.length;
    const latestAssessment = assessmentCount > 0 ? assessments[assessmentCount - 1] : null;
    const firstName = patientProfile.full_name?.split(' ')[0] || 'Paciente';

    const getTrendPct = (key: string, current: string | number) => {
        if (assessmentCount < 2) return null;
        const prev = assessments[assessmentCount - 2];
        const prevFatPct = Number(prev.fat_percentage || prev.body_fat || 0);
        const prevWeight = Number(prev.weight || 0);

        let prevVal = 0;
        if (key === 'fat_mass') prevVal = prevWeight * (prevFatPct / 100);
        else if (key === 'lean_mass') prevVal = prevWeight * (1 - prevFatPct / 100);
        else prevVal = Number(prev[key] || (key === 'fat_percentage' ? prevFatPct : prevWeight));

        const currVal = Number(current);
        if (!prevVal) return null;
        const diffPct = ((currVal - prevVal) / prevVal) * 100;
        return (diffPct > 0 ? '+' : '') + diffPct.toFixed(1) + '%';
    };

    const getIsBad = (key: string, current: string | number) => {
        if (assessmentCount < 2) return false;
        const trendStr = getTrendPct(key, current);
        if (!trendStr) return false;
        const val = parseFloat(trendStr);

        if (key === 'fat_percentage' || key === 'fat_mass') return val > 0; // Gained fat = Red
        if (key === 'lean_mass') return val < 0; // Lost muscle = Red
        return false;
    };

    const currentWeight = Number(latestAssessment?.weight || patientProfile.weight || 0);
    const currentHeight = Number(latestAssessment?.height || patientProfile.height || 0);
    const currentFatPct = Number(latestAssessment?.fat_percentage || latestAssessment?.body_fat || 0);
    const currentFatMass = (currentWeight * (currentFatPct / 100)).toFixed(1);
    const currentLeanMass = (currentWeight - parseFloat(currentFatMass)).toFixed(1);

    const metrics = [
        {
            label: 'Gordura Corporal',
            value: currentFatPct || '0.0',
            unit: '%',
            trend: getTrendPct('fat_percentage', currentFatPct),
            up: getIsBad('fat_percentage', currentFatPct),
            Icon: Activity
        },
        {
            label: 'Peso Atual',
            value: currentWeight || '0.0',
            unit: 'kg',
            trend: getTrendPct('weight', currentWeight),
            up: false,
            Icon: Weight
        },
        {
            label: 'Massa Magra',
            value: currentLeanMass || '0.0',
            unit: 'kg',
            trend: getTrendPct('lean_mass', currentLeanMass),
            up: getIsBad('lean_mass', currentLeanMass),
            Icon: Dumbbell
        },
        {
            label: 'Massa Gorda',
            value: currentFatMass || '0.0',
            unit: 'kg',
            trend: getTrendPct('fat_mass', currentFatMass),
            up: getIsBad('fat_mass', currentFatMass),
            Icon: Layers
        }
    ];

    return (
        <FluidBackground variant="luminous" className="pb-40 font-sans px-5 relative overflow-hidden min-h-screen">
            <div className="relative z-10 text-white animate-in fade-in slide-in-from-right duration-500">

                {/* Header with Back Button */}
                <header className="pt-8 flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-slate-400 hover:text-white hover:border-[#D4AF37]/50 transition-all active:scale-95"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full border border-[#D4AF37]/30 p-0.5 bg-black/60 shadow-[0_0_15px_rgba(212,175,55,0.2)] overflow-hidden">
                                {(patientProfile.avatar_url) ? (
                                    <img src={patientProfile.avatar_url} alt="Profile" className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <DefaultAvatar gender={patientProfile.gender} className="w-full h-full rounded-full" />
                                )}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.2em] mb-1">Paciente</span>
                                <h1 className="text-xl font-bold text-white leading-none drop-shadow-sm">{patientProfile.full_name}</h1>
                            </div>
                        </div>
                    </div>
                </header>

                {/* HERO SECTION - Summary / Motivational */}
                <div className={`${textureCardClass} w-full h-44 rounded-[2.5rem] mb-8 flex items-center justify-between px-8 relative group`}>
                    {/* Subtle Gold Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/10 via-transparent to-transparent pointer-events-none opacity-50"></div>

                    <div className="relative z-10 max-w-[60%]">
                        <div className="w-8 h-1 bg-[#D4AF37] rounded-full mb-3"></div>
                        <h2 className="text-xl font-bold text-white leading-tight mb-2">{motivator.title}<br />{motivator.subtitle}</h2>
                        <p className="text-[10px] text-slate-400 font-medium tracking-wide">{motivator.text}</p>
                    </div>
                    <div className="relative z-10 w-36 h-36 -mr-6 animate-in fade-in zoom-in duration-1000">
                        <img src="/assets/3d/tape_measure.png" className="w-full h-full object-contain filter drop-shadow-[0_0_25px_rgba(212,175,55,0.2)]" alt="Tape Measure Friend" />
                    </div>
                </div>

                {/* ALERTS SECTION */}
                {profileIncomplete && (
                    <div className="mb-8 p-4 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                            <ShieldCheck className="text-red-500" size={20} />
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">Cadastro Incompleto</p>
                            <p className="text-xs text-slate-300">Faltando: {missingFields.join(', ')}</p>
                        </div>
                    </div>
                )}

                {/* AGENDA SECTION */}
                <div className="mb-8 space-y-4">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Próxima Consulta</p>
                    {upcomingAppointments.length > 0 ? (
                        <div className={`${textureCardClass} rounded-[2.5rem] p-6 shadow-md transition-all duration-300 group hover:border-[#D4AF37]/30`}>
                            <div className="flex justify-between items-start mb-4">
                                <span className="bg-[#D4AF37]/10 text-[#D4AF37] text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider border border-[#D4AF37]/20 shadow-sm">Agendado</span>
                                <div className="w-10 h-10 bg-[#D4AF37]/10 rounded-2xl flex items-center justify-center border border-[#D4AF37]/5"><CalendarIcon className="text-[#D4AF37]" size={20} /></div>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-4">Consulta de Acompanhamento</h3>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/5"><Clock className="text-[#D4AF37]" size={14} /></div>
                                    <div>
                                        <p className="text-sm font-bold text-white leading-none">{new Date(upcomingAppointments[0].start_time).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</p>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">As {new Date(upcomingAppointments[0].start_time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                </div>
                            </div>
                            <Button onClick={() => navigate(`/appointment/${upcomingAppointments[0].id}`)} className="w-full h-12 rounded-xl bg-white text-black font-black text-xs hover:bg-[#D4AF37] hover:text-black transition-all shadow-lg tracking-widest uppercase">Ver Detalhes</Button>
                        </div>
                    ) : (
                        <div className={`${textureCardClass} rounded-[2rem] p-6 shadow-sm flex items-center gap-4`}>
                            <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5"><CalendarDays className="text-slate-600" size={20} /></div>
                            <div className="flex-1"><p className="text-xs font-bold text-slate-500">Nenhum agendamento futuro.</p></div>
                        </div>
                    )}
                </div>

                {/* METRICS GRID */}
                <div className="mb-8 relative">
                    <div className="grid grid-cols-2 gap-4">
                        {metrics.map((item, idx) => (
                            <div key={idx} className={`${textureCardClass} rounded-[2rem] p-5 shadow-sm group hover:bg-white/5 transition-colors overflow-hidden`}>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight mb-2 relative z-10">{item.label}</p>

                                {/* Dynamic Icon */}
                                <div className="absolute -bottom-4 -right-4 w-20 h-20 opacity-10 group-hover:opacity-20 transition-opacity text-white flex items-center justify-center rotate-[-15deg]">
                                    <item.Icon size={80} strokeWidth={1} />
                                </div>

                                <div className="flex items-baseline gap-1 relative z-10">
                                    <span className="text-2xl font-black text-white tracking-tighter drop-shadow-sm">{item.value}</span>
                                    <span className="text-xs font-bold text-[#D4AF37]">{item.unit}</span>
                                </div>
                                {item.trend && (
                                    <div className={cn("flex items-center gap-1 mt-2 text-[10px] font-bold relative z-10", item.up ? "text-red-400" : "text-green-400")}>
                                        {item.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                        {item.trend}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    {assessmentCount === 0 && <div className="mt-4 px-2"><p className="text-[10px] text-slate-600 font-bold italic leading-relaxed">* Dados indisponíveis. Realize a <span className="text-[#D4AF37] font-black">primeira avaliação</span>.</p></div>}
                </div>

                {/* EVOLUTION CHART */}
                <div className={`${textureCardClass} rounded-[2.5rem] p-6 shadow-md mb-8`}>
                    <div className="flex justify-between items-center mb-6"><h3 className="text-lg font-bold text-white">Evolução do Paciente</h3></div>
                    {assessmentCount > 0 ? (
                        <div className="h-40 w-full flex items-end relative overflow-hidden group">
                            {(() => {
                                const dataPoints = assessments.slice(-5);
                                if (dataPoints.length < 2) return (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                                        <TrendingUp size={24} className="mb-3 opacity-80 text-[#D4AF37]" />
                                        <p className="text-sm font-black text-[#D4AF37] uppercase tracking-wider mb-1">Dados Insuficientes</p>
                                        <p className="text-xs text-slate-300 font-medium opacity-80 mt-1">Precisa de pelo menos 2 avaliações.</p>
                                    </div>
                                );

                                const width = 100;
                                const height = 50;
                                const values = dataPoints.map(d => Number(d.fat_percentage || d.body_fat || 0));
                                const maxVal = Math.max(...values) * 1.1;
                                const minVal = Math.min(...values) * 0.9;

                                const getX = (i: number) => (i / (dataPoints.length - 1)) * width;
                                const getY = (val: number) => height - ((val - minVal) / (maxVal - minVal || 1)) * height;

                                const pathData = dataPoints.map((d, i) =>
                                    `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(Number(d.fat_percentage || d.body_fat || 0))}`
                                ).join(' ');

                                const areaPath = `${pathData} V ${height} H 0 Z`;

                                return (
                                    <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
                                        <line x1="0" y1={height} x2={width} y2={height} stroke="white" strokeOpacity="0.1" strokeWidth="0.5" />
                                        <path d={areaPath} fill="url(#gradient)" opacity="0.2" />
                                        <defs>
                                            <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                                                <stop offset="0%" stopColor="#D4AF37" />
                                                <stop offset="100%" stopColor="transparent" />
                                            </linearGradient>
                                        </defs>
                                        <path d={pathData} fill="none" stroke="#D4AF37" strokeWidth="2" className="drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]" strokeLinecap="round" strokeLinejoin="round" />
                                        {dataPoints.map((d, i) => (
                                            <circle key={i} cx={getX(i)} cy={getY(Number(d.fat_percentage || d.body_fat || 0))} r="2" fill="#D4AF37" />
                                        ))}
                                    </svg>
                                );
                            })()}
                        </div>
                    ) : (
                        <div className="py-12 flex flex-col items-center text-center px-4">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 text-slate-500 border border-white/5"><TrendingUp size={32} strokeWidth={1.5} /></div>
                            <p className="text-sm font-bold text-slate-500 leading-tight">Sem dados de evolução.</p>
                        </div>
                    )}
                </div>

                {/* ASSESSMENT HISTORY */}
                <div className="mb-24">
                    <div className="flex items-center justify-between mb-4 px-2">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Histórico de Avaliações</p>
                        {/* Add Assessment Button */}
                        <button
                            onClick={() => navigate('/assessment/start', { state: { patientId: id } })}
                            className="bg-[#D4AF37] text-black w-8 h-8 rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                        >
                            <Plus size={18} strokeWidth={3} />
                        </button>
                    </div>

                    <div className="space-y-3">
                        {assessments.slice().reverse().map((assess, idx) => (
                            <div key={assess.id} className={`${textureCardClass} p-4 rounded-3xl flex items-center justify-between group cursor-pointer hover:border-[#D4AF37]/30 transition-all`} onClick={() => navigate(`/assessment/results/${assess.id}`)}>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 text-[#D4AF37]">
                                        <span className="text-xs font-black">{new Date(assess.created_at).getDate()}</span>
                                        <span className="text-[8px] font-bold uppercase ml-1 opacity-60">{new Date(assess.created_at).toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-white mb-0.5">{assess.type === 'pollock7' ? 'Protocolo Pollock 7' : 'Avaliação Física'}</p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-medium text-slate-400">{assess.weight}kg</span>
                                            <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                                            <span className="text-[10px] font-medium text-slate-400">{assess.fat_percentage || assess.body_fat}% Gordura</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-white group-hover:bg-[#D4AF37] transition-all">
                                    <ChevronRight size={14} />
                                </div>
                            </div>
                        ))}
                        {assessments.length === 0 && (
                            <div className="text-center py-8 opacity-50">
                                <p className="text-xs text-slate-500">Nenhuma avaliação encontrada.</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>

            <ProfessionalBottomNav activeTab="patients" onTabChange={() => navigate('/dashboard')} />
        </FluidBackground>
    );
};
