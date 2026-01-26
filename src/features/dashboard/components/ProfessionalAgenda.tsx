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
    Save,
    Check,
    Bell,
    Plus,
    Trash2,
    Disc,
    MessageCircle,
    Play
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Toast } from '@/components/ui/Toast';
import { Loader } from 'lucide-react';
import { format, isSameDay, isBefore, isAfter, eachDayOfInterval, startOfDay, endOfDay, isSameMinute, parse, subMinutes } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Patient {
    id?: string;
    full_name: string;
    avatar_url: string | null;
    gender?: string;
}

interface Appointment {
    id: string;
    start_time: string;
    end_time: string;
    status: 'confirmed' | 'blocked' | 'pending' | 'cancelled';
    notes?: string;
    patient_id: string | null;
    patient?: Patient | null;
}

// Inline Custom Switch (Yellow Standard)
const CustomSwitch = ({ checked, onCheckedChange }: { checked: boolean; onCheckedChange: (c: boolean) => void }) => (
    <button
        onClick={() => onCheckedChange(!checked)}
        className={cn(
            "w-12 h-7 rounded-full relative transition-all duration-300 focus:outline-none",
            checked ? "bg-[#D4AF37]" : "bg-white/10"
        )}
    >
        <div className={cn(
            "absolute top-1 w-5 h-5 rounded-full transition-all duration-300 shadow-sm",
            checked ? "right-1 bg-black" : "left-1 bg-slate-500"
        )}></div>
    </button>
);

