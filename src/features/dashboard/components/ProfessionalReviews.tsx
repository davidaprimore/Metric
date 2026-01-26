import React from 'react';
import { Star, ThumbsUp, MessageSquare, Quote } from 'lucide-react';

const DUMMY_REVIEWS = [
    {
        id: 1,
        client: 'Marcos Oliveira',
        rating: 5,
        date: 'Há 2 dias',
        comment: 'Profissional excelente! A avaliação foi super detalhada e o plano de treino está dando muito resultado.',
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d'
    },
    {
        id: 2,
        client: 'Juliana Santos',
        rating: 5,
        date: 'Há 1 semana',
        comment: 'Adorei a atenção e o cuidado. O ambiente é ótimo e me senti muito à vontade.',
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d'
    },
    {
        id: 3,
        client: 'Pedro Henrique',
        rating: 4,
        date: 'Há 2 semanas',
        comment: 'Muito bom, mas o horário poderia ser mais flexível. O resultado tem sido ótimo.',
        avatar: 'https://i.pravatar.cc/150?u=a04258114e29026302d'
    },
    {
        id: 4,
        client: 'Carla Dias',
        rating: 5,
        date: 'Há 3 semanas',
        comment: 'O melhor profissional que já passei. A bioimpedância é muito precisa!',
        avatar: 'https://i.pravatar.cc/150?u=a048581f4e29026024d'
    }
];

export const ProfessionalReviews = () => {
    return (
        <div className="space-y-8 animate-in slide-in-from-right duration-500">
            {/* Summary Header */}
            <div className="bg-[#D4AF37] rounded-[2.5rem] p-8 shadow-[0_10px_40px_rgba(212,175,55,0.2)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <p className="text-black/60 font-black uppercase tracking-widest text-xs mb-1">Média Geral</p>
                        <h2 className="text-5xl font-black text-black tracking-tighter">4.9</h2>
                        <div className="flex items-center gap-1 mt-2 text-black/80">
                            {[1, 2, 3, 4, 5].map((_, i) => (
                                <Star key={i} size={16} fill="currentColor" strokeWidth={0} />
                            ))}
                            <span className="text-xs font-bold ml-2">(128 avaliações)</span>
                        </div>
                    </div>
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                        <ThumbsUp size={32} className="text-white" />
                    </div>
                </div>
            </div>

            {/* Reviews List */}
            <div>
                <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-6 pl-2">Comentários Recentes</h3>
                <div className="space-y-4">
                    {DUMMY_REVIEWS.map((review) => (
                        <div key={review.id} className="bg-[#1F2937]/40 backdrop-blur-xl border border-white/5 p-6 rounded-[2rem] hover:border-[#D4AF37]/20 transition-all">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <img src={review.avatar} alt={review.client} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                                    <div>
                                        <h4 className="text-white font-bold text-sm">{review.client}</h4>
                                        <p className="text-[10px] text-slate-500 font-medium">{review.date}</p>
                                    </div>
                                </div>
                                <div className="flex gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={12}
                                            className={i < review.rating ? "text-[#D4AF37] fill-[#D4AF37]" : "text-slate-700"}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="relative pl-4">
                                <div className="absolute left-0 top-0 w-0.5 h-full bg-white/10 rounded-full"></div>
                                <Quote size={12} className="text-slate-600 mb-1 rotate-180" />
                                <p className="text-sm text-slate-300 italic leading-relaxed">"{review.comment}"</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
