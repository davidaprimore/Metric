import React, { useState, useRef } from 'react';
import { FluidBackground } from '@/components/layout/FluidBackground';
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
import { DefaultAvatar } from '@/components/shared/DefaultAvatar';
import { ImageCropper } from '@/components/shared/ImageCropper';
import { Toast } from '@/components/ui/Toast';
import { supabase } from '@/lib/supabase';
import { masks } from '@/utils/masks';
import { fetchAddressByCEP } from '@/utils/cep';
import { cn } from '@/lib/utils';

export const PersonalDataScreen: React.FC = () => {
    const navigate = useNavigate();
    const { user, userProfile, refreshProfile } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const [imageToCrop, setImageToCrop] = useState<string | null>(null);
    const [fetchingCep, setFetchingCep] = useState(false);
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
        cpf: user?.user_metadata?.cpf || '',
        phone: user?.user_metadata?.phone || '',
        address_zip: user?.user_metadata?.address_zip || '',
        address_street: user?.user_metadata?.address_street || '',
        address_number: user?.user_metadata?.address_number || '',
        address_neighborhood: user?.user_metadata?.address_neighborhood || '',
        address_city: user?.user_metadata?.address_city || ''
    });

    const handleCepLookup = async (cep: string) => {
        const cleanCep = cep.replace(/\D/g, '');
        if (cleanCep.length === 8) {
            setFetchingCep(true);
            const data = await fetchAddressByCEP(cleanCep);
            if (data) {
                setFormData(prev => ({
                    ...prev,
                    address_street: data.logradouro,
                    address_neighborhood: data.bairro,
                    address_city: data.localidade
                }));
            }
            setFetchingCep(false);
        }
    };

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
                    cpf: formData.cpf,
                    phone: formData.phone,
                    address_zip: formData.address_zip,
                    address_street: formData.address_street,
                    address_number: formData.address_number,
                    address_neighborhood: formData.address_neighborhood,
                    address_city: formData.address_city
                }
            });

            if (authError) throw authError;

            // 2. Update profiles table (Data permanence)
            const { error: profileError } = await supabase
                .from('profiles')
                .update({
                    full_name: `${formData.first_name} ${formData.last_name}`.trim(),
                    birth_date: formData.birth_date,
                    gender: formData.gender.toLowerCase(),
                    height: formData.height ? parseFloat(formData.height) : null,
                    weight: formData.weight ? parseFloat(formData.weight) : null,
                    phone: formData.phone,
                    address_zip: formData.address_zip,
                    address_street: formData.address_street,
                    address_number: formData.address_number,
                    address_neighborhood: formData.address_neighborhood,
                    address_city: formData.address_city
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

    const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () => setImageToCrop(reader.result?.toString() || null));
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleCropComplete = async (croppedBlob: Blob) => {
        setImageToCrop(null);
        setLoading(true);
        setToast({ show: true, message: 'Enviando foto...', type: 'loading' });

        try {
            const fileName = `avatar_${user?.id}_${Date.now()}.jpg`;
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(fileName, croppedBlob, {
                    contentType: 'image/jpeg',
                    upsert: true
                });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName);

            // 1. Update auth metadata
            const { error: authError } = await supabase.auth.updateUser({
                data: { avatar_url: publicUrl }
            });
            if (authError) throw authError;

            // 2. Update profiles table
            const { error: profileError } = await supabase
                .from('profiles')
                .update({ avatar_url: publicUrl })
                .eq('id', user?.id);
            if (profileError) throw profileError;

            await refreshProfile();
            setToast({ show: true, message: 'Foto atualizada com sucesso!', type: 'success' });
        } catch (error: any) {
            console.error('Upload error:', error);
            setToast({ show: true, message: error.message || 'Erro ao enviar foto', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

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

    // Glassy, Transparent, Luminous
    const textureCardClass = "bg-black/40 bg-[radial-gradient(120%_120%_at_50%_0%,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent backdrop-blur-3xl border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] relative overflow-hidden";

    return (
        <FluidBackground variant="luminous" className="pb-40 font-sans px-5 relative overflow-hidden min-h-screen">
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

            <div className="relative z-10 text-white">
                {/* Header */}
                <header className="pt-8 flex justify-between items-center mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 shadow-sm active:scale-95 text-slate-400 hover:text-white transition-colors"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <div className="flex-1 text-center">
                        <h1 className="text-lg font-bold text-white uppercase tracking-tight">
                            Dados <span className="text-[#CCFF00]">Pessoais</span>
                        </h1>
                    </div>
                    <button className="w-10 h-10 flex items-center justify-center opacity-30">
                        <MoreVertical size={24} className="text-white" />
                    </button>
                </header>

                <div className="">
                    {/* Hidden Inputs */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={onSelectFile}
                    />
                    <input
                        type="file"
                        ref={cameraInputRef}
                        className="hidden"
                        accept="image/*"
                        capture="environment"
                        onChange={onSelectFile}
                    />

                    {/* Avatar Section */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="relative group">
                            <div className="w-28 h-28 rounded-full border-[3px] border-[#CCFF00] p-1 bg-[#080C09] shadow-xl shadow-[#CCFF00]/10 overflow-hidden">
                                {user?.user_metadata?.avatar_url && !user.user_metadata.avatar_url.includes('pravatar.cc') ? (
                                    <img
                                        src={user.user_metadata.avatar_url}
                                        alt="Avatar"
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                ) : (
                                    <DefaultAvatar gender={formData.gender} className="w-full h-full rounded-full" />
                                )}
                            </div>
                            <button
                                onClick={triggerCamera}
                                className="absolute bottom-1 right-1 w-9 h-9 bg-[#CCFF00] text-black rounded-full flex items-center justify-center border-2 border-[#122216] shadow-lg active:scale-90 transition-transform hover:scale-110"
                            >
                                <Camera size={16} strokeWidth={2.5} />
                            </button>
                        </div>
                        <button
                            onClick={triggerFilePicker}
                            className="mt-4 text-[10px] font-black text-[#CCFF00] uppercase tracking-[0.2em] hover:underline"
                        >
                            Alterar Foto
                        </button>
                    </div>

                    {imageToCrop && (
                        <ImageCropper
                            image={imageToCrop}
                            onCropComplete={handleCropComplete}
                            onCancel={() => setImageToCrop(null)}
                        />
                    )}

                    {/* Form Sections */}
                    <div className="space-y-6">
                        {/* Basic Info */}
                        <div className={`${textureCardClass} p-6 rounded-[2rem]`}>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider ml-2">Nome</label>
                                    <div className="h-14 bg-white/5 rounded-2xl border border-white/10 px-4 flex items-center focus-within:border-[#CCFF00]/50 transition-colors">
                                        <input
                                            className="bg-transparent w-full text-sm font-bold text-white outline-none placeholder:text-slate-600"
                                            value={formData.first_name}
                                            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider ml-2">Sobrenome</label>
                                    <div className="h-14 bg-white/5 rounded-2xl border border-white/10 px-4 flex items-center focus-within:border-[#CCFF00]/50 transition-colors">
                                        <input
                                            className="bg-transparent w-full text-sm font-bold text-white outline-none placeholder:text-slate-600"
                                            value={formData.last_name}
                                            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Email & CPF */}
                        <div className={`${textureCardClass} p-6 rounded-[2rem] space-y-4`}>
                            <div className="space-y-2 opacity-60">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider ml-2">E-mail</label>
                                <div className="h-14 bg-white/5 rounded-2xl border border-white/10 px-4 flex items-center">
                                    <input
                                        className="bg-transparent w-full text-sm font-bold text-slate-400 outline-none cursor-not-allowed"
                                        value={formData.email}
                                        readOnly
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider ml-2">CPF</label>
                                <div className={cn(
                                    "h-14 bg-white/5 rounded-2xl border border-white/10 px-4 flex items-center",
                                    userProfile?.role === 'profissional' && "opacity-60"
                                )}>
                                    <input
                                        className={cn(
                                            "bg-transparent w-full text-sm font-bold text-white outline-none placeholder:text-slate-600",
                                            userProfile?.role === 'profissional' && "cursor-not-allowed text-slate-400"
                                        )}
                                        value={formData.cpf}
                                        readOnly={userProfile?.role === 'profissional'}
                                        onChange={(e) => setFormData({ ...formData, cpf: masks.cpf(e.target.value) })}
                                        placeholder="000.000.000-00"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider ml-2">Telefone / WhatsApp</label>
                                <div className="h-14 bg-white/5 rounded-2xl border border-white/10 px-4 flex items-center focus-within:border-[#CCFF00]/50 transition-colors">
                                    <input
                                        className="bg-transparent w-full text-sm font-bold text-white outline-none placeholder:text-slate-600"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: masks.phone(e.target.value) })}
                                        placeholder="(00) 00000-0000"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Physical Specs (Only for Patients) */}
                        {userProfile?.role !== 'profissional' && (
                            <div className={`${textureCardClass} p-6 rounded-[2rem] space-y-4`}>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider ml-2">Nascimento</label>
                                        <div className="h-14 bg-white/5 rounded-2xl border border-white/10 px-4 flex items-center focus-within:border-[#CCFF00]/50 transition-colors">
                                            <input
                                                className="bg-transparent w-full text-sm font-bold text-white outline-none placeholder:text-slate-600"
                                                value={formData.birth_date}
                                                placeholder="DD/MM/AAAA"
                                                onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider ml-2">Gênero</label>
                                        <div className="h-14 bg-white/5 rounded-2xl border border-white/10 px-4 flex items-center focus-within:border-[#CCFF00]/50 transition-colors relative">
                                            <select
                                                className="bg-transparent w-full text-sm font-bold text-white outline-none appearance-none [&>option]:text-black"
                                                value={formData.gender}
                                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                            >
                                                <option value="Feminino">Feminino</option>
                                                <option value="Masculino">Masculino</option>
                                                <option value="Outro">Outro</option>
                                            </select>
                                            <div className="pointer-events-none absolute right-4 text-slate-500"><ChevronLeft className="-rotate-90" size={14} /></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider ml-2">Altura (cm)</label>
                                        <div className="h-14 bg-white/5 rounded-2xl border border-white/10 px-4 flex items-center justify-between focus-within:border-[#CCFF00]/50 transition-colors">
                                            <input
                                                type="number"
                                                className="bg-transparent w-full text-sm font-bold text-white outline-none placeholder:text-slate-600"
                                                value={formData.height}
                                                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                                            />
                                            <span className="text-[8px] font-black text-slate-600 uppercase shrink-0">CM</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider ml-2">Peso (kg)</label>
                                        <div className="h-14 bg-white/5 rounded-2xl border border-white/10 px-4 flex items-center justify-between focus-within:border-[#CCFF00]/50 transition-colors">
                                            <input
                                                type="number"
                                                className="bg-transparent w-full text-sm font-bold text-white outline-none placeholder:text-slate-600"
                                                value={formData.weight}
                                                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                            />
                                            <span className="text-[8px] font-black text-slate-600 uppercase shrink-0">KG</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Address Section */}
                        <div className={`${textureCardClass} p-6 rounded-[2rem] space-y-4`}>
                            <div className="flex justify-between items-center px-2 mb-2">
                                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Endereço</h3>
                                {fetchingCep && <Loader2 className="w-4 h-4 animate-spin text-[#CCFF00]" />}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider ml-2">CEP</label>
                                    <div className="h-14 bg-white/5 rounded-2xl border border-white/10 px-4 flex items-center focus-within:border-[#CCFF00]/50 transition-colors">
                                        <input
                                            className="bg-transparent w-full text-sm font-bold text-white outline-none placeholder:text-slate-600"
                                            placeholder="00000-000"
                                            value={formData.address_zip}
                                            onChange={(e) => {
                                                const val = masks.cep(e.target.value);
                                                setFormData({ ...formData, address_zip: val });
                                                if (val.replace(/\D/g, '').length === 8) handleCepLookup(val);
                                            }}
                                            maxLength={9}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider ml-2">Cidade</label>
                                    <div className="h-14 bg-white/5 rounded-2xl border border-white/10 px-4 flex items-center opacity-60">
                                        <input
                                            className="bg-transparent w-full text-sm font-bold text-slate-300 outline-none"
                                            value={formData.address_city}
                                            readOnly
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider ml-2">Logradouro</label>
                                <div className="h-14 bg-white/5 rounded-2xl border border-white/10 px-4 flex items-center opacity-60">
                                    <input
                                        className="bg-transparent w-full text-sm font-bold text-slate-300 outline-none"
                                        value={formData.address_street}
                                        readOnly
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider ml-2">Número</label>
                                    <div className="h-14 bg-white/5 rounded-2xl border border-white/10 px-4 flex items-center focus-within:border-[#CCFF00]/50 transition-colors">
                                        <input
                                            className="bg-transparent w-full text-sm font-bold text-white outline-none placeholder:text-slate-600"
                                            placeholder="123"
                                            value={formData.address_number}
                                            onChange={(e) => setFormData({ ...formData, address_number: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider ml-2">Bairro</label>
                                    <div className="h-14 bg-white/5 rounded-2xl border border-white/10 px-4 flex items-center opacity-60">
                                        <input
                                            className="bg-transparent w-full text-sm font-bold text-slate-300 outline-none"
                                            value={formData.address_neighborhood}
                                            readOnly
                                        />
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
                            className="w-full h-16 rounded-3xl bg-[#CCFF00] text-black font-black tracking-tight gap-3 shadow-lg shadow-[#CCFF00]/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 hover:bg-white"
                        >
                            {loading ? (
                                <Loader2 className="w-6 h-6 animate-spin text-black" />
                            ) : (
                                <CheckCircle2 size={24} strokeWidth={3} />
                            )}
                            {loading ? 'SALVANDO...' : 'SALVAR ALTERAÇÕES'}
                        </Button>
                    </div>
                </div>
            </div>

            <BottomNav />
        </FluidBackground>
    );
};
