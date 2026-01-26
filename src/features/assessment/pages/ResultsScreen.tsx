import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { ChevronLeft, Share2, Activity, Ruler, Weight, TrendingUp, TrendingDown, X, ChevronRight, Dumbbell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { FluidBackground } from '@/components/layout/FluidBackground';

export const ResultsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentSlide, setCurrentSlide] = useState(0); // 0: Summary, 1: Skinfolds, 2: Perimeters
  const [assessment, setAssessment] = useState<any>(null);
  const [prevAssessment, setPrevAssessment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      // 1. Get Current Assessment
      const { data: current } = await supabase.from('assessments').select('*').eq('id', id).single();
      if (current) {
        setAssessment(current);
        // 2. Get Previous Assessment (most recent before this one)
        const { data: prev } = await supabase.from('assessments')
          .select('*')
          .eq('patient_id', current.patient_id)
          .lt('created_at', current.created_at)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (prev) setPrevAssessment(prev);
      }
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-[#D4AF37]">Carregando...</div>;
  if (!assessment) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Avaliação não encontrada.</div>;

  // --- HELPER CALCULATIONS ---
  const getDiff = (key: string, isPct = false) => {
    if (!prevAssessment) return null;
    // Handle nested or flat keys. Assessments stores weight on root, skinfolds in jsonb
    let currVal = 0;
    let prevVal = 0;

    if (key === 'weight') { currVal = assessment.weight; prevVal = prevAssessment.weight; }
    else if (key === 'fat') { currVal = Number(assessment.fat_percentage || assessment.body_fat); prevVal = Number(prevAssessment.fat_percentage || prevAssessment.body_fat); }
    else if (key === 'lean_mass') {
      currVal = assessment.weight * (1 - Number(assessment.fat_percentage || assessment.body_fat) / 100);
      prevVal = prevAssessment.weight * (1 - Number(prevAssessment.fat_percentage || prevAssessment.body_fat) / 100);
    }
    else if (key === 'fat_mass') {
      currVal = assessment.weight * (Number(assessment.fat_percentage || assessment.body_fat) / 100);
      prevVal = prevAssessment.weight * (Number(prevAssessment.fat_percentage || prevAssessment.body_fat) / 100);
    }

    const diff = currVal - prevVal;
    const symbol = diff > 0 ? '+' : '';
    return { val: symbol + diff.toFixed(1) + (isPct ? '%' : 'kg'), positive: diff > 0 };
  };

  const diffWeight = getDiff('weight');
  const diffFat = getDiff('fat', true);
  const diffLean = getDiff('lean_mass');
  const diffFatMass = getDiff('fat_mass');

  // --- SLIDES ----

  const SlideSummary = () => {
    const prevDate = prevAssessment ? new Date(prevAssessment.created_at) : null;
    const currDate = new Date(assessment.created_at);
    const dayDiff = prevDate ? Math.round((currDate.getTime() - prevDate.getTime()) / (1000 * 3600 * 24)) : 0;

    const ComparisonRow = ({ label, unit, prevVal, currVal, isReverse = false }: { label: string, unit: string, prevVal: any, currVal: any, isReverse?: boolean }) => {
      const diff = Number(currVal) - Number(prevVal);
      const isGood = isReverse ? diff < 0 : diff > 0;
      return (
        <div className="bg-white/30 backdrop-blur-xl rounded-[1.5rem] p-5 border border-white/30 shadow-sm relative group overflow-hidden">
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] text-center mb-4">{label}</p>

          <div className="flex items-center justify-between gap-2">
            {/* Previous */}
            <div className="flex-1 flex flex-col items-center">
              <div className="flex items-baseline gap-0.5">
                <span className="text-xl font-bold text-slate-600 tracking-tight">{prevVal}</span>
                <span className="text-[9px] font-medium text-slate-400">{unit}</span>
              </div>
              <p className="text-[7px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">Anterior</p>
            </div>

            {/* Indicator - Minimalist */}
            <div className="flex flex-col items-center px-3 border-x border-slate-900/5">
              <div className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center transition-all duration-500",
                diff === 0 ? "bg-slate-100/50 text-slate-400" : isGood ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
              )}>
                {diff === 0 ? <div className="w-2 h-0.5 bg-current" /> : diff > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              </div>
              <span className={cn(
                "text-[9px] font-bold mt-1 tabular-nums",
                diff === 0 ? "text-slate-400" : isGood ? "text-green-600" : "text-red-500"
              )}>
                {diff > 0 ? '+' : ''}{diff.toFixed(1)}
              </span>
            </div>

            {/* Current */}
            <div className="flex-1 flex flex-col items-center">
              <div className="flex items-baseline gap-0.5">
                <span className="text-2xl font-black text-slate-900 tracking-tight">{currVal}</span>
                <span className="text-[9px] font-bold text-[#D4AF37]">{unit}</span>
              </div>
              <p className="text-[7px] font-bold text-[#C5A028] uppercase tracking-tighter mt-0.5">Atual</p>
            </div>
          </div>
        </div>
      );
    };

    const prevFatPct = prevAssessment ? Number(prevAssessment.fat_percentage || prevAssessment.body_fat) : 0;
    const currFatPct = Number(assessment.fat_percentage || assessment.body_fat);
    const prevFatMass = prevAssessment ? (prevAssessment.weight * (prevFatPct / 100)).toFixed(1) : "0.0";
    const currFatMass = (assessment.weight * (currFatPct / 100)).toFixed(1);
    const prevLeanMass = prevAssessment ? (prevAssessment.weight * (1 - prevFatPct / 100)).toFixed(1) : "0.0";
    const currLeanMass = (assessment.weight * (1 - currFatPct / 100)).toFixed(1);

    return (
      <div className="flex flex-col h-full relative overflow-hidden bg-white">
        {/* Softened Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/dashboard-bgs/natural_premium_bg.png"
            className="w-full h-full object-cover scale-105 animate-subtle-zoom"
            alt="Natural Background"
          />
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-black/5"></div>
        </div>

        <div className="relative z-10 flex flex-col h-full p-6 pt-14">
          <div className="mb-6 text-center animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="inline-block">
              <span className="px-5 py-2 rounded-xl backdrop-blur-md border border-white/50 bg-white/20 text-slate-500 text-[9px] font-bold uppercase tracking-[0.3em]">
                Resumo de Evolução
              </span>
            </div>

            <h1 className="text-3xl font-black text-slate-900 mt-6 leading-tight tracking-tighter uppercase italic drop-shadow-sm">
              Minha evolução<br />
              <span className="text-[#D4AF37]">
                em {dayDiff} dias
              </span>
            </h1>

            <p className="text-slate-400 text-[9px] font-bold uppercase tracking-[0.2em] mt-2 opacity-70">
              {prevDate?.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} — {currDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
            </p>
          </div>

          <div className="flex-1 space-y-3 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 overflow-y-auto scrollbar-hide py-2">
            <ComparisonRow
              label="Peso Total"
              unit="kg"
              prevVal={prevAssessment?.weight || "0.0"}
              currVal={assessment.weight}
            />
            <ComparisonRow
              label="Gordura Corporal"
              unit="%"
              prevVal={prevFatPct.toFixed(1)}
              currVal={currFatPct.toFixed(1)}
              isReverse
            />
            <ComparisonRow
              label="Massa Magra"
              unit="kg"
              prevVal={prevLeanMass}
              currVal={currLeanMass}
            />
            <ComparisonRow
              label="Massa Gorda"
              unit="kg"
              prevVal={prevFatMass}
              currVal={currFatMass}
              isReverse
            />
          </div>

          {/* Minimalist Integrated Footer */}
          <div className="mt-4 pt-6 flex justify-between items-center opacity-90 border-t border-black/5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center">
                <span className="font-black text-[#D4AF37] text-xs">M</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-800 tracking-[0.2em]">METRIK</span>
                <span className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">PERSONAL PRO</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-[#D4AF37] italic uppercase tracking-tighter opacity-80">
                #SuaObraDeArte
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const SlideSkinfolds = () => {
    const folds = assessment.measurements?.skinfolds || assessment.skinfolds || {};
    const labels: Record<string, string> = {
      chest: 'Peitoral', axilla: 'Axilar Média', triceps: 'Tricipital', subscapular: 'Subescapular',
      abdomen: 'Abdominal', suprailiac: 'Suprailíaca', thigh: 'Coxa'
    };

    return (
      <div className="flex flex-col h-full p-8 relative overflow-y-auto scrollbar-hide">
        <div className="mt-8 mb-6">
          <p className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest mb-1">Detalhamento</p>
          <h2 className="text-3xl font-black text-white">Dobras<br />Cutâneas</h2>
        </div>

        <div className="space-y-3 pb-8">
          {Object.entries(folds).map(([key, val]: any) => (
            <div key={key} className="bg-white/5 p-4 rounded-2xl flex items-center gap-4 border border-white/5">
              <div className="flex-1">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1.5">{labels[key] || key}</p>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-[#D4AF37]" style={{ width: `${Math.min(val * 2, 100)}%` }}></div>
                </div>
              </div>
              <span className="text-xl font-black text-white w-12 text-right">{val}<span className="text-[8px] text-slate-500 ml-0.5">mm</span></span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const SlidePerimeters = () => {
    const perims = assessment.measurements?.perimeters || {};
    const labels: Record<string, string> = {
      neck: 'Pescoço', shoulder: 'Ombros', chest_perim: 'Tórax', waist: 'Cintura', abdomen_perim: 'Abdômen', hips: 'Quadril',
      arm_right_relaxed: 'Braço Dir. (Rel)', arm_right_contracted: 'Braço Dir. (Con)',
      thigh_right: 'Coxa Dir.', calf_right: 'Panturrilha Dir.'
    };
    // Filter some empty ones if needed
    const entries = Object.entries(perims).filter(([k, v]) => v && Number(v) > 0);

    return (
      <div className="flex flex-col h-full p-8 relative overflow-y-auto scrollbar-hide">
        <div className="mt-8 mb-6">
          <p className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest mb-1">Medidas</p>
          <h2 className="text-3xl font-black text-white">Perímetros<br />Corporais</h2>
        </div>

        <div className="grid grid-cols-2 gap-3 pb-8">
          {entries.map(([key, val]: any) => (
            <div key={key} className="bg-white/5 p-4 rounded-2xl border border-white/5 flex flex-col justify-between h-24">
              <p className="text-[9px] text-slate-400 uppercase font-black tracking-wider leading-tight">{labels[key] || key.replace('_', ' ')}</p>
              <div className="flex items-baseline justify-end gap-1">
                <Ruler size={12} className="text-[#D4AF37] opacity-50 absolute bottom-4 left-4" />
                <span className="text-2xl font-black text-white">{val}</span>
                <span className="text-[9px] text-slate-500 font-bold">cm</span>
              </div>
            </div>
          ))}
          {entries.length === 0 && <p className="text-slate-500 text-sm">Nenhuma medida registrada.</p>}
        </div>
      </div>
    );
  };

  const slides = [<SlideSummary />, <SlideSkinfolds />, <SlidePerimeters />];

  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);

  return (
    <FluidBackground variant="professional" className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center font-sans">

      {/* Close Button */}
      <button onClick={() => navigate(-1)} className="absolute top-6 right-6 z-50 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 text-white active:scale-90 transition-all">
        <X size={20} />
      </button>

      {/* Main Card Container (9:16 approx or Max Height) */}
      <div className="w-full h-full md:max-w-md md:h-[800px] md:max-h-[90vh] bg-black/30 backdrop-blur-2xl relative md:rounded-[3rem] overflow-hidden shadow-2xl border border-white/5 flex flex-col">

        {/* Content Area */}
        <div className="flex-1 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full"
            >
              {slides[currentSlide]}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Pagination Dots */}
        <div className="h-20 flex items-center justify-center gap-4 relative z-20 bg-gradient-to-t from-black/80 to-transparent">
          <button onClick={prevSlide} className="p-2 opacity-50 hover:opacity-100 text-white"><ChevronLeft size={20} /></button>
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <button key={i} onClick={() => setCurrentSlide(i)} className={cn("w-2 h-2 rounded-full transition-all", currentSlide === i ? "bg-[#D4AF37] w-6" : "bg-white/20")} />
            ))}
          </div>
          <button onClick={nextSlide} className="p-2 opacity-50 hover:opacity-100 text-white"><ChevronRight size={20} /></button>
        </div>
      </div>

      {/* Share Button (Floating) */}
      <div className="absolute bottom-10 md:bottom-auto md:top-1/2 md:-right-20">
        <button className="flex flex-col items-center gap-2 group">
          <div className="w-12 h-12 rounded-full bg-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.4)] flex items-center justify-center text-black active:scale-95 transition-all group-hover:scale-110">
            <Share2 size={20} />
          </div>
          <span className="text-[10px] font-bold text-white uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap md:rotate-90">Compartilhar</span>
        </button>
      </div>

    </FluidBackground>
  );
};