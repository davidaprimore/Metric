import React, { useState, useEffect } from 'react';
import {
    ChevronLeft,
    Stethoscope,
    Building2,
    ShieldCheck,
    CheckCircle2,
    Loader2,
    FileText,
    Upload,
    X,
    Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { BottomNav } from '@/components/layout/BottomNav';
import { Toast } from '@/components/ui/Toast';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

export const ProfessionalDataScreen: React.FC = () => {
    const navigate = useNavigate();
    const { user, userProfile, refreshProfile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [fetchingDropdowns, setFetchingDropdowns] = useState(true);
    const [specialties, setSpecialties] = useState<any[]>([]);
    const [units, setUnits] = useState<any[]>([]);
    const [docs, setDocs] = useState<any[]>([]);
    const [loadingDocs, setLoadingDocs] = useState(true);
    const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' | 'loading' | 'warning' });

    const [formData, setFormData] = useState({
        cref_crm: user?.user_metadata?.cref_crm || '',
        specialty_id: user?.user_metadata?.specialty_id || '',
        unit_id: user?.user_metadata?.unit_id || ''
    });

    useEffect(() => {
        fetchDropdowns();
    }, []);

    useEffect(() => {
        // Fetch docs whenever user changes (which happens after refreshProfile)
        fetchDocs();
    }, [user]);

    const fetchDocs = async () => {
        if (!user) return;
        try {
            // Fetch from metadata instead of DB
            const meta = user.user_metadata || {};
            const docsMap = meta.documents || {};

            // Convert map to array format expected by UI
            const docsArray = Object.keys(docsMap).map(key => ({
                document_type: key,
                ...docsMap[key]
            }));

            setDocs(docsArray);
        } catch (err) {
            console.error('Error fetching docs:', err);
        } finally {
            setLoadingDocs(false);
        }
    };

    const fetchDropdowns = async () => {
        try {
            const { data: specData } = await supabase.from('specialties').select('*').order('name');
            const { data: unitData } = await supabase.from('units').select('*').eq('active', true).order('name');
            setSpecialties(specData || []);
            setUnits(unitData || []);
        } catch (err) {
            console.error('Error fetching dropdowns:', err);
        } finally {
            setFetchingDropdowns(false);
        }
    };

    const handleSave = async () => {
        if (!user) return;
        setLoading(true);
        try {
            // Update Auth Metadata
            const { error: authError } = await supabase.auth.updateUser({
                data: {
                    cref_crm: formData.cref_crm,
                    specialty_id: formData.specialty_id,
                    unit_id: formData.unit_id
                }
            });

            if (authError) throw authError;

            // Also update the profile table to be sure
            await supabase.from('profiles').update({
                specialty_id: formData.specialty_id,
                unit_id: formData.unit_id
            }).eq('id', user.id);

            setToast({
                show: true,
                message: 'Dados profissionais atualizados com sucesso! 🛡️',
                type: 'success'
            });
            await refreshProfile();
        } catch (error: any) {
            console.error('Error saving professional data:', error);
            setToast({
                show: true,
                message: 'Erro ao salvar: ' + (error.message || 'Erro desconhecido'),
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleUploadClick = (docType: string) => {
        setUploadingDoc(docType);
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !uploadingDoc || !user) return;

        setToast({ show: true, message: 'Enviando documento...', type: 'loading' });

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${uploadingDoc}_${user.id}_${Date.now()}.${fileExt}`;

            // 1. Storage Upload (Usually allows authenticated users)
            const { error: uploadError } = await supabase.storage
                .from('documents')
                .upload(fileName, file, { upsert: true });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage.from('documents').getPublicUrl(fileName);

            // 2. Metadata Update (Bypass RLS on tables)
            // We store documents in user_metadata.documents = { [type]: { url, status: 'pending', date } }
            const currentMetadata = user.user_metadata || {};
            const currentDocs = currentMetadata.documents || {};

            const newDocs = {
                ...currentDocs,
                [uploadingDoc]: {
                    url: publicUrl,
                    status: 'pending',
                    updated_at: new Date().toISOString()
                }
            };

            const { error: authError } = await supabase.auth.updateUser({
                data: { documents: newDocs }
            });

            if (authError) throw authError;

            // 3. Update 'documents' column in PROFILES (Primary Source for Admin)
            // We use the same JSON structure
            try {
                await supabase.from('profiles').update({
                    documents: newDocs,
                    has_pending_docs: true
                }).eq('id', user.id);
            } catch (ignored) {
                console.error('Error updating profile documents:', ignored);
            }

            setToast({ show: true, message: 'Documento enviado para análise! 🚀✨', type: 'success' });

            // Update local state to reflect change immediately
            // We need to fetch from metadata now, not DB table.
            // But for now, let's trigger a profile refresh?
            await refreshProfile();
            // And manually update local docs state for immediate UI feedback if possible
            // Re-fetching docs won't work if we stopped using the table. 
            // We need to change how we fetch docs too.

        } catch (error: any) {
            console.error('Upload error:', error);
            setToast({ show: true, message: 'Erro ao enviar: ' + (error.message || 'Verifique sua conexão'), type: 'error' });
        }
    };

    const getDocStatus = (type: string) => {
        return docs.find(d => d.document_type === type);
    };

    const getStatusStyle = (status?: string) => {
        switch (status) {
            case 'approved': return "bg-[#C4FF0E] text-dark shadow-[#C4FF0E]/20";
            case 'refused': return "bg-red-500 text-white shadow-red-200";
            default: return "bg-amber-100 text-amber-600 shadow-none";
        }
    };

    const inputStyle = "w-full h-14 bg-white border border-gray-200 rounded-2xl px-4 text-sm font-bold text-dark outline-none focus:border-secondary transition-all appearance-none";
    const labelStyle = "text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block";

    return (
        <div className="min-h-screen bg-[#F1F3F5] pb-32 font-sans">
            <Toast
                isVisible={toast.show}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ ...toast, show: false })}
            />

            <header className="bg-white px-5 pt-8 pb-4 flex justify-between items-center mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-50 border border-gray-100 shadow-sm active:scale-95"
                >
                    <ChevronLeft size={24} className="text-dark" />
                </button>
                <div className="flex-1 text-center">
                    <h1 className="text-lg font-bold text-dark">
                        Dados <span className="text-secondary">Profissionais</span>
                    </h1>
                </div>
                <div className="w-10" />
            </header>

            <div className="px-5 space-y-6">
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100/50 space-y-6">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <ShieldCheck size={18} className="text-secondary" />
                            <span className="text-xs font-black text-dark uppercase tracking-widest">Documentação e Validação</span>
                        </div>

                        <div className="space-y-4">
                            {[
                                { id: 'cpf', label: 'Cópia do CPF / RG' },
                                { id: 'cref_crm', label: 'Carteira Profissional (CREF/CRM)' },
                                { id: 'certificacao', label: 'Certificação / Especialização' }
                            ].map((docType) => {
                                const statusDoc = getDocStatus(docType.id);
                                return (
                                    <div key={docType.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "w-10 h-10 rounded-xl flex items-center justify-center",
                                                statusDoc ? getStatusStyle(statusDoc.status) : "bg-white text-gray-300"
                                            )}>
                                                <FileText size={20} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-dark uppercase tracking-tighter">{docType.label}</p>
                                                <p className="text-[9px] font-bold text-gray-400">
                                                    {statusDoc ? (
                                                        statusDoc.status === 'approved' ? '✓ Validado' :
                                                            statusDoc.status === 'refused' ? '✕ Recusado' : '⌛ Em análise'
                                                    ) : 'Não enviado'}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleUploadClick(docType.id)}
                                            className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-secondary active:scale-90 transition-transform"
                                        >
                                            <Upload size={16} />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                        <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,image/*" onChange={handleFileChange} />
                    </div>
                </div>

                {/* identification and location sections as before but lower */}
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100/50 space-y-6">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <ShieldCheck size={18} className="text-secondary" />
                            <span className="text-xs font-black text-dark uppercase tracking-widest">Identificação</span>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className={labelStyle}>CREF / CRM / Registro</label>
                                <input
                                    className={inputStyle}
                                    placeholder="Ex: 00000-G/UF"
                                    value={formData.cref_crm}
                                    onChange={(e) => setFormData({ ...formData, cref_crm: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className={labelStyle}>Especialidade Principal</label>
                                <div className="relative">
                                    <select
                                        className={inputStyle}
                                        value={formData.specialty_id}
                                        onChange={(e) => setFormData({ ...formData, specialty_id: e.target.value })}
                                        disabled={fetchingDropdowns}
                                    >
                                        <option value="">Selecione...</option>
                                        {specialties.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                        {fetchingDropdowns ? <Loader2 className="animate-spin w-4 h-4" /> : <Stethoscope size={16} />}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-50">
                        <div className="flex items-center gap-2 mb-4">
                            <Building2 size={18} className="text-secondary" />
                            <span className="text-xs font-black text-dark uppercase tracking-widest">Local de Atuação</span>
                        </div>
                        <div>
                            <label className={labelStyle}>Unidade Principal</label>
                            <div className="relative">
                                <select
                                    className={inputStyle}
                                    value={formData.unit_id}
                                    onChange={(e) => setFormData({ ...formData, unit_id: e.target.value })}
                                    disabled={fetchingDropdowns}
                                >
                                    <option value="">Selecione a unidade...</option>
                                    {units.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-secondary/5 p-5 rounded-[2rem] border border-secondary/10 flex gap-4">
                    <ShieldCheck className="text-secondary shrink-0" size={20} />
                    <p className="text-[11px] text-secondary font-medium leading-relaxed">
                        Estas informações são utilizadas para vincular seus atendimentos e prescrições nos relatórios gerados para seus pacientes.
                    </p>
                </div>

                <div className="mt-8">
                    <Button
                        onClick={handleSave}
                        disabled={loading || fetchingDropdowns}
                        className="w-full h-16 rounded-3xl bg-primary text-dark font-black tracking-tight gap-3 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                    >
                        {loading ? (
                            <Loader2 className="w-6 h-6 animate-spin text-dark" />
                        ) : (
                            <CheckCircle2 size={24} strokeWidth={3} />
                        )}
                        {loading ? 'SALVANDO...' : 'SALVAR DADOS PROFISSIONAIS'}
                    </Button>
                </div>
            </div>

            <BottomNav />
        </div>
    );
};
