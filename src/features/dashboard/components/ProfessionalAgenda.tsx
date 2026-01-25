import React, { useState, useEffect } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    Clock,
    X,
    Lock,
    Settings,
    Activity,
    AlertTriangle,
    Save,
    Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Toast } from '@/components/ui/Toast';
import { Loader } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const ProfessionalAgenda: React.FC = () => {
    const navigate = useNavigate();
    const { userProfile: profile, session } = useAuth();

    // States
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [view, setView] = useState<'daily' | 'monthly'>('daily');
    const [loading, setLoading] = useState(false);

    // Modals
    const [showConfig, setShowConfig] = useState(false);
    const [confirmBlock, setConfirmBlock] = useState<{ show: boolean, time: string | null }>({ show: false, time: null });
    const [delayModal, setDelayModal] = useState<{ show: boolean, hour: number | null }>({ show: false, hour: null });

    // Data
    const [availability, setAvailability] = useState<any[]>([]);
    const [appointments, setAppointments] = useState<any[]>([]);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' | 'info' });
    const [loadingDelay, setLoadingDelay] = useState(false);
    const [loadingDaily, setLoadingDaily] = useState(false);

    // Initial Data Fetch
    useEffect(() => {
        if (session?.user.id) {
            fetchAvailability();
        }
    }, [session?.user.id]);

    useEffect(() => {
        if (session?.user.id && view === 'daily') {
            fetchAppointments();

            // Realtime Channel
            const channel = supabase
                .channel('agenda-changes')
                .on('postgres_changes', {
                    event: '*',
                    schema: 'public',
                    table: 'appointments',
                    filter: `professional_id=eq.${session.user.id}`
                }, () => {
                    console.log('Realtime change detected, refreshing agenda...');
                    fetchAppointments();
                })
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        }
    }, [session?.user.id, selectedDate, view]);

    const fetchAvailability = async () => {
        try {
            const { data, error } = await supabase
                .from('professional_availability')
                .select('*')
                .eq('professional_id', session?.user.id);

            if (data && data.length > 0) {
                setAvailability(data);
            } else {
                // Default settings if none exist
                setAvailability([
                    { day_of_week: 1, start_time: '08:00:00', end_time: '18:00:00', is_active: true },
                    { day_of_week: 2, start_time: '08:00:00', end_time: '18:00:00', is_active: true },
                    { day_of_week: 3, start_time: '08:00:00', end_time: '18:00:00', is_active: true },
                    { day_of_week: 4, start_time: '08:00:00', end_time: '18:00:00', is_active: true },
                    { day_of_week: 5, start_time: '08:00:00', end_time: '18:00:00', is_active: true },
                ]);
            }
        } catch (error) {
            console.error('Error fetching availability:', error);
        }
    };

    const fetchAppointments = async () => {
        if (!session?.user.id) return;
        setLoadingDaily(true);
        try {
            const dayStart = new Date(selectedDate);
            dayStart.setHours(0, 0, 0, 0);
            const dayEnd = new Date(selectedDate);
            dayEnd.setHours(23, 59, 59, 999);

            const { data, error } = await supabase
                .from('appointments')
                .select('id, start_time, end_time, status, notes, patient_id')
                .eq('professional_id', session.user.id)
                .in('status', ['confirmed', 'blocked'])
                .gte('start_time', dayStart.toISOString())
                .lte('start_time', dayEnd.toISOString());

            if (error) {
                console.error('Fetch error:', error);
                return;
            }

            if (data && data.length > 0) {
                console.log('Appointments fetched:', data.length);
                const { data: profiles } = await supabase
                    .from('profiles')
                    .select('id, full_name, avatar_url, gender')
                    .in('id', data.map(a => a.patient_id).filter(Boolean));

                const combined = data.map(app => ({
                    ...app,
                    patient: profiles?.find(p => p.id === app.patient_id) || null
                }));
                setAppointments(combined);
            } else {
                setAppointments([]);
            }
        } catch (error) {
            console.error('Error fetching appointments:', error);
        } finally {
            setLoadingDaily(false);
        }
    };

    const saveAvailability = async () => {
        setLoading(true);
        try {
            // Delete existing (simple replace strategy for MVP)
            await supabase.from('professional_availability').delete().eq('professional_id', session?.user.id);

            // Insert new
            const toInsert = availability.filter(a => a.is_active).map(a => ({
                professional_id: session?.user.id,
                day_of_week: a.day_of_week,
                start_time: a.start_time,
                end_time: a.end_time,
                is_active: true
            }));

            const { error } = await supabase.from('professional_availability').insert(toInsert);

            if (error) throw error;
            setToast({ show: true, message: 'Disponibilidade salva com sucesso!', type: 'success' });
            setShowConfig(false);
        } catch (error) {
            setToast({ show: true, message: 'Erro ao salvar disponibilidade.', type: 'error' });
            console.error(error);
        } finally {
            setLoading(false);
        }
    };


    const handleBlockSlot = async () => {
        if (confirmBlock.time !== null && session?.user.id) {
            setLoading(true);
            try {
                const [h, m] = confirmBlock.time.split(':').map(Number);
                const start = new Date(selectedDate);
                start.setHours(h, m, 0, 0);

                const end = new Date(start.getTime() + 15 * 60000);

                const { error } = await supabase.from('appointments').insert({
                    professional_id: session.user.id,
                    start_time: start.toISOString(),
                    end_time: end.toISOString(),
                    status: 'blocked',
                    notes: 'Horário bloqueado manualmente pelo profissional'
                });

                if (error) throw error;

                setToast({ show: true, message: `Horário das ${confirmBlock.time} bloqueado com sucesso.`, type: 'info' });
                setConfirmBlock({ show: false, time: null });
                fetchAppointments(); // Refresh
            } catch (error) {
                console.error(error);
                setToast({ show: true, message: 'Erro ao bloquear horário.', type: 'error' });
            } finally {
                setLoading(false);
            }
        }
    };

    const handleDelaySlot = async () => {
        if (delayModal.hour === null) return;
        setLoadingDelay(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));

            if (session?.user.id) {
                await supabase.from('notifications').insert({
                    user_id: session.user.id, // For demo, notifies self. In real app, would query appointment -> patient_id
                    title: 'Atraso Comunicado',
                    message: `O paciente agendado para as ${delayModal.hour}:00 foi notificado sobre o atraso.`,
                    type: 'info',
                    read: false
                });
            }

            setToast({ show: true, message: 'Paciente notificado com sucesso!', type: 'success' });
            setDelayModal({ show: false, hour: null });
        } catch (error) {
            console.error(error);
            setToast({ show: true, message: 'Erro ao comunicar atraso.', type: 'error' });
        } finally {
            setLoadingDelay(false);
        }
    };

    const weekDays = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    // 15-minute intervals from 08:00 to 20:00
    const timeSlots = [];
    for (let h = 8; h < 20; h++) {
        for (let m = 0; m < 60; m += 15) {
            timeSlots.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
        }
    }

    // ... Helper functions (same as before) ...
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

    // Render Logic
    const renderConfigModal = () => (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#111] border border-white/10 rounded-[2rem] p-6 w-full max-w-md shadow-2xl h-[80vh] flex flex-col">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Configurar Agenda</h3>
                    <button onClick={() => setShowConfig(false)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6">
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Dias de Atendimento</h4>
                        <div className="space-y-2">
                            {weekDays.map((day, idx) => {
                                const isActive = availability.some(a => a.day_of_week === idx && a.is_active);
                                const availableConfig = availability.find(a => a.day_of_week === idx);

                                return (
                                    <div key={day} className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/5">
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => {
                                                    const exists = availability.find(a => a.day_of_week === idx);
                                                    if (exists) {
                                                        setAvailability(availability.filter(a => a.day_of_week !== idx));
                                                    } else {
                                                        setAvailability([...availability, { day_of_week: idx, start_time: '08:00', end_time: '18:00', is_active: true }]);
                                                    }
                                                }}
                                                className={cn("w-6 h-6 rounded-lg flex items-center justify-center transition-all", isActive ? "bg-[#39FF14] text-black" : "bg-white/10 text-transparent")}
                                            >
                                                <Check size={14} strokeWidth={4} />
                                            </button>
                                            <span className={cn("text-sm font-bold", isActive ? "text-white" : "text-slate-600")}>{day}</span>
                                        </div>
                                        {isActive && (
                                            <div className="flex items-center gap-2 text-xs">
                                                <span className="text-slate-400">08:00 - 18:00</span>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                <div className="pt-4 mt-4 border-t border-white/10">
                    <button
                        onClick={saveAvailability}
                        disabled={loading}
                        className="w-full py-4 bg-[#39FF14] hover:bg-[#32d411] text-black font-bold uppercase tracking-widest rounded-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader className="animate-spin" /> : <><Save size={18} /> Salvar Disponibilidade</>}
                    </button>
                </div>
            </div>
        </div>
    );

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

            {/* Daily Schedule - Visualizing Availability */}
            <div className="space-y-2">
                {timeSlots.map((timeString) => {
                    const hour = parseInt(timeString.split(':')[0]);
                    const dayOfWeek = selectedDate.getDay();

                    // Check availability from Config
                    const dayConfig = availability.find(a => a.day_of_week === dayOfWeek && a.is_active);
                    const isLunch = hour === 12;

                    // Matching Logic for Manual Blocks in UI
                    const dbBlocked = appointments.find(a => a.status === 'blocked' && format(new Date(a.start_time), 'HH:mm') === timeString);
                    const isUserBlocked = !!dbBlocked;

                    let isOpen = false;
                    if (dayConfig) {
                        const start = parseInt(dayConfig.start_time.split(':')[0]);
                        const end = parseInt(dayConfig.end_time.split(':')[0]);
                        if (hour >= start && hour < end) isOpen = true;
                    }

                    // Matching logic: Does an appointment start at this exact time?
                    const slotBookings = appointments.filter(a => {
                        const appTime = format(new Date(a.start_time), 'HH:mm');
                        return appTime === timeString;
                    });

                    // PRINTED STYLE HELPERS
                    const isHourMark = timeString.endsWith(':00');


                    return (
                        <div key={timeString} className={cn("flex group items-stretch relative", isHourMark ? "border-t border-white/10 mt-1 pt-1" : "border-t border-white/5")}>
                            <div className="w-16 text-right pr-4 py-3 shrink-0 flex flex-col items-end justify-start relative">
                                {isHourMark && <div className="absolute right-0 top-0 w-2 h-[1px] bg-[#CCFF00]"></div>}
                                <span className={cn("text-[10px] font-bold tracking-wider font-mono", isHourMark ? "text-white scale-110" : "text-slate-600")}>
                                    {timeString}
                                </span>
                            </div>

                            <div className="flex-1 relative space-y-1 pb-1 min-h-[3.5rem]">
                                {/* Background Grid Lines */}
                                <div className="absolute inset-0 border-l border-white/5 pointer-events-none"></div>

                                {!isOpen ? (
                                    <div className="h-full w-full bg-[linear-gradient(45deg,rgba(0,0,0,0.5)_25%,transparent_25%,transparent_50%,rgba(0,0,0,0.5)_50%,rgba(0,0,0,0.5)_75%,transparent_75%,transparent)] bg-[length:10px_10px] opacity-20 flex items-center justify-center">

                                    </div>
                                ) : isLunch ? (
                                    <div className="h-full w-full bg-white/5 flex items-center px-4 gap-3">
                                        <Clock size={12} className="text-slate-500" />
                                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Almoço / Pausa</span>
                                    </div>
                                ) : isUserBlocked ? (
                                    <div className="h-full w-full bg-red-900/10 border-l-2 border-red-500 flex items-center px-4 gap-3 relative group/blocked">
                                        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,rgba(239,68,68,0.05)_5px,rgba(239,68,68,0.05)_10px)] pointer-events-none"></div>
                                        <Lock size={12} className="text-red-500 opacity-60" />
                                        <span className="text-[9px] font-bold text-red-500 opacity-60 uppercase tracking-widest">BLOQUEADO</span>
                                        <button
                                            onClick={async (e) => {
                                                e.stopPropagation();
                                                const record = appointments.find(a => a.status === 'blocked' && format(new Date(a.start_time), 'HH:mm') === timeString);
                                                if (record) {
                                                    await supabase.from('appointments').delete().eq('id', record.id);
                                                    fetchAppointments();
                                                }
                                            }}
                                            className="ml-auto w-6 h-6 rounded-md bg-red-500 text-white flex items-center justify-center opacity-0 group-hover/blocked:opacity-100 transition-opacity z-10 hover:bg-red-400"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ) : slotBookings.length > 0 ? (
                                    slotBookings.map(booked => (
                                        <div
                                            key={booked.id}
                                            onClick={() => navigate(`/appointment/${booked.id}`)}
                                            className="h-full w-full bg-[#CCFF00] text-black border-l-4 border-white p-3 flex items-center justify-between relative shadow-lg hover:brightness-110 cursor-pointer transition-all"
                                        >
                                            <div className="flex items-center gap-3 z-10">
                                                <div className="w-8 h-8 rounded-full bg-black/10 border border-black/10 p-0.5 shrink-0 overflow-hidden">
                                                    <img
                                                        src={booked.patient?.avatar_url || `https://ui-avatars.com/api/?name=${booked.patient?.full_name || 'P'}&background=random&color=fff`}
                                                        className="w-full h-full rounded-full object-cover grayscale"
                                                    />
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-black text-xs leading-none uppercase tracking-tight">
                                                        {booked.patient?.full_name || 'Paciente'}
                                                    </h4>
                                                    <p className="text-[9px] text-black/60 font-bold uppercase tracking-widest mt-0.5">
                                                        {booked.notes?.includes('Individualizada') ? 'Consultoria' : 'Avaliação'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 z-10 opacity-70">
                                                <Activity size={16} strokeWidth={2.5} />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div
                                        onClick={() => setConfirmBlock({ show: true, time: timeString })}
                                        className="h-full w-full hover:bg-white/5 transition-colors cursor-pointer flex items-center px-4 group/available"
                                    >
                                        <div className="w-full h-[1px] bg-white/5 group-hover/available:bg-white/10"></div>
                                        <span className="absolute right-4 text-[8px] font-bold text-slate-700 uppercase tracking-widest opacity-0 group-hover/available:opacity-100 transition-opacity">Disponível</span>
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
                                disabled={loadingDelay}
                                className="flex-1 py-4 rounded-xl bg-[#FBBF24] text-black font-bold text-xs uppercase tracking-widest hover:bg-[#f59e0b] transition-colors shadow-lg shadow-[#FBBF24]/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loadingDelay ? <Loader size={16} className="animate-spin" /> : 'Confirmar'}
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
                            Você está prestes a bloquear o horário de <span className="text-white font-bold">{confirmBlock.time}</span>. Nenhum paciente poderá agendar.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setConfirmBlock({ show: false, time: null })}
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

    return (
        <div className="h-full">
            {view === 'monthly' ? renderMonthView() : renderDailyView()}
            {showConfig && renderConfigModal()}
            <Toast isVisible={toast.show} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />
        </div>
    );
};
