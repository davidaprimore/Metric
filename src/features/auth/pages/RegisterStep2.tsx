import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Calendar, Ruler, Weight, Info, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export const RegisterStep2: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { signUp } = useAuth();
    const [loading, setLoading] = useState(false);
    const [gender, setGender] = useState('masculino');

    const [formData, setFormData] = useState({
        birthDate: '',
        height: '',
        weight: ''
    });

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

    const step1Data = location.state?.step1;

    const handleFinish = async () => {
        if (!step1Data) return;
        setLoading(true);

        // Format metadata for profile creation
        const metadata = {
            first_name: step1Data.name,
            last_name: step1Data.surname,
            cpf: step1Data.cpf,
            birth_date: formData.birthDate,
            gender: gender,
            height: parseFloat(formData.height),
            weight: parseFloat(formData.weight)
        };

        const { error } = await signUp(step1Data.email, step1Data.password, metadata);

        setLoading(false);
        if (error) {
            alert(error.message);
        } else {
            // Success - Supabase handles redirection if session is active or user gets confirmation email
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
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
                                        ? 'bg-white shadow-md text-dark'
                                        : 'text-gray-400 hover:text-gray-600'
                                        }`}
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
                                />
                                <Weight className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                            </div>
                        </div>
                    </div>

                    {/* Info Box */}
                    <div className="bg-secondary/5 border border-secondary/10 p-5 rounded-3xl flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
                            <Info className="text-secondary" size={18} />
                        </div>
                        <p className="text-[11px] text-secondary font-medium leading-relaxed">
                            Estes dados são essenciais para o cálculo do seu IMC e taxa metabólica basal, garantindo precisão nos resultados da Metrik.
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
