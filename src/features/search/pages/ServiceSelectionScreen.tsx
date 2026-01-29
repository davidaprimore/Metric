import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Clock, ShieldCheck, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';

export const ServiceSelectionScreen = () => {
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
                .select('id, full_name, nickname, avatar_url, gender, role')
                .eq('id', id)
                .single();

            if (error) throw error;
            setProfessional(data);
        } catch (err) {
            console.error('Error fetching professional:', err);
        } finally {
            setLoading(false);
        }
    };

    const getAvatarUrl = (pro: any) => {
        if (!pro) return '';
        if (pro.avatar_url) return pro.avatar_url;

        const gender = pro.gender?.toLowerCase();
        if (gender === 'female' || gender === 'feminino' || gender === 'f' || gender === 'mulher') {
            return `https://avatar.iran.liara.run/public/girl?username=${pro.id}`;
        }
        return `https://avatar.iran.liara.run/public/boy?username=${pro.id}`;
    };

    // Mock Services (Would fetch from DB in real scenario)
    const services = [
        {
            id: 'basic', // Matches ScheduleScreen 'basic' plan
            title: "Avaliação Básica",
            description: "Avaliação completa por profissional habilitado. Bioimpedância e relatório imediato.",
            duration: "30 min",
            price: 39.90
        },
        {
            id: 'premium', // Matches ScheduleScreen 'premium' plan
            title: "Avaliação Individualizada",
            description: "Exclusivo com mentor. Treinamento 100% sob medida e suporte 24/7.",
            duration: "60 min",
            price: 89.90
        }
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!professional) {
        return (
            <div className="min-h-screen bg-[#F7F7F7] flex flex-col items-center justify-center p-6 text-center">
                <AlertCircle size={48} className="text-gray-300 mb-4" />
                <h2 className="text-lg font-bold text-gray-700 mb-2">Profissional não encontrado</h2>
                <Button variant="outline" onClick={() => navigate(-1)}>Voltar</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F7F7F7] p-6 pb-24">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-600 hover:bg-gray-100 shadow-sm border border-gray-100"
                >
                    <ChevronLeft size={24} />
                </button>
                <h1 className="text-xl font-bold text-[#222222]">Selecione o Serviço</h1>
            </div>

            {/* Professional Quick Info */}
            <div className="flex items-center gap-3 mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden border border-gray-100">
                    <img
                        src={getAvatarUrl(professional)}
                        alt="Pro"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div>
                    <p className="text-sm font-bold text-[#222222]">{professional.nickname || professional.full_name}</p>
                    <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
                        <ShieldCheck size={12} />
                        <span className="uppercase tracking-wide">Profissional Verificado</span>
                    </div>
                </div>
            </div>

            {/* Services Grid */}
            <div className="space-y-4">
                {services.map((service) => (
                    <div
                        key={service.id}
                        className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-gray-100 hover:border-emerald-500/30 transition-all active:scale-[0.99] cursor-pointer group relative overflow-hidden"
                        onClick={() => navigate('/schedule', {
                            state: {
                                professionalId: professional.id,
                                plan: service.id // Passing the plan ID to pre-select
                            }
                        })}
                    >
                        {/* Decorative Blob */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-[4rem] rounded-tr-[1.5rem] -mr-4 -mt-4 transition-transform group-hover:scale-110" />

                        <div className="relative z-10">
                            <h3 className="text-lg font-black text-[#222222] mb-1">{service.title}</h3>
                            <p className="text-sm text-gray-500 mb-4 font-medium leading-relaxed max-w-[90%]">
                                {service.description}
                            </p>

                            <div className="flex items-center justify-between mt-4">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-100">
                                        <Clock size={14} className="text-emerald-600" />
                                        {service.duration}
                                    </div>
                                    <div className="flex items-center gap-1 text-base font-black text-[#222222]">
                                        R$ {service.price.toFixed(2)}
                                    </div>
                                </div>

                                <Button
                                    size="sm"
                                    className="rounded-xl px-5 h-9 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wide shadow-lg shadow-emerald-200"
                                >
                                    Agendar
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <p className="text-center text-xs text-gray-400 mt-8 font-medium">
                Selecione um serviço para visualizar o calendário.
            </p>
        </div>
    );
};
