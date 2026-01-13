import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    Plus,
    Loader2,
    Award,
    Trash2
} from 'lucide-react';
import { BottomNav } from '@/components/layout/BottomNav';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';

export const SpecialtiesScreen: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [specialties, setSpecialties] = useState<any[]>([]);
    const [newSpecialty, setNewSpecialty] = useState('');
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        fetchSpecialties();
    }, []);

    const fetchSpecialties = async () => {
        try {
            const { data, error } = await supabase
                .from('specialties')
                .select('*')
                .order('name');

            if (error) throw error;
            setSpecialties(data || []);
        } catch (error) {
            console.error('Error fetching specialties:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async () => {
        if (!newSpecialty.trim()) return;
        setAdding(true);
        try {
            const { error } = await supabase.from('specialties').insert([
                { name: newSpecialty.trim() }
            ]);
            if (error) throw error;

            setNewSpecialty('');
            fetchSpecialties();
        } catch (error) {
            alert('Erro ao criar especialidade');
        } finally {
            setAdding(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir?')) return;
        try {
            const { error } = await supabase.from('specialties').delete().eq('id', id);
            if (error) throw error;
            fetchSpecialties();
        } catch (e) {
            alert('Erro ao excluir');
        }
    }

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
                    Especialidades
                </h1>
            </header>

            {/* Add Input */}
            <div className="bg-white p-4 rounded-[2rem] shadow-sm mb-6 flex gap-2">
                <input
                    className="flex-1 bg-gray-50 rounded-xl px-4 text-sm outline-none font-bold text-dark"
                    placeholder="Nova Especialidade..."
                    value={newSpecialty}
                    onChange={(e) => setNewSpecialty(e.target.value)}
                />
                <Button
                    onClick={handleAdd}
                    disabled={adding || !newSpecialty}
                    className="w-12 h-12 rounded-xl bg-indigo-500 p-0 flex items-center justify-center"
                >
                    {adding ? <Loader2 size={20} className="animate-spin text-white" /> : <Plus size={24} className="text-white" />}
                </Button>
            </div>

            {/* List */}
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest pl-2 mb-4">Cadastradas</h3>

            {loading ? (
                <div className="flex justify-center p-8">
                    <Loader2 className="animate-spin text-indigo-500" />
                </div>
            ) : specialties.length > 0 ? (
                <div className="space-y-3">
                    {specialties.map((spec) => (
                        <div key={spec.id} className="bg-white p-4 rounded-[1.5rem] flex items-center justify-between border border-gray-100/50 shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500">
                                    <Award size={20} />
                                </div>
                                <h4 className="text-sm font-bold text-dark">{spec.name}</h4>
                            </div>
                            <button
                                onClick={() => handleDelete(spec.id)}
                                className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-100 transition-colors"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 opacity-50">
                    <p className="text-sm font-bold text-gray-400">Nenhuma especialidade.</p>
                </div>
            )}

            <BottomNav />
        </div>
    );
};
