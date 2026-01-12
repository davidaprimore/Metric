import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Mail, ArrowLeft, Send } from 'lucide-react';

export const ForgotPasswordScreen: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleReset = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setSent(true);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans">
            {/* Header */}
            <div className="p-6">
                <button
                    onClick={() => navigate(-1)}
                    className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-dark hover:bg-gray-100 transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
            </div>

            <div className="flex-1 p-6 space-y-8 flex flex-col justify-center max-w-md mx-auto w-full">
                {!sent ? (
                    <>
                        <div className="space-y-4 text-center">
                            <div className="w-20 h-20 bg-secondary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                <Mail className="text-secondary" size={40} />
                            </div>
                            <h2 className="text-3xl font-display font-bold text-dark tracking-tight">Esqueci minha senha</h2>
                            <p className="text-gray-500 text-sm px-4">
                                Insira o e-mail associado à sua conta e enviaremos um link para redefinir sua senha.
                            </p>
                        </div>

                        <form onSubmit={handleReset} className="space-y-6 pt-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-dark ml-1 uppercase tracking-widest">E-mail</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        required
                                        placeholder="seu@email.com"
                                        className="w-full h-16 px-5 bg-gray-100 rounded-3xl border-none focus:ring-2 focus:ring-secondary/20 transition-all outline-none text-dark"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <Mail className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                                </div>
                            </div>

                            <Button
                                variant="primary"
                                type="submit"
                                className="w-full h-16 rounded-3xl text-lg font-bold bg-secondary text-white shadow-none hover:bg-secondary/90 flex items-center justify-center gap-3"
                                isLoading={loading}
                            >
                                Enviar Link
                                <Send size={20} />
                            </Button>
                        </form>
                    </>
                ) : (
                    <div className="space-y-8 text-center animate-in fade-in zoom-in duration-500">
                        <div className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center mx-auto">
                            <Send className="text-primary" size={40} />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-3xl font-display font-bold text-dark tracking-tight">E-mail enviado!</h2>
                            <p className="text-gray-500 text-sm">
                                Enviamos as instruções de recuperação para <span className="font-bold text-dark">{email}</span>. Verifique sua caixa de entrada e spam.
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            className="w-full h-16 rounded-3xl border-gray-100 font-bold"
                            onClick={() => navigate('/login')}
                        >
                            Voltar para Entrar
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};
