import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Calendar, Ruler, Weight, Info, CheckCircle, MapPin, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { masks } from '@/utils/masks';
import { fetchAddressByCEP } from '@/utils/cep';
import { cn } from '@/lib/utils';
import { Toast } from '@/components/ui/Toast';

export const RegisterStep2: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { signUp } = useAuth();
    const [loading, setLoading] = useState(false);
    const [fetchingCep, setFetchingCep] = useState(false);
    const [gender, setGender] = useState('masculino');
    const [toast, setToast] = useState({ show: false, message: '', type: 'error' as 'error' | 'success' });

    const [formData, setFormData] = useState({
        birthDate: '',
        height: '',
        weight: '',
        address_zip: '',
        address_street: '',
        address_number: '',
        address_complement: '',
        address_neighborhood: '',
        address_city: ''
    });

    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const scrollToField = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
        e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    const formatDate = (value: string) => {
        const raw = value.replace(/\D/g, '');
        return raw
            .replace(/(\d{2})(\d)/, '$1/$2')
            .replace(/(\d{2})(\d)/, '$1/$2')
            .replace(/(\d{4})\d+?$/, '$1');
    };

    const handleBirthDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, birthDate: formatDate(e.target.value) });
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
                    address_city: data.localidade
                }));
            }
            setFetchingCep(false);
        }
    };

    const step1Data = location.state?.step1;

    const handleFinish = async () => {
        if (!step1Data) return;
        // Format date from DD/MM/AAAA to YYYY-MM-DD
        const [day, month, year] = formData.birthDate.split('/');
        const isoBirthDate = `${year}-${month}-${day}`;

        // Format metadata for profile creation
        const metadata = {
            first_name: step1Data.name,
            last_name: step1Data.surname,
            cpf: step1Data.cpf,
            phone: step1Data.phone,
            birth_date: isoBirthDate,
            gender: gender,
            height: parseFloat(formData.height),
            weight: parseFloat(formData.weight),
            address_zip: formData.address_zip,
            address_street: formData.address_street,
            address_number: formData.address_number,
            address_complement: formData.address_complement,
            address_neighborhood: formData.address_neighborhood,
            address_city: formData.address_city,
            role: 'usuario',
            approval_status: 'approved'
        };

        const { error } = await signUp(step1Data.email, step1Data.password, metadata);

        if (error) {
            setToast({
                show: true,
                message: 'OPS! Tivemos um problema ao processar seu cadastro. Por favor, revise seus dados e tente novamente.',
                type: 'error'
            });
            setLoading(false);
        } else {
            // Success - Show splash screen
            setLoading(false);
            navigate('/register-success');
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
            <Toast
                isVisible={toast.show}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ ...toast, show: false })}
            />

            {/* Step Header */}
            <div className="p-6 bg-white border-b border-gray-100">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-tight">Passo 2 de 2</span>
                    <span className="bg-secondary/10 text-secondary text-[10px] font-bold px-2 py-1 rounded-md uppercase">100%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="w-full h-full bg-secondary transition-all" />
                </div>
            </div>

            <div className="flex-1 p-6 space-y-8 overflow-y-auto">
                <div className="space-y-6">
                    {/* Birth Date */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-500">Data de Nascimento</label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="DD/MM/AAAA"
                                className="w-full h-16 px-5 bg-white rounded-3xl border-none shadow-sm focus:ring-2 focus:ring-secondary/20 transition-all outline-none text-dark"
                                value={formData.birthDate}
                                onChange={handleBirthDateChange}
                                onFocus={scrollToField}
                                maxLength={10}
                            />
                            <Calendar className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                        </div>
                    </div>

                    {/* Gender */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-500">Gênero</label>
                        <div className="bg-white p-1.5 rounded-3xl shadow-sm flex gap-1">
                            {['Masculino', 'Feminino', 'Outro'].map((g) => (
                                <button
                                    key={g}
                                    onClick={() => setGender(g.toLowerCase())}
                                    className={`flex-1 h-12 rounded-2xl text-sm font-bold transition-all ${gender === g.toLowerCase()
                                        ? 'bg-white shadow-md text-dark border border-gray-100'
                                        : 'text-gray-400 hover:text-gray-600'
                                        }`}
                                    onFocus={scrollToField}
                                >
                                    {g}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Height and Weight Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-500">Altura (cm)</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    placeholder="175"
                                    className="w-full h-16 px-5 bg-white rounded-3xl border-none shadow-sm focus:ring-2 focus:ring-secondary/20 transition-all outline-none text-dark"
                                    value={formData.height}
                                    onChange={e => setFormData({ ...formData, height: e.target.value })}
                                    onFocus={scrollToField}
                                />
                                <Ruler className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-500">Peso Atual (kg)</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    placeholder="70.0"
                                    className="w-full h-16 px-5 bg-white rounded-3xl border-none shadow-sm focus:ring-2 focus:ring-secondary/20 transition-all outline-none text-dark"
                                    value={formData.weight}
                                    onChange={e => setFormData({ ...formData, weight: e.target.value })}
                                    onFocus={scrollToField}
                                />
                                <Weight className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                            </div>
                        </div>
                    </div>

                    {/* Address Section */}
                    <div className="space-y-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2 mb-2">
                            <MapPin size={18} className="text-secondary" />
                            <h3 className="text-sm font-bold text-dark uppercase tracking-wider">Endereço</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-xs font-bold text-gray-500">CEP</label>
                                    <a
                                        href="https://buscacepinter.correios.com.br/app/endereco/index.php"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[10px] font-bold text-secondary hover:underline"
                                    >
                                        Não sei meu CEP
                                    </a>
                                </div>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="00000-000"
                                        className={cn("w-full h-16 px-5 bg-white rounded-3xl border-none shadow-sm focus:ring-2 focus:ring-secondary/20 transition-all outline-none text-dark", fetchingCep && "animate-pulse")}
                                        value={formData.address_zip}
                                        onChange={(e) => {
                                            const val = masks.cep(e.target.value);
                                            setFormData({ ...formData, address_zip: val });
                                            if (val.replace(/\D/g, '').length === 8) handleCepLookup(val);
                                        }}
                                        onFocus={scrollToField}
                                        maxLength={9}
                                    />
                                    {fetchingCep && <Loader2 className="absolute right-5 top-1/2 -translate-y-1/2 text-secondary animate-spin" size={18} />}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500">Cidade</label>
                                <input
                                    type="text"
                                    className="w-full h-16 px-5 bg-gray-100/50 rounded-3xl border-none shadow-inner outline-none text-gray-400 font-bold"
                                    value={formData.address_city}
                                    readOnly
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500">Logradouro</label>
                            <input
                                type="text"
                                className="w-full h-16 px-5 bg-gray-100/50 rounded-3xl border-none shadow-inner outline-none text-gray-400 font-bold"
                                value={formData.address_street}
                                readOnly
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500">Número</label>
                                <input
                                    type="text"
                                    placeholder="123"
                                    className="w-full h-16 px-5 bg-white rounded-3xl border-none shadow-sm focus:ring-2 focus:ring-secondary/20 transition-all outline-none text-dark"
                                    value={formData.address_number}
                                    onChange={(e) => setFormData({ ...formData, address_number: e.target.value })}
                                    onFocus={scrollToField}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500">Complemento</label>
                                <input
                                    type="text"
                                    placeholder="Apto 101"
                                    className="w-full h-16 px-5 bg-white rounded-3xl border-none shadow-sm focus:ring-2 focus:ring-secondary/20 transition-all outline-none text-dark"
                                    value={formData.address_complement}
                                    onChange={(e) => setFormData({ ...formData, address_complement: e.target.value })}
                                    onFocus={scrollToField}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500">Bairro</label>
                                <input
                                    type="text"
                                    className="w-full h-16 px-5 bg-gray-100/50 rounded-3xl border-none shadow-inner outline-none text-gray-400 font-bold"
                                    value={formData.address_neighborhood}
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>

                    {/* Info Box */}
                    <div className="bg-secondary/5 border border-secondary/10 p-5 rounded-3xl flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
                            <Info className="text-secondary" size={18} />
                        </div>
                        <p className="text-[11px] text-secondary font-medium leading-relaxed">
                            Seus dados de endereço são importantes para localizarmos as unidades mais próximas de você.
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-6">
                <Button
                    variant="primary"
                    className="w-full h-16 rounded-3xl text-lg font-bold bg-[#4ADE80] text-dark shadow-none hover:bg-[#3be074] flex items-center justify-center gap-3"
                    onClick={handleFinish}
                    isLoading={loading}
                    disabled={!formData.birthDate || !formData.height || !formData.weight}
                >
                    Finalizar Cadastro
                    <CheckCircle size={20} />
                </Button>
                <p className="text-[10px] text-gray-400 text-center mt-6 px-4 leading-relaxed">
                    Ao finalizar, você concorda com nossos Termos de Uso e Política de Privacidade.
                </p>
            </div>
        </div>
    );
};
