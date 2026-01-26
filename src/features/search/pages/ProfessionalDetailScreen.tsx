import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    MapPin,
    Star,
    ShieldCheck,
    Calendar,
    MessageCircle,
    Share2,
    Award,
    Activity
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export const ProfessionalDetailScreen = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [professional, setProfessional] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) fetchProfessional();
    }, [id]);

    const fetchProfessional = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select(`
                    id, full_name, nickname, avatar_url,
                    rating, review_count, bio,
                    specialties(name),
                    address_city, address_state,
                    role
                `)
                .eq('id', id)
                .single();

            if (error) throw error;
            setProfessional(data);
        } catch (error) {
            console.error('Error fetching professional:', error);
            // navigate('/search'); // Optional: redirect if not found
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-[#FF385C] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!professional) return null;

    return (
        <div className="min-h-screen bg-[#F7F7F7] pb-32">
            {/* Cover Image & Header Actions */}
            <div className="h-64 bg-gradient-to-br from-gray-800 to-gray-900 relative">
                {/* Simulated Cover Image */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>

                <header className="absolute top-0 w-full px-6 pt-8 flex justify-between items-center z-10">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-all border border-white/10"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <div className="flex gap-3">
                        <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-all border border-white/10">
                            <Share2 size={20} />
                        </button>
                    </div>
                </header>
            </div>

            {/* Profile Content Container */}
            <div className="-mt-10 px-4 relative z-20">
                <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-6 shadow-xl shadow-black/5 border border-white/50 relative overflow-hidden">

                    {/* ID Badge */}
                    <div className="absolute top-6 right-6 flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-green-100">
                        <ShieldCheck size={12} />
                        Verificado
                    </div>

                    {/* Avatar & Basic Info */}
                    <div className="flex flex-col items-center -mt-16 mb-6">
                        <div className="w-28 h-28 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100 mb-4">
                            <img
                                src={professional.avatar_url || `https://ui-avatars.com/api/?name=${professional.full_name}&background=f3f4f6&color=000`}
                                className="w-full h-full object-cover"
                                alt={professional.full_name}
                            />
                        </div>

                        <h1 className="text-2xl font-black text-[#222222] text-center leading-tight mb-1">
                            {professional.nickname || professional.full_name}
                        </h1>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 text-center">
                            {professional.specialties?.[0]?.name || professional.role}
                        </p>

                        <div className="flex items-center gap-4 text-xs font-semibold text-gray-600 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100">
                            <div className="flex items-center gap-1.5">
                                <MapPin size={14} className="text-[#FF385C]" />
                                {professional.address_city || "Online"}, {professional.address_state || "BR"}
                            </div>
                            <div className="w-px h-3 bg-gray-300"></div>
                            <div className="flex items-center gap-1.5">
                                <Star size={14} className="text-amber-400 fill-amber-400" />
                                {professional.rating ? Number(professional.rating).toFixed(1) : "Novo"}
                                <span className="text-gray-400 font-normal">({professional.review_count || 0})</span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-3 mb-8">
                        <div className="bg-gray-50 rounded-2xl p-3 text-center border border-gray-100">
                            <p className="text-xl font-black text-[#222222]">1.2k</p>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Pacientes</p>
                        </div>
                        <div className="bg-gray-50 rounded-2xl p-3 text-center border border-gray-100">
                            <p className="text-xl font-black text-[#222222]">5+</p>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Anos Exp.</p>
                        </div>
                        <div className="bg-gray-50 rounded-2xl p-3 text-center border border-gray-100">
                            <p className="text-xl font-black text-[#222222]">4.9</p>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Avaliação</p>
                        </div>
                    </div>

                    {/* Introduction / Bio */}
                    <div className="mb-8">
                        <h3 className="text-lg font-bold text-[#222222] mb-3 flex items-center gap-2">
                            <Award className="text-[#FF385C]" size={18} />
                            Sobre
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed font-medium">
                            {professional.bio || "Olá! Sou especialista em ajudar pessoas a atingirem seus objetivos de saúde através de uma abordagem baseada em dados e acompanhamento personalizado. Com metodologia comprovada, vamos transformar sua qualidade de vida juntos."}
                        </p>
                    </div>

                    {/* Services Included */}
                    <div className="mb-8">
                        <h3 className="text-lg font-bold text-[#222222] mb-3 flex items-center gap-2">
                            <Activity className="text-[#FF385C]" size={18} />
                            Especialidades
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {['Avaliação Física', 'Prescrição de Treino', 'Consultoria Online', 'Nutrição Esportiva'].map((tag, i) => (
                                <span key={i} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600 shadow-sm">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-xl border-t border-gray-200 z-40 max-w-md mx-auto">
                <div className="flex gap-3 items-center">
                    <div className="flex flex-col">
                        <span className="text-xs font-medium text-gray-500">Valor da consulta</span>
                        <span className="text-xl font-black text-[#222222]">
                            R$ 150 <span className="text-sm font-normal text-gray-400">/hr</span>
                        </span>
                    </div>
                    <Button
                        variant="primary"
                        className="flex-1 h-14 rounded-2xl bg-[#FF385C] hover:bg-[#e01f45] shadow-lg shadow-rose-200 text-sm font-bold uppercase tracking-wide"
                        onClick={() => navigate('/schedule')}
                    >
                        Agendar Agora
                    </Button>
                </div>
            </div>
        </div>
    );
};
