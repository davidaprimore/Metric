import React, { useState, useEffect } from 'react';
import { FluidBackground } from '@/components/layout/FluidBackground';
import {
    ChevronLeft,
    TrendingUp,
    TrendingDown,
    Calendar,
    ArrowRight,
    Search,
    Filter,
    FileBarChart,
    ChevronRight,
    Award
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { BottomNav } from '@/components/layout/BottomNav';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

interface Assessment {
    id: string;
    date: string;
    client_name: string;
    weight: number;
    body_fat: number;
    lean_mass: number;
    fat_mass: number;
    status: 'Elite' | 'Premium' | 'Standard';
    trend: 'up' | 'down' | 'stable';
    diff: string;
}

export const AssessmentHistoryScreen: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [assessments, setAssessments] = useState<Assessment[]>([]);

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            try {
                // Future implementation: Fetch from Supabase
                // const { data } = await supabase.from('assessments').select('*').eq('user_id', user.id).order('date', { ascending: false });

                // For now, mock data as requested to "elaborate" the screen
                const mockHistory: Assessment[] = [
                    {
                        id: '1',
                        date: '2025-12-15T10:00:00Z',
                        client_name: 'Marcos Oliveira',
                        weight: 81.2,
                        body_fat: 18.5,
                        lean_mass: 66.2,
                        fat_mass: 15.0,
                        status: 'Elite',
                        trend: 'down',
                        diff: '-2.1%'
                    },
                    {
                        id: '2',
                        date: '2025-11-28T15:00:00Z',
                        client_name: 'Juliana Santos',
                        weight: 62.5,
                        body_fat: 22.1,
                        lean_mass: 48.2,
                        fat_mass: 14.3,
                        status: 'Premium',
                        trend: 'down',
                        diff: '-1.5%'
                    },
                    {
                        id: '3',
                        date: '2025-11-12T09:30:00Z',
                        client_name: 'Carlos Alberto',
                        weight: 85.1,
                        body_fat: 21.8,
                        lean_mass: 66.5,
                        fat_mass: 18.6,
                        status: 'Standard',
                        trend: 'stable',
                        diff: '0.0%'
                    }
                ];

                // Simulate network delay
                setTimeout(() => {
                    setAssessments(mockHistory);
                    setLoading(false);
                }, 800);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };

        fetchHistory();
    }, [user]);

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).replace('.', '');
    };

    // Glassy, Transparent, Luminous
    const textureCardClass = "bg-black/40 bg-[radial-gradient(120%_120%_at_50%_0%,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent backdrop-blur-3xl border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] relative overflow-hidden";

    return (
        <FluidBackground variant="luminous" className="pb-40 font-sans px-5 relative overflow-hidden min-h-screen">
            {/* Header */}
            <header className="relative z-10 pt-10 flex items-center justify-between mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="w-11 h-11 rounded-full flex items-center justify-center bg-white/5 border border-white/10 shadow-sm active:scale-95 hover:bg-white/10 transition-all text-slate-400 hover:text-white"
                >
                    <ChevronLeft size={24} />
                </button>
                <div className="flex flex-col items-center">
                    <h1 className="text-lg font-black text-white uppercase tracking-tight">
                        Histórico <span className="text-[#CCFF00] tracking-widest">Metrik</span>
                    </h1>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Evolução de Performance</span>
                </div>
                <button className="w-11 h-11 rounded-full flex items-center justify-center bg-white/5 border border-white/10 shadow-sm active:scale-95 hover:bg-white/10 transition-all text-slate-400 hover:text-white">
                    <Filter size={20} />
                </button>
            </header>

            <div className="relative z-10 space-y-6">
                {/* Search Bar */}
                <div className="relative group">
                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-[#CCFF00] transition-colors">
                        <Search size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar por data ou resultado..."
                        className="w-full h-16 bg-white/5 border border-white/10 rounded-3xl pl-14 pr-6 text-sm font-bold text-white outline-none focus:border-[#CCFF00]/50 shadow-sm transition-all placeholder:text-slate-600"
                    />
                </div>

                {/* Evolution Summary Chart (Placeholder Visual) */}
                <div className={`${textureCardClass} rounded-[2.5rem] p-8 shadow-xl shadow-black/50 relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#CCFF00]/10 rounded-full -mr-10 -mt-10 blur-3xl" />
                    <div className="relative z-10 flex justify-between items-start mb-6">
                        <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Status da Evolução</p>
                            <h2 className="text-2xl font-black text-white">Excelente Progresso</h2>
                        </div>
                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10">
                            <TrendingDown className="text-[#CCFF00]" size={24} />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2 relative z-10">
                        <span className="text-4xl font-black text-[#CCFF00] tracking-tighter">-3.9kg</span>
                        <span className="text-xs font-bold text-slate-500 uppercase">desde o início</span>
                    </div>
                </div>

                {/* Timeline Grid */}
                <div className="space-y-4">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Timeline de Avaliações</p>

                    {loading ? (
                        <div className="py-20 flex flex-col items-center justify-center gap-4">
                            <div className="w-10 h-10 border-4 border-[#CCFF00] border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sincronizando Lab...</p>
                        </div>
                    ) : assessments.length > 0 ? (
                        assessments.map((item, idx) => (
                            <div
                                key={item.id}
                                onClick={() => navigate(`/profile/history/${item.id}`)}
                                className={`${textureCardClass} rounded-[2.5rem] p-6 shadow-sm border border-white/5 hover:border-[#CCFF00]/30 transition-all cursor-pointer active:scale-98 group`}
                            >
                                <div className="flex justify-between items-start mb-5 relative z-10">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-white/5 rounded-2xl flex flex-col items-center justify-center border border-white/5 group-hover:bg-[#CCFF00]/10 group-hover:border-[#CCFF00]/20 transition-colors">
                                            <Calendar size={18} className="text-slate-400 group-hover:text-[#CCFF00] mb-1" />
                                            <span className="text-[8px] font-black text-white uppercase">{item.date.split('-')[1]} {item.date.split('-')[2].substring(0, 2)}</span>
                                        </div>
                                        <div>
                                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{formatDate(item.date)}</h3>
                                            <p className="text-sm font-black text-white leading-tight mt-0.5">{item.client_name}</p>
                                            <div className="flex items-center gap-2 mt-1.5">
                                                <div className={cn(
                                                    "px-2 py-0.5 rounded-lg flex items-center gap-1 border border-white/5",
                                                    item.status === 'Elite' ? "bg-[#CCFF00]/10 text-[#CCFF00] border-[#CCFF00]/20" : "bg-white/5 text-slate-400"
                                                )}>
                                                    <Award size={10} />
                                                    <span className="text-[9px] font-black uppercase tracking-tighter">{item.status}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-1 justify-end">
                                            <span className="text-lg font-black text-white tracking-tighter">{item.body_fat}%</span>
                                            {item.trend === 'down' ? <TrendingDown size={14} className="text-[#CCFF00]" /> : <TrendingUp size={14} className="text-red-500" />}
                                        </div>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase">Gordura Corp.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3 border-t border-white/5 pt-5 mt-2 relative z-10">
                                    <div className="text-center">
                                        <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Peso</p>
                                        <p className="text-xs font-black text-slate-200">{item.weight}kg</p>
                                    </div>
                                    <div className="text-center border-x border-white/5 px-2">
                                        <p className="text-[9px] font-black text-slate-500 uppercase mb-1">M. Magra</p>
                                        <p className="text-xs font-black text-slate-200">{item.lean_mass}kg</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Variação</p>
                                        <p className={cn("text-xs font-black", item.trend === 'down' ? "text-[#CCFF00]" : "text-white")}>{item.diff}</p>
                                    </div>
                                </div>

                                <div className="mt-5 flex justify-end relative z-10">
                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-[#CCFF00] group-hover:text-black transition-all border border-white/5">
                                        <ChevronRight size={18} />
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-20 flex flex-col items-center justify-center text-center px-10">
                            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 text-slate-600 border border-white/5">
                                <FileBarChart size={40} />
                            </div>
                            <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-2">Sem Avaliações</h3>
                            <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Você ainda não realizou avaliações. Comece sua jornada agora!</p>
                        </div>
                    )}
                </div>
            </div>

            <BottomNav />
        </FluidBackground>
    );
};
