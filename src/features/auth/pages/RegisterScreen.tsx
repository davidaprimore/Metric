import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export const RegisterScreen: React.FC = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // Mock form state
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        cpf: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const requirements = [
        { label: 'Mínimo de 8 caracteres', met: formData.password.length >= 8 },
        { label: 'Uma letra maiúscula e uma minúscula', met: /[A-Z]/.test(formData.password) && /[a-z]/.test(formData.password) },
        { label: 'Um caractere especial', met: /[^A-Za-z0-9]/.test(formData.password) },
        { label: 'Pelo menos um número', met: /[0-9]/.test(formData.password) },
    ];

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans">
            {/* Step Header */}
            <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">PASSO 1 DE 2</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Informações Básicas</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="w-1/2 h-full bg-secondary transition-all" />
                </div>
            </div>

            <div className="flex-1 p-6 space-y-8 overflow-y-auto">
                <div className="space-y-2">
                    <h2 className="text-4xl font-display font-bold text-dark tracking-tight">Criar Conta</h2>
                    <p className="text-gray-500 text-sm">
                        Comece sua avaliação profissional hoje com <span className="font-bold text-dark">METRIK</span>.
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-dark ml-1">Nome</label>
                        <input
                            type="text"
                            placeholder="Ex: João"
                            className="w-full h-14 px-4 bg-gray-100 rounded-2xl border-none focus:ring-2 focus:ring-secondary/20 transition-all outline-none text-dark"
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-dark ml-1">Sobrenome</label>
                        <input
                            type="text"
                            placeholder="Ex: Silva"
                            className="w-full h-14 px-4 bg-gray-100 rounded-2xl border-none focus:ring-2 focus:ring-secondary/20 transition-all outline-none text-dark"
                            onChange={e => setFormData({ ...formData, surname: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-dark ml-1">CPF</label>
                        <input
                            type="text"
                            placeholder="000.000.000-00"
                            className="w-full h-14 px-4 bg-gray-100 rounded-2xl border-none focus:ring-2 focus:ring-secondary/20 transition-all outline-none text-dark"
                            onChange={e => setFormData({ ...formData, cpf: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-dark ml-1">E-mail</label>
                        <input
                            type="email"
                            placeholder="seu@email.com"
                            className="w-full h-14 px-4 bg-gray-100 rounded-2xl border-none focus:ring-2 focus:ring-secondary/20 transition-all outline-none text-dark"
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-dark ml-1">Senha</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="w-full h-14 px-4 bg-gray-100 rounded-2xl border-none focus:ring-2 focus:ring-secondary/20 transition-all outline-none text-dark"
                                placeholder="••••••••"
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                            />
                            <button
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-dark ml-1">Confirmar Senha</label>
                        <input
                            type="password"
                            className="w-full h-14 px-4 bg-gray-100 rounded-2xl border-none focus:ring-2 focus:ring-secondary/20 transition-all outline-none text-dark"
                            placeholder="••••••••"
                            onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                        />
                    </div>
                </div>

                {/* Validation Requirements */}
                <div className="space-y-2 py-2">
                    {requirements.map((req, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <div className={cn(
                                "w-2.5 h-2.5 rounded-full transition-colors",
                                req.met ? "bg-primary" : "bg-gray-300"
                            )} />
                            <span className={cn(
                                "text-[11px] font-medium transition-colors",
                                req.met ? "text-dark" : "text-gray-400"
                            )}>{req.label}</span>
                        </div>
                    ))}
                </div>

                <Button
                    variant="primary"
                    className="w-full h-16 rounded-2xl text-lg font-bold bg-[#70F3A2] text-dark shadow-none hover:bg-[#5EDC8F]"
                    onClick={() => setLoading(true)}
                    isLoading={loading}
                >
                    AVANÇAR
                </Button>

                <div className="relative flex items-center justify-center py-4">
                    <div className="absolute w-full h-[1px] bg-gray-100" />
                    <span className="relative bg-white px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">OU CONTINUE COM</span>
                </div>

                <button className="w-full h-16 border border-gray-100 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.67-.35-1.39-.35-2.09s.13-1.42.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    <span className="font-bold text-dark">Google</span>
                </button>

                <div className="text-center pb-8 pt-2">
                    <p className="text-sm font-medium text-gray-400">
                        Já tem uma conta? <button onClick={() => navigate('/login')} className="text-secondary font-bold">Entre aqui</button>
                    </p>
                </div>
            </div>
        </div>
    );
};
