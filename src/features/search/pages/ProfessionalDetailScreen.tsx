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
    Activity,
    AlertCircle
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export const ProfessionalDetailScreen = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [professional, setProfessional] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) fetchProfessional();
    }, [id]);

    const fetchProfessional = async () => {
        try {
            // Simplified query first to avoid missing column errors if possible
            // But we need the data.
            const { data, error } = await supabase
                .from('profiles')
                .select(`
                    id, full_name, nickname, avatar_url,
                    rating, review_count, bio, nano_bio,
                    specialties(name),
                    address_city, address_state,
                    role
                `)
                .eq('id', id)
                .single();

            if (error) {
                // If specific column error, fallback? Not easy with Supabase-js.
                throw error;
            }
            setProfessional(data);
        } catch (error: any) {
            console.error('Error fetching professional:', error);
            setError(error.message || "Não foi possível carregar os dados do profissional.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center text-gray-500">
                <div className="w-10 h-10 border-4 border-[#FF385C] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (error || !professional) {
        return (
            <div className="min-h-screen bg-[#F7F7F7] flex flex-col items-center justify-center p-6 text-center">
                <AlertCircle size={48} className="text-gray-300 mb-4" />
                <h2 className="text-lg font-bold text-gray-700 mb-2">Ops! Algo deu errado.</h2>
                <p className="text-sm text-gray-500 mb-6 max-w-xs">{error || "Profissional não encontrado."}</p>
                <Button variant="outline" onClick={() => navigate(-1)} className="bg-white border-gray-200">
                    Voltar
                </Button>
            </div>
        );
    }

    // Default Banner
    const bannerUrl = "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop";

    return (
        <div className="min-h-screen bg-[#F7F7F7] pb-32 w-full text-left">
            {/* Cover Image & Header Actions */}
            <div className="h-64 bg-gray-900 relative overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-overlay"
                    style={{ backgroundImage: `url('${bannerUrl}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />

                <header className="absolute top-0 w-full px-6 pt-8 flex justify-between items-center z-10 w-full">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-all border border-white/10 shadow-lg"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <div className="flex gap-3">
                        <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-all border border-white/10 shadow-lg">
                            <Share2 size={20} />
                        </button>
                    </div>
                </header>
            </div>

            {/* Profile Content Container */}
            <div className="-mt-10 px-4 relative z-20 w-full max-w-md mx-auto">
                <div className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-6 shadow-xl shadow-black/5 border border-white/50 relative">

                    {/* ID Badge */}
                    <div className="absolute top-6 right-6 flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-green-100 shadow-sm z-20">
                        <ShieldCheck size={12} />
                        Verificado
                    </div>

                    {/* Avatar & Basic Info */}
                    <div className="flex flex-col items-center -mt-16 mb-6 relative z-10">
                        <div className="w-28 h-28 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gray-100 mb-4 cursor-pointer active:scale-95 transition-transform">
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
                            {professional.specialties?.[0]?.name || professional.role || "Especialista"}
                        </p>

                        <div className="flex flex-wrap justify-center items-center gap-3 text-xs font-semibold text-gray-600 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100">
                            <div className="flex items-center gap-1.5">
                                <MapPin size={14} className="text-[#FF385C]" />
                                {professional.address_city || "Online"}
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
                        <div className="bg-white rounded-2xl p-3 text-center border border-gray-100 shadow-sm">
                            <p className="text-xl font-black text-[#222222]">1.2k</p>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Pacientes</p>
                        </div>
                        <div className="bg-white rounded-2xl p-3 text-center border border-gray-100 shadow-sm">
                            <p className="text-xl font-black text-[#222222]">5+</p>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Anos Exp.</p>
                        </div>
                        <div className="bg-white rounded-2xl p-3 text-center border border-gray-100 shadow-sm">
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
                        <p className="text-sm text-gray-600 leading-relaxed font-medium text-left bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                            {professional.bio || professional.nano_bio || "Olá! Sou especialista em ajudar pessoas a atingirem seus objetivos de saúde através de uma abordagem baseada em dados e acompanhamento personalizado. Com metodologia comprovada, vamos transformar sua qualidade de vida juntos."}
                        </p>
                    </div>

                    {/* Education / Certifications (New Point) */}
                    <div className="mb-8">
                        <h3 className="text-lg font-bold text-[#222222] mb-3 flex items-center gap-2">
                            <ShieldCheck className="text-[#FF385C]" size={18} />
                            Formação
                        </h3>
                        <ul className="space-y-2">
                            <li className="flex items-start gap-2 text-sm text-gray-600 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#FF385C] mt-1.5 shrink-0" />
                                <span>Bacharel em Educação Física (UFRJ)</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm text-gray-600 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#FF385C] mt-1.5 shrink-0" />
                                <span>Pós-graduação em Fisiologia do Exercício</span>
                            </li>
                        </ul>
                    </div>

                    {/* Service Hours */}
                    <div className="mb-8">
                        <h3 className="text-lg font-bold text-[#222222] mb-3 flex items-center gap-2">
                            <Calendar className="text-[#FF385C]" size={18} />
                            Atendimento
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-center">
                                <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Seg - Sex</p>
                                <p className="text-sm font-bold text-[#222222]">06:00 - 22:00</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-center">
                                <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Sábados</p>
                                <p className="text-sm font-bold text-[#222222]">08:00 - 14:00</p>
                            </div>
                        </div>
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

                    {/* CTA Area */}
                    <div className="bg-gradient-to-br from-[#FF385C]/10 to-[#FF385C]/5 rounded-2xl p-4 border border-[#FF385C]/20 text-center mb-4">
                        <p className="text-sm font-bold text-[#FF385C] mb-1">Pronto para começar?</p>
                        <p className="text-xs text-gray-500">Agende sua avaliação inicial e comece sua transformação.</p>
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
