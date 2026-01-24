import React, { useState } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    Clock,
    X,
    Lock,
    Settings,
    Activity,
    AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

export const ProfessionalAgenda: React.FC = () => {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showConfig, setShowConfig] = useState(false);
    const [view, setView] = useState<'daily' | 'monthly'>('daily');
    const [confirmBlock, setConfirmBlock] = useState<{ show: boolean, hour: number | null }>({ show: false, hour: null });
    const [delayModal, setDelayModal] = useState<{ show: boolean, hour: number | null }>({ show: false, hour: null });
    const [blockedSlots, setBlockedSlots] = useState<number[]>([]);

    const handleBlockSlot = () => {
        if (confirmBlock.hour !== null) {
            setBlockedSlots([...blockedSlots, confirmBlock.hour]);
            setConfirmBlock({ show: false, hour: null });
        }
    };

    const handleDelaySlot = () => {
        // Logic to notify system of delay
        setDelayModal({ show: false, hour: null });
        alert('Atraso comunicado ao paciente com sucesso.'); // Simplified for now
    };

    const weekDays = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const timeSlots = Array.from({ length: 13 }, (_, i) => i + 8); // 8:00 to 20:00

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const changeMonth = (delta: number) => {
        const newDate = new Date(selectedDate);
        newDate.setMonth(newDate.getMonth() + delta);
        setSelectedDate(newDate);
    };

    const renderMonthView = () => {
        const daysInMonth = getDaysInMonth(selectedDate);
        const firstDay = getFirstDayOfMonth(selectedDate);
        const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
        const blanks = Array.from({ length: firstDay }, (_, i) => i);

        return (
            <div className="bg-black/40 backdrop-blur-3xl p-6 rounded-[2.5rem] border border-[#39FF14]/20 animate-in slide-in-from-left-4 duration-500 shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                    <button onClick={() => changeMonth(-1)} className="p-3 hover:bg-white/10 rounded-full transition-all text-slate-400 active:scale-95 group">
                        <ChevronLeft size={24} className="group-hover:text-white" />
                    </button>
                    <h2 className="text-xl font-bold text-white uppercase tracking-tight">
                        {months[selectedDate.getMonth()]} <span className="text-[#39FF14] drop-shadow-sm">{selectedDate.getFullYear()}</span>
                    </h2>
                    <button onClick={() => changeMonth(1)} className="p-3 hover:bg-white/10 rounded-full transition-all text-slate-400 active:scale-95 group">
                        <ChevronRight size={24} className="group-hover:text-white" />
                    </button>
                </div>

                <div className="grid grid-cols-7 gap-3 mb-4">
                    {weekDays.map(day => (
                        <div key={day} className="text-center text-[10px] font-black text-gray-500 uppercase tracking-widest py-2">
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-3">
                    {blanks.map(blank => <div key={`blank-${blank}`} className="h-16"></div>)}
                    {days.map(day => {
                        const isToday = day === new Date().getDate() && selectedDate.getMonth() === new Date().getMonth();
                        const fullDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
                        const isSelected = day === selectedDate.getDate();
                        const hasEvent = Math.random() > 0.8;

                        return (
                            <button
                                key={day}
                                onClick={() => { setSelectedDate(fullDate); setView('daily'); }}
                                className={cn(
                                    "h-16 rounded-2xl flex flex-col items-center justify-center transition-all border relative",
                                    isToday ? "bg-[#39FF14] text-black border-[#39FF14] shadow-lg shadow-[#39FF14]/20" :
                                        isSelected ? "bg-white/10 border-white/20 text-white" : "bg-white/5 border-transparent text-slate-500 hover:bg-white/10 hover:text-white"
                                )}
                            >
                                <span className={cn(
                                    "text-sm font-bold",
                                    isToday ? "text-black" : isSelected ? "text-white" : "text-slate-500 group-hover:text-white"
                                )}>
                                    {day}
                                </span>
                                {hasEvent && <div className={cn("absolute bottom-2 w-1.5 h-1.5 rounded-full", isToday ? "bg-black" : "bg-[#FBBF24]")}></div>}
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    };

    const renderDailyView = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-32">
            <div className="flex items-center justify-between mb-8 px-2">
                <div onClick={() => setView('monthly')} className="cursor-pointer group">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#39FF14] rounded-2xl flex items-center justify-center text-black border border-[#39FF14] group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(57,255,20,0.3)]">
                            <CalendarIcon size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white leading-none uppercase tracking-tighter">Agenda</h2>
                            <p className="text-slate-400 text-[10px] mt-1.5 font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                                {selectedDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setView(view === 'daily' ? 'monthly' : 'daily')}
                        className="px-5 h-12 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all text-[10px] font-bold uppercase tracking-widest backdrop-blur-md"
                    >
                        {view === 'daily' ? 'Mês' : 'Dia'}
                    </button>
                    <button
                        onClick={() => setShowConfig(true)}
                        className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/20 transition-all active:scale-90 shadow-xl backdrop-blur-xl"
                    >
                        <Settings size={22} />
                    </button>
                </div>
            </div>

            {/* Cleaned Up Daily Schedule */}
            <div className="space-y-3">
                {timeSlots.map((hour) => {
                    const timeString = `${hour.toString().padStart(2, '0')}:00`;
                    const isLunch = hour === 12;
                    const isUserBlocked = blockedSlots.includes(hour);
                    const isBooked = !isLunch && !isUserBlocked && Math.random() > 0.8;

                    return (
                        <div key={hour} className="flex group items-stretch min-h-[5rem]">
                            <div className="w-16 text-right pr-4 py-4 shrink-0 flex flex-col items-end justify-start">
                                <span className="text-xs font-bold text-white tracking-wider">{timeString}</span>
                            </div>

                            <div className="flex-1 relative">
                                {isLunch ? (
                                    <div className="h-full rounded-[1.5rem] border border-white/5 bg-white/5 flex items-center px-6 gap-3 opacity-50">
                                        <Clock size={16} className="text-slate-400" />
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pausa de Almoço</span>
                                    </div>
                                ) : isUserBlocked ? (
                                    <div className="h-full rounded-[1.5rem] border border-red-900/30 bg-red-900/10 flex items-center px-6 gap-3 relative overflow-hidden group/blocked">
                                        <div className="absolute inset-0 pattern-diagonal-lines opacity-10"></div>
                                        <Lock size={16} className="text-red-500" />
                                        <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Bloqueado</span>
                                        <button
                                            onClick={() => setBlockedSlots(prev => prev.filter(h => h !== hour))}
                                            className="ml-auto w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 opacity-0 group-hover/blocked:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ) : isBooked ? (
                                    <div
                                        onClick={() => navigate(`/appointment/${hour}`)}
                                        className="h-full rounded-[1.5rem] bg-[#0A1F0A] border border-[#39FF14]/20 p-3 pr-4 flex items-center justify-between relative overflow-hidden group/card shadow-lg transition-all hover:bg-[#0F2F0F] cursor-pointer"
                                        style={{ boxShadow: '0 0 20px rgba(57, 255, 20, 0.05)' }}
                                    >
                                        <div className="w-1.5 h-full absolute left-0 top-0 bg-[#39FF14]"></div>

                                        {/* Profile Section */}
                                        <div className="flex items-center gap-4 z-10 pl-3">
                                            <div className="w-14 h-14 rounded-2xl bg-black/40 border border-[#39FF14]/30 p-0.5 relative shrink-0">
                                                <img src={`https://i.pravatar.cc/150?u=${hour}`} className="w-full h-full rounded-[0.7rem] object-cover" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white text-base leading-tight">João Silva</h4>
                                                <p className="text-[10px] text-[#39FF14] font-bold uppercase tracking-widest mt-0.5 opacity-90">Avaliação Física</p>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex items-center gap-3 z-10">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); navigate('/assessment'); }}
                                                className="h-10 w-10 rounded-xl bg-[#39FF14] text-black flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-[0_0_15px_rgba(57,255,20,0.4)]"
                                                title="Iniciar"
                                            >
                                                <Activity size={20} strokeWidth={2.5} />
                                            </button>

                                            <button
                                                onClick={(e) => { e.stopPropagation(); setDelayModal({ show: true, hour }); }}
                                                className="h-10 w-10 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all active:scale-95"
                                                title="Adiar"
                                            >
                                                <Clock size={20} />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => setConfirmBlock({ show: true, hour })}
                                        className="h-full rounded-[1.5rem] border border-dashed border-white/10 hover:border-[#FBBF24]/50 bg-transparent hover:bg-[#FBBF24]/5 transition-all cursor-pointer flex items-center justify-between px-6 group/available"
                                    >
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest group-hover/available:text-[#FBBF24] transition-colors">Horário Livre</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] text-[#FBBF24] opacity-0 group-hover/available:opacity-100 transition-opacity font-bold uppercase tracking-wider hidden sm:block">
                                                Bloquear
                                            </span>
                                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-500 group-hover/available:text-[#FBBF24] group-hover/available:bg-[#FBBF24]/10 transition-all">
                                                <Lock size={14} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* DELAY MODAL */}
            {delayModal.show && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#111] border border-white/10 rounded-[2rem] p-8 w-full max-w-sm shadow-2xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-[#FBBF24]/5 pointer-events-none"></div>
                        <div className="w-16 h-16 bg-[#FBBF24]/10 rounded-full flex items-center justify-center mb-6 mx-auto text-[#FBBF24] border border-[#FBBF24]/20 shadow-[0_0_20px_rgba(251,191,36,0.2)]">
                            <Clock size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-white text-center mb-2">Informar Atraso</h3>
                        <p className="text-center text-slate-400 text-sm mb-8 leading-relaxed">
                            Isso notificará o paciente agendado para as <span className="text-white font-bold">{delayModal.hour?.toString().padStart(2, '0')}:00</span> sobre um possível atraso.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDelayModal({ show: false, hour: null })}
                                className="flex-1 py-4 rounded-xl bg-white/5 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDelaySlot}
                                className="flex-1 py-4 rounded-xl bg-[#FBBF24] text-black font-bold text-xs uppercase tracking-widest hover:bg-[#f59e0b] transition-colors shadow-lg shadow-[#FBBF24]/20"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* BLOCK MODAL */}
            {confirmBlock.show && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#111] border border-white/10 rounded-[2rem] p-8 w-full max-w-sm shadow-2xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-red-500/5 pointer-events-none"></div>
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6 mx-auto text-red-500 border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                            <Lock size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-white text-center mb-2">Bloquear Horário?</h3>
                        <p className="text-center text-slate-400 text-sm mb-8 leading-relaxed">
                            Você está prestes a bloquear o horário das <span className="text-white font-bold">{confirmBlock.hour?.toString().padStart(2, '0')}:00</span>. Nenhum paciente poderá agendar.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setConfirmBlock({ show: false, hour: null })}
                                className="flex-1 py-4 rounded-xl bg-white/5 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleBlockSlot}
                                className="flex-1 py-4 rounded-xl bg-red-600 text-white font-bold text-xs uppercase tracking-widest hover:bg-red-500 transition-colors shadow-lg shadow-red-600/20"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
