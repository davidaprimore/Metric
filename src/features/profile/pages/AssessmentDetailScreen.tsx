import React, { useState, useEffect } from 'react';
import { FluidBackground } from '@/components/layout/FluidBackground';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    Calendar,
    User,
    Activity,
    PieChart,
    Share2,
    Download,
    Award,
    TrendingDown,
    MapPin
} from 'lucide-react';
import { BottomNav } from '@/components/layout/BottomNav';
import { cn } from '@/lib/utils';

export const AssessmentDetailScreen: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    // Mock detailed data
    const assessment = {
        id,
        date: '2025-12-15T10:00:00Z',
        client_name: 'Marcos Oliveira',
        weight: 81.2,
        height: 180,
        body_fat: 18.5,
        lean_mass: 66.2,
        fat_mass: 15.0,
        visceral_fat: 8,
        bmi: 25.1,
        basal_metabolism: 1850,
        status: 'Elite',
        professional: 'Dr. Ricardo Silva',
        unit: 'Metrik Prime - Jardins',
        notes: 'O paciente apresentou excelente evolução na massa magra e redução consistente de gordura visceral. Recomendo manter o protocolo atual por mais 4 semanas.'
    };

    useEffect(() => {
        setTimeout(() => setLoading(false), 500);
    }, []);

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
    };

    // Glassy, Transparent, Luminous
    const textureCardClass = "bg-black/40 bg-[radial-gradient(120%_120%_at_50%_0%,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent backdrop-blur-3xl border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] relative overflow-hidden";
    const headerButtonClass = "w-11 h-11 rounded-full flex items-center justify-center bg-white/5 border border-white/10 shadow-sm active:scale-95 hover:bg-white/10 transition-all text-slate-400 hover:text-white";

    if (loading) return (
        <FluidBackground variant="luminous" className="min-h-screen flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-4 border-[#CCFF00] border-t-transparent rounded-full animate-spin"></div>
        </FluidBackground>
    );

    return (
        <FluidBackground variant="luminous" className="pb-40 font-sans px-5 relative overflow-hidden min-h-screen">
            <header className="relative z-10 pt-10 pb-6 flex items-center justify-between mb-8">
                <button onClick={() => navigate(-1)} className={headerButtonClass}>
                    <ChevronLeft size={24} />
                </button>
                <div className="flex flex-col items-center">
                    <h1 className="text-lg font-black text-white uppercase tracking-tight">Detalhes <span className="text-[#CCFF00] tracking-widest">Metrik</span></h1>
                </div>
                <button className={headerButtonClass}>
                    <Share2 size={20} />
                </button>
            </header>

            <div className="relative z-10 space-y-6">
                {/* Header Card */}
                <div className={`${textureCardClass} rounded-[2.5rem] p-8 relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-40 h-40 bg-[#CCFF00]/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>

                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-black text-white">{assessment.client_name}</h2>
                                <p className="text-[10px] font-bold text-[#CCFF00] uppercase tracking-[0.2em] mt-1">Avaliação de Performance</p>
                            </div>
                            <div className="bg-[#CCFF00] text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-xl shadow-[#CCFF00]/20">
                                Status: {assessment.status}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8 text-slate-400">
                            <div className="flex items-center gap-2">
                                <Calendar size={14} className="text-[#CCFF00]" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">{formatDate(assessment.date)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin size={14} className="text-[#CCFF00]" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">{assessment.unit.split('-')[0]}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <MetricBox label="Composição Corporal" title="% Gordura" value={`${assessment.body_fat}%`} icon={<PieChart size={18} />} color="secondary" />
                    <MetricBox label="Peso Total" title="Massa (kg)" value={`${assessment.weight}kg`} icon={<Activity size={18} />} color="primary" />
                </div>

                {/* Detailed Metrics */}
                <div className={`${textureCardClass} rounded-[2.5rem] p-8`}>
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Detalhamento Técnico</h3>
                    <div className="space-y-6">
                        <DetailRow label="Massa Magra" value={`${assessment.lean_mass} kg`} />
                        <DetailRow label="Massa Gorda" value={`${assessment.fat_mass} kg`} />
                        <DetailRow label="Gordura Visceral" value={assessment.visceral_fat.toString()} />
                        <DetailRow label="IMC (BMI)" value={assessment.bmi.toString()} />
                        <DetailRow label="Metabolismo Basal" value={`${assessment.basal_metabolism} kcal`} />
                    </div>
                </div>

                {/* Professional Notes */}
                <div className={`${textureCardClass} rounded-[2.5rem] p-8`}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                            <User size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Responsável</p>
                            <p className="text-xs font-black text-white uppercase">{assessment.professional}</p>
                        </div>
                    </div>
                    <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                        <p className="text-xs text-slate-300 font-medium leading-relaxed italic">"{assessment.notes}"</p>
                    </div>
                </div>

                {/* PDF Download */}
                <button className={`w-full h-20 bg-[#080C09] rounded-[2.5rem] border border-white/10 flex items-center justify-between px-8 group active:scale-95 transition-all shadow-lg shadow-black/50 hover:bg-white/5`}>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#CCFF00] rounded-xl flex items-center justify-center text-black shadow-lg shadow-[#CCFF00]/20 group-hover:scale-110 transition-transform">
                            <Download size={20} />
                        </div>
                        <div className="text-left">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block leading-none mb-1">Relatório Completo</span>
                            <span className="text-xs font-black text-white uppercase">Baixar PDF da Avaliação</span>
                        </div>
                    </div>
                    <ChevronLeft size={20} className="text-slate-500 rotate-180" />
                </button>
            </div>

            <BottomNav />
        </FluidBackground>
    );
};

const MetricBox = ({ label, title, value, icon, color }: any) => (
    <div className={`bg-[#080C09] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-[#080C09] to-[#080C09] backdrop-blur-2xl border-t border-white/10 border-b border-black/80 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.8)] relative overflow-hidden p-6 rounded-[2.5rem] flex flex-col items-center text-center`}>
        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-lg border border-white/5", color === 'secondary' ? "bg-[#CCFF00]/10 text-[#CCFF00] border-[#CCFF00]/20" : "bg-white/10 text-white")}>
            {icon}
        </div>
        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-xs font-black text-white uppercase mb-2">{title}</p>
        <p className={cn("text-2xl font-black", color === 'secondary' ? "text-[#CCFF00]" : "text-white")}>{value}</p>
    </div>
);

const DetailRow = ({ label, value }: { label: string, value: string }) => (
    <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <span className="text-xs font-bold text-slate-500">{label}</span>
        <span className="text-sm font-black text-white">{value}</span>
    </div>
);
