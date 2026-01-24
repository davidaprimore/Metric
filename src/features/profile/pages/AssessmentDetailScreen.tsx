import React, { useState, useEffect } from 'react';
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

    if (loading) return (
        <div className="min-h-screen bg-[#F1F3F5] flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F1F3F5] pb-32 font-sans overflow-x-hidden">
            <header className="bg-white px-5 pt-10 pb-6 rounded-b-[2.5rem] shadow-sm flex items-center justify-between mb-8 sticky top-0 z-20">
                <button onClick={() => navigate(-1)} className="w-11 h-11 rounded-full flex items-center justify-center bg-gray-50 border border-gray-100 shadow-sm">
                    <ChevronLeft size={24} className="text-dark" />
                </button>
                <div className="flex flex-col items-center">
                    <h1 className="text-lg font-black text-dark uppercase tracking-tight">Detalhes <span className="text-secondary tracking-widest">Metrik</span></h1>
                </div>
                <button className="w-11 h-11 rounded-full flex items-center justify-center bg-gray-50 border border-gray-100 shadow-sm">
                    <Share2 size={20} className="text-dark" />
                </button>
            </header>

            <div className="px-5 space-y-6">
                {/* Header Card */}
                <div className="bg-dark rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-gray-300">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-secondary/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>

                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-black">{assessment.client_name}</h2>
                                <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mt-1">Avaliação de Performance</p>
                            </div>
                            <div className="bg-secondary text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-neon">
                                Status: {assessment.status}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8 text-white/60">
                            <div className="flex items-center gap-2">
                                <Calendar size={14} className="text-secondary" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">{formatDate(assessment.date)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin size={14} className="text-secondary" />
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
                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Detalhamento Técnico</h3>
                    <div className="space-y-6">
                        <DetailRow label="Massa Magra" value={`${assessment.lean_mass} kg`} />
                        <DetailRow label="Massa Gorda" value={`${assessment.fat_mass} kg`} />
                        <DetailRow label="Gordura Visceral" value={assessment.visceral_fat.toString()} />
                        <DetailRow label="IMC (BMI)" value={assessment.bmi.toString()} />
                        <DetailRow label="Metabolismo Basal" value={`${assessment.basal_metabolism} kcal`} />
                    </div>
                </div>

                {/* Professional Notes */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500">
                            <User size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Responsável</p>
                            <p className="text-xs font-black text-dark uppercase">{assessment.professional}</p>
                        </div>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                        <p className="text-xs text-dark/70 font-medium leading-relaxed italic">"{assessment.notes}"</p>
                    </div>
                </div>

                {/* PDF Download */}
                <button className="w-full h-20 bg-white rounded-[2.5rem] border border-gray-100 flex items-center justify-between px-8 group active:scale-95 transition-all shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#C6FF00] rounded-xl flex items-center justify-center text-dark shadow-sm group-hover:bg-[#B5E600] transition-colors">
                            <Download size={20} />
                        </div>
                        <div>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block leading-none mb-1">Relatório Completo</span>
                            <span className="text-xs font-black text-dark uppercase">Baixar PDF da Avaliação</span>
                        </div>
                    </div>
                    <ChevronLeft size={20} className="text-gray-300 rotate-180" />
                </button>
            </div>

            <BottomNav />
        </div>
    );
};

const MetricBox = ({ label, title, value, icon, color }: any) => (
    <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col items-center text-center">
        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-sm", color === 'secondary' ? "bg-secondary text-white" : "bg-primary text-dark")}>
            {icon}
        </div>
        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-xs font-black text-dark uppercase mb-2">{title}</p>
        <p className={cn("text-2xl font-black", color === 'secondary' ? "text-secondary" : "text-dark")}>{value}</p>
    </div>
);

const DetailRow = ({ label, value }: { label: string, value: string }) => (
    <div className="flex justify-between items-center border-b border-gray-50 pb-4">
        <span className="text-xs font-bold text-gray-400">{label}</span>
        <span className="text-sm font-black text-dark">{value}</span>
    </div>
);
