import { motion } from 'framer-motion';
import { useState } from 'react';
import {
    Search,
    Filter,
    ChevronRight,
    Calendar,
    Activity,
    UserPlus
} from 'lucide-react';

const patients = [
    { id: '1', name: 'Marina Silva', age: 28, lastVisit: '10 Jan, 2026', status: 'active', goal: 'Emagrecimento', avatar: 'https://i.pravatar.cc/150?img=1', healthScore: 85 },
    { id: '2', name: 'João Pedro', age: 34, lastVisit: '15 Jan, 2026', status: 'active', goal: 'Hipertrofia', avatar: 'https://i.pravatar.cc/150?img=3', healthScore: 92 },
    { id: '3', name: 'Ana Paula', age: 42, lastVisit: '05 Jan, 2026', status: 'waiting', goal: 'Saúde Intestinal', avatar: 'https://i.pravatar.cc/150?img=5', healthScore: 78 },
    { id: '4', name: 'Carlos Eduardo', age: 29, lastVisit: '20 Dez, 2025', status: 'active', goal: 'Performance', avatar: 'https://i.pravatar.cc/150?img=8', healthScore: 88 },
    { id: '5', name: 'Beatriz Costa', age: 31, lastVisit: '12 Jan, 2026', status: 'active', goal: 'Bem-estar', avatar: 'https://i.pravatar.cc/150?img=10', healthScore: 95 },
];

export function PatientsListScreen({
    onSelectPatient
}: {
    onSelectPatient: (patientId: string) => void
}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<'all' | 'active' | 'waiting'>('all');

    const filteredPatients = patients.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'all' || p.status === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="min-h-screen bg-gray-50 pb-24 max-w-[430px] mx-auto overflow-x-hidden">
            {/* Header */}
            <div className="bg-white px-6 pt-safe pb-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold text-gray-800">Meus Pacientes</h1>
                    <button className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-purple-600/20 active:scale-95 transition-transform">
                        <UserPlus className="w-5 h-5" />
                    </button>
                </div>

                {/* Search & Filter */}
                <div className="space-y-3">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar paciente..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-100 border-none rounded-2xl py-3.5 pl-12 pr-4 text-gray-800 focus:ring-2 focus:ring-purple-500/20 transition-all font-medium"
                        />
                    </div>

                    <div className="flex gap-2">
                        {[
                            { id: 'all', label: 'Todos', count: patients.length },
                            { id: 'active', label: 'Ativos', count: patients.filter(p => p.status === 'active').length },
                            { id: 'waiting', label: 'Em espera', count: patients.filter(p => p.status === 'waiting').length },
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setFilter(item.id as any)}
                                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${filter === item.id
                                        ? 'bg-purple-600 text-white shadow-md'
                                        : 'bg-white text-gray-500 border border-gray-100'
                                    }`}
                            >
                                {item.label} ({item.count})
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-4">
                {filteredPatients.map((patient, idx) => (
                    <motion.div
                        key={patient.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => onSelectPatient(patient.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 cursor-pointer group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <img src={patient.avatar} className="w-14 h-14 rounded-2xl object-cover" alt={patient.name} />
                                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${patient.status === 'active' ? 'bg-green-500' : 'bg-orange-500'
                                    }`} />
                            </div>

                            <div className="flex-1">
                                <h3 className="font-bold text-gray-800">{patient.name}</h3>
                                <p className="text-xs text-gray-500">{patient.age} anos • {patient.goal}</p>
                            </div>

                            <div className="text-right">
                                <div className="flex items-center gap-1 text-purple-600 mb-1">
                                    <Activity className="w-3 h-3" />
                                    <span className="text-[11px] font-bold">{patient.healthScore}%</span>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-purple-400 transition-colors ml-auto" />
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-gray-400">
                                <Calendar className="w-3.5 h-3.5" />
                                <span className="text-[10px] uppercase font-bold tracking-tight">Última: {patient.lastVisit}</span>
                            </div>
                            <button className="px-3 py-1.5 bg-purple-50 text-purple-600 rounded-full text-[10px] font-bold">
                                VER PRONTUÁRIO
                            </button>
                        </div>
                    </motion.div>
                ))}

                {filteredPatients.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-400 font-medium">Nenhum paciente encontrado</p>
                    </div>
                )}
            </div>
        </div>
    );
}
