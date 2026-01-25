import React from 'react';
import { FluidBackground } from '@/components/layout/FluidBackground';
import {
    ChevronLeft,
    Bell,
    Calendar as CalendarIcon,
    CheckCircle2,
    XCircle,
    Clock,
    MapPin,
    CalendarPlus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { BottomNav } from '@/components/layout/BottomNav';
import { cn } from '@/lib/utils';

export const UserAppointmentsScreen: React.FC = () => {
    const navigate = useNavigate();

    // For demonstration, let's assume there are no upcoming appointments
    const upcomingAppointments = [];

    const history = [];

    // Glassy, Transparent, Luminous
    const textureCardClass = "bg-black/40 bg-[radial-gradient(120%_120%_at_50%_0%,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent backdrop-blur-3xl border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] relative overflow-hidden";

    return (
        <FluidBackground variant="luminous" className="pb-40 font-sans px-5 relative overflow-hidden min-h-screen">
            {/* Header */}
            <header className="pt-8 flex justify-between items-center mb-10 relative z-10">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 shadow-sm hover:text-white text-slate-400 active:scale-95 transition-all"
                >
                    <ChevronLeft size={24} />
                </button>
                <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/10 pb-0.5 mb-1">Painel do Atleta</span>
                    <h1 className="text-lg font-extrabold text-white tracking-tight">
                        Meus <span className="text-[#CCFF00]">Agendamentos</span>
                    </h1>
                </div>
                <button className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 shadow-sm relative hover:text-white text-slate-400">
                    <Bell size={20} fill="currentColor" />
                    <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#CCFF00] rounded-full border-2 border-[#080C09]"></div>
                </button>
            </header>

            {/* Upcoming Appointment Section */}
            <div className="mb-10 relative z-10">
                <div className="flex justify-between items-center mb-4">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Próximo Agendamento</p>
                </div>

                {upcomingAppointments.length > 0 ? (
                    <div className={`${textureCardClass} rounded-[2.5rem] p-6`}>
                        <div className="flex gap-4 mb-6">
                            <div className="w-14 h-14 bg-[#CCFF00]/10 rounded-2xl flex flex-col items-center justify-center shrink-0 border border-[#CCFF00]/20">
                                <CalendarIcon size={20} className="text-[#CCFF00]" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-black text-white leading-tight">24 de Outubro</h3>
                                <p className="text-sm font-bold text-[#CCFF00]">14:00h</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 py-4 border-t border-white/10">
                            <img src="https://i.pravatar.cc/100?u=Ale" alt="Prof" className="w-10 h-10 rounded-2xl object-cover" />
                            <div className="flex-1">
                                <p className="text-[10px] font-bold text-slate-500 uppercase">Profissional Responsável</p>
                                <p className="text-sm font-black text-white">Alê - Mentor</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 py-4 text-slate-400">
                            <MapPin size={16} />
                            <p className="text-xs font-bold">Sala 03 - Unidade Centro</p>
                        </div>

                        <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
                            <button className="flex-1 h-12 rounded-xl border border-[#CCFF00] text-[#CCFF00] font-black text-[10px] uppercase tracking-wider hover:bg-[#CCFF00]/10 transition-all">Reagendar</button>
                            <button className="flex-1 h-12 rounded-xl text-slate-500 font-black text-[10px] uppercase tracking-wider hover:text-red-500 hover:bg-white/5 transition-all">Cancelar</button>
                        </div>
                    </div>
                ) : (
                    <div className={`${textureCardClass} rounded-[2.5rem] p-8 flex flex-col items-center text-center overflow-hidden relative group`}>
                        {/* Decorative Background Element */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#CCFF00]/10 rounded-full blur-3xl group-hover:bg-[#CCFF00]/20 transition-all duration-700"></div>

                        <div className="w-20 h-20 bg-[#CCFF00]/10 rounded-full flex items-center justify-center mb-6 relative border border-[#CCFF00]/20">
                            <CalendarPlus size={32} className="text-[#CCFF00]" strokeWidth={2.5} />
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#CCFF00] text-black rounded-full flex items-center justify-center text-[10px] font-black animate-bounce shadow-lg">!</div>
                        </div>

                        <h3 className="text-xl font-black text-white leading-tight mb-3 px-4">
                            Sua agenda está <span className="text-[#CCFF00]">vazia...</span>
                        </h3>

                        <p className="text-xs font-medium text-slate-400 leading-relaxed mb-8 px-6">
                            Você foi <span className="text-[#CCFF00] font-black">escolhido</span> para uma oferta imperdível! Que tal agendar sua próxima avaliação agora e garantir um <span className="font-black text-white">bônus exclusivo</span>?
                        </p>

                        <Button
                            onClick={() => navigate('/schedule')}
                            className="w-full h-14 rounded-2xl bg-[#CCFF00] text-black font-black text-xs gap-3 shadow-lg shadow-[#CCFF00]/20 hover:scale-[1.02] transition-all hover:bg-white"
                        >
                            <CalendarPlus size={18} strokeWidth={3} />
                            NOVO AGENDAMENTO
                        </Button>
                    </div>
                )}
            </div>

            {/* Middle New Appointment Button - Only shown if there are active appointments */}
            {upcomingAppointments.length > 0 && (
                <div className="mb-10 relative z-10">
                    <Button
                        onClick={() => navigate('/schedule')}
                        className="w-full h-16 rounded-[2rem] bg-[#CCFF00] text-black font-black gap-3 shadow-lg shadow-[#CCFF00]/20 hover:scale-[1.02] transition-all hover:bg-white"
                    >
                        <CalendarPlus size={22} strokeWidth={3} />
                        NOVO AGENDAMENTO
                    </Button>
                </div>
            )}

            {/* History Section */}
            <div className="space-y-4 relative z-10">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2 mb-4">Histórico de Avaliações</p>

                {history.length > 0 ? (
                    history.map((item, idx) => (
                        <div key={idx} className={`${textureCardClass} p-4 rounded-3xl flex items-center gap-4 hover:border-[#CCFF00]/30 transition-colors`}>
                            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border border-white/5", item.iconColor)}>
                                <item.icon size={22} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xs font-black text-white">{item.title}</h3>
                                <p className="text-[10px] text-slate-500 font-bold">{item.date}</p>
                            </div>
                            <div className="flex flex-col items-end gap-2 text-right">
                                <span className={cn("text-[7px] font-black px-2 py-0.5 rounded-md uppercase", item.statusColor)}>
                                    {item.status}
                                </span>
                                <button className="text-[9px] font-black text-[#CCFF00] hover:underline">Ver Detalhes</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-white/5 p-8 rounded-3xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center hover:bg-white/10 transition-colors">
                        <p className="text-xs font-bold text-slate-500 italic">Ainda não há histórico de Avaliações.</p>
                    </div>
                )}
            </div>

            <BottomNav />
        </FluidBackground>
    );
};
