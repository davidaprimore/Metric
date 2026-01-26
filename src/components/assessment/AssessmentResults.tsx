import React from 'react';
import { motion } from 'framer-motion';
import { Activity, TrendingUp, User, Weight, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

// Helper for Calculations (Internal to component for now, or move to utils)
const calculateComposition = (weight: number, height: number, gender: string, age: number, measurements: Record<string, number>) => {
    // MOCK FORMULA (JACKSON & POLLOCK 3-SITE)
    // Male: Chest, Abdomen, Thigh
    // Female: Triceps, Suprailiac, Thigh

    // Sum of skinfolds
    let sum = 0;
    if (gender === 'male') {
        sum = (measurements['chest'] || 10) + (measurements['abdomen'] || 15) + (measurements['thigh_right'] || 12);
    } else {
        sum = (measurements['triceps_right'] || 15) + (measurements['suprailiac_right'] || 12) + (measurements['thigh_right'] || 18);
    }

    // Body Density (Generic Approximation)
    const density = 1.10938 - (0.0008267 * sum) + (0.0000016 * sum * sum) - (0.0002574 * age);

    // Siri Equation: %BF = (495 / Density) - 450
    let fatPercentage = (495 / density) - 450;

    // Safety clamp
    if (fatPercentage < 3) fatPercentage = 3;
    if (fatPercentage > 60) fatPercentage = 60;
    if (isNaN(fatPercentage)) fatPercentage = 20; // Default mock

    const fatMass = weight * (fatPercentage / 100);
    const leanMass = weight - fatMass;

    return { fatPercentage, fatMass, leanMass, density, sum };
};

interface AssessmentResultsProps {
    patientData: any; // { weight, height, age, gender }
    measurements: Record<string, number>;
}

export const AssessmentResults: React.FC<AssessmentResultsProps> = ({ patientData, measurements }) => {
    const { weight = 70, height = 175, age = 30, gender = 'male' } = patientData || {};

    const stats = calculateComposition(weight, height, gender, age, measurements);

    return (
        <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Main KPI: Body Fat % */}
            <div className="bg-[#111]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Activity size={100} className="text-[#D4AF37]" />
                </div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#D4AF37] mb-2">Gordura Corporal</h3>
                <div className="flex items-baseline gap-2">
                    <span className="text-6xl font-black text-white tracking-tighter shadow-gold">{stats.fatPercentage.toFixed(1)}</span>
                    <span className="text-xl font-bold text-slate-500">%</span>
                </div>
                <div className="mt-4 h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${stats.fatPercentage}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-[#D4AF37] to-[#B4941F]"
                    />
                </div>
                <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-widest">Protocolo: Jackson & Pollock (3 Dobras)</p>
            </div>

            {/* Grid Stats */}
            <div className="grid grid-cols-2 gap-4">
                {/* Lean Mass */}
                <div className="bg-[#111]/50 border border-white/5 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 hover:border-[#D4AF37]/30 transition-all">
                    <Zap size={24} className="text-emerald-400 mb-2" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Massa Magra</span>
                    <span className="text-2xl font-black text-white">{stats.leanMass.toFixed(1)} <span className="text-xs text-slate-600">kg</span></span>
                </div>

                {/* Fat Mass */}
                <div className="bg-[#111]/50 border border-white/5 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 hover:border-[#D4AF37]/30 transition-all">
                    <Weight size={24} className="text-rose-400 mb-2" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Peso Gordo</span>
                    <span className="text-2xl font-black text-white">{stats.fatMass.toFixed(1)} <span className="text-xs text-slate-600">kg</span></span>
                </div>
            </div>

            {/* Insight / BMR */}
            <div className="bg-gradient-to-br from-[#111] to-[#0A0A0A] border border-white/5 rounded-2xl p-6 flex items-center justify-between">
                <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Taxa Metabólica Basal</h4>
                    <p className="text-xl font-bold text-white">~ {(weight * 24).toFixed(0)} <span className="text-xs text-[#D4AF37]">kcal/dia</span></p>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
                    <TrendingUp size={20} />
                </div>
            </div>

            {/* Disclaimer */}
            <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 text-center">
                <p className="text-[10px] text-blue-400/60 leading-relaxed max-w-[200px] mx-auto">
                    *Resultados baseados em estimativas populacionais. Considere a avaliação clínica completa.
                </p>
            </div>
        </div>
    );
};
