import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Eye, EyeOff, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Toast } from '@/components/ui/Toast';
import { supabase } from '@/lib/supabase';
import { isValidCPF } from '@/utils/validation';

type ValidationStatus = 'idle' | 'checking' | 'available' | 'taken' | 'invalid';

export const RegisterScreen: React.FC = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userType, setUserType] = useState<'patient' | 'professional'>('patient');
    const [toast, setToast] = useState({ show: false, message: '', type: 'error' as 'error' | 'success' });

    // Mock form state
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        cpf: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [cpfStatus, setCpfStatus] = useState<ValidationStatus>('idle');
    const [emailStatus, setEmailStatus] = useState<ValidationStatus>('idle');
    const [phoneStatus, setPhoneStatus] = useState<ValidationStatus>('idle');

    React.useEffect(() => {
        setFormData({
            name: '',
            surname: '',
            cpf: '',
            phone: '',
            email: '',
            password: '',
            confirmPassword: ''
        });
        setCpfStatus('idle');
        setEmailStatus('idle');
        setPhoneStatus('idle');
    }, []);

    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const scrollToField = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
        e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    // Real-time validation for CPF
    React.useEffect(() => {
        const raw = formData.cpf.replace(/\D/g, '');
        if (raw.length === 0) {
            setCpfStatus('idle');
            return;
        }

        if (raw.length < 11) {
            setCpfStatus('idle');
            return;
        }

        if (!isValidCPF(formData.cpf)) {
            setCpfStatus('invalid');
            return;
        }

        setCpfStatus('checking');
        const timer = setTimeout(async () => {
            try {
                // Check both formatted and raw to be safe, quoting strings for .or()
                const { data } = await supabase
                    .from('profiles')
                    .select('id')
                    .or(`cpf.eq."${formData.cpf}",cpf.eq."${raw}"`)
                    .maybeSingle();
                setCpfStatus(data ? 'taken' : 'available');
            } catch (err) {
                console.error('CPF Validation Error:', err);
                setCpfStatus('idle');
            }
        }, 600);
        return () => clearTimeout(timer);
    }, [formData.cpf]);

    // Real-time validation for Email
    React.useEffect(() => {
        if (!formData.email) {
            setEmailStatus('idle');
            return;
        }

        if (!formData.email.includes('@')) {
            setEmailStatus('checking'); // Show it's checking/validating format
            return;
        }

        setEmailStatus('checking');
        const timer = setTimeout(async () => {
            try {
                // Use .ilike for case-insensitive check
                const { data } = await supabase
                    .from('profiles')
                    .select('id')
                    .ilike('email', formData.email.trim())
                    .maybeSingle();
                setEmailStatus(data ? 'taken' : 'available');
            } catch (err) {
                console.error('Email Validation Error:', err);
                setEmailStatus('idle');
            }
        }, 600);
        return () => clearTimeout(timer);
    }, [formData.email]);

    // Real-time validation for Phone
    React.useEffect(() => {
        const raw = formData.phone.replace(/\D/g, '');
        if (raw.length === 0) {
            setPhoneStatus('idle');
            return;
        }

        if (raw.length < 10) {
            setPhoneStatus('idle');
            return;
        }

        setPhoneStatus('checking');
        const timer = setTimeout(async () => {
            try {
                const { data } = await supabase
                    .from('profiles')
                    .select('id')
                    .or(`phone.eq."${formData.phone}",phone.eq."${raw}"`)
                    .maybeSingle();
                setPhoneStatus(data ? 'taken' : 'available');
            } catch (err) {
                console.error('Phone Validation Error:', err);
                setPhoneStatus('idle');
            }
        }, 600);
        return () => clearTimeout(timer);
    }, [formData.phone]);

    const formatCPF = (value: string) => {
        const raw = value.replace(/\D/g, '');
        return raw
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})/, '$1-$2')
            .replace(/(-\d{2})\d+?$/, '$1');
    };

    const formatPhone = (value: string) => {
        const raw = value.replace(/\D/g, '');
        if (raw.length <= 10) {
            return raw
                .replace(/(\d{2})(\d)/, '($1) $2')
                .replace(/(\d{4})(\d)/, '$1-$2');
        } else {
            return raw
                .replace(/(\d{2})(\d)/, '($1) $2')
                .replace(/(\d{5})(\d)/, '$1-$2')
                .replace(/(-\d{4})\d+?$/, '$1');
        }
    };

    const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, cpf: formatCPF(e.target.value) });
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, phone: formatPhone(e.target.value) });
    };

    const requirements = [
        { label: 'Mínimo de 8 caracteres', met: formData.password.length >= 8 },
        { label: 'Uma letra maiúscula e uma minúscula', met: /[A-Z]/.test(formData.password) && /[a-z]/.test(formData.password) },
        { label: 'Um caractere especial', met: /[^A-Za-z0-9]/.test(formData.password) },
        { label: 'Pelo menos um número', met: /[0-9]/.test(formData.password) },
    ];

    const passwordsMatch = formData.password.length > 0 && formData.password === formData.confirmPassword;
    const isFormValid = formData.name.length > 2 &&
        cpfStatus === 'available' &&
        phoneStatus === 'available' &&
        emailStatus === 'available' &&
        requirements.every(r => r.met) &&
        passwordsMatch;

    const StatusIcon = ({ status }: { status: ValidationStatus }) => {
        if (status === 'checking') return <Loader2 size={22} className="animate-spin text-secondary" />;
        if (status === 'available') return <CheckCircle2 size={22} className="text-[#16A34A]" strokeWidth={3} />;
        if (status === 'taken' || status === 'invalid') return <AlertCircle size={22} className="text-[#FF5252]" strokeWidth={3} />;
        return null;
    };

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans">
            <Toast
                isVisible={toast.show}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ ...toast, show: false })}
            />

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
                <div className="space-y-4">
                    <h2 className="text-4xl font-display font-bold text-dark tracking-tight">Criar Conta</h2>
                    <p className="text-gray-500 text-sm">
                        Preencha seus dados para começar sua jornada com a <span className="font-bold text-dark">METRIK</span>.
                    </p>
                </div>

                {/* Path Selector */}
                <div className="flex bg-gray-50 p-1.5 rounded-3xl border border-gray-100">
                    <button
                        onClick={() => setUserType('patient')}
                        className={cn(
                            "flex-1 h-12 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                            userType === 'patient'
                                ? "bg-white text-secondary shadow-md border border-gray-100"
                                : "text-gray-400 opacity-60"
                        )}
                    >
                        Quero ser atendido
                    </button>
                    <button
                        onClick={() => setUserType('professional')}
                        className={cn(
                            "flex-1 h-12 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                            userType === 'professional'
                                ? "bg-white text-secondary shadow-md border border-gray-100"
                                : "text-gray-400 opacity-40 hover:opacity-100"
                        )}
                    >
                        Sou Profissional
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-dark ml-1">Nome</label>
                        <input
                            type="text"
                            placeholder="Ex: João"
                            className="w-full h-14 px-4 bg-gray-100 rounded-2xl border-none focus:ring-2 focus:ring-secondary/20 transition-all outline-none text-dark"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            onFocus={scrollToField}
                            autoComplete="off"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-dark ml-1">Sobrenome</label>
                        <input
                            type="text"
                            placeholder="Ex: Silva"
                            className="w-full h-14 px-4 bg-gray-100 rounded-2xl border-none focus:ring-2 focus:ring-secondary/20 transition-all outline-none text-dark"
                            value={formData.surname}
                            onChange={e => setFormData({ ...formData, surname: e.target.value })}
                            onFocus={scrollToField}
                            autoComplete="off"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center ml-1">
                            <label className="text-xs font-bold text-dark">CPF</label>
                            <StatusIcon status={cpfStatus} />
                        </div>
                        <input
                            type="text"
                            placeholder="000.000.000-00"
                            className={cn(
                                "w-full h-14 px-4 bg-gray-100 rounded-2xl border-none focus:ring-2 transition-all outline-none text-dark font-mono",
                                (cpfStatus === 'taken' || cpfStatus === 'invalid') ? "ring-2 ring-[#FF5252]/40 bg-red-50" : "focus:ring-secondary/20"
                            )}
                            value={formData.cpf}
                            onChange={handleCPFChange}
                            onFocus={scrollToField}
                            maxLength={14}
                            autoComplete="off"
                        />
                        {cpfStatus === 'taken' && (
                            <p className="text-[10px] font-black text-[#FF5252] ml-1 mt-0.5 uppercase tracking-tighter italic">
                                ATENÇÃO: ESTE CPF JÁ ESTÁ CADASTRADO EM OUTRA CONTA.
                            </p>
                        )}
                        {cpfStatus === 'invalid' && (
                            <p className="text-[10px] font-black text-[#FF5252] ml-1 mt-0.5 uppercase tracking-tighter italic">
                                ATENÇÃO: POR FAVOR, INSIRA UM CPF VÁLIDO.
                            </p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center ml-1">
                            <label className="text-xs font-bold text-dark font-sans">Telefone</label>
                            <StatusIcon status={phoneStatus} />
                        </div>
                        <input
                            type="text"
                            placeholder="(00) 00000-0000"
                            className={cn(
                                "w-full h-14 px-4 bg-gray-100 rounded-2xl border-none focus:ring-2 transition-all outline-none text-dark font-mono",
                                phoneStatus === 'taken' ? "ring-2 ring-[#FF5252]/40 bg-red-50" : "focus:ring-secondary/20"
                            )}
                            value={formData.phone}
                            onChange={handlePhoneChange}
                            onFocus={scrollToField}
                            maxLength={15}
                            autoComplete="off"
                        />
                        {phoneStatus === 'taken' && (
                            <p className="text-[10px] font-black text-[#FF5252] ml-1 mt-0.5 uppercase tracking-tighter italic">
                                ATENÇÃO: ESTE TELEFONE JÁ ESTÁ CADASTRADO EM OUTRA CONTA.
                            </p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center ml-1">
                            <label className="text-xs font-bold text-dark">E-mail</label>
                            <StatusIcon status={emailStatus} />
                        </div>
                        <input
                            type="email"
                            placeholder="seu@email.com"
                            className={cn(
                                "w-full h-14 px-4 bg-gray-100 rounded-2xl border-none focus:ring-2 transition-all outline-none text-dark",
                                emailStatus === 'taken' ? "ring-2 ring-[#FF5252]/40 bg-red-50" : "focus:ring-secondary/20"
                            )}
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            onFocus={scrollToField}
                            autoComplete="off"
                        />
                        {emailStatus === 'taken' && (
                            <p className="text-[10px] font-black text-[#FF5252] ml-1 mt-0.5 uppercase tracking-tighter italic">
                                ATENÇÃO: ESTE E-MAIL JÁ ESTÁ SENDO USADO POR OUTRO CADASTRO.
                            </p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-dark ml-1">Senha</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="w-full h-14 px-4 bg-gray-100 rounded-2xl border-none focus:ring-2 focus:ring-secondary/20 transition-all outline-none text-dark"
                                placeholder=""
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                onFocus={scrollToField}
                                autoComplete="new-password"
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
                            className={cn(
                                "w-full h-14 px-4 bg-gray-100 rounded-2xl border-none focus:ring-2 transition-all outline-none text-dark",
                                passwordsMatch ? "ring-2 ring-primary/40 bg-primary/5" : "focus:ring-secondary/20"
                            )}
                            placeholder=""
                            value={formData.confirmPassword}
                            onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                            onFocus={scrollToField}
                            autoComplete="new-password"
                        />
                    </div>
                </div>

                {/* Validation Requirements */}
                <div className="space-y-2 py-2">
                    {requirements.map((req, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <div className={cn(
                                "w-2.5 h-2.5 rounded-full transition-colors",
                                req.met ? "bg-[#C6FF00]" : "bg-gray-300"
                            )} />
                            <span className={cn(
                                "text-[11px] font-medium transition-colors",
                                req.met ? "text-dark" : "text-gray-400"
                            )}>{req.label}</span>
                        </div>
                    ))}
                    {/* Match validation */}
                    <div className="flex items-center gap-2">
                        <div className={cn(
                            "w-2.5 h-2.5 rounded-full transition-colors",
                            passwordsMatch ? "bg-[#C6FF00]" : "bg-gray-300"
                        )} />
                        <span className={cn(
                            "text-[11px] font-medium transition-colors",
                            passwordsMatch ? "text-dark" : "text-gray-400"
                        )}>As senhas coincidem</span>
                    </div>
                </div>

                <Button
                    variant="primary"
                    className={cn(
                        "w-full h-16 rounded-2xl text-lg font-bold text-dark transition-all shadow-none",
                        isFormValid ? "bg-primary hover:bg-primary/90" : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    )}
                    onClick={async () => {
                        if (isFormValid) {
                            setLoading(true);
                            try {
                                // 1. Check if CPF already exists in profiles
                                const { data: existingCPF } = await supabase
                                    .from('profiles')
                                    .select('id')
                                    .eq('cpf', formData.cpf)
                                    .maybeSingle();

                                if (existingCPF) {
                                    setToast({
                                        show: true,
                                        message: 'OPS! Este CPF já está cadastrado. Por favor, utilize outro ou acesse sua conta existente.',
                                        type: 'error'
                                    });
                                    setLoading(false);
                                    return;
                                }

                                // 2. Check if Email already exists in profiles
                                const { data: existingEmail } = await supabase
                                    .from('profiles')
                                    .select('id')
                                    .eq('email', formData.email)
                                    .maybeSingle();

                                if (existingEmail) {
                                    setToast({ show: true, message: `O e-mail ${formData.email} já está em uso por outro cadastro.`, type: 'error' });
                                    setLoading(false);
                                    return;
                                }

                                // 3. Check if Phone already exists in profiles
                                const { data: existingPhone } = await supabase
                                    .from('profiles')
                                    .select('id')
                                    .eq('phone', formData.phone)
                                    .maybeSingle();

                                if (existingPhone) {
                                    setToast({ show: true, message: `O telefone ${formData.phone} já está vinculado a outra conta.`, type: 'error' });
                                    setLoading(false);
                                    return;
                                }

                                const path = userType === 'patient' ? '/register-step-2' : '/register-professional-step-2';
                                setTimeout(() => navigate(path, { state: { step1: formData } }), 800);
                            } catch (err: any) {
                                console.error(err);
                                setToast({ show: true, message: 'Erro ao validar dados: ' + err.message, type: 'error' });
                                setLoading(false);
                            }
                        }
                    }}
                    isLoading={loading}
                    disabled={!isFormValid}
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
