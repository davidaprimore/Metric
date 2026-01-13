import React from 'react';
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

    return (
        <div className="min-h-screen bg-[#F1F3F5] pb-32 font-sans px-5">
            {/* Header omitted for brevity in diff, but kept in full file */}
            <header className="pt-8 flex justify-between items-center mb-10">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm"
                >
                    <ChevronLeft size={24} className="text-dark" />
                </button>
                <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-200 pb-0.5 mb-1">Painel do Atleta</span>
                    <h1 className="text-lg font-extrabold text-dark tracking-tight">
                        Meus <span className="text-secondary">Agendamentos</span>
                    </h1>
                </div>
                <button className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm relative">
                    <Bell size={20} fill="currentColor" className="text-dark" />
                    <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-secondary rounded-full border-2 border-white"></div>
                </button>
            </header>

            {/* Upcoming Appointment Section */}
            <div className="mb-10">
                <div className="flex justify-between items-center mb-4">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Próximo Agendamento</p>
                </div>

                {upcomingAppointments.length > 0 ? (
                    <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100/50">
                        <div className="flex gap-4 mb-6">
                            <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex flex-col items-center justify-center shrink-0">
                                <CalendarIcon size={20} className="text-secondary" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-black text-dark leading-tight">24 de Outubro</h3>
                                <p className="text-sm font-bold text-secondary">14:00h</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 py-4 border-t border-gray-50">
                            <img src="https://i.pravatar.cc/100?u=Ale" alt="Prof" className="w-10 h-10 rounded-2xl object-cover" />
                            <div className="flex-1">
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Profissional Responsável</p>
                                <p className="text-sm font-black text-dark">Alê - Mentor</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 py-4 text-gray-400">
                            <MapPin size={16} />
                            <p className="text-xs font-bold">Sala 03 - Unidade Centro</p>
                        </div>

                        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-50">
                            <button className="flex-1 h-12 rounded-xl border border-secondary text-secondary font-black text-[10px] uppercase tracking-wider hover:bg-secondary/5 transition-all">Reagendar</button>
                            <button className="flex-1 h-12 rounded-xl text-gray-400 font-black text-[10px] uppercase tracking-wider hover:text-red-500 transition-all">Cancelar</button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100/50 flex flex-col items-center text-center overflow-hidden relative">
                        {/* Decorative Background Element */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>

                        <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-6 relative">
                            <CalendarPlus size={32} className="text-dark" strokeWidth={2.5} />
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-secondary text-white rounded-full flex items-center justify-center text-[10px] font-black animate-bounce shadow-lg">!</div>
                        </div>

                        <h3 className="text-xl font-black text-dark leading-tight mb-3 px-4">
                            Sua agenda está <span className="text-secondary">vazia...</span>
                        </h3>

                        <p className="text-xs font-medium text-gray-500 leading-relaxed mb-8 px-6">
                            Você foi <span className="text-secondary font-black">escolhido</span> para uma oferta imperdível! Que tal agendar sua próxima avaliação agora e garantir um <span className="font-black text-dark">bônus exclusivo</span>?
                        </p>

                        <Button
                            onClick={() => navigate('/schedule')}
                            className="w-full h-14 rounded-2xl bg-primary text-dark font-black text-xs gap-3 shadow-md shadow-primary/20 hover:scale-[1.02] transition-all"
                        >
                            <CalendarPlus size={18} strokeWidth={3} />
                            NOVO AGENDAMENTO
                        </Button>
                    </div>
                )}
            </div>

            {/* History Section */}
            <div className="space-y-4">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2 mb-4">Histórico de Avaliações</p>

                {history.length > 0 ? (
                    history.map((item, idx) => (
                        <div key={idx} className="bg-white p-4 rounded-3xl flex items-center gap-4 border border-gray-50 shadow-sm">
                            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", item.iconColor)}>
                                <item.icon size={22} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xs font-black text-dark">{item.title}</h3>
                                <p className="text-[10px] text-gray-400 font-bold">{item.date}</p>
                            </div>
                            <div className="flex flex-col items-end gap-2 text-right">
                                <span className={cn("text-[7px] font-black px-2 py-0.5 rounded-md uppercase", item.statusColor)}>
                                    {item.status}
                                </span>
                                <button className="text-[9px] font-black text-secondary hover:underline">Ver Detalhes</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-white/50 p-8 rounded-3xl border border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
                        <p className="text-xs font-bold text-gray-400 italic">Ainda não há histórico de Avaliações.</p>
                    </div>
                )}
            </div>

            {/* New Appointment FAB */}
            <div className="mt-10">
                <Button
                    className="w-full h-16 rounded-[2rem] bg-primary text-dark font-black gap-3 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
                >
                    <CalendarPlus size={22} strokeWidth={3} />
                    NOVO AGENDAMENTO
                </Button>
            </div>

            <BottomNav />
        </div>
    );
};
