import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Clock, CheckCircle2, Mail, Bell } from 'lucide-react';

export const RegisterPendingScreen: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 font-sans">
            {/* Visual Icon Section */}
            <div className="relative mb-12">
                <div className="w-32 h-32 bg-secondary/10 rounded-[3rem] flex items-center justify-center animate-pulse">
                    <Clock size={48} className="text-secondary" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-primary rounded-2xl border-4 border-white flex items-center justify-center shadow-lg">
                    <CheckCircle2 size={24} className="text-dark" />
                </div>
            </div>

            {/* Text Content */}
            <div className="text-center space-y-4 max-w-sm">
                <h1 className="text-3xl font-black text-dark leading-tight tracking-tight uppercase">
                    Cadastro <br /> <span className="text-secondary">Enviado!</span>
                </h1>
                <p className="text-gray-400 text-sm font-medium leading-relaxed">
                    Sua solicitação de acesso profissional foi recebida com sucesso por nossa equipe de administração.
                </p>
            </div>

            {/* Info Cards */}
            <div className="w-full max-w-sm mt-12 space-y-3">
                <div className="flex gap-4 p-5 bg-gray-50 rounded-3xl border border-gray-100">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0">
                        <Mail size={18} className="text-secondary" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-dark uppercase tracking-widest">E-mail</p>
                        <p className="text-[10px] text-gray-400 font-medium">Você receberá uma confirmação assim que seu perfil for validado.</p>
                    </div>
                </div>

                <div className="flex gap-4 p-5 bg-gray-50 rounded-3xl border border-gray-100">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0">
                        <Bell size={18} className="text-secondary" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-dark uppercase tracking-widest">Notificação</p>
                        <p className="text-[10px] text-gray-400 font-medium">Verifique as notificações do sistema em seu próximo acesso.</p>
                    </div>
                </div>
            </div>

            {/* Action */}
            <div className="w-full max-w-sm mt-12">
                <Button
                    variant="primary"
                    className="w-full h-16 rounded-[2rem] text-sm font-black tracking-widest uppercase shadow-neon"
                    onClick={() => navigate('/welcome')}
                >
                    CONCLUIR E SAIR
                </Button>
            </div>

            <p className="mt-8 text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                Professional Assessment Suite
            </p>
        </div>
    );
};
