import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    Bell,
    Rocket,
    Clock,
    Calendar,
    MessageSquare,
    History,
    ChevronRight,
    User,
    Weight,
    Ruler,
    Target,
    Activity,
    Info,
    Send,
    X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProfessionalBottomNav } from '@/components/layout/ProfessionalBottomNav';
import { Toast } from '@/components/ui/Toast';

export const AppointmentDetailScreen: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [showDelayModal, setShowDelayModal] = useState(false);
    const [delayTime, setDelayTime] = useState<string | null>(null);
    const [delayMessage, setDelayMessage] = useState('');
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' as any });

    // Mock Patient Data
    const patient = {
        name: 'Lucas Silva',
        age: 28,
        weight: '82.5 kg',
        height: '1.80 m',
        objective: 'Hipertrofia & Definição',
        avatar: 'https://i.pravatar.cc/150?u=lucas',
        appointmentTime: '14:00',
        lastAssessed: '15/12/2025',
        history: [
            { date: '15/12/2025', type: 'Avaliação Antropométrica', status: 'Concluída' },
            { date: '10/10/2025', type: 'Protocolo Pollok 7 Dobras', status: 'Concluída' },
            { date: '05/08/2025', type: 'Bioimpedância', status: 'Concluída' },
        ]
    };

    const handleNotifyDelay = () => {
        const finalMessage = delayMessage.trim() || `Olá ${patient.name.split(' ')[0]}, infelizmente precisarei atrasar por ${delayTime} minutos. Obrigado pela compreensão.`;

        console.log('Sending Notification:', finalMessage);

        setToast({ show: true, message: `Notificação enviada para ${patient.name}.`, type: 'success' });
        setShowDelayModal(false);
    };

    const renderDelayModal = () => (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/90 backdrop-blur-xl animate-in fade-in duration-300 font-sans">
            <div className="bg-[#050505] w-full max-w-xl rounded-t-[3rem] border-t border-[#39FF14]/20 p-10 animate-in slide-in-from-bottom-full duration-500 pb-20 shadow-[0_0_50px_rgba(57,255,20,0.1)]">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Notificar <span className="text-[#39FF14]">Atraso</span></h3>
                        <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-[0.3em] font-bold">Selecione o tempo estimado</p>
                    </div>
                    <button onClick={() => { setShowDelayModal(false); setDelayTime(null); }} className="w-12 h-12 rounded-full bg-[#111] flex items-center justify-center text-slate-400 border border-white/10 hover:border-[#39FF14] hover:text-[#39FF14] transition-all">
                        <X size={20} />
                    </button>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-10">
                    {['5', '10', '15', '30', '45', 'Indefinido'].map((time) => (
                        <button
                            key={time}
                            onClick={() => setDelayTime(time === 'Indefinido' ? time : `${time}`)}
                            className={cn(
                                "py-4 rounded-xl border transition-all text-[10px] font-black uppercase tracking-widest",
                                delayTime === (time === 'Indefinido' ? time : `${time}`)
                                    ? "bg-[#39FF14] border-[#39FF14] text-black shadow-[0_0_15px_rgba(57,255,20,0.4)]"
                                    : "bg-[#111] border-white/5 text-slate-400 hover:border-[#39FF14] hover:text-white"
                            )}
                        >
                            {time === 'Indefinido' ? time : `${time} min`}
                        </button>
                    ))}
                </div>

                <div className="mb-10">
                    <p className="text-[10px] text-slate-400 uppercase tracking-[0.3em] font-black mb-4">Mensagem Opcional</p>
                    <textarea
                        value={delayMessage}
                        onChange={(e) => setDelayMessage(e.target.value)}
                        placeholder="Ex: Desculpe o atraso, precisarei me atrasar um pouco"
                        className="w-full h-32 bg-[#111] border border-white/10 rounded-2xl p-6 text-white text-sm focus:border-[#39FF14] focus:ring-0 transition-colors resize-none shadow-inner font-mono"
                    />
                </div>

                <button
                    onClick={handleNotifyDelay}
                    disabled={!delayTime}
                    className="w-full py-6 bg-[#39FF14] text-black font-black uppercase tracking-[0.3em] rounded-full hover:scale-[1.01] active:scale-95 transition-all shadow-[0_0_20px_rgba(57,255,20,0.3)] flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale"
                >
                    <Send size={20} strokeWidth={3} /> Enviar Notificação
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans pb-40 relative overflow-hidden flex flex-col items-center">
            {/* Theme: Organic Toxic Smoke */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a0a] to-[#051105]"></div>
                {/* Faster, Heavier Toxic Green Smoke */}
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#39FF14]/10 rounded-full blur-[80px] animate-chemical-fog-1 mix-blend-screen"></div>
                {/* Meth Blue Smoke */}
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#00F0FF]/5 rounded-full blur-[100px] animate-chemical-fog-2 mix-blend-screen"></div>
            </div>

            <div className="relative z-10 w-full max-w-xl px-6 pt-6">
                {/* Header */}
                <header className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-14 h-14 bg-[#111]/50 rounded-2xl border border-white/10 flex items-center justify-center hover:bg-[#39FF14]/10 hover:border-[#39FF14]/30 transition-colors active:scale-90 shadow-sm backdrop-blur-md group"
                    >
                        <ChevronLeft size={24} className="text-slate-400 group-hover:text-[#39FF14]" />
                    </button>
                    <h1 className="text-xl font-black uppercase tracking-tighter text-white text-center flex-1">Agendamento<span className="text-[#39FF14]">.Io</span></h1>
                    <div className="w-14"></div>
                </header>

                {/* Top Action Buttons */}
                <div className="grid grid-cols-2 gap-4 mb-10">
                    <button
                        onClick={() => setShowDelayModal(true)}
                        className="flex items-center justify-center gap-3 py-5 bg-[#111]/50 border border-white/10 rounded-3xl hover:border-[#39FF14] hover:bg-[#39FF14]/5 transition-all active:scale-95 group shadow-sm backdrop-blur-md"
                    >
                        <Bell size={18} className="text-slate-400 group-hover:text-[#39FF14] group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white">Atraso</span>
                    </button>
                    <button
                        onClick={() => navigate('/assessment')}
                        className="flex items-center justify-center gap-3 py-5 bg-[#39FF14] text-black rounded-3xl hover:scale-[1.01] active:scale-95 transition-all shadow-[0_0_20px_rgba(57,255,20,0.3)]"
                    >
                        <Activity size={18} strokeWidth={3} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Iniciar Análise</span>
                    </button>
                </div>

                {/* Patient Profile Card (Clean Glass) */}
                <div className="bg-white/5 backdrop-blur-3xl rounded-[3rem] p-10 border border-white/5 mb-8 relative overflow-hidden group shadow-2xl">
                    <div className="absolute top-0 right-0 p-8">
                        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-[#39FF14] border border-white/10">
                            <Info size={20} />
                        </div>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="w-32 h-32 rounded-full border-2 border-[#39FF14] p-1 mb-6 shadow-lg shadow-[#39FF14]/20 group-hover:scale-105 transition-transform duration-500 bg-[#050505] relative">
                            <img src={patient.avatar} className="w-full h-full object-cover rounded-full" alt={patient.name} />
                        </div>
                        <h2 className="text-3xl font-bold uppercase tracking-tight mb-2 text-white">{patient.name}</h2>
                        <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/5 mb-8">
                            <Clock size={16} className="text-[#39FF14]" />
                            <span className="text-sm font-bold text-white">14:00</span>
                            <div className="w-1.5 h-1.5 bg-[#39FF14] rounded-full shadow-[0_0_5px_#39FF14] animate-pulse"></div>
                        </div>

                        <div className="w-full grid grid-cols-3 gap-4">
                            <div className="text-center p-4 rounded-3xl bg-white/5 border border-white/5 shadow-inner transition-colors">
                                <p className="text-[8px] text-slate-400 uppercase font-bold tracking-widest mb-1">Idade</p>
                                <p className="text-lg font-bold text-white">{patient.age}</p>
                            </div>
                            <div className="text-center p-4 rounded-3xl bg-white/5 border border-white/5 shadow-inner transition-colors">
                                <p className="text-[8px] text-slate-400 uppercase font-bold tracking-widest mb-1">Peso</p>
                                <p className="text-lg font-bold text-white">82.5 <span className="text-[10px] text-slate-500">kg</span></p>
                            </div>
                            <div className="text-center p-4 rounded-3xl bg-white/5 border border-white/5 shadow-inner transition-colors">
                                <p className="text-[8px] text-slate-400 uppercase font-bold tracking-widest mb-1">Altura</p>
                                <p className="text-lg font-bold text-white">1.80 <span className="text-[10px] text-slate-500">m</span></p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Objective Section */}
                <div className="px-2 mb-10">
                    <div className="flex items-center justify-between mb-6">
                        <h4 className="text-[10px] font-bold text-white uppercase tracking-[0.2em] opacity-50">Objetivo Principal</h4>
                        <Target size={16} className="text-[#39FF14]" />
                    </div>
                    <div className="bg-white/5 backdrop-blur-md p-6 rounded-[2rem] border border-white/5 shadow-lg relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#39FF14]"></div>
                        <p className="text-xl font-bold uppercase tracking-tight text-white font-sans">{patient.objective}</p>
                    </div>
                </div>

                {/* History Section */}
                <div className="px-2 mb-10">
                    <div className="flex items-center justify-between mb-8">
                        <h4 className="text-[10px] font-bold text-white uppercase tracking-[0.2em] opacity-50">Histórico</h4>
                        <History size={16} className="text-slate-500" />
                    </div>

                    <div className="space-y-4">
                        {patient.history.map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-6 bg-white/5 backdrop-blur-md rounded-[2rem] border border-white/5 hover:bg-white/10 transition-all cursor-pointer group shadow-lg">
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-[#39FF14] border border-white/5 group-hover:scale-105 transition-transform">
                                        <Calendar size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white uppercase tracking-tight">{item.type}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <p className="text-[10px] text-slate-500 uppercase font-bold">{item.date} • {item.status}</p>
                                            <div className="w-1.5 h-1.5 bg-[#39FF14] rounded-full shadow-[0_0_5px_#39FF14]"></div>
                                        </div>
                                    </div>
                                </div>
                                <ChevronRight size={20} className="text-slate-600 group-hover:text-[#39FF14]" />
                            </div>
                        ))}
                    </div>

                    <button className="w-full mt-6 py-5 bg-white/5 rounded-full border border-dashed border-white/10 text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:border-[#39FF14]/50 hover:text-[#39FF14] transition-all">
                        Carregar Mais
                    </button>
                </div>
            </div>

            {/* Bottom Nav */}
            <ProfessionalBottomNav activeTab="agenda" onTabChange={(tab) => navigate('/dashboard')} />

            {/* Modals & Toasts */}
            {showDelayModal && renderDelayModal()}
            {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />}
        </div>
    );
};
