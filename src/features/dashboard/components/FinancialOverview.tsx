import React from 'react';
import { DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, CreditCard, Wallet, Calendar } from 'lucide-react';

export const FinancialOverview = () => {
    return (
        <div className="space-y-6 animate-in slide-in-from-right duration-500">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">Financeiro</h2>
                <p className="text-sm text-slate-400 font-medium">Balanço e previsões</p>
            </div>

            {/* Main Balance Card */}
            <div className="bg-gradient-to-br from-[#122216] to-[#0A0A0A] border border-[#D4AF37]/20 p-8 rounded-[2.5rem] relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-full h-full bg-[url('/assets/grain.png')] opacity-20 pointer-events-none mix-blend-overlay"></div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#D4AF37]/20 rounded-full blur-3xl" />

                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
                            <DollarSign size={16} />
                        </div>
                        <span className="text-xs font-black text-[#D4AF37] uppercase tracking-widest">Receita Total (Mês)</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-white tracking-tighter">R$ 12.450</span>
                        <span className="text-lg font-bold text-slate-500">,00</span>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                        <div className="px-2 py-1 rounded-lg bg-green-500/20 text-green-500 flex items-center gap-1 text-[10px] font-black uppercase">
                            <TrendingUp size={12} /> +15.3%
                        </div>
                        <span className="text-[10px] text-slate-500 font-bold uppercase">vs. Mês anterior</span>
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#1F2937]/40 backdrop-blur-xl border border-white/5 p-5 rounded-[2rem]">
                    <div className="bg-blue-500/10 w-10 h-10 rounded-xl flex items-center justify-center text-blue-400 mb-3">
                        <Wallet size={20} />
                    </div>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-wider mb-1">A Receber</p>
                    <h3 className="text-xl font-black text-white">R$ 2.890</h3>
                    <p className="text-[9px] text-slate-400 mt-1">Previsão: 5 dias</p>
                </div>
                <div className="bg-[#1F2937]/40 backdrop-blur-xl border border-white/5 p-5 rounded-[2rem]">
                    <div className="bg-purple-500/10 w-10 h-10 rounded-xl flex items-center justify-center text-purple-400 mb-3">
                        <CreditCard size={20} />
                    </div>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-wider mb-1">Ticket Médio</p>
                    <h3 className="text-xl font-black text-white">R$ 180</h3>
                    <p className="text-[9px] text-slate-400 mt-1 text-green-400">+5% este mês</p>
                </div>
            </div>

            {/* Recent Transactions List */}
            <div>
                <div className="flex items-center justify-between mb-4 pl-2">
                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Últimas Transações</h3>
                    <button className="text-[10px] text-[#D4AF37] font-bold uppercase hover:underline">Ver Extrato</button>
                </div>
                <div className="space-y-3">
                    {[
                        { id: 1, name: 'Lucas Ferreira', type: 'Avaliação Premium', value: 250, date: 'Hoje, 14:30' },
                        { id: 2, name: 'Ana Silva', type: 'Avaliação Básica', value: 150, date: 'Ontem, 09:15' },
                        { id: 3, name: 'Roberto Campos', type: 'Consultoria Online', value: 400, date: '23 Jan', status: 'pending' },
                    ].map((tx) => (
                        <div key={tx.id} className="bg-black/20 p-4 rounded-2xl border border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400">
                                    <ArrowDownRight size={16} className={tx.status === 'pending' ? "text-yellow-500" : "text-green-500"} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-white">{tx.name}</p>
                                    <p className="text-[9px] text-slate-500 uppercase font-medium">{tx.type} • {tx.date}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-black text-white">R$ {tx.value}</p>
                                {tx.status === 'pending' && <p className="text-[8px] text-yellow-500 uppercase font-bold">Pendente</p>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
