import React, { useState, useEffect } from 'react';
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

    return (
        <div className="min-h-screen bg-[#F1F3F5] pb-32 font-sans overflow-x-hidden">
            {/* Header */}
            <header className="bg-white px-5 pt-10 pb-6 rounded-b-[2.5rem] shadow-sm border-b border-gray-100 flex items-center justify-between mb-8 sticky top-0 z-20">
                <button
                    onClick={() => navigate(-1)}
                    className="w-11 h-11 rounded-full flex items-center justify-center bg-gray-50 border border-gray-100 shadow-sm active:scale-90 transition-all"
                >
                    <ChevronLeft size={24} className="text-dark" />
                </button>
                <div className="flex flex-col items-center">
                    <h1 className="text-lg font-black text-dark uppercase tracking-tight">
                        Histórico <span className="text-secondary tracking-widest">Metrik</span>
                    </h1>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Evolução de Performance</span>
                </div>
                <button className="w-11 h-11 rounded-full flex items-center justify-center bg-gray-50 border border-gray-100 shadow-sm active:scale-90 transition-all">
                    <Filter size={20} className="text-dark" />
                </button>
            </header>

            <div className="px-5 space-y-6">
                {/* Search Bar */}
                <div className="relative group">
                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-secondary transition-colors">
                        <Search size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar por data ou resultado..."
                        className="w-full h-16 bg-white border border-gray-100 rounded-3xl pl-14 pr-6 text-sm font-bold text-dark outline-none focus:border-secondary shadow-sm transition-all shadow-gray-200/50"
                    />
                </div>

                {/* Evolution Summary Chart (Placeholder Visual) */}
                <div className="bg-dark rounded-[2.5rem] p-8 shadow-xl shadow-gray-300 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full -mr-10 -mt-10 blur-3xl" />
                    <div className="relative z-10 flex justify-between items-start mb-6">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status da Evolução</p>
                            <h2 className="text-2xl font-black text-white">Excelente Progresso</h2>
                        </div>
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                            <TrendingDown className="text-secondary" size={24} />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-secondary">-3.9kg</span>
                        <span className="text-xs font-bold text-white/50 uppercase">desde o início</span>
                    </div>
                </div>

                {/* Timeline Grid */}
                <div className="space-y-4">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Timeline de Avaliações</p>

                    {loading ? (
                        <div className="py-20 flex flex-col items-center justify-center gap-4">
                            <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sincronizando Lab...</p>
                        </div>
                    ) : assessments.length > 0 ? (
                        assessments.map((item, idx) => (
                            <div
                                key={item.id}
                                onClick={() => navigate(`/profile/history/${item.id}`)}
                                className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-transparent hover:border-secondary/20 transition-all cursor-pointer active:scale-98 group"
                            >
                                <div className="flex justify-between items-start mb-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-gray-50 rounded-2xl flex flex-col items-center justify-center border border-gray-100 group-hover:bg-secondary/5 group-hover:border-secondary/10 transition-colors">
                                            <Calendar size={18} className="text-gray-400 group-hover:text-secondary mb-1" />
                                            <span className="text-[8px] font-black text-dark uppercase">{item.date.split('-')[1]} {item.date.split('-')[2].substring(0, 2)}</span>
                                        </div>
                                        <div>
                                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{formatDate(item.date)}</h3>
                                            <p className="text-sm font-black text-dark leading-tight mt-0.5">{item.client_name}</p>
                                            <div className="flex items-center gap-2 mt-1.5">
                                                <div className={cn(
                                                    "px-2 py-0.5 rounded-lg flex items-center gap-1",
                                                    item.status === 'Elite' ? "bg-secondary text-white" : "bg-gray-100 text-gray-500"
                                                )}>
                                                    <Award size={10} />
                                                    <span className="text-[9px] font-black uppercase tracking-tighter">{item.status}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-1 justify-end">
                                            <span className="text-lg font-black text-dark tracking-tighter">{item.body_fat}%</span>
                                            {item.trend === 'down' ? <TrendingDown size={14} className="text-green-500" /> : <TrendingUp size={14} className="text-red-500" />}
                                        </div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">Gordura Corp.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3 border-t border-gray-50 pt-5 mt-2">
                                    <div className="text-center">
                                        <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Peso</p>
                                        <p className="text-xs font-black text-dark">{item.weight}kg</p>
                                    </div>
                                    <div className="text-center border-x border-gray-100 px-2">
                                        <p className="text-[9px] font-black text-gray-400 uppercase mb-1">M. Magra</p>
                                        <p className="text-xs font-black text-dark">{item.lean_mass}kg</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Variação</p>
                                        <p className={cn("text-xs font-black", item.trend === 'down' ? "text-green-500" : "text-dark")}>{item.diff}</p>
                                    </div>
                                </div>

                                <div className="mt-5 flex justify-end">
                                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-secondary group-hover:text-white transition-all">
                                        <ChevronRight size={18} />
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-20 flex flex-col items-center justify-center text-center px-10">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-200">
                                <FileBarChart size={40} />
                            </div>
                            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-2">Sem Avaliações</h3>
                            <p className="text-[10px] text-gray-400 font-medium leading-relaxed">Você ainda não realizou avaliações. Comece sua jornada agora!</p>
                        </div>
                    )}
                </div>
            </div>

            <BottomNav />
        </div>
    );
};
