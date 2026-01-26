import React from 'react';
import {
    User,
    Shield,
    CreditCard,
    Bell,
    Smartphone,
    HelpCircle,
    LogOut,
    ChevronRight,
    Globe
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export const ProfessionalSettings = () => {
    const { signOut } = useAuth();

    const SECTIONS = [
        {
            title: 'Conta e Perfil',
            items: [
                { icon: User, label: 'Dados Pessoais', desc: 'Nome, CPF, Data de nasc.' },
                { icon: Globe, label: 'Perfil Público', desc: 'Como você aparece no app' },
            ]
        },
        {
            title: 'Segurança e Acesso',
            items: [
                { icon: Shield, label: 'Senha e Biometria', desc: 'Alterar senha, FaceID' },
                { icon: Smartphone, label: 'Dispositivos', desc: 'Gerenciar sessões ativas' },
            ]
        },
        {
            title: 'Financeiro',
            items: [
                { icon: CreditCard, label: 'Dados Bancários', desc: 'Para recebimento de repasses' },
            ]
        },
        {
            title: 'Geral',
            items: [
                { icon: Bell, label: 'Notificações', desc: 'Push, Email, SMS' },
                { icon: HelpCircle, label: 'Ajuda e Suporte', desc: 'FAQ, Contato' },
            ]
        }
    ];

    return (
        <div className="space-y-8 animate-in slide-in-from-right duration-500 pb-20">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">Ajustes</h2>
                <p className="text-sm text-slate-400 font-medium">Configure sua experiência</p>
            </div>

            {/* Settings Sections */}
            <div className="space-y-6">
                {SECTIONS.map((section, idx) => (
                    <div key={idx}>
                        <h3 className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest mb-3 pl-2 opacity-80">{section.title}</h3>
                        <div className="space-y-2">
                            {section.items.map((item, i) => (
                                <button key={i} className="w-full bg-[#1F2937]/40 backdrop-blur-md border border-white/5 p-4 rounded-2xl flex items-center justify-between hover:bg-white/5 transition-all group active:scale-[0.99]">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-black/40 flex items-center justify-center text-slate-400 group-hover:text-white transition-colors">
                                            <item.icon size={20} />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-bold text-white leading-none mb-1">{item.label}</p>
                                            <p className="text-[10px] text-slate-500 font-medium">{item.desc}</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={18} className="text-slate-600 group-hover:text-[#D4AF37] transition-colors" />
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Sign Out */}
            <button
                onClick={signOut}
                className="w-full py-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-500 font-black uppercase tracking-widest text-xs hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2 mt-8"
            >
                <LogOut size={16} /> Sair da Conta
            </button>

            <p className="text-center text-[9px] text-slate-600 font-bold uppercase tracking-widest mt-4 opacity-50">
                Metrik Pro v2.1.0 • Build 2408
            </p>
        </div>
    );
};
