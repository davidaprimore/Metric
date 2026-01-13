import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    Plus,
    Loader2,
    MapPin,
    Building,
    Check
} from 'lucide-react';
import { BottomNav } from '@/components/layout/BottomNav';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Toast } from '@/components/ui/Toast';

export const UnitsScreen: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [units, setUnits] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [newUnit, setNewUnit] = useState({ name: '', address: '' });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchUnits();
    }, []);

    const fetchUnits = async () => {
        try {
            const { data, error } = await supabase
                .from('units')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setUnits(data || []);
        } catch (error) {
            console.error('Error fetching units:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!newUnit.name || !newUnit.address) return;
        setSaving(true);
        try {
            const { error } = await supabase.from('units').insert([
                { name: newUnit.name, address: newUnit.address }
            ]);
            if (error) throw error;

            setNewUnit({ name: '', address: '' });
            setShowForm(false);
            fetchUnits();
        } catch (error) {
            alert('Erro ao salvar unidade');
        } finally {
            setSaving(false);
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
                    Unidades
                </h1>
            </header>

            {/* Add Button */}
            {!showForm && (
                <button
                    onClick={() => setShowForm(true)}
                    className="w-full bg-orange-500 text-white p-5 rounded-[2rem] flex items-center justify-between mb-8 shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <Plus size={20} />
                        </div>
                        <span className="font-bold text-sm">Nova Unidade</span>
                    </div>
                </button>
            )}

            {/* Creative Form */}
            {showForm && (
                <div className="bg-white p-6 rounded-[2.5rem] mb-8 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300 border border-orange-100">
                    <h3 className="text-lg font-black text-dark mb-6">Cadastrar Local</h3>

                    <div className="space-y-4">
                        <div className="bg-orange-50/50 rounded-2xl px-4 py-3 border border-orange-100/50">
                            <label className="text-[10px] uppercase font-bold text-orange-400 pl-1 block mb-1">Nome da Unidade</label>
                            <input
                                className="w-full bg-transparent font-bold text-dark outline-none placeholder:text-gray-300"
                                placeholder="Ex: Matriz Paulista"
                                value={newUnit.name}
                                onChange={(e) => setNewUnit({ ...newUnit, name: e.target.value })}
                            />
                        </div>

                        <div className="bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100">
                            <label className="text-[10px] uppercase font-bold text-gray-400 pl-1 block mb-1">Endereço Completo</label>
                            <input
                                className="w-full bg-transparent font-bold text-dark outline-none placeholder:text-gray-300"
                                placeholder="Rua, Número, Bairro..."
                                value={newUnit.address}
                                onChange={(e) => setNewUnit({ ...newUnit, address: e.target.value })}
                            />
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => setShowForm(false)}
                                className="flex-1 h-12 rounded-xl bg-gray-100 text-gray-400 font-bold text-xs"
                            >
                                Cancelar
                            </button>
                            <Button
                                onClick={handleSave}
                                disabled={saving || !newUnit.name}
                                className="flex-[2] h-12 rounded-xl bg-orange-500 text-white font-bold text-xs shadow-md shadow-orange-500/20"
                            >
                                {saving ? <Loader2 className="animate-spin" /> : 'Salvar Unidade'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* List */}
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest pl-2 mb-4">Unidades Ativas</h3>

            {loading ? (
                <div className="flex justify-center p-8">
                    <Loader2 className="animate-spin text-orange-500" />
                </div>
            ) : units.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                    {units.map((unit) => (
                        <div key={unit.id} className="bg-white rounded-[2rem] p-5 shadow-sm border border-gray-100 group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500">
                                    <Building size={20} />
                                </div>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${unit.active ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                                    {unit.active ? 'Ativo' : 'Inativo'}
                                </span>
                            </div>
                            <h4 className="text-lg font-bold text-dark mb-1">{unit.name}</h4>
                            <div className="flex items-start gap-2 text-gray-400">
                                <MapPin size={14} className="mt-0.5 shrink-0" />
                                <p className="text-xs font-medium leading-tight">{unit.address}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 opacity-50">
                    <p className="text-sm font-bold text-gray-400">Nenhuma unidade cadastrada.</p>
                </div>
            )}

            <BottomNav />
        </div>
    );
};
