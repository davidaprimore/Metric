import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    UserIcon,
    MapPin,
    Upload,
    Check
} from 'lucide-react';
import { BottomNav } from '@/components/layout/BottomNav';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { masks } from '@/utils/masks';

export const ProfessionalRegisterScreen: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Dropdown data
    const [specialties, setSpecialties] = useState<any[]>([]);
    const [units, setUnits] = useState<any[]>([]);

    // Form State
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        cpf: '',
        phone: '',
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
        fetchDropdowns();
    }, []);

    const fetchDropdowns = async () => {
        try {
            const { data: specData } = await supabase.from('specialties').select('*').order('name');
            const { data: unitData } = await supabase.from('units').select('*').eq('active', true).order('name');
            setSpecialties(specData || []);
            setUnits(unitData || []);
        } catch (err) {
            console.error(err);
        }
    };

    const handleFileChange = (type: 'cpf' | 'cref' | 'cert', e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFiles(prev => ({ ...prev, [type]: e.target.files![0] }));
        }
    };

    const handleChange = (field: string, value: string) => {
        let finalValue = value;
        if (field === 'cpf') finalValue = masks.cpf(value);
        if (field === 'phone') finalValue = masks.phone(value);
        if (field === 'address_zip') finalValue = masks.cep(value);

        setFormData(prev => ({ ...prev, [field]: finalValue }));
    };

    const handleRegister = async () => {
        if (!formData.email || !formData.full_name || !formData.cpf) {
            alert('Preencha os campos obrigatórios');
            return;
        }

        setLoading(true);
        try {
            const uploadPromises = Object.entries(files).map(async ([key, file]) => {
                if (!file) return;
                const path = `temp/${formData.cpf}/${key}_${Date.now()}`;
                await supabase.storage.from('documents').upload(path, file);
                return path;
            });

            await Promise.all(uploadPromises);

            alert('Profissional cadastrado com sucesso! (Simulação: Convite enviado por e-mail)');
            navigate('/admin/registrations/professionals');

        } catch (error) {
            console.error(error);
            alert('Erro ao cadastrar');
        } finally {
            setLoading(false);
        }
    };

    // Style constants for reusable inputs
    const inputStyle = "w-full h-12 bg-gray-100 border border-gray-200 rounded-xl px-4 outline-none text-sm font-bold text-dark focus:border-indigo-500 focus:bg-white transition-all placeholder:text-gray-400";
    const labelStyle = "text-xs font-bold text-gray-600 ml-2 mb-1 block";

    return (
        <div className="min-h-screen bg-[#F1F3F5] pb-32 font-sans px-5">
            <header className="pt-8 flex items-center gap-4 mb-4">
                <button
                    onClick={() => navigate('/admin/registrations/professionals')}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-dark active:scale-95 transition-transform"
                >
                    <ChevronLeft size={20} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-dark leading-none">Cadastrar</h1>
                    <h1 className="text-2xl font-bold text-indigo-600 leading-none">Profissional</h1>
                </div>
            </header>

            <p className="text-gray-400 text-xs mb-8">Preencha os dados técnicos do novo colaborador.</p>

            <div className="space-y-6">

                {/* DADOS PESSOAIS */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <UserIcon size={14} className="text-gray-400" />
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Dados Pessoais</h3>
                    </div>

                    <div className="bg-white p-5 rounded-[2rem] shadow-sm space-y-4">
                        <div>
                            <label className={labelStyle}>Nome Completo</label>
                            <input
                                className={inputStyle}
                                placeholder="Ex: Dr. Ricardo Silva"
                                value={formData.full_name}
                                onChange={(e) => handleChange('full_name', e.target.value)}
                            />
                        </div>

                        <div>
                            <label className={labelStyle}>E-mail Profissional</label>
                            <input
                                className={inputStyle}
                                placeholder="ricardo@metrik.com"
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelStyle}>CPF</label>
                                <input
                                    className={inputStyle}
                                    placeholder="000.000.000-00"
                                    value={formData.cpf}
                                    onChange={(e) => handleChange('cpf', e.target.value)}
                                    maxLength={14}
                                />
                            </div>
                            <div>
                                <label className={labelStyle}>Telefone</label>
                                <input
                                    className={inputStyle}
                                    placeholder="(11) 99999-0000"
                                    value={formData.phone}
                                    onChange={(e) => handleChange('phone', e.target.value)}
                                    maxLength={15}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* ENDEREÇO */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <MapPin size={14} className="text-gray-400" />
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Endereço</h3>
                    </div>

                    <div className="bg-white p-5 rounded-[2rem] shadow-sm space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-1">
                                <label className={labelStyle}>CEP</label>
                                <input
                                    className={inputStyle}
                                    placeholder="00000-000"
                                    value={formData.address_zip}
                                    onChange={(e) => handleChange('address_zip', e.target.value)}
                                    maxLength={9}
                                />
                            </div>
                            <div className="col-span-2">
                                <label className={labelStyle}>Cidade</label>
                                <input
                                    className={inputStyle}
                                    placeholder="São Paulo"
                                    value={formData.address_city}
                                    onChange={(e) => handleChange('address_city', e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className={labelStyle}>Logradouro</label>
                            <input
                                className={inputStyle}
                                placeholder="Rua..."
                                value={formData.address_street}
                                onChange={(e) => handleChange('address_street', e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelStyle}>Número</label>
                                <input
                                    className={inputStyle}
                                    placeholder="123"
                                    value={formData.address_number}
                                    onChange={(e) => handleChange('address_number', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className={labelStyle}>Bairro</label>
                                <input
                                    className={inputStyle}
                                    placeholder="Centro"
                                    value={formData.address_neighborhood}
                                    onChange={(e) => handleChange('address_neighborhood', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* CREDENCIAIS */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <Check size={14} className="text-gray-400" />
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Credenciais & Acesso</h3>
                    </div>

                    <div className="bg-white p-5 rounded-[2rem] shadow-sm space-y-4">
                        <div>
                            <label className={labelStyle}>Registro (CREF/CRM)</label>
                            <input
                                className={inputStyle}
                                placeholder="Ex: CRM-SP 123456"
                                value={formData.cref_crm}
                                onChange={(e) => handleChange('cref_crm', e.target.value)}
                            />
                        </div>

                        <div>
                            <label className={labelStyle}>Especialidade</label>
                            <select
                                className={inputStyle}
                                value={formData.specialty_id}
                                onChange={(e) => handleChange('specialty_id', e.target.value)}
                            >
                                <option value="">Selecione...</option>
                                {specialties.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className={labelStyle}>Unidade Principal</label>
                            <select
                                className={inputStyle}
                                value={formData.unit_id}
                                onChange={(e) => handleChange('unit_id', e.target.value)}
                            >
                                <option value="">Selecione...</option>
                                {units.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                            </select>
                        </div>
                    </div>
                </section>

                {/* DOCUMENTAÇÃO */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <Upload size={14} className="text-gray-400" />
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Documentação</h3>
                    </div>

                    <div className="space-y-3">
                        {/* CPF Upload */}
                        <div className="bg-white p-4 rounded-3xl flex items-center gap-4 border border-gray-100/50">
                            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
                                <Upload size={20} />
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-bold text-dark">Anexar CPF</p>
                                <p className="text-[10px] text-gray-400 truncate">{files.cpf ? files.cpf.name : 'Clique para enviar ou arraste'}</p>
                            </div>
                            <input type="file" className="absolute opacity-0 w-full h-full cursor-pointer left-0" onChange={(e) => handleFileChange('cpf', e)} />
                        </div>

                        {/* CREF/CRM Upload */}
                        <div className="bg-white p-4 rounded-3xl flex items-center gap-4 relative border border-gray-100/50">
                            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
                                <Upload size={20} />
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-bold text-dark">Anexar CREF/CRM</p>
                                <p className="text-[10px] text-gray-400 truncate">{files.cref ? files.cref.name : 'Clique para enviar ou arraste'}</p>
                            </div>
                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileChange('cref', e)} />
                        </div>

                        {/* Cert Upload */}
                        <div className="bg-white p-4 rounded-3xl flex items-center gap-4 relative border border-gray-100/50">
                            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
                                <Upload size={20} />
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-bold text-dark">Anexar Certificações</p>
                                <p className="text-[10px] text-gray-400 truncate">{files.cert ? files.cert.name : 'Clique para enviar ou arraste'}</p>
                            </div>
                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileChange('cert', e)} />
                        </div>
                    </div>
                </section>

                <Button
                    variant="primary"
                    className="w-full h-14 rounded-2xl bg-[#a3e635] text-dark font-black uppercase tracking-wide hover:bg-[#8cc62d] shadow-lg shadow-lime-500/20"
                    onClick={handleRegister}
                    isLoading={loading}
                >
                    Finalizar Cadastro
                </Button>

            </div>

            <BottomNav />
        </div>
    );
};
