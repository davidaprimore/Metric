import React, { useState, useEffect } from 'react';
import { BottomNav } from '@/components/layout/BottomNav';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import {
  X,
  Loader,
  ChevronLeft,
  ChevronRight,
  Check,
  CreditCard,
  QrCode,
  Calendar as CalendarIcon,
  Clock,
  ShieldCheck,
  Dumbbell,
  Activity
} from 'lucide-react';
import { Toast } from '@/components/ui/Toast';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const ScheduleScreen: React.FC = () => {
  const { session } = useAuth();
  const navigate = useNavigate();

  // Wizard State
  const [isBookingOpen, setIsBookingOpen] = useState(true);
  const [wizardStep, setWizardStep] = useState<'plans' | 'schedule' | 'checkout' | 'success'>('plans');
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'premium' | null>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit'>('pix');

  // Data
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' | 'info' });

  // Auto-select Professional (Priority: Alex)
  useEffect(() => {
    if (wizardStep === 'schedule' && !selectedProfessional) {
      const loadAlex = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('profiles')
          .select('*')
          .eq('role', 'professional')
          .eq('approval_status', 'approved')
          .ilike('full_name', '%Alex%')
          .limit(1)
          .maybeSingle();

        if (data) {
          setSelectedProfessional(data);
        } else {
          // Fallback to any professional if Alex not found
          const { data: fallback } = await supabase.from('profiles')
            .select('*')
            .eq('role', 'professional')
            .eq('approval_status', 'approved')
            .limit(1)
            .maybeSingle();
          if (fallback) setSelectedProfessional(fallback);
        }
        setLoading(false);
      };
      loadAlex();
    }
  }, [wizardStep]);

  useEffect(() => {
    if (selectedProfessional && wizardStep === 'schedule') {
      fetchSlots();
    }
  }, [selectedProfessional, selectedDate, wizardStep]);

  const fetchSlots = async () => {
    if (!selectedProfessional) return;
    setLoading(true);
    setAvailableSlots([]); // Reset while loading

    try {
      const dayOfWeek = selectedDate.getDay();

      // FIX: Ensure Sunday (0) is handled if Alex doesn't work Sundays
      // Mon-Sat is 1-6.
      const { data: config, error } = await supabase
        .from('professional_availability')
        .select('*')
        .eq('professional_id', selectedProfessional.id)
        .eq('day_of_week', dayOfWeek)
        .maybeSingle();

      if (error) {
        console.error('Error fetching availability:', error);
        return;
      }

      if (!config || !config.is_active) {
        setAvailableSlots([]);
        return;
      }

      // Generate slots based on config times
      const startSplit = config.start_time.split(':');
      const endSplit = config.end_time.split(':');

      const startHour = parseInt(startSplit[0]);
      const startMin = parseInt(startSplit[1] || '0');
      const endHour = parseInt(endSplit[0]);
      const endMin = parseInt(endSplit[1] || '0');

      const slots = [];
      const interval = selectedPlan === 'basic' ? 15 : 30;

      let current = new Date();
      current.setHours(startHour, startMin, 0, 0);

      const end = new Date();
      end.setHours(endHour, endMin, 0, 0);

      while (current < end) {
        slots.push(format(current, 'HH:mm'));
        current = new Date(current.getTime() + interval * 60000);
      }

      setAvailableSlots(slots);
    } catch (err) {
      console.error('Fetch slots failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmBooking = async () => {
    setLoading(true);
    try {
      // Calculate End Time based on Interval
      const interval = selectedPlan === 'basic' ? 15 : 30;
      const start = new Date(selectedDate);
      const [hours, minutes] = selectedSlot!.split(':').map(Number);
      start.setHours(hours, minutes, 0, 0);

      const end = new Date(start.getTime() + interval * 60000);

      await supabase.from('appointments').insert({
        professional_id: selectedProfessional.id,
        patient_id: session?.user.id,
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        status: 'confirmed',
        notes: `Plano: ${selectedPlan === 'basic' ? 'Básica' : 'Individualizada'} | Pagamento: ${paymentMethod}`
      });
      setWizardStep('success');
    } catch (error) {
      setToast({ show: true, message: 'Erro ao processar agendamento.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // --- RENDER STEPS ---

  const renderPlans = () => (
    <div className="space-y-6 animate-in slide-in-from-right duration-300">
      <div className="space-y-2">
        <h2 className="text-2xl font-black text-white uppercase tracking-tight">Escolha de Plano</h2>
        <p className="text-sm text-slate-400">Selecione o melhor plano para sua evolução.</p>
      </div>

      {/* BASIC PLAN - WHITE/SILVER THEME */}
      <div
        onClick={() => setSelectedPlan('basic')}
        className={cn(
          "p-6 rounded-[2rem] border transition-all cursor-pointer relative overflow-hidden group min-h-[160px] flex flex-col justify-between",
          selectedPlan === 'basic' ? "bg-white border-white shadow-[0_0_40px_rgba(255,255,255,0.2)] scale-[1.02]" : "bg-[#111] border-white/10 hover:border-white/30"
        )}
      >
        {/* Background Image */}
        <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity">
          <img src="/assets/plan_basic.png" className="w-full h-full object-cover" alt="" />
          <div className={cn("absolute inset-0", selectedPlan === 'basic' ? "bg-gradient-to-t from-white via-white/80 to-transparent" : "bg-gradient-to-t from-black via-black/60 to-transparent")}></div>
        </div>

        <div className="relative z-10">
          <div className="flex justify-between items-start mb-2">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center border transition-colors",
              selectedPlan === 'basic' ? "bg-black/10 border-black/10 text-black" : "bg-white/5 border-white/10 text-white"
            )}>
              <Dumbbell size={20} />
            </div>
            {selectedPlan === 'basic' && <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center"><Check size={14} strokeWidth={4} /></div>}
          </div>
          <h3 className={cn("text-xl font-black mb-1", selectedPlan === 'basic' ? "text-black" : "text-white")}>Básica</h3>
          <p className={cn("text-[11px] mb-4 leading-relaxed font-bold", selectedPlan === 'basic' ? "text-slate-600" : "text-slate-400")}>
            Avaliação completa por profissional habilitado. Bioimpedância clínica, medidas antropométricas e relatório digital imediato no App. Foco em acompanhamento de progresso.
          </p>
          <div className="flex items-end gap-1">
            <span className={cn("text-sm font-bold mb-1", selectedPlan === 'basic' ? "text-slate-500" : "text-slate-400")}>R$</span>
            <span className={cn("text-3xl font-black", selectedPlan === 'basic' ? "text-black" : "text-white")}>39,90</span>
          </div>
        </div>
      </div>

      {/* PREMIUM PLAN - YELLOW/GOLD THEME */}
      <div
        onClick={() => setSelectedPlan('premium')}
        className={cn(
          "p-6 rounded-[2rem] border transition-all cursor-pointer relative overflow-hidden group min-h-[160px] flex flex-col justify-between",
          selectedPlan === 'premium' ? "bg-[#FBBF24] border-[#FBBF24] shadow-[0_0_40px_rgba(251,191,36,0.3)] scale-[1.02]" : "bg-[#111] border-white/10 hover:border-[#FBBF24]/30"
        )}
      >
        {/* Background Image */}
        <div className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity">
          <img src="/assets/plan_premium.png" className="w-full h-full object-cover" alt="" />
          <div className={cn("absolute inset-0", selectedPlan === 'premium' ? "bg-gradient-to-t from-[#FBBF24] via-[#FBBF24]/80 to-transparent" : "bg-gradient-to-t from-black via-black/80 to-transparent")}></div>
        </div>

        <div className="absolute top-0 right-0 bg-black text-[#FBBF24] text-[9px] font-black px-4 py-2 rounded-bl-2xl uppercase tracking-tighter z-20">
          ELITE PERFORMANCE
        </div>

        <div className="relative z-10">
          <div className="flex justify-between items-start mb-2">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center border transition-colors",
              selectedPlan === 'premium' ? "bg-black/10 border-black/10 text-black" : "bg-[#FBBF24]/10 border-[#FBBF24]/30 text-[#FBBF24]"
            )}>
              <Activity size={20} />
            </div>
            {selectedPlan === 'premium' && <div className="w-6 h-6 rounded-full bg-black text-[#FBBF24] flex items-center justify-center"><Check size={14} strokeWidth={4} /></div>}
          </div>
          <h3 className={cn("text-xl font-black mb-1", selectedPlan === 'premium' ? "text-black" : "text-white")}>Individualizada</h3>
          <p className={cn("text-[11px] mb-4 leading-relaxed font-bold", selectedPlan === 'premium' ? "text-slate-900" : "text-slate-400")}>
            Exclusivo com <span className="font-black">Alê</span>. Mentor de Evolução Física e Especialista em Biomecânica. Treinamento 100% sob medida, suporte via chat 24/7 e ajustes de performance semanais.
          </p>
          <div className="flex items-end gap-1">
            <span className={cn("text-sm font-bold mb-1", selectedPlan === 'premium' ? "text-slate-800" : "text-slate-400")}>Investimento</span>
            <span className={cn("text-3xl font-black", selectedPlan === 'premium' ? "text-black" : "text-[#FBBF24]")}>89,90</span>
          </div>
        </div>
      </div>

      <button
        disabled={!selectedPlan}
        onClick={() => setWizardStep('schedule')}
        className={cn(
          "w-full py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed sticky bottom-0",
          selectedPlan === 'basic' ? "bg-white text-black hover:bg-gray-200" : "bg-[#FBBF24] text-black hover:bg-[#f59e0b] shadow-[0_0_20px_rgba(251,191,36,0.3)]"
        )}
      >
        Continuar para Agendamento
      </button>
    </div>
  );

  const renderSchedule = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const dateFormat = "d";
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        const isSelected = isSameDay(day, selectedDate);
        const isCurrentMonth = isSameMonth(day, monthStart);

        days.push(
          <div
            key={day.toString()}
            onClick={() => { setSelectedDate(cloneDay); setSelectedSlot(null); }}
            className={cn(
              "h-10 w-full flex items-center justify-center rounded-lg text-sm font-bold cursor-pointer transition-all relative",
              !isCurrentMonth ? "text-slate-800" :
                isSelected ? "bg-[#39FF14] text-black shadow-[0_0_15px_rgba(57,255,20,0.4)] z-10" : "text-slate-400 hover:bg-white/10 hover:text-white"
            )}
          >
            {formattedDate}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7 mb-2" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }

    return (
      <div className="space-y-6 animate-in slide-in-from-right duration-300">
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">Agendamento</h2>
          <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/5">
            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", selectedPlan === 'basic' ? "bg-white text-black" : "bg-[#FBBF24] text-black")}>
              {selectedPlan === 'basic' ? <Dumbbell size={16} /> : <Activity size={16} />}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Plano Selecionado</p>
              <h4 className="text-sm font-bold text-white leading-tight">
                {selectedPlan === 'basic' ? 'Básica' : 'Individualizada'} com {selectedProfessional?.full_name?.split(' ')[0] || 'Profissional'}
              </h4>
            </div>
          </div>
        </div>

        {/* FULL CALENDAR */}
        <div className="bg-white/5 rounded-[2rem] p-6 border border-white/5">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-white/10 rounded-full text-white"><ChevronLeft size={20} /></button>
            <span className="text-lg font-bold text-white capitalization">
              {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
            </span>
            <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-white/10 rounded-full text-white"><ChevronRight size={20} /></button>
          </div>
          <div className="grid grid-cols-7 mb-4">
            {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'].map(d => (
              <div key={d} className="text-center text-[10px] font-black text-slate-600 uppercase tracking-wider">{d}</div>
            ))}
          </div>
          <div>{rows}</div>
        </div>

        {/* Slots */}
        <div>
          <h3 className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-widest pl-2">Horários Disponíveis</h3>
          <div className="grid grid-cols-4 gap-3">
            {loading ? (
              <div className="col-span-4 py-8 flex justify-center"><Loader className="animate-spin text-[#39FF14]" /></div>
            ) : availableSlots.length > 0 ? (
              availableSlots.map(slot => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={cn(
                    "py-3 rounded-xl border text-xs font-bold transition-all",
                    selectedSlot === slot ? "bg-[#FBBF24] text-black border-[#FBBF24]" : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                  )}
                >
                  {slot}
                </button>
              ))
            ) : (
              <div className="col-span-4 flex flex-col items-center justify-center py-8 text-slate-500 rounded-2xl border border-dashed border-white/10 bg-white/5">
                <Clock size={24} className="mb-2 opacity-50" />
                <span className="text-xs">Nenhum horário disponível.</span>
              </div>
            )}
          </div>
        </div>

        <button
          disabled={!selectedSlot}
          onClick={() => setWizardStep('checkout')}
          className="w-full py-4 rounded-xl bg-[#FBBF24] text-black font-black uppercase tracking-widest text-xs hover:bg-[#f59e0b] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(251,191,36,0.3)] sticky bottom-0"
        >
          Confirmar Agendamento
        </button>
      </div>
    );
  }

  const renderCheckout = () => (
    <div className="space-y-6 animate-in slide-in-from-right duration-300">
      <h2 className="text-2xl font-black text-white uppercase tracking-tight">Checkout</h2>

      <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6">
        <div className="flex gap-4 mb-6">
          <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center", selectedPlan === 'basic' ? "bg-white" : "bg-[#FBBF24]")}>
            {selectedPlan === 'basic' ? <Dumbbell size={24} className="text-black" /> : <Activity size={24} className="text-black" />}
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Resumo do Pedido</p>
            <h3 className="text-lg font-bold text-white leading-tight mb-1">{selectedPlan === 'basic' ? 'Avaliação Básica' : 'Avaliação Individualizada'}</h3>
            <p className="text-xs text-slate-400">Com {selectedProfessional?.full_name}</p>
          </div>
        </div>
        <div className="flex justify-between items-center pt-4 border-t border-white/10">
          <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Total a Pagar</span>
          <span className={cn("text-2xl font-black", selectedPlan === 'basic' ? "text-white" : "text-[#FBBF24]")}>{selectedPlan === 'basic' ? 'R$ 39,90' : 'R$ 89,90'}</span>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-widest">Forma de Pagamento</h3>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => setPaymentMethod('pix')}
            className={cn(
              "p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all relative overflow-hidden",
              paymentMethod === 'pix' ? "bg-[#39FF14]/10 border-[#39FF14] text-white" : "bg-white/5 border-white/10 text-slate-500"
            )}
          >
            {paymentMethod === 'pix' && <div className="absolute top-0 right-0 px-2 py-0.5 bg-[#39FF14] text-black text-[8px] font-black uppercase">Instantâneo</div>}
            <QrCode size={24} />
            <span className="text-xs font-bold">Pix</span>
          </button>
          <button
            onClick={() => setPaymentMethod('credit')}
            className={cn(
              "p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all",
              paymentMethod === 'credit' ? "bg-[#39FF14]/10 border-[#39FF14] text-white" : "bg-white/5 border-white/10 text-slate-500"
            )}
          >
            <CreditCard size={24} />
            <span className="text-xs font-bold">Cartão</span>
          </button>
        </div>
      </div>

      <div className="bg-[#39FF14]/5 border border-[#39FF14]/20 p-4 rounded-xl flex items-start gap-3">
        <ShieldCheck size={18} className="text-[#39FF14] shrink-0 mt-0.5" />
        <p className="text-[10px] text-slate-400 leading-relaxed">
          Seus dados são criptografados de ponta-a-ponta. Processamento seguro via protocolo SSL 256 bits.
        </p>
      </div>

      <button
        onClick={handleConfirmBooking}
        className="w-full py-4 rounded-xl bg-[#39FF14] text-black font-black uppercase tracking-widest text-xs hover:bg-[#32d411] transition-all shadow-[0_0_20px_rgba(57,255,20,0.3)]"
      >
        Finalizar Pagamento
      </button>
    </div>
  );

  const renderSuccess = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in zoom-in duration-500">
      <div className="w-24 h-24 rounded-full bg-[#39FF14]/20 flex items-center justify-center mb-8 border border-[#39FF14]/50 shadow-[0_0_40px_rgba(57,255,20,0.3)]">
        <div className="w-16 h-16 rounded-full bg-[#39FF14] flex items-center justify-center">
          <Check size={32} className="text-black" strokeWidth={4} />
        </div>
      </div>

      <h2 className="text-2xl font-black text-white text-center mb-2">Agendamento Confirmado</h2>
      <p className="text-slate-400 text-center text-sm mb-12">Sua reserva foi finalizada com sucesso.</p>

      <div className="w-full bg-white/5 border border-white/10 rounded-[2rem] p-6 mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-[#39FF14]"></div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Resumo do Plano</p>
        <h3 className="text-lg font-bold text-white mb-4">{selectedPlan === 'basic' ? 'Individualizada' : 'Individualizada'} com {selectedProfessional?.full_name}</h3>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <CalendarIcon size={16} className="text-[#FBBF24]" />
            <span className="text-sm font-bold text-white">{selectedDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}</span>
          </div>
        </div>
      </div>

      <div className="w-full bg-white rounded-[2rem] p-8 text-center shadow-2xl">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
          <Check size={24} strokeWidth={3} />
        </div>
        <h3 className="text-gray-900 font-bold text-lg mb-1">Pagamento Processado</h3>
        <p className="text-gray-400 text-xs mb-6">ID da Transação: #MET-992384</p>

        <button
          onClick={() => navigate('/assessment/anamnesis')}
          className="w-full py-4 rounded-xl bg-[#39FF14] text-black font-black uppercase tracking-widest text-xs hover:bg-[#32d411] transition-all shadow-xl flex items-center justify-center gap-2"
        >
          Preencher Anamnese <ChevronRight size={16} />
        </button>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-4 text-xs font-bold text-gray-400 hover:text-gray-600"
        >
          Voltar ao Início
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020502] font-sans text-white pb-24 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[#0a100a]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(57,255,20,0.15),transparent_40%)]"></div>
      </div>

      {!isBookingOpen ? (
        <header className="relative z-10 px-6 py-6 flex justify-between items-center">
          <h1 className="text-xl font-bold font-display text-white">Minha Agenda</h1>
          <button
            onClick={() => { setIsBookingOpen(true); setWizardStep('plans'); }}
            className="bg-[#39FF14] text-black px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wide hover:scale-105 transition-transform shadow-[0_0_15px_rgba(57,255,20,0.3)]"
          >
            + Novo Agendamento
          </button>
        </header>
      ) : (
        <header className="relative z-10 px-6 py-6 flex items-center gap-4">
          {wizardStep !== 'success' && (
            <button
              onClick={() => {
                if (wizardStep === 'plans') setIsBookingOpen(false);
                if (wizardStep === 'schedule') setWizardStep('plans');
                if (wizardStep === 'checkout') setWizardStep('schedule');
              }}
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <ChevronLeft size={20} className="text-white" />
            </button>
          )}
          <div className="flex-1 text-center pr-10">
            <h1 className="text-sm font-bold text-white uppercase tracking-widest">
              {wizardStep === 'plans' && 'Plano de Avaliação'}
              {wizardStep === 'schedule' && 'Agendamento'}
              {wizardStep === 'checkout' && 'Checkout'}
              {wizardStep === 'success' && 'Confirmação'}
            </h1>
          </div>
        </header>
      )}

      <div className="relative z-10 px-6">
        {!isBookingOpen ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-50">
            <CalendarIcon size={48} className="text-slate-600 mb-4" />
            <p className="text-slate-500 text-sm font-bold">Nenhum agendamento ativo.</p>
          </div>
        ) : (
          <div className="pb-20">
            {wizardStep === 'plans' && renderPlans()}
            {wizardStep === 'schedule' && renderSchedule()}
            {wizardStep === 'checkout' && renderCheckout()}
            {wizardStep === 'success' && renderSuccess()}
          </div>
        )}
      </div>

      <Toast isVisible={toast.show} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />
      {!isBookingOpen && <BottomNav />}
    </div>
  );
};