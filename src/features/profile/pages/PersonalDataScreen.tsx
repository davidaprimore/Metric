import React, { useState, useRef } from 'react';
import {
    ChevronLeft,
    MoreVertical,
    Camera,
    CheckCircle2,
    Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { BottomNav } from '@/components/layout/BottomNav';
import { Toast } from '@/components/ui/Toast';
import { supabase } from '@/lib/supabase';

export const PersonalDataScreen: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' | 'loading' });

    // Form state initialized with user metadata
    const [formData, setFormData] = useState({
        first_name: user?.user_metadata?.first_name || '',
        last_name: user?.user_metadata?.last_name || '',
        email: user?.email || '',
        birth_date: user?.user_metadata?.birth_date || '',
        gender: user?.user_metadata?.gender || 'Feminino',
        height: user?.user_metadata?.height || '',
        weight: user?.user_metadata?.weight || '',
        cpf: user?.user_metadata?.cpf || ''
    });

    const handleSave = async () => {
        if (!user) return;
        setLoading(true);
        try {
            // 1. Update Supabase Auth Metadata (Used for quick access in session)
            const { error: authError } = await supabase.auth.updateUser({
                data: {
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    birth_date: formData.birth_date,
                    gender: formData.gender,
                    height: formData.height,
                    weight: formData.weight,
                    cpf: formData.cpf
                }
            });

            if (authError) throw authError;

            // 2. Update profiles table (Data permanence)
            const { error: profileError } = await supabase
                .from('profiles')
                .update({
                    full_name: `${formData.first_name} ${formData.last_name}`.trim(),
                })
                .eq('id', user.id);

            if (profileError) throw profileError;

            setToast({
                show: true,
                message: 'Perfeito! Suas alterações foram salvas com sucesso. ✨',
                type: 'success'
            });
            setTimeout(() => navigate('/profile'), 2000);
        } catch (error: any) {
            console.error('Error saving profile:', error);
            setToast({
                show: true,
                message: 'Não foi possível salvar: ' + (error.message || 'Erro desconhecido'),
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const triggerFilePicker = () => fileInputRef.current?.click();
    const triggerCamera = () => cameraInputRef.current?.click();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setToast({
                show: true,
                message: `Foto "${file.name}" selecionada! O upload para o servidor estará disponível em breve. 📸`,
                type: 'success'
            });
        }
    };

    return (
        <div className="min-h-screen bg-[#F1F3F5] pb-32 font-sans">
            <Toast
                isVisible={toast.show}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ ...toast, show: false })}
            />
            {/* Hidden native inputs */}
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
            />
            <input
                type="file"
                ref={cameraInputRef}
                className="hidden"
                accept="image/*"
                capture="user"
                onChange={handleImageChange}
            />

            {/* Header */}
            <header className="bg-white px-5 pt-8 pb-4 flex justify-between items-center mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-50 border border-gray-100 shadow-sm active:scale-95"
                >
                    <ChevronLeft size={24} className="text-dark" />
                </button>
                <div className="flex-1 text-center">
                    <h1 className="text-lg font-bold text-dark">
                        Dados <span className="text-secondary">Pessoais</span>
                    </h1>
                </div>
                <button className="w-10 h-10 flex items-center justify-center opacity-30">
                    <MoreVertical size={24} className="text-dark" />
                </button>
            </header>

            <div className="px-5">
                {/* Avatar Section */}
                <div className="flex flex-col items-center mb-8">
                    <div className="relative">
                        <div className="w-28 h-28 rounded-full border-[3px] border-white p-1 bg-white shadow-xl overflow-hidden">
                            <img
                                src="https://i.pravatar.cc/150?u=Ricardo"
                                alt="Avatar"
                                className="w-full h-full rounded-full object-cover"
                            />
                        </div>
                        <button
                            onClick={triggerCamera}
                            className="absolute bottom-1 right-1 w-10 h-10 bg-secondary text-white rounded-full flex items-center justify-center border-2 border-white shadow-lg active:scale-90 transition-transform"
                        >
                            <Camera size={18} />
                        </button>
                    </div>
                    <button
                        onClick={triggerFilePicker}
                        className="mt-4 text-[10px] font-black text-secondary uppercase tracking-[0.2em] hover:underline"
                    >
                        Alterar Foto
                    </button>
                </div>

                {/* Form Sections */}
                <div className="space-y-6">
                    {/* Basic Info */}
                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100/50">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider ml-2">Nome</label>
                                <div className="h-14 bg-gray-50 rounded-2xl border border-primary px-4 flex items-center">
                                    <input
                                        className="bg-transparent w-full text-sm font-bold text-dark outline-none"
                                        value={formData.first_name}
                                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider ml-2">Sobrenome</label>
                                <div className="h-14 bg-white rounded-2xl border border-gray-200 px-4 flex items-center shadow-inner">
                                    <input
                                        className="bg-transparent w-full text-sm font-bold text-dark outline-none"
                                        value={formData.last_name}
                                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Email & CPF */}
                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100/50 space-y-4">
                        <div className="space-y-2 opacity-60">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider ml-2">E-mail Profissional</label>
                            <div className="h-14 bg-gray-100/50 rounded-2xl border border-gray-100 px-4 flex items-center">
                                <input
                                    className="bg-transparent w-full text-sm font-bold text-dark outline-none cursor-not-allowed"
                                    value={formData.email}
                                    readOnly
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider ml-2">CPF</label>
                            <div className="h-14 bg-white rounded-2xl border border-gray-200 px-4 flex items-center">
                                <input
                                    className="bg-transparent w-full text-sm font-bold text-dark outline-none"
                                    value={formData.cpf}
                                    onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                                    placeholder="000.000.000-00"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Physical Specs */}
                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100/50 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider ml-2">Nascimento</label>
                                <div className="h-14 bg-white rounded-2xl border border-gray-200 px-4 flex items-center">
                                    <input
                                        className="bg-transparent w-full text-sm font-bold text-dark outline-none"
                                        value={formData.birth_date}
                                        placeholder="DD/MM/AAAA"
                                        onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider ml-2">Gênero</label>
                                <div className="h-14 bg-white rounded-2xl border border-gray-200 px-4 flex items-center">
                                    <select
                                        className="bg-transparent w-full text-sm font-bold text-dark outline-none appearance-none"
                                        value={formData.gender}
                                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                    >
                                        <option value="Feminino">Feminino</option>
                                        <option value="Masculino">Masculino</option>
                                        <option value="Outro">Outro</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider ml-2">Altura (cm)</label>
                                <div className="h-14 bg-white rounded-2xl border border-gray-200 px-4 flex items-center justify-between">
                                    <input
                                        type="number"
                                        className="bg-transparent w-full text-sm font-bold text-dark outline-none"
                                        value={formData.height}
                                        onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                                    />
                                    <span className="text-[8px] font-black text-gray-300 uppercase shrink-0">CM</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider ml-2">Peso (kg)</label>
                                <div className="h-14 bg-white rounded-2xl border border-gray-200 px-4 flex items-center justify-between">
                                    <input
                                        type="number"
                                        className="bg-transparent w-full text-sm font-bold text-dark outline-none"
                                        value={formData.weight}
                                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                    />
                                    <span className="text-[8px] font-black text-gray-300 uppercase shrink-0">KG</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="mt-8">
                    <Button
                        onClick={handleSave}
                        disabled={loading}
                        className="w-full h-16 rounded-3xl bg-primary text-dark font-black tracking-tight gap-3 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                    >
                        {loading ? (
                            <Loader2 className="w-6 h-6 animate-spin text-dark" />
                        ) : (
                            <CheckCircle2 size={24} strokeWidth={3} />
                        )}
                        {loading ? 'SALVANDO...' : 'SALVAR ALTERAÇÕES'}
                    </Button>
                </div>
            </div>

            <BottomNav />
        </div>
    );
};