export const ProfessionalAgenda: React.FC = () => {
    // Helper for time rounding
    const roundTime = (time: string) => {
        if (!time) return '00:00';
        let [h, m] = time.split(':').map(Number);

        // Clamp hours 0-23
        if (h < 0) h = 0;
        if (h > 23) h = 23;

        // Round minutes to nearest 15
        const remainder = m % 15;
        if (remainder < 8) {
            m = m - remainder;
        } else {
            m = m + (15 - remainder);
        }

        // Handle overflow
        if (m === 60) {
            m = 0;
            h = (h + 1) % 24;
        }

        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    };

    const navigate = useNavigate();
    const { userProfile: profile, session } = useAuth();

    // States
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [view, setView] = useState<'daily' | 'monthly'>('daily');
    const [loading, setLoading] = useState(false);

    // Config Modal States
    const [showConfig, setShowConfig] = useState(false);
    const [configTab, setConfigTab] = useState<'weekly' | 'dates'>('weekly');

    // Block / Notifications
    const [confirmBlock, setConfirmBlock] = useState<{ show: boolean, time: string | null }>({ show: false, time: null });
    const [showNotifications, setShowNotifications] = useState(false);

    // Data
    const [availability, setAvailability] = useState<any[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' | 'info' });
    const [loadingDaily, setLoadingDaily] = useState(false);

    // Save Logic States
    // dirtyDays tracks which days have unsaved changes [0-6]
    const [dirtyDays, setDirtyDays] = useState<number[]>([]);
    const [savingDay, setSavingDay] = useState<number | null>(null);
    const [justSavedDay, setJustSavedDay] = useState<number | null>(null);

    // Block Dates Logic
    const [blockMode, setBlockMode] = useState<'range' | 'single'>('range');
    const [blockRange, setBlockRange] = useState<{ start: Date | null, end: Date | null }>({ start: null, end: null });
    const [blockSingleDates, setBlockSingleDates] = useState<Date[]>([]);
    const [blockingDates, setBlockingDates] = useState(false);
    const [configDate, setConfigDate] = useState(new Date()); // Independent date for config calendar
    const [isPickerOpen, setIsPickerOpen] = useState(false); // New state for Month/Year picker

    // Initial Data Fetch
    useEffect(() => {
        if (session?.user.id) {
            fetchAvailability();
        }
    }, [session?.user.id]);

    useEffect(() => {
        if (session?.user.id && view === 'daily') {
            fetchAppointments();
            fetchNotifications();

            const channel = supabase
                .channel('agenda-changes')
                .on('postgres_changes', {
                    event: '*',
                    schema: 'public',
                    table: 'appointments',
                    filter: `professional_id=eq.${session.user.id}`
                }, () => {
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

            if (error) console.error('Fetch error:', error);

            const combinedData = (data || []) as Appointment[];

            if (combinedData.length > 0) {
                const realPatientIds = combinedData.map(a => a.patient_id).filter(id => id && !id.startsWith('mock-'));
                let profiles: any[] = [];
                if (realPatientIds.length > 0) {
                    const { data: profileData } = await supabase
                        .from('profiles')
                        .select('id, full_name, avatar_url, gender')
                        .in('id', realPatientIds);
                    profiles = profileData || [];
                }
                const combined = combinedData.map(app => ({
                    ...app,
                    patient: app.patient || profiles?.find(p => p.id === app.patient_id) || null
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

    // Unified: Fetch blocked dates for the relevant month view
    const [blockedDays, setBlockedDays] = useState<Appointment[]>([]);

    // Determine which date drives the blocked data (Config or Main)
    const monthRefDate = showConfig ? configDate : selectedDate;

    const fetchBlockedDates = async () => {
        if (!session?.user.id) return;

        // Range: First to Last day of the REFERENCE month
        const startOfMonth = new Date(monthRefDate.getFullYear(), monthRefDate.getMonth(), 1);
        const endOfMonth = new Date(monthRefDate.getFullYear(), monthRefDate.getMonth() + 1, 0);
        endOfMonth.setHours(23, 59, 59, 999);

        try {
            const { data, error } = await supabase
                .from('appointments')
                .select('id, start_time, end_time, status, notes')
                .eq('professional_id', session.user.id)
                .eq('notes', 'FULL_DAY_BLOCK') // Only interested in explicit blocks
                .gte('start_time', startOfMonth.toISOString())
                .lte('end_time', endOfMonth.toISOString());

            if (error) throw error;
            setBlockedDays(data || []);
        } catch (error) {
            console.error('Error fetching blocked dates:', error);
        }
    };

    // Trigger fetch on relevant changes (Config Toggle, Tab, Date Navigation)
    useEffect(() => {
        fetchBlockedDates();
    }, [showConfig, configTab, configDate.getMonth(), selectedDate.getMonth(), session?.user.id]); // Re-fetch when month changes in either view

    const fetchNotifications = async () => {
        // ... same functionality
        if (!session?.user.id) return;
        try {
            const { data } = await supabase.from('notifications').select('*').eq('user_id', session.user.id).eq('read', false);
            setNotifications(data || []);
        } catch (e) {
            console.error(e);
        }
    };

    // --- SAVE LOGIC ---
    const markDirty = (dayIdx: number) => {
        setJustSavedDay(null); // Clear "Saved" state if user edits
        if (!dirtyDays.includes(dayIdx)) {
            setDirtyDays(prev => [...prev, dayIdx]);
        }
    };

    const handleSaveDay = async (dayIdx: number) => {
        setSavingDay(dayIdx);
        try {
            // 1. Delete all for this Professional AND this Day
            // This ensures we don't have duplicates or old intervals.
            // NOTE: We must filter by day_of_week as well to avoid wiping other days!
            await supabase
                .from('professional_availability')
                .delete()
                .eq('professional_id', session?.user.id)
                .eq('day_of_week', dayIdx);

            // 2. Insert new slots for this day
            const slotsToInsert = availability
                .filter(a => a.day_of_week === dayIdx && a.is_active)
                .map(a => ({
                    professional_id: session?.user.id,
                    day_of_week: a.day_of_week,
                    start_time: a.start_time,
                    end_time: a.end_time,
                    is_active: true
                }));

            if (slotsToInsert.length > 0) {
                const { error } = await supabase.from('professional_availability').insert(slotsToInsert);
                if (error) {
                    if (error.code === '23505') { // Unique violation
                        throw new Error("DB_CONSTRAINT");
                    }
                    throw error;
                }
            }

            // Success Updates
            setDirtyDays(prev => prev.filter(d => d !== dayIdx)); // Remove from dirty
            setJustSavedDay(dayIdx); // Show checkmark
            setTimeout(() => setJustSavedDay(null), 3000);

        } catch (error: any) {
            console.error("Save failed:", error);
            if (error.message === "DB_CONSTRAINT") {
                setToast({
                    show: true,
                    message: 'ERRO DE BANCO: Execute o script fix_db_constraints.sql no Supabase!',
                    type: 'error'
                });
            } else {
                setToast({ show: true, message: `Erro ao salvar: ${error.message}`, type: 'error' });
            }
        } finally {
            setSavingDay(null);
        }
    };

    // --- MANIPULATION HANDLERS ---
    const toggleDay = (dayIdx: number) => {
        const isActive = availability.some(a => a.day_of_week === dayIdx && a.is_active);
        let newAvail;

        if (isActive) {
            // Deactivate: remove all slots for this day locally
            newAvail = availability.filter(a => a.day_of_week !== dayIdx);
        } else {
            // Activate: add default slots (08-12 and 13-20)
            newAvail = [
                ...availability,
                { day_of_week: dayIdx, start_time: '08:00', end_time: '12:00', is_active: true },
                { day_of_week: dayIdx, start_time: '13:00', end_time: '20:00', is_active: true }
            ];
        }

        setAvailability(newAvail);
        markDirty(dayIdx);
    };

    const addInterval = (dayIdx: number) => {
        const newSlot = { day_of_week: dayIdx, start_time: '08:00', end_time: '18:00', is_active: true };
        setAvailability([...availability, newSlot]);
        markDirty(dayIdx);
    };

    const removeInterval = (indexToRemove: number, dayIdx: number) => {
        // Find all slots for this day
        const daySlots = availability.filter(a => a.day_of_week === dayIdx);
        const slotToRemove = daySlots[indexToRemove];

        // Find index in global array
        const globalIndex = availability.indexOf(slotToRemove);
        if (globalIndex === -1) return;

        const newAvail = [...availability];
        newAvail.splice(globalIndex, 1);
        setAvailability(newAvail);
        markDirty(dayIdx);
    };

    const updateSlotTime = (slot: any, field: 'start_time' | 'end_time', value: string, dayIdx: number) => {
        const globalIndex = availability.indexOf(slot);
        if (globalIndex === -1) return;

        const newAvail = [...availability];
        newAvail[globalIndex] = { ...newAvail[globalIndex], [field]: value };
        setAvailability(newAvail);
        markDirty(dayIdx);
    };

    // --- DATE BLOCKING HANDLERS ---
    const handleDateSelect = (date: Date) => {
        if (blockMode === 'range') {
            if (!blockRange.start || (blockRange.start && blockRange.end)) {
                // Start new range
                setBlockRange({ start: date, end: null });
            } else {
                // Complete range (ensure start < end)
                if (isBefore(date, blockRange.start)) {
                    setBlockRange({ start: date, end: blockRange.start });
                } else {
                    setBlockRange({ ...blockRange, end: date });
                }
            }
        } else {
            // Toggle single date
            const exists = blockSingleDates.some(d => isSameDay(d, date));
            if (exists) {
                setBlockSingleDates(prev => prev.filter(d => !isSameDay(d, date)));
            } else {
                setBlockSingleDates(prev => [...prev, date]);
            }
        }
    };

    const handleClearSelection = () => {
        setBlockRange({ start: null, end: null });
        setBlockSingleDates([]);
    };

    const handleSaveBlockDates = async () => {
        let datesToBlock: Date[] = [];

        if (blockMode === 'range') {
            if (blockRange.start && blockRange.end) {
                datesToBlock = eachDayOfInterval({ start: blockRange.start, end: blockRange.end });
            }
        } else {
            datesToBlock = blockSingleDates;
        }

        if (datesToBlock.length === 0) return;

        setBlockingDates(true);
        try {
            const inserts = datesToBlock.map(date => ({
                professional_id: session?.user.id,
                start_time: startOfDay(date).toISOString(),
                end_time: endOfDay(date).toISOString(),
                status: 'confirmed', // To block availability
                notes: 'FULL_DAY_BLOCK'
            }));

            const { error } = await supabase.from('appointments').insert(inserts);

            if (error) throw error;

            setToast({ show: true, message: `${datesToBlock.length} dias bloqueados com sucesso!`, type: 'success' });
            handleClearSelection();
            fetchAppointments(); // Refresh main Daily view
            fetchBlockedDates(); // Refresh Config Month view
        } catch (error: any) {
            console.error(error);
            setToast({ show: true, message: 'Erro ao bloquear datas.', type: 'error' });
        } finally {
            setBlockingDates(false);
        }
    };

    // --- OTHER HANDLERS ---
    const handleBlockSlot = async () => {
        // ... (Keep existing block logic)
        if (!confirmBlock.time || !session?.user.id) return;

        const [h, m] = confirmBlock.time.split(':').map(Number);
        const start = new Date(selectedDate);
        start.setHours(h, m, 0, 0);
        const end = new Date(start.getTime() + 15 * 60000);

        try {
            await supabase.from('appointments').insert([{
                professional_id: session.user.id,
                start_time: start.toISOString(),
                end_time: end.toISOString(),
                status: 'confirmed',
                notes: 'BLOCK_MANUAL'
            }]);
            setToast({ show: true, message: `Horário bloqueado!`, type: 'info' });
            setConfirmBlock({ show: false, time: null });
            fetchAppointments();
        } catch (e: any) {
            setToast({ show: true, message: 'Erro ao bloquear.', type: 'error' });
        }
    };

    // Debug
    const handleDebugDB = async () => {
        // ... existing debug
    };

    // Consts
    const weekDays = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    const timeSlots = [];
    for (let h = 8; h < 20; h++) {
        for (let m = 0; m < 60; m += 15) {
            timeSlots.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
        }
    }

    // Helper functions
    const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    const changeMonth = (delta: number) => {
        const d = new Date(selectedDate);
        d.setMonth(d.getMonth() + delta);
        setSelectedDate(d);
    };
    const isBlocked = (appt: any) => appt.status === 'blocked' || (appt.status === 'confirmed' && appt.notes === 'BLOCK_MANUAL');


    // RENDERS
    const renderConfigScreen = () => (
        <div className="fixed inset-0 z-40 bg-[#0B1221]/25 backdrop-blur-sm overflow-y-auto pb-32 animate-in fade-in duration-300">
            {/* Header - Gradient Blue */}
            <div className="sticky top-0 z-40 px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between">
                <div>
                    <button
                        onClick={() => setShowConfig(false)}
                        className="flex items-center gap-2 text-slate-400 hover:text-[#D4AF37] transition-colors mb-1 group"
                    >
                        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] group-hover:text-[#D4AF37] transition-colors">Voltar para Agenda</span>
                    </button>
                    <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-tight leading-none">Minha Disponibilidade</h2>
                </div>
            </div>

            <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
                {/* Tabs */}
                <div className="flex gap-8 border-b border-[#222] px-2">
                    <button
                        onClick={() => setConfigTab('weekly')}
                        className={cn(
                            "pb-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-b-2",
                            configTab === 'weekly' ? "text-[#D4AF37] border-[#D4AF37]" : "text-slate-600 border-transparent hover:text-slate-400"
                        )}
                    >
                        Semana
                    </button>
                    <button
                        onClick={() => setConfigTab('dates')}
                        className={cn(
                            "pb-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-b-2",
                            configTab === 'dates' ? "text-[#D4AF37] border-[#D4AF37]" : "text-slate-600 border-transparent hover:text-slate-400"
                        )}
                    >
                        Datas Específicas
                    </button>
                </div>

                {configTab === 'weekly' ? (
                    <div className="space-y-4">
                        {weekDays.map((day, idx) => {
                            const daySlots = availability.filter(a => a.day_of_week === idx);
                            const isActive = daySlots.length > 0 && daySlots.some(s => s.is_active);
                            const isDirty = dirtyDays.includes(idx);
                            const isSaving = savingDay === idx;
                            const justSaved = justSavedDay === idx;

                            return (
                                <div key={day} className={cn(
                                    "rounded-3xl border transition-all duration-300 overflow-hidden backdrop-blur-md",
                                    isActive ? "bg-black/40 border-white/10 shadow-xl" : "bg-black/20 border-white/5 opacity-60 hover:opacity-100"
                                )}>
                                    {/* Card Header */}
                                    <div className="px-4 py-4 sm:px-6 sm:py-5 flex items-center justify-between bg-black/20 border-b border-white/5">
                                        <div className="flex items-center gap-3 sm:gap-4">
                                            <div className={cn("w-2 h-2 rounded-full transition-all duration-500", isActive ? "bg-[#D4AF37] shadow-[0_0_10px_#D4AF37]" : "bg-[#666]")}></div>
                                            <span className={cn("text-base font-black uppercase tracking-widest", isActive ? "text-white" : "text-[#666]")}>
                                                {day === 'DOM' ? 'Domingo' : day === 'SEG' ? 'Segunda-feira' : day === 'TER' ? 'Terça-feira' : day === 'QUA' ? 'Quarta-feira' : day === 'QUI' ? 'Quinta-feira' : day === 'SEX' ? 'Sexta-feira' : 'Sábado'}
                                            </span>
                                        </div>
                                        <CustomSwitch checked={isActive} onCheckedChange={() => toggleDay(idx)} />
                                    </div>

                                    {/* Card Content */}
                                    {isActive && (
                                        <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-2 space-y-4 animate-in slide-in-from-top-2 duration-300">
                                            {daySlots.map((slot, slotIdx) => (
                                                <div key={slotIdx} className="flex items-center gap-2 sm:gap-3">
                                                    <div className="flex-1 flex items-center gap-1 sm:gap-2">
                                                        <div className="relative flex-1">
                                                            <input
                                                                type="time"
                                                                value={slot.start_time?.slice(0, 5) || '08:00'}
                                                                onChange={(e) => updateSlotTime(slot, 'start_time', e.target.value, idx)}
                                                                onBlur={(e) => updateSlotTime(slot, 'start_time', roundTime(e.target.value), idx)}
                                                                className="w-full bg-[#080808] border border-[#222] rounded-xl pl-8 sm:pl-10 pr-1 sm:pr-3 py-2 text-left text-[#D4AF37] font-bold text-xs sm:text-sm focus:outline-none focus:border-[#D4AF37]/50 transition-colors"
                                                            />
                                                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[8px] sm:text-[9px] text-slate-600 font-black uppercase pointer-events-none">DE</span>
                                                        </div>
                                                        <span className="text-slate-600 font-bold">-</span>
                                                        <div className="relative flex-1">
                                                            <input
                                                                type="time"
                                                                value={slot.end_time?.slice(0, 5) || '18:00'}
                                                                onChange={(e) => updateSlotTime(slot, 'end_time', e.target.value, idx)}
                                                                onBlur={(e) => updateSlotTime(slot, 'end_time', roundTime(e.target.value), idx)}
                                                                className="w-full bg-[#080808] border border-[#222] rounded-xl pl-8 sm:pl-10 pr-1 sm:pr-3 py-2 text-left text-[#D4AF37] font-bold text-xs sm:text-sm focus:outline-none focus:border-[#D4AF37]/50 transition-colors"
                                                            />
                                                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[8px] sm:text-[9px] text-slate-600 font-black uppercase pointer-events-none">ATÉ</span>
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={() => removeInterval(slotIdx, idx)}
                                                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#1A1A1A] text-[#444] hover:text-red-500 hover:bg-[#222] hover:scale-105 flex items-center justify-center transition-all shrink-0"
                                                        title="Remover"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            ))}

                                            {/* Action Footer */}
                                            <div className="flex items-center justify-between pt-2 mt-2">
                                                <button
                                                    onClick={() => addInterval(idx)}
                                                    className="flex items-center gap-2 text-[10px] font-black text-[#D4AF37] uppercase tracking-widest hover:text-white transition-colors group/add"
                                                >
                                                    <div className="w-6 h-6 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center group-hover/add:bg-[#D4AF37] group-hover/add:text-black transition-all">
                                                        <Plus size={12} strokeWidth={3} />
                                                    </div>
                                                    Adicionar Horário
                                                </button>

                                                {/* Status Indicator / Save Button */}
                                                <div className="flex items-center gap-3">
                                                    {isDirty && (
                                                        <span className="text-[9px] font-bold text-[#D4AF37] uppercase tracking-widest animate-pulse">Não salvo</span>
                                                    )}
                                                    <button
                                                        onClick={() => handleSaveDay(idx)}
                                                        disabled={!isDirty || isSaving}
                                                        className={cn(
                                                            "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                                                            isSaving ? "bg-[#D4AF37]/10" :
                                                                justSaved ? "bg-green-500/20 text-green-500 border border-green-500/30" :
                                                                    isDirty ? "bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/50 hover:bg-[#D4AF37]/30" : "bg-[#1A1A1A] text-[#333] border border-[#222]"
                                                        )}
                                                        title={isDirty ? "Salvar alterações" : "Nenhuma alteração"}
                                                    >
                                                        {isSaving ? (
                                                            <Loader size={16} className="animate-spin text-[#D4AF37]" />
                                                        ) : justSaved ? (
                                                            <Check size={18} strokeWidth={3} />
                                                        ) : (
                                                            <Save size={18} className={cn(isDirty ? "fill-current" : "")} />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-500">
                        {/* Control Panel - More compact for mobile */}
                        <div className="flex flex-col gap-3 bg-[#0A0A0A]/60 p-4 rounded-3xl border border-white/5">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-black text-slate-500 uppercase tracking-widest pl-2">M O D O</span>
                                <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
                                    <button
                                        onClick={() => { setBlockMode('range'); handleClearSelection(); }}
                                        className={cn(
                                            "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all",
                                            blockMode === 'range' ? "bg-[#D4AF37] text-black shadow-lg" : "text-slate-500 hover:text-white"
                                        )}
                                    >
                                        Período
                                    </button>
                                    <button
                                        onClick={() => { setBlockMode('single'); handleClearSelection(); }}
                                        className={cn(
                                            "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all",
                                            blockMode === 'single' ? "bg-[#D4AF37] text-black shadow-lg" : "text-slate-500 hover:text-white"
                                        )}
                                    >
                                        Datas Únicas
                                    </button>
                                </div>
                            </div>
                            <p className="text-xs text-slate-300 px-2 leading-relaxed">
                                {blockMode === 'range'
                                    ? "Selecione o dia de INÍCIO e o dia de FIM para bloquear um intervalo contínuo."
                                    : "Clique em dias específicos para bloqueá-los individualmente."}
                            </p>
                        </div>

                        {/* Calendar Grid - Higher transparency, tighter spacing */}
                        <div className="bg-[#0A0A0A]/80 p-4 rounded-[2rem] border border-white/10 shadow-xl">
                            {/* Calendar Header */}
                            <div className="flex items-center justify-between mb-4">
                                <button onClick={() => setConfigDate(new Date(configDate.setMonth(configDate.getMonth() - 1)))} className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors">
                                    <ChevronLeft size={20} />
                                </button>

                                <button
                                    onClick={() => setIsPickerOpen(!isPickerOpen)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white/5 transition-all group"
                                >
                                    <span className="text-sm font-black text-white uppercase tracking-widest group-hover:text-[#D4AF37] transition-colors">
                                        {months[configDate.getMonth()]} <span className="text-[#D4AF37] group-hover:text-white transition-colors">{configDate.getFullYear()}</span>
                                    </span>
                                    <ChevronRight size={14} className={cn("text-slate-500 transition-transform duration-300", isPickerOpen ? "rotate-90" : "rotate-0")} />
                                </button>

                                <button onClick={() => setConfigDate(new Date(configDate.setMonth(configDate.getMonth() + 1)))} className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors">
                                    <ChevronRight size={20} />
                                </button>
                            </div>

                            {/* Content: Picker vs Grid */}
                            {isPickerOpen ? (
                                <div className="animate-in fade-in zoom-in-95 duration-200 p-2">
                                    <div className="flex items-center justify-center gap-6 mb-6">
                                        <button onClick={() => setConfigDate(new Date(configDate.setFullYear(configDate.getFullYear() - 1)))} className="p-2 hover:bg-white/10 rounded-full text-slate-400">
                                            <ChevronLeft size={24} />
                                        </button>
                                        <span className="text-xl font-black text-[#D4AF37]">{configDate.getFullYear()}</span>
                                        <button onClick={() => setConfigDate(new Date(configDate.setFullYear(configDate.getFullYear() + 1)))} className="p-2 hover:bg-white/10 rounded-full text-slate-400">
                                            <ChevronRight size={24} />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                        {months.map((m, i) => (
                                            <button
                                                key={m}
                                                onClick={() => {
                                                    const newDate = new Date(configDate);
                                                    newDate.setMonth(i);
                                                    setConfigDate(newDate);
                                                    setIsPickerOpen(false);
                                                }}
                                                className={cn(
                                                    "py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border",
                                                    configDate.getMonth() === i
                                                        ? "bg-[#D4AF37] text-black border-[#D4AF37]"
                                                        : "bg-[#1A1A1A] text-slate-400 border-white/5 hover:bg-[#222] hover:text-white hover:border-white/20"
                                                )}
                                            >
                                                {m}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {/* Days Header */}
                                    <div className="grid grid-cols-7 mb-2">
                                        {weekDays.map(d => <div key={d} className="text-center text-[9px] font-black text-slate-500 uppercase py-2">{d}</div>)}
                                    </div>

                                    {/* Days Grid */}
                                    <div className="grid grid-cols-7 gap-2">
                                        {Array.from({ length: getFirstDayOfMonth(configDate) }).map((_, i) => <div key={`empty-${i}`} />)}
                                        {Array.from({ length: getDaysInMonth(configDate) }).map((_, i) => {
                                            const day = i + 1;
                                            const date = new Date(configDate.getFullYear(), configDate.getMonth(), day);
                                            const today = startOfDay(new Date());
                                            const isPast = isBefore(date, today);

                                            // BRAZILIAN HOLIDAYS LOGIC
                                            const getBrazilianHolidays = (year: number) => {
                                                // Fixed Holidays
                                                const holidays = [
                                                    { d: 1, m: 0, name: 'Confraternização' }, // Jan 1
                                                    { d: 21, m: 3, name: 'Tiradentes' },      // Apr 21
                                                    { d: 1, m: 4, name: 'Trabalho' },         // May 1
                                                    { d: 7, m: 8, name: 'Independência' },    // Sep 7
                                                    { d: 12, m: 9, name: 'Nossa Sra.' },      // Oct 12
                                                    { d: 2, m: 10, name: 'Finados' },         // Nov 2
                                                    { d: 15, m: 10, name: 'Proclamação' },    // Nov 15
                                                    { d: 25, m: 11, name: 'Natal' },          // Dec 25
                                                ];
                                                return holidays;
                                            };

                                            const holidays = getBrazilianHolidays(date.getFullYear());
                                            const isHoliday = holidays.find(h => h.d === date.getDate() && h.m === date.getMonth());

                                            // Status Checks
                                            let isSelected = false;
                                            let isRangeStart = false;
                                            let isRangeEnd = false;
                                            let isInRange = false;

                                            // CHECK EXISTING DB BLOCKS
                                            const isBlockedAlready = blockedDays.some(a => {
                                                // blockedDays only contains FULL_DAY_BLOCK items for this month, so simple date check is enough
                                                const appStart = new Date(a.start_time);
                                                return isSameDay(appStart, date);
                                            });

                                            if (blockMode === 'range') {
                                                if (blockRange.start && isSameDay(date, blockRange.start)) isRangeStart = true;
                                                if (blockRange.end && isSameDay(date, blockRange.end)) isRangeEnd = true;
                                                if (blockRange.start && blockRange.end && isAfter(date, blockRange.start) && isBefore(date, blockRange.end)) isInRange = true;
                                                isSelected = isRangeStart || isRangeEnd || isInRange;
                                            } else {
                                                isSelected = blockSingleDates.some(d => isSameDay(d, date));
                                            }

                                            const isDisabled = isPast || (!!isHoliday && blockMode === 'single') || (isBlockedAlready && !isSelected); // Disable if blocked externally (unless selected now to toggle?)

                                            return (
                                                <button
                                                    key={day}
                                                    disabled={isDisabled}
                                                    title={isHoliday ? isHoliday.name : isBlockedAlready ? "Dia Bloqueado" : undefined}
                                                    onClick={() => !isDisabled && handleDateSelect(date)}
                                                    className={cn(
                                                        "h-10 rounded-xl text-xs font-bold transition-all relative flex items-center justify-center overflow-hidden border",
                                                        // PAST DATES
                                                        isPast ? "opacity-30 border-transparent bg-transparent text-slate-600 line-through decoration-slate-600 decoration-2" :
                                                            // HOLIDAYS
                                                            isHoliday ? "bg-red-900/10 border-red-900/20 text-red-500/70 opacity-60 cursor-not-allowed" :
                                                                // ALREADY BLOCKED
                                                                isBlockedAlready ? "bg-[#111] border-red-900/40 text-red-900 opacity-80 cursor-not-allowed" :
                                                                    // SELECTED STATES
                                                                    isSelected ? "bg-[#D4AF37] text-black border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.4)] z-10" :
                                                                        // DEFAULT AVAILABLE (High Contrast)
                                                                        "bg-[#111] border-white/10 text-slate-200 hover:bg-[#222] hover:text-white hover:border-white/30 hover:scale-105 hover:shadow-lg",

                                                        // RANGE SHAPES
                                                        isInRange && !isRangeStart && !isRangeEnd && "rounded-none bg-[#D4AF37]/50 border-y-[#D4AF37] border-x-0 scale-100 shadow-none z-0",
                                                        isRangeStart && "rounded-r-none z-10",
                                                        isRangeEnd && "rounded-l-none z-10"
                                                    )}
                                                >
                                                    {day}
                                                    {/* Visual Strike for Past Dates */}
                                                    {isPast && (
                                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                            <div className="w-[80%] h-[1px] bg-slate-600/50 rotate-45 transform origin-center"></div>
                                                        </div>
                                                    )}
                                                    {/* Label for Holidays (Dot) */}
                                                    {isHoliday && !isPast && (
                                                        <div className="absolute bottom-1 w-1 h-1 rounded-full bg-red-500"></div>
                                                    )}
                                                    {/* Blocked Icon (X) */}
                                                    {isBlockedAlready && !isPast && (
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <X size={14} className="text-red-700" />
                                                        </div>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Footer Actions */}
                        <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                            <button
                                onClick={handleClearSelection}
                                className="px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-red-500 hover:bg-red-500/10 transition-all"
                            >
                                Limpar
                            </button>
                            <button
                                onClick={handleSaveBlockDates}
                                disabled={blockingDates || (blockMode === 'range' ? !blockRange.start : blockSingleDates.length === 0)}
                                className="flex-1 py-4 bg-[#D4AF37] text-black rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                            >
                                {blockingDates ? <Loader size={16} className="animate-spin" /> : <Lock size={16} />}
                                {blockMode === 'range' && blockRange.start && blockRange.end ? 'Bloquear Período' : 'Bloquear Datas'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );

    const renderDailyView = () => {
        // Check for full day block in blockedDays array
        const fullDayBlock = blockedDays.find(a => isSameDay(new Date(a.start_time), selectedDate));

        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-40">
                {/* Header */}
                <div className="sticky top-0 z-[100] bg-gradient-to-b from-[#0A0A0A]/95 via-[#0A0A0A]/70 to-transparent backdrop-blur-xl border-none -mx-6 px-6 py-5 mb-5 pb-4">
                    <div className="flex flex-col gap-4 relative z-20">
                        {/* Top Row: Profile & Notifications */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-full bg-[#D4AF37] flex items-center justify-center text-black font-black text-xl border-2 border-[#D4AF37]/20 shadow-lg shadow-[#D4AF37]/10">
                                    {profile?.full_name?.substring(0, 2).toUpperCase() || 'AM'}
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.3em]">METRIK PRO</p>
                                    <h2 className="text-2xl font-black text-[#F0F0F0] leading-none uppercase tracking-tighter mt-2">Olá, {profile?.full_name?.split(' ')[0] || 'Alex'}</h2>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={handleDebugDB} className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 hover:bg-red-500/20 font-mono text-[10px]">DB</button>
                                <div className="relative">
                                    <button onClick={() => setShowNotifications(!showNotifications)} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-white/10 relative">
                                        <Bell size={22} />
                                        {notifications.length > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}
                                    </button>
                                    {/* Notifications Dropdown */}
                                    {showNotifications && (
                                        <div className="absolute right-0 top-full mt-2 w-80 bg-[#111] border border-white/10 rounded-2xl p-4 shadow-2xl z-50">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="text-[10px] uppercase text-slate-500 font-bold">Notificações</h4>
                                                <button className="text-[9px] text-[#D4AF37]">Limpar</button>
                                            </div>
                                            <div className="text-center py-6 text-slate-700 text-xs">Vazio</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Date Row (Restored Layout with Navigation) */}
                        <div className="flex items-end justify-between">
                            <div className="flex items-center gap-4">
                                {/* Prev Day Button - Only if selectedDate > Today (user request-ish: "option to go back") */}
                                {isAfter(startOfDay(selectedDate), startOfDay(new Date())) && (
                                    <button
                                        onClick={() => {
                                            const d = new Date(selectedDate);
                                            d.setDate(d.getDate() - 1);
                                            setSelectedDate(d);
                                        }}
                                        className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-all active:scale-95"
                                    >
                                        <ChevronLeft size={18} />
                                    </button>
                                )}

                                <div onClick={() => setView('monthly')} className="cursor-pointer group flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black transition-all">
                                        <CalendarIcon size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.2em] mb-1">{format(selectedDate, "eeee", { locale: ptBR })}</p>
                                        <h3 className="text-[12px] text-[#F0F0F0] tracking-wide leading-none opacity-80 font-medium">{format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }).toLowerCase()}</h3>
                                    </div>
                                </div>

                                {/* Next Day Button */}
                                <button
                                    onClick={() => {
                                        const d = new Date(selectedDate);
                                        d.setDate(d.getDate() + 1);
                                        setSelectedDate(d);
                                    }}
                                    className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-all active:scale-95 ml-2"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>

                            <div className="flex gap-2">
                                <button onClick={() => setShowConfig(true)} className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-white/10">
                                    <Settings size={18} />
                                </button>
                                <button onClick={() => setView('monthly')} className="h-10 px-8 rounded-2xl bg-[#D4AF37] text-black text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-[#D4AF37]/20 hover:bg-white transition-all">Mês</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FULL DAY BLOCK STATE */}
                {fullDayBlock ? (
                    <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-in fade-in zoom-in-95">
                        <div className="w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/20">
                            <Lock size={40} className="text-red-500" />
                        </div>
                        <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">Dia Bloqueado</h3>
                        <p className="text-sm text-slate-400 max-w-xs mb-8">Esta data foi bloqueada manualmente para atendimentos.</p>
                        <button
                            onClick={async () => {
                                // Unlock Logic
                                await supabase.from('appointments').delete().eq('id', fullDayBlock.id);
                                fetchAppointments();
                                fetchBlockedDates();
                            }}
                            className="px-6 py-3 rounded-xl bg-red-500/10 text-red-500 font-bold text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                        >
                            Desbloquear Dia
                        </button>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {timeSlots.map(timeString => {
                            const hour = parseInt(timeString.split(':')[0]);
                            const minute = parseInt(timeString.split(':')[1]);
                            const date = new Date(selectedDate);
                            date.setHours(hour, minute, 0, 0);

                            // MOCK APPOINTMENTS (For Demo Visualization)
                            // Only show if list is essentially empty to avoid cluttering real usage?
                            // User explicitly asked "Create example schedules".
                            const isDemoMode = appointments.length === 0 || true; // Force demo for now as requested
                            const mockData: Appointment[] = [
                                { id: 'mock-1', start_time: new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 9, 0, 0).toISOString(), end_time: '', status: 'confirmed', professional_id: '', patient_id: '', notes: 'Avaliação Bioimpedância', patient: { full_name: 'Sarah Mitchell', avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60' } },
                                { id: 'mock-2', start_time: new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 14, 30, 0).toISOString(), end_time: '', status: 'confirmed', professional_id: '', patient_id: '', notes: 'Retorno 30 Dias', patient: { full_name: 'David Chen', avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60' } },
                                { id: 'mock-3', start_time: new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 16, 15, 0).toISOString(), end_time: '', status: 'confirmed', professional_id: '', patient_id: '', notes: 'Primeira Consulta', patient: { full_name: 'Elena Rodriguez', avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60' } }
                            ] as any;

                            const isPast = isBefore(date, new Date()); // Strict past check
                            const realAppt = appointments.find(a => isSameMinute(new Date(a.start_time), date) && a.status !== 'cancelled');
                            // Use mock if no real, ONLY for specific slots to demo
                            const mockAppt = isDemoMode && !realAppt ? mockData.find(m => isSameMinute(new Date(m.start_time), date)) : null;

                            const appt = realAppt || mockAppt;

                            // Availability Check
                            const dayOfWeek = selectedDate.getDay();
                            const dayConfig = availability.filter(a => a.day_of_week === dayOfWeek && a.is_active);
                            const isActiveDay = dayConfig.length > 0;

                            const isWithinSlot = dayConfig.some(slot => {
                                const start = parse(slot.start_time, 'HH:mm:ss', new Date());
                                const end = parse(slot.end_time, 'HH:mm:ss', new Date());
                                const current = parse(timeString, 'HH:mm', new Date());
                                return isAfter(current, subMinutes(start, 1)) && isBefore(current, end);
                            });

                            const isSlotAvailable = !isPast && !appt && isActiveDay && isWithinSlot;
                            const isHourMark = timeString.endsWith(':00');

                            // Check for manual single-slot blocks (not full day)
                            const isManualBlock = appointments.some(a => isSameMinute(new Date(a.start_time), date) && (a.status === 'blocked' || a.notes === 'BLOCK_MANUAL'));

                            return (
                                <div key={timeString} className={cn("flex group items-stretch relative bg-black/50 rounded-3xl transition-all hover:bg-black/70 min-h-[4.5rem]", isHourMark ? "mt-3" : "border-t border-white/5")}>
                                    {/* Time Column (With Delay Action) */}
                                    <div className="w-16 shrink-0 flex flex-col items-center justify-between relative border-r border-white/5 py-4">
                                        <span className={cn(
                                            "text-xs font-black tracking-widest font-mono drop-shadow-md transition-all",
                                            isPast ? "text-slate-700 decoration-slate-700 line-through" :
                                                isHourMark ? "text-[#D4AF37] scale-110" : "text-slate-600 group-hover:text-slate-400"
                                        )}>
                                            {timeString}
                                        </span>

                                        {/* Delay Icon (Broken Clock) - 15m Delay Action */}
                                        {appt && !isManualBlock && (
                                            <button
                                                onClick={async (e) => {
                                                    e.stopPropagation();
                                                    const newStart = new Date(new Date(appt.start_time).getTime() + 15 * 60000); // +15 mins
                                                    const newEnd = new Date(new Date(appt.end_time).getTime() + 15 * 60000);
                                                    await supabase.from('appointments').update({
                                                        start_time: newStart.toISOString(),
                                                        end_time: newEnd.toISOString()
                                                    }).eq('id', appt.id);
                                                    fetchAppointments();
                                                }}
                                                className="mt-1 w-8 h-8 flex items-center justify-center opacity-70 hover:opacity-100 hover:scale-110 transition-all text-[#D4AF37]"
                                                title="Adiar 15 min"
                                            >
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <circle cx="12" cy="12" r="10" />
                                                    <path d="M12 6v6l4 2" />
                                                    <path d="m20 10-2 1" /> {/* Crack 1 */}
                                                    <path d="m4 14 2-1" /> {/* Crack 2 */}
                                                    <path d="M12 2v2" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>

                                    {/* Slot Content */}
                                    <div className="flex-1 relative p-1.5 pl-3">

                                        {appt && !isManualBlock ? (
                                            /* BOOKING CONTENT - CLICK TO PROFILE */
                                            <div
                                                onClick={() => navigate(`/appointment/${appt.id}`)}
                                                className="flex items-center gap-4 h-full relative z-20 group/appt cursor-pointer"
                                            >
                                                {/* Avatar */}
                                                <div className="w-12 h-12 rounded-2xl bg-[#222] overflow-hidden shadow-2xl border border-white/10 shrink-0 group-hover/appt:scale-105 transition-transform">
                                                    {appt.patient?.avatar_url ? (
                                                        <img src={appt.patient.avatar_url} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-xs text-white font-bold bg-[#111]">
                                                            {appt.patient?.full_name?.substring(0, 2) || 'PT'}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Info */}
                                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                                    <h3 className="text-white text-sm font-bold leading-tight truncate group-hover/appt:text-[#D4AF37] transition-colors">{appt.patient?.full_name || 'Paciente'}</h3>
                                                    <p className="text-[#D4AF37] text-[9px] font-black uppercase tracking-wider opacity-80">{appt.notes || 'Consulta'}</p>
                                                </div>

                                                {/* Start Action (Expandable Button) */}
                                                <div className="pr-2">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigate('/assessment', { state: { patientId: appt.patient_id, appointmentId: appt.id } });
                                                        }}
                                                        className="h-10 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center shadow-lg shadow-[#D4AF37]/10 hover:bg-[#D4AF37] transition-all duration-500 ease-out w-10 hover:w-32 group/start overflow-hidden relative"
                                                    >
                                                        {/* Icon Container (Fixed Left) */}
                                                        <div className="w-10 h-10 flex items-center justify-center shrink-0 relative z-10 text-[#D4AF37] group-hover/start:text-black transition-colors">
                                                            {/* Caliper + Play Integrated Icon */}
                                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                                {/* Caliper Legs (Arch) */}
                                                                <path d="M7 21c0-6 3-9 5-9s5 3 5 9" />
                                                                {/* Central Rod / Play Stem */}
                                                                <path d="M12 3v9" strokeWidth="2" />
                                                                {/* Play Triangle (Integrated as the 'Head/Pivot') */}
                                                                <path d="M10 5l5 3-5 3V5z" fill="currentColor" stroke="none" />
                                                                {/* Measurement Lines (Tape hint) */}
                                                                <path d="M15 15h2" className="opacity-50" />
                                                                <path d="M15 18h2" className="opacity-50" />
                                                            </svg>
                                                        </div>

                                                        {/* Text Reveal */}
                                                        <span className="whitespace-nowrap opacity-0 group-hover/start:opacity-100 text-[11px] font-black tracking-widest text-black transition-all duration-500 transform translate-x-10 group-hover/start:translate-x-0 ml-1">
                                                            INICIAR
                                                        </span>

                                                        {/* Shine Effect */}
                                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/start:animate-[shimmer_1.5s_infinite]"></div>
                                                    </button>
                                                </div>
                                            </div>
                                        ) : isManualBlock ? (
                                            /* MANUAL BLOCK CARD */
                                            <div className="h-full w-full flex items-center px-4 gap-4 relative overflow-hidden group/blocked cursor-pointer opacity-50 hover:opacity-100 transition-opacity" onClick={async () => {
                                                const record = appointments.find(a => isSameMinute(new Date(a.start_time), date));
                                                if (record) {
                                                    await supabase.from('appointments').delete().eq('id', record.id);
                                                    fetchAppointments();
                                                }
                                            }}>
                                                <div className="w-1 py-3 h-full bg-red-500/20 rounded-full"></div>
                                                <Lock size={16} className="text-red-500/50" />
                                                <span className="text-[10px] font-black text-red-500/50 uppercase tracking-[0.3em]">Bloqueado</span>
                                                <span className="ml-auto text-[9px] text-red-500 font-bold uppercase opacity-0 group-hover/blocked:opacity-100 px-3 py-1 bg-red-500/10 rounded-lg border border-red-500/20">Desbloquear</span>
                                            </div>
                                        ) : (
                                            /* AVAILABLE / EMPTY SLOT */
                                            <div onClick={() => isSlotAvailable && setConfirmBlock({ show: true, time: timeString })} className={cn(
                                                "h-full w-full flex items-center px-4 group/available relative z-10 transition-all cursor-pointer rounded-xl",
                                                isSlotAvailable ? "hover:bg-white/5" : "cursor-not-allowed opacity-30"
                                            )}>
                                                {isSlotAvailable ? (
                                                    <>
                                                        {/* ALways Visible "Disponível", hidden on Hover */}
                                                        <div className="px-3 py-1 bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-lg transition-all opacity-100 group-hover/available:opacity-0 transform group-hover/available:-translate-x-2">
                                                            <span className="text-[9px] font-black text-[#D4AF37] uppercase tracking-wider">Disponível</span>
                                                        </div>

                                                        {/* "Bloquear Horário" appears on Hover */}
                                                        <div className="absolute right-4 opacity-0 group-hover/available:opacity-100 transition-all transform translate-x-4 group-hover/available:translate-x-0 flex items-center gap-3">
                                                            <span className="text-[9px] font-black text-red-500/70 uppercase tracking-widest">Bloquear</span>
                                                            <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
                                                                <Lock size={12} />
                                                            </div>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <span className="text-[8px] font-black text-slate-800 uppercase tracking-widest pl-2">-</span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
                {/* Block Modal */}
                {
                    confirmBlock.show && (
                        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
                            <div className="bg-[#111] p-8 rounded-3xl border border-[#333] w-full max-w-sm text-center">
                                <Lock size={40} className="mx-auto text-[#D4AF37] mb-4" />
                                <h3 className="text-xl font-black text-white uppercase mb-2">Bloquear {confirmBlock.time}?</h3>
                                <p className="text-xs text-[#888] mb-6">Ninguém poderá agendar neste horário hoje.</p>
                                <div className="flex gap-3">
                                    <button onClick={() => setConfirmBlock({ show: false, time: null })} className="flex-1 py-3 bg-[#222] text-[#888] rounded-xl text-xs font-bold hover:bg-[#333]">Cancelar</button>
                                    <button onClick={handleBlockSlot} className="flex-1 py-3 bg-[#D4AF37] text-black rounded-xl text-xs font-black hover:bg-[#f0c24b]">Bloquear</button>
                                </div>
                            </div>
                        </div>
                    )
                }

                <Toast isVisible={toast.show} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />
            </div>
        );
    };

    const renderMonthView = () => (
        <div className="bg-[#0A0A0A]/60 backdrop-blur-3xl p-6 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
            <div className="flex items-center justify-between mb-8 relative z-10">
                <button onClick={() => changeMonth(-1)} className="p-3 hover:bg-white/10 rounded-full transition-all text-slate-400 active:scale-95 group">
                    <ChevronLeft size={24} className="group-hover:text-white" />
                </button>
                <h2 className="text-xl font-black text-white uppercase tracking-tight">
                    {months[selectedDate.getMonth()]} <span className="text-[#D4AF37] drop-shadow-sm">{selectedDate.getFullYear()}</span>
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
                {Array.from({ length: getFirstDayOfMonth(selectedDate) }).map((_, i) => <div key={`blank-${i}`} className="h-16"></div>)}
                {Array.from({ length: getDaysInMonth(selectedDate) }).map((_, i) => {
                    const day = i + 1;
                    const isToday = day === new Date().getDate() && selectedDate.getMonth() === new Date().getMonth();
                    const fullDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
                    const isSelected = day === selectedDate.getDate();

                    // CHECK BLOCKED
                    const isFullyBlocked = blockedDays.some(a => isSameDay(new Date(a.start_time), fullDate));

                    return (
                        <button
                            key={day}
                            onClick={() => { setSelectedDate(fullDate); setView('daily'); }}
                            className={cn(
                                "h-16 rounded-2xl flex flex-col items-center justify-center transition-all border relative",
                                isToday ? "bg-[#D4AF37] text-white border-[#D4AF37] shadow-lg shadow-[#D4AF37]/20" :
                                    isFullyBlocked ? "bg-[#111] border-red-900/30 text-red-800 opacity-60" : // BLOCKED STYLE
                                        isSelected ? "bg-white/15 border-white/20 text-white" : "bg-white/5 border-transparent text-slate-400 hover:bg-white/10 hover:text-white"
                            )}
                        >
                            <span className={cn("text-sm font-black", isToday || isSelected ? "text-white" : isFullyBlocked ? "text-red-900" : "text-slate-500")}>{day}</span>
                            {/* Block Icon for Month View */}
                            {isFullyBlocked && <Lock size={12} className="text-red-900 mt-1" />}
                        </button>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div className="h-full">
            {showConfig ? (
                renderConfigScreen()
            ) : (
                view === 'monthly' ? renderMonthView() : renderDailyView()
            )}
        </div>
    );
};
