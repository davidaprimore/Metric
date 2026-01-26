import React, { useState } from 'react';
import {
    Search,
    MoreVertical,
    Filter,
    ChevronRight,
    User,
    Calendar,
    Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

// Dummy Data
const DUMMY_PATIENTS = [
    {
        id: '1',
        name: 'Ana Silva',
        age: 28,
        status: 'active',
        lastVisit: '2024-01-15',
        nextVisit: '2024-02-15',
        plan: 'Premium',
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
        goal: 'Hipertrofia'
    },
    {
        id: '2',
        name: 'Carlos Mendez',
        age: 34,
        status: 'active',
        lastVisit: '2024-01-10',
        nextVisit: '2024-02-10',
        plan: 'Basic',
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
        goal: 'Emagrecimento'
    },
    {
        id: '3',
        name: 'Beatriz Costa',
        age: 26,
        status: 'inactive',
        lastVisit: '2023-11-20',
        nextVisit: null,
        plan: 'Basic',
        avatar: 'https://i.pravatar.cc/150?u=a04258114e29026302d',
        goal: 'Manutenção'
    },
    {
        id: '4',
        name: 'João Pedro',
        age: 30,
        status: 'active',
        lastVisit: '2024-01-20',
        nextVisit: '2024-02-20',
        plan: 'Premium',
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
        goal: 'Performance'
    },
    {
        id: '5',
        name: 'Mariana Lima',
        age: 29,
        status: 'active',
        lastVisit: '2024-01-22',
        nextVisit: '2024-02-22',
        plan: 'Premium',
        avatar: 'https://i.pravatar.cc/150?u=a04258a2462d826712d',
        goal: 'Saúde'
    }
];

export const PatientsList = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPatients = DUMMY_PATIENTS.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in slide-in-from-right duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight">Meus Pacientes</h2>
                    <p className="text-sm text-slate-400 font-medium">Gerenciamento de alunos e atletas</p>
                </div>
                <button className="w-10 h-10 rounded-xl bg-[#D4AF37] text-black flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                    <User size={20} className="fill-current" />
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Search size={18} className="text-slate-500 group-focus-within:text-[#D4AF37] transition-colors" />
                </div>
                <input
                    type="text"
                    placeholder="Buscar paciente..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-14 bg-black/20 border border-white/5 rounded-2xl pl-12 pr-4 text-white placeholder:text-slate-600 focus:border-[#D4AF37]/50 focus:bg-black/40 transition-all outline-none text-sm font-medium"
                />
            </div>

            {/* List */}
            <div className="grid gap-4">
                {filteredPatients.map((patient) => (
                    <div
                        key={patient.id}
                        onClick={() => navigate(`/profile/${patient.id}`)} // Navigate to patient profile
                        className="bg-[#1F2937]/40 backdrop-blur-xl border border-white/5 p-4 rounded-3xl flex items-center gap-4 cursor-pointer hover:border-[#D4AF37]/30 hover:bg-[#1F2937]/60 transition-all group"
                    >
                        {/* Avatar */}
                        <div className="w-14 h-14 rounded-2xl overflow-hidden border border-white/10 relative">
                            <img src={patient.avatar} alt={patient.name} className="w-full h-full object-cover" />
                            <div className={cn(
                                "absolute bottom-0 right-0 w-3 h-3 rounded-tl-lg",
                                patient.status === 'active' ? "bg-green-500" : "bg-red-500"
                            )} />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5">
                                <h3 className="text-white font-bold truncate group-hover:text-[#D4AF37] transition-colors">{patient.name}</h3>
                                <span className={cn(
                                    "text-[9px] font-black uppercase px-2 py-0.5 rounded-md",
                                    patient.plan === 'Premium' ? "bg-[#D4AF37]/20 text-[#D4AF37]" : "bg-white/5 text-slate-400"
                                )}>
                                    {patient.plan}
                                </span>
                            </div>
                            <div className="flex items-center gap-3 text-[10px] text-slate-400 font-medium">
                                <span className="flex items-center gap-1">
                                    <Activity size={10} />
                                    {patient.goal}
                                </span>
                                <span className="w-1 h-1 rounded-full bg-white/10" />
                                <span className="flex items-center gap-1">
                                    <Calendar size={10} />
                                    Próx: {patient.nextVisit ? new Date(patient.nextVisit).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) : 'N/A'}
                                </span>
                            </div>
                        </div>

                        {/* Action */}
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-white group-hover:bg-[#D4AF37] transition-all">
                            <ChevronRight size={16} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
