import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    UserIcon,
    Plus,
    Loader2,
    Shield
} from 'lucide-react';
import { BottomNav } from '@/components/layout/BottomNav';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';

export const ProfessionalsScreen: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [professionals, setProfessionals] = useState<any[]>([]);

    useEffect(() => {
        fetchProfessionals();
    }, []);

    const fetchProfessionals = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('role', 'profissional');

            if (error) throw error;
            setProfessionals(data || []);
        } catch (error) {
            console.error('Error fetching professionals:', error);
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
                    Profissionais
                </h1>
            </header>

            {/* Stats Card */}
            <div className="bg-emerald-500 rounded-[2rem] p-6 text-white mb-8 shadow-lg shadow-emerald-500/20">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                        <Shield size={24} className="text-white" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-white/80">Total Cadastrado</p>
                        <h2 className="text-3xl font-black">{professionals.length}</h2>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        className="bg-white text-emerald-600 font-bold rounded-xl h-10 text-xs flex-1 hover:bg-emerald-50"
                        onClick={() => navigate('/admin/professionals/new')}
                    >
                        <Plus size={16} className="mr-2" />
                        Novo Profissional
                    </Button>
                </div>
            </div>

            {/* List */}
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest pl-2 mb-4">Lista de Especialistas</h3>

            {loading ? (
                <div className="flex justify-center p-8">
                    <Loader2 className="animate-spin text-emerald-500" />
                </div>
            ) : professionals.length > 0 ? (
                <div className="space-y-3">
                    {professionals.map((pro) => (
                        <div
                            key={pro.id}
                            onClick={() => navigate(`/admin/professionals/verify/${pro.id}`)}
                            className="bg-white p-4 rounded-[1.5rem] flex items-center gap-4 border border-gray-100/50 shadow-sm active:scale-95 transition-all cursor-pointer"
                        >
                            <div className="w-12 h-12 rounded-full border-2 border-emerald-100 p-0.5 overflow-hidden">
                                <img
                                    src={pro.avatar_url || `https://ui-avatars.com/api/?name=${pro.full_name}&background=10b981&color=fff`}
                                    alt={pro.full_name}
                                    className="w-full h-full rounded-full object-cover"
                                />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-bold text-dark">{pro.full_name}</h4>
                                <p className="text-[10px] text-gray-400 font-medium truncate">{pro.email}</p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                                <UserIcon size={14} className="text-gray-400" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 opacity-50">
                    <p className="text-sm font-bold text-gray-400">Nenhum profissional encontrado.</p>
                </div>
            )}

            <BottomNav />
        </div>
    );
};
