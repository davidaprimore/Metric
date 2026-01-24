import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    UserIcon,
    Loader2,
    ShieldCheck,
    Clock,
    Search
} from 'lucide-react';
import { BottomNav } from '@/components/layout/BottomNav';
import { supabase } from '@/lib/supabase';

export const ApprovalListScreen: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [pendings, setPendings] = useState<any[]>([]);

    useEffect(() => {
        fetchPendings();
    }, []);

    const fetchPendings = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*, specialties(name)')
                .eq('role', 'profissional')
                .eq('approval_status', 'pending');

            if (error) throw error;
            setPendings(data || []);
        } catch (error) {
            console.error('Error fetching pendings:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F1F3F5] pb-32 font-sans px-5">
            <header className="pt-8 flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate('/admin/registrations')}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-dark active:scale-95 transition-transform"
                >
                    <ChevronLeft size={20} />
                </button>
                <h1 className="text-2xl font-bold text-dark">
                    Aprovações
                </h1>
            </header>

            {/* Stats Card */}
            <div className="bg-amber-500 rounded-[2rem] p-6 text-white mb-8 shadow-lg shadow-amber-500/20">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                        <ShieldCheck size={24} className="text-white" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-white/80">Aguardando Validação</p>
                        <h2 className="text-3xl font-black">{pendings.length}</h2>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="flex items-center justify-between pl-2 mb-4">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Solicitações Recentes</h3>
                <Search size={16} className="text-gray-400" />
            </div>

            {loading ? (
                <div className="flex justify-center p-8">
                    <Loader2 className="animate-spin text-amber-500" />
                </div>
            ) : pendings.length > 0 ? (
                <div className="space-y-3">
                    {pendings.map((pro) => (
                        <div
                            key={pro.id}
                            onClick={() => navigate(`/admin/professionals/verify/${pro.id}`)}
                            className="bg-white p-4 rounded-[1.5rem] flex items-center gap-4 border border-gray-100/50 shadow-sm active:scale-95 transition-all cursor-pointer group"
                        >
                            <div className="w-12 h-12 rounded-full border-2 border-amber-100 p-0.5 overflow-hidden">
                                <img
                                    src={pro.avatar_url || `https://ui-avatars.com/api/?name=${pro.full_name}&background=f59e0b&color=fff`}
                                    alt={pro.full_name}
                                    className="w-full h-full rounded-full object-cover"
                                />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-bold text-dark">{pro.full_name}</h4>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[9px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                        {pro.specialties?.name || 'Geral'}
                                    </span>
                                    <div className="flex items-center gap-1 text-[9px] text-gray-400 font-medium">
                                        <Clock size={10} />
                                        <span>Há 2 dias</span> {/* Mock time for aesthetic */}
                                    </div>
                                </div>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-amber-50 transition-colors">
                                <ShieldCheck size={14} className="text-gray-400 group-hover:text-amber-500" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-[2rem] p-10 text-center border border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <UserIcon size={24} className="text-gray-300" />
                    </div>
                    <p className="text-sm font-bold text-gray-400">Nenhuma solicitação pendente.</p>
                </div>
            )}

            <BottomNav />
        </div>
    );
};
