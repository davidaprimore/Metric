import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    ChevronLeft,
    Upload,
    CheckCircle2,
    Loader2,
    MapPin,
    Stethoscope,
    ClipboardList,
    AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';
import { masks } from '@/utils/masks';
import { fetchAddressByCEP } from '@/utils/cep';
import { cn } from '@/lib/utils';
import { Toast } from '@/components/ui/Toast';

export const RegisterProfessionalStep2: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [fetchingCep, setFetchingCep] = useState(false);

    // Dropdown data
    const [specialties, setSpecialties] = useState<any[]>([]);
    const [units, setUnits] = useState<any[]>([]);
    const [toast, setToast] = useState({ show: false, message: '', type: 'error' as any });
    const [redirectAfterToast, setRedirectAfterToast] = useState(false);

    const step1Data = location.state?.step1;

    // Form State
    const [formData, setFormData] = useState({
        cref_crm: '',
        specialty_id: '',
        unit_id: '',
        address_zip: '',
        address_street: '',
        address_number: '',
        address_complement: '',
        address_neighborhood: '',
        address_city: '',
        address_state: ''
    });

    const [files, setFiles] = useState<{ cpf: File | null, cref: File | null, cert: File | null }>({
        cpf: null,
        cref: null,
        cert: null
    });

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!step1Data) {
            navigate('/register');
            return;
        }
        fetchDropdowns();
    }, [step1Data]);

    const scrollToField = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
        e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    const fetchDropdowns = async () => {
        try {
            console.log('Fetching specialties and units...');
            const { data: specData, error: specErr } = await supabase.from('specialties').select('*').order('name');
            const { data: unitData, error: unitErr } = await supabase.from('units').select('*').eq('active', true).order('name');

            if (specErr) console.error('Error fetching specialties:', specErr);
            if (unitErr) console.error('Error fetching units:', unitErr);

            setSpecialties(specData || []);
            setUnits(unitData || []);
        } catch (err) {
            console.error('Catch error fetching dropdowns:', err);
        }
    };

    const handleFileChange = (type: 'cpf' | 'cref' | 'cert', e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFiles(prev => ({ ...prev, [type]: e.target.files![0] }));
        }
    };

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
                    address_city: data.localidade,
                    address_state: data.uf
                }));
            }
            setFetchingCep(false);
        }
    };

    const handleRegister = async () => {
        setLoading(true);
        try {
            // 1. Create User in Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: step1Data.email,
                password: step1Data.password,
                options: {
                    data: {
                        first_name: step1Data.name,
                        last_name: step1Data.surname,
                        role: 'profissional',
                        approval_status: 'pending',
                        cpf: step1Data.cpf,
                        phone: step1Data.phone,
                        ...formData
                    }
                }
            });

            if (authError) throw authError;

            // 2. Upload Documents
            const userId = authData.user?.id;
            if (userId) {
                try {
                    const uploadPromises = Object.entries(files).map(async ([key, file]) => {
                        if (!file) return;
                        const path = `applications/${userId}/${key}_${Date.now()}`;
                        const { error: uploadError } = await supabase.storage.from('documents').upload(path, file as File);
                        if (uploadError) throw uploadError;

                        // Create record in professional_documents
                        const { error: dbDocError } = await supabase.from('professional_documents').insert({
                            profile_id: userId,
                            document_type: key === 'cref' ? 'cref_crm' : key === 'cert' ? 'certificacao' : 'cpf',
                            file_url: path,
                            status: 'pending'
                        });
                        if (dbDocError) throw dbDocError;
                    });

                    await Promise.all(uploadPromises);

                    // 3. Notify Admins
                    const { data: admins } = await supabase.from('profiles').select('id').eq('role', 'administrador');
                    if (admins && admins.length > 0) {
                        const notifications = admins.map(admin => ({
                            user_id: admin.id,
                            title: 'Novo Profissional Pendente 🛡️',
                            message: `${step1Data.name} ${step1Data.surname} solicitou acesso profissional.`,
                            type: 'warning'
                        }));
                        await supabase.from('notifications').insert(notifications);
                    }

                    navigate('/dashboard');
                } catch (uploadOrDbErr: any) {
                    console.error('Secondary registration steps failed:', uploadOrDbErr);
                    // Account IS created, but docs failed.
                    setRedirectAfterToast(true);
                    setToast({
                        show: true,
                        message: 'SUA CONTA FOI CRIADA COM SUCESSO! No entanto, tivemos um problema técnico ao processar seus documentos agora. Não se preocupe, você já pode acessar seu painel e reenviá-los por lá.',
                        type: 'error'
                    });
                }
            } else {
                navigate('/dashboard');
            }

        } catch (error: any) {
            console.error(error);
            setToast({
                show: true,
                message: 'OPS! Tivemos um problema ao salvar seu cadastro. Por favor, tente novamente ou entre em contato com nosso suporte.',
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = "w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-4 text-sm font-bold text-dark outline-none focus:border-secondary focus:bg-white transition-all appearance-none";
    const labelStyle = "text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block";

    return (
        <div className="min-h-screen bg-white font-sans">
            <Toast
                isVisible={toast.show}
                message={toast.message}
                type={toast.type}
                onClose={() => {
                    setToast({ ...toast, show: false });
                    if (redirectAfterToast) navigate('/dashboard');
                }}
            />
            <header className="px-6 pt-8 pb-4 flex items-center justify-between border-b border-gray-100">
                <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-50 active:scale-95 transition-transform text-dark">
                    <ChevronLeft size={24} />
                </button>
                <div className="flex-1 text-center pr-10">
                    <p className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">ETAPA 02/02</p>
                    <h1 className="text-sm font-black text-dark uppercase tracking-widest">Documentação Profissional</h1>
                </div>
            </header>

            <div className="p-6 space-y-8 pb-32">
                <div className="space-y-4">
                    <div className="bg-secondary/5 p-4 rounded-2xl border border-secondary/10 flex gap-3">
                        <AlertCircle className="text-secondary shrink-0" size={20} />
                        <p className="text-[11px] text-secondary font-medium leading-relaxed">
                            Como profissional, seu cadastro passará por uma análise documental antes da liberação do acesso.
                        </p>
                    </div>

                    {/* Basic Spec */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Stethoscope size={18} className="text-secondary" />
                            <h3 className="text-xs font-black text-dark uppercase tracking-widest">Atuação</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelStyle}>Especialidade</label>
                                <select
                                    className={inputStyle}
                                    value={formData.specialty_id}
                                    onChange={(e) => setFormData({ ...formData, specialty_id: e.target.value })}
                                    onFocus={scrollToField}
                                >
                                    <option value="">Selecione...</option>
                                    {specialties.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className={labelStyle}>CREF/CRM</label>
                                <input
                                    className={inputStyle}
                                    placeholder="00000-G/UF"
                                    value={formData.cref_crm}
                                    onChange={(e) => setFormData({ ...formData, cref_crm: e.target.value })}
                                    onFocus={scrollToField}
                                />
                            </div>
                        </div>

                        <div>
                            <label className={labelStyle}>Unidade de Preferência</label>
                            <select
                                className={inputStyle}
                                value={formData.unit_id}
                                onChange={(e) => setFormData({ ...formData, unit_id: e.target.value })}
                                onFocus={scrollToField}
                            >
                                <option value="">Selecione a unidade principal...</option>
                                {units.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Address section as before */}
                    <div className="space-y-4 pt-4">
                        <div className="flex items-center gap-2 mb-2">
                            <MapPin size={18} className="text-secondary" />
                            <h3 className="text-xs font-black text-dark uppercase tracking-widest">Localização</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="flex justify-between items-center px-1">
                                    <label className={labelStyle}>CEP</label>
                                    <a
                                        href="https://buscacepinter.correios.com.br/app/endereco/index.php"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[9px] font-black text-secondary hover:underline uppercase tracking-tighter"
                                    >
                                        Não sei meu CEP
                                    </a>
                                </div>
                                <input
                                    className={cn(inputStyle, fetchingCep && "animate-pulse")}
                                    placeholder="00000-000"
                                    value={formData.address_zip}
                                    onChange={(e) => {
                                        const val = masks.cep(e.target.value);
                                        setFormData({ ...formData, address_zip: val });
                                        if (val.replace(/\D/g, '').length === 8) handleCepLookup(val);
                                    }}
                                    onFocus={scrollToField}
                                    maxLength={9}
                                />
                            </div>
                            <div>
                                <label className={labelStyle}>Cidade</label>
                                <input className={cn(inputStyle, "bg-gray-100 border-transparent text-gray-400")} value={formData.address_city} readOnly onFocus={scrollToField} />
                            </div>
                        </div>

                        <div>
                            <label className={labelStyle}>Logradouro</label>
                            <input className={cn(inputStyle, "bg-gray-100 border-transparent text-gray-400")} value={formData.address_street} readOnly onFocus={scrollToField} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelStyle}>Número</label>
                                <input
                                    className={inputStyle}
                                    placeholder="123"
                                    value={formData.address_number}
                                    onChange={(e) => setFormData({ ...formData, address_number: e.target.value })}
                                    onFocus={scrollToField}
                                />
                            </div>
                            <div>
                                <label className={labelStyle}>Complemento</label>
                                <input
                                    className={inputStyle}
                                    placeholder="Sala 202"
                                    value={formData.address_complement}
                                    onChange={(e) => setFormData({ ...formData, address_complement: e.target.value })}
                                    onFocus={scrollToField}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className={labelStyle}>Bairro</label>
                                <input className={cn(inputStyle, "bg-gray-100 border-transparent text-gray-400")} value={formData.address_neighborhood} readOnly onFocus={scrollToField} />
                            </div>
                        </div>
                    </div>

                    {/* Documents */}
                    <div className="space-y-6 pt-4">
                        <div className="flex items-center gap-2 mb-2">
                            <ClipboardList size={18} className="text-secondary" />
                            <h3 className="text-xs font-black text-dark uppercase tracking-widest">Documentos (Anexos)</h3>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <DocumentUploader
                                label="Cópia do CPF / RG"
                                file={files.cpf}
                                onChange={(e) => handleFileChange('cpf', e)}
                                onFocus={scrollToField}
                            />
                            <DocumentUploader
                                label="Carteira Profissional (CREF/CRM)"
                                file={files.cref}
                                onChange={(e) => handleFileChange('cref', e)}
                                onFocus={scrollToField}
                            />
                            <DocumentUploader
                                label="Certificação / Especialização"
                                file={files.cert}
                                onChange={(e) => handleFileChange('cert', e)}
                                onFocus={scrollToField}
                            />
                        </div>
                    </div>
                </div>

                <Button
                    onClick={handleRegister}
                    disabled={loading || !formData.address_street || !files.cpf || !files.cref}
                    className="w-full h-16 rounded-[2rem] bg-secondary text-white font-black text-xs gap-3 shadow-lg shadow-secondary/20 tracking-widest uppercase transition-all overflow-hidden relative group"
                >
                    {loading ? (
                        <Loader2 className="animate-spin" size={20} />
                    ) : (
                        <>
                            FINALIZAR E ENVIAR PARA ANÁLISE
                            <CheckCircle2 size={18} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
};

const DocumentUploader = ({ label, file, onChange, onFocus }: { label: string, file: File | null, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, onFocus?: (e: any) => void }) => (
    <div className="relative">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">{label}</label>
        <div className={cn(
            "h-20 border-2 border-dashed rounded-2xl flex items-center justify-between px-5 transition-all",
            file ? "border-[#C6FF00] bg-[#C6FF00]/5" : "border-gray-100 bg-gray-50/50 hover:bg-gray-100/50"
        )}>
            <div className="flex items-center gap-4">
                <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    file ? "bg-[#C6FF00] text-dark" : "bg-gray-100 text-gray-400"
                )}>
                    {file ? <CheckCircle2 size={20} /> : <Upload size={20} />}
                </div>
                <div className="flex flex-col">
                    <span className={cn("text-xs font-bold", file ? "text-dark" : "text-gray-400")}>
                        {file ? file.name : "Toque para anexar"}
                    </span>
                    {!file && <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">PDF, JPG OU PNG</span>}
                </div>
            </div>
            <input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={onChange}
                onFocus={onFocus}
                accept=".pdf,image/*"
            />
        </div>
    </div>
);
