import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ChevronLeft,
    FileText,
    Check,
    X,
    Clock,
    Save,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Eye,
    MessageSquare,
    AlertTriangle,
    Shield,
    Database,
    Maximize2
} from 'lucide-react';
import { BottomNav } from '@/components/layout/BottomNav';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { Toast } from '@/components/ui/Toast';

export const ProfessionalVerificationScreen: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [professional, setProfessional] = useState<any>(null);
    const [documents, setDocuments] = useState<any[]>([]);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' as any });

    // Modals
    const [refusalModal, setRefusalModal] = useState<{ show: boolean, docId: string, reason: string }>({ show: false, docId: '', reason: '' });
    const [finalRefusalModal, setFinalRefusalModal] = useState<{ show: boolean, reason: string }>({ show: false, reason: '' });
    const [previewModal, setPreviewModal] = useState<{ show: boolean, url: string, type: string }>({ show: false, url: '', type: '' });

    // Debug helper (Hidden by default)
    const [showDebug, setShowDebug] = useState(false);
    const [rawData, setRawData] = useState<any>({ jsonb: null, table: null });

    useEffect(() => {
        if (id) {
            fetchData();
        }
    }, [id]);

    const fetchData = async () => {
        try {
            // 1. Fetch Profile
            const { data: pro, error: proError } = await supabase
                .from('profiles')
                .select('*, specialties(name)')
                .eq('id', id)
                .single();

            if (proError) throw proError;
            setProfessional(pro);

            // 2. Data Audit & Merge Strategy
            const jsonbDocs = pro.documents || {};

            const { data: dbDocs } = await supabase
                .from('professional_documents')
                .select('*')
                .eq('profile_id', id);

            const safeDbDocs = dbDocs || [];
            setRawData({ jsonb: jsonbDocs, table: safeDbDocs });

            const allTypes = new Set([
                ...Object.keys(jsonbDocs),
                ...safeDbDocs.map(d => d.document_type)
            ]);

            const finalDocs = Array.from(allTypes).map(type => {
                const tableDoc = safeDbDocs.find(d => d.document_type === type);
                const jsonDoc = jsonbDocs[type];

                return {
                    id: tableDoc?.id || `virt_${type}`,
                    document_type: type,
                    file_url: tableDoc?.file_url || jsonDoc?.url,
                    status: tableDoc?.status || jsonDoc?.status || 'pending',
                    rejection_reason: tableDoc?.rejection_reason || jsonDoc?.rejection_reason,
                    updated_at: tableDoc?.updated_at || jsonDoc?.updated_at
                };
            }).filter(d => d.file_url);

            setDocuments(finalDocs);
        } catch (error) {
            console.error('Audit Error:', error);
            setToast({ show: true, message: 'Erro ao carregar dados.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleDocStatus = async (docObj: any, status: 'approved' | 'refused', reason?: string) => {
        try {
            const payload = {
                profile_id: id,
                document_type: docObj.document_type,
                file_url: docObj.file_url,
                status: status,
                rejection_reason: status === 'refused' ? reason : null,
                updated_at: new Date().toISOString()
            };

            await supabase
                .from('professional_documents')
                .upsert(payload, { onConflict: 'profile_id,document_type' });

            const newJsonDocs = {
                ...(professional.documents || {}),
                [docObj.document_type]: {
                    url: docObj.file_url,
                    status: status,
                    rejection_reason: status === 'refused' ? reason : null,
                    updated_at: new Date().toISOString()
                }
            };

            await supabase.from('profiles').update({ documents: newJsonDocs }).eq('id', id);

            setDocuments(prev => prev.map(d => d.document_type === docObj.document_type ?
                { ...d, status, rejection_reason: status === 'refused' ? reason : null } : d));

            setToast({ show: true, message: `Status atualizado: ${status === 'approved' ? 'Aprovado' : 'Recusado'}`, type: 'success' });
            setRefusalModal({ show: false, docId: '', reason: '' });
        } catch (error) {
            console.error(error);
            setToast({ show: true, message: 'Erro ao salvar status.', type: 'error' });
        }
    };

    const handleFinalizeStatus = async (newStatus: 'approved' | 'refused', reason?: string) => {
        setSaving(true);
        try {
            // 1. Update Profile (The Source of Truth)
            const { error: updateError } = await supabase.from('profiles').update({
                approval_status: newStatus,
                rejection_reason: newStatus === 'refused' ? reason : null
            }).eq('id', id);

            if (updateError) throw updateError;

            // REMOVED: await supabase.auth.updateUser(...) 
            // Reason: Admins cannot update metadata of other users via Client SDK. 
            // The Dashboard now reads from 'profiles' table, so this is handled there.

            // 2. Insert Notification
            const { error: notifyError } = await supabase.from('notifications').insert({
                user_id: id,
                title: newStatus === 'approved' ? 'Cadastro Aprovado! ✨' : 'Atenção ao Cadastro',
                message: newStatus === 'approved'
                    ? 'Seu perfil foi validado com sucesso pela equipe Metrik.'
                    : `Houve um problema na validação: ${reason || 'Verifique seus dados.'}`,
                type: newStatus === 'approved' ? 'success' : 'warning'
            });

            if (notifyError) console.error("Notification Error:", notifyError);

            setToast({ show: true, message: 'Veredito registrado com sucesso.', type: 'success' });
            setTimeout(() => navigate('/admin/registrations/approvals'), 1500);
        } catch (error: any) {
            console.error(error);
            setToast({ show: true, message: `Erro ao finalizar: ${error.message || 'Erro desconhecido'}`, type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    const getDocLabel = (type: string) => {
        const labels: any = { 'cpf': 'CPF / RG', 'cref_crm': 'Registro Profissional', 'certificacao': 'Especialização' };
        return labels[type] || type;
    };

    const openPreview = async (url: string, type: string) => {
        try {
            // If it's a public URL that fails, we need a signed URL.
            // We need to extract the path from the URL. 
            // URL format: .../documents/filename.ext

            setPreviewModal({ show: true, url: '', type, loading: true });

            let finalUrl = url;

            // Extract path: everything after 'documents/'
            const parts = url.split('/documents/');
            if (parts.length > 1) {
                const path = parts[1]; // e.g. "cpf_123.jpg" or "folder/file.jpg"

                // Get Signed URL
                const { data, error } = await supabase.storage
                    .from('documents')
                    .createSignedUrl(decodeURIComponent(path), 3600); // 1 hour validity

                if (data?.signedUrl) {
                    finalUrl = data.signedUrl;
                } else {
                    console.error('Error signing URL:', error);
                }
            }

            setPreviewModal({ show: true, url: finalUrl, type, loading: false });
        } catch (e) {
            console.error('Preview error:', e);
            setPreviewModal({ show: true, url: url, type, loading: false });
        }
    };

    const isImage = (url: string) => {
        // Remove query params for check
        const cleanUrl = url.split('?')[0];
        return cleanUrl.match(/\.(jpeg|jpg|gif|png|webp|bmp)$/i) != null;
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#F1F3F5]"><Loader2 className="animate-spin text-dark" size={32} /></div>;

    return (
        <div className="min-h-screen bg-[#F1F3F5] pb-32 font-sans px-5">
            <Toast isVisible={toast.show} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />

            <header className="pt-8 flex items-center gap-4 mb-8">
                <button onClick={() => navigate('/admin/registrations/approvals')} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-dark active:scale-95 transition-transform">
                    <ChevronLeft size={20} />
                </button>
                <h1 className="text-xl font-bold text-dark tracking-tight">Validar <span className="text-secondary">Profissional</span></h1>
            </header>

            {professional && (
                <div className="bg-white p-6 rounded-[2.5rem] shadow-sm mb-8 flex items-center gap-5 border border-gray-100">
                    <div className="w-20 h-20 rounded-[1.8rem] bg-gray-50 p-1 shrink-0 relative">
                        <img src={professional.avatar_url || `https://ui-avatars.com/api/?name=${professional.full_name}`} className="w-full h-full rounded-[1.5rem] object-cover" />
                        <div className="absolute -bottom-1 -right-1 bg-secondary text-white w-6 h-6 rounded-full flex items-center justify-center border-2 border-white text-[10px] font-bold">
                            <Shield size={10} />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-dark leading-none mb-1">{professional.full_name}</h2>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">{professional.specialties?.name || 'Geral'}</p>
                        <div className={cn("mt-2 inline-flex px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                            professional.approval_status === 'pending' ? "bg-amber-100 text-amber-600" :
                                professional.approval_status === 'approved' ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600")}>
                            {professional.approval_status === 'pending' ? 'Em Análise' : professional.approval_status === 'approved' ? 'Aprovado' : 'Recusado'}
                        </div>
                    </div>
                </div>
            )}

            <div className="mb-6 flex justify-between items-end px-2">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Documentos do Auditoria</h3>
                <span className="text-[9px] font-bold text-gray-400">{documents.length} Arquivos Encontrados</span>
            </div>

            <div className="space-y-3">
                {documents.length === 0 ? (
                    <div className="p-8 bg-white rounded-[2rem] text-center border border-dashed border-gray-200">
                        <p className="text-xs font-bold text-gray-400">Nenhum documento encontrado.</p>
                        <p className="text-[10px] text-gray-300 mt-1">O profissional deve reenviar os arquivos.</p>
                    </div>
                ) : documents.map((doc) => (
                    <div key={doc.document_type} className="bg-white p-4 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                            <div className="flex gap-4 items-center">
                                <button
                                    onClick={() => openPreview(doc.file_url, doc.document_type)}
                                    className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-indigo-500 shrink-0 hover:bg-indigo-50 hover:scale-105 transition-all"
                                >
                                    <FileText size={20} />
                                </button>
                                <div>
                                    <h4 className="text-sm font-black text-dark leading-tight">{getDocLabel(doc.document_type)}</h4>
                                    <button
                                        onClick={() => openPreview(doc.file_url, doc.document_type)}
                                        className="text-[10px] text-indigo-500 font-bold hover:underline flex items-center gap-1 mt-0.5"
                                    >
                                        <Eye size={10} /> Visualizar Arquivo
                                    </button>
                                </div>
                            </div>
                            <div className={cn("px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest",
                                doc.status === 'approved' ? "bg-emerald-100 text-emerald-600" :
                                    doc.status === 'refused' ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"
                            )}>
                                {doc.status === 'pending' ? 'Pendente' : doc.status === 'approved' ? 'Ok' : 'Recusado'}
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setRefusalModal({ show: true, docId: doc.document_type, reason: '' })}
                                className="flex-1 h-10 rounded-xl border border-gray-100 text-gray-400 font-bold text-[10px] uppercase tracking-widest hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all flex items-center justify-center gap-2"
                            >
                                <X size={14} /> Recusar
                            </button>
                            <button
                                onClick={() => handleDocStatus(doc, 'approved')}
                                className="flex-1 h-10 rounded-xl bg-gray-50 text-dark font-bold text-[10px] uppercase tracking-widest hover:bg-[#C4FF0E] hover:shadow-lg hover:shadow-[#C4FF0E]/20 transition-all flex items-center justify-center gap-2"
                            >
                                <Check size={14} /> Aprovar
                            </button>
                        </div>
                        {doc.rejection_reason && doc.status === 'refused' && (
                            <div className="bg-red-50 p-3 rounded-xl">
                                <p className="text-[10px] text-red-600 font-medium italic">"{doc.rejection_reason}"</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* PREVIEW MODAL */}
            {previewModal.show && (
                <div className="fixed inset-0 bg-black/90 z-[60] flex flex-col animate-in fade-in duration-300">
                    <div className="flex items-center justify-between p-4 text-white">
                        <h3 className="text-sm font-bold">{getDocLabel(previewModal.type)}</h3>
                        <button
                            onClick={() => setPreviewModal({ show: false, url: '', type: '' })}
                            className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    <div className="flex-1 p-4 flex items-center justify-center overflow-hidden relative">
                        {/* Loading Indicator */}
                        {(previewModal as any).loading && (
                            <div className="absolute inset-0 flex items-center justify-center z-10">
                                <Loader2 className="animate-spin text-white" size={48} />
                            </div>
                        )}

                        {/* Content */}
                        {!(previewModal as any).loading && (
                            isImage(previewModal.url) ? (
                                <img
                                    src={previewModal.url}
                                    alt="Preview"
                                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                                />
                            ) : (
                                <iframe
                                    src={previewModal.url}
                                    className="w-full h-full rounded-lg bg-white shadow-2xl border-none"
                                    title="Document Preview"
                                />
                            )
                        )}
                    </div>
                    <div className="p-4 flex gap-3 justify-center pb-8">
                        <a
                            href={previewModal.url}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-white/10 text-white px-6 py-3 rounded-xl font-bold text-xs hover:bg-white/20 flex items-center gap-2"
                        >
                            <Maximize2 size={14} /> Abrir Original
                        </a>
                    </div>
                </div>
            )}

            {/* REFUSAL MODALS (Preserved) */}
            {refusalModal.show && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-6 animate-in zoom-in-95">
                        <h3 className="text-lg font-black text-dark mb-4">Motivo da Recusa</h3>
                        <textarea
                            className="w-full h-32 bg-gray-50 rounded-2xl p-4 text-xs font-bold outline-none border border-transparent focus:border-secondary transition-all resize-none mb-4"
                            placeholder="Explique o motivo..."
                            value={refusalModal.reason}
                            onChange={e => setRefusalModal({ ...refusalModal, reason: e.target.value })}
                        />
                        <div className="flex gap-3">
                            <button onClick={() => setRefusalModal({ show: false, docId: '', reason: '' })} className="flex-1 h-12 rounded-xl border border-gray-200 font-bold text-xs">Cancelar</button>
                            <button
                                onClick={() => {
                                    const doc = documents.find(d => d.document_type === refusalModal.docId);
                                    if (doc) handleDocStatus(doc, 'refused', refusalModal.reason);
                                }}
                                disabled={!refusalModal.reason}
                                className="flex-1 h-12 rounded-xl bg-red-500 text-white font-bold text-xs disabled:opacity-50"
                            >Confirmar</button>
                        </div>
                    </div>
                </div>
            )}

            {finalRefusalModal.show && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-6 animate-in zoom-in-95">
                        <h3 className="text-lg font-black text-dark mb-4">Recusar Cadastro</h3>
                        <textarea
                            className="w-full h-32 bg-gray-50 rounded-2xl p-4 text-xs font-bold outline-none border border-transparent focus:border-secondary transition-all resize-none mb-4"
                            placeholder="Motivo final da recusa..."
                            value={finalRefusalModal.reason}
                            onChange={e => setFinalRefusalModal({ ...finalRefusalModal, reason: e.target.value })}
                        />
                        <div className="flex gap-3">
                            <button onClick={() => setFinalRefusalModal({ show: false, reason: '' })} className="flex-1 h-12 rounded-xl border border-gray-200 font-bold text-xs">Cancelar</button>
                            <button
                                onClick={() => {
                                    handleFinalizeStatus('refused', finalRefusalModal.reason);
                                    setFinalRefusalModal({ show: false, reason: '' });
                                }}
                                disabled={!finalRefusalModal.reason}
                                className="flex-1 h-12 rounded-xl bg-red-500 text-white font-bold text-xs disabled:opacity-50"
                            >Recusar Profissional</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="h-32"></div>
            <div className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md p-5 border-t border-gray-100 pb-8 flex gap-3">
                <button onClick={() => setFinalRefusalModal({ show: true, reason: '' })} className="flex-1 h-14 rounded-[2rem] border-2 border-gray-100 text-gray-400 font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all">
                    Recusar
                </button>
                <button onClick={() => handleFinalizeStatus('approved')} className="flex-1 h-14 rounded-[2rem] bg-indigo-600 text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-200 hover:scale-[1.02] active:scale-95 transition-all">
                    Aprovar Cadastro
                </button>
            </div>

            {/* DEBUG TOGGLE (Bottom Right) */}
            <button
                onClick={() => setShowDebug(!showDebug)}
                className="fixed bottom-32 right-5 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center opacity-30 hover:opacity-100 transition-opacity z-40 text-[8px] font-black"
                title="Toggle Debug"
            >
                DBG
            </button>
            {showDebug && (
                <div className="fixed bottom-40 right-5 w-64 bg-black/90 text-white p-4 rounded-xl text-[9px] font-mono z-50 overflow-auto max-h-64">
                    <pre>{JSON.stringify(rawData.table, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};
