import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search,
    MapPin,
    Star,
    Heart,
    ChevronLeft,
    Filter,
    Stethoscope
} from 'lucide-react';
import { FluidBackground } from '@/components/layout/FluidBackground';
import { BottomNav } from '@/components/layout/BottomNav';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/useDebounce';

const SPECIALTIES = [
    { id: 'all', label: 'Todos' },
    { id: 'personal', label: 'Personal Trainer' },
    { id: 'nutri', label: 'Nutricionista' },
    { id: 'avaliador', label: 'Avaliador Físico' },
    { id: 'fisioterapeuta', label: 'Fisioterapeuta' }
];

export const SearchScreen: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [professionals, setProfessionals] = useState<any[]>([]);
    const [favorites, setFavorites] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(false);

    const debouncedSearch = useDebounce(searchTerm, 500);

    useEffect(() => {
        fetchFavorites();
    }, [user]);

    useEffect(() => {
        searchProfessionals();
    }, [debouncedSearch, activeFilter]);

    const fetchFavorites = async () => {
        if (!user) return;
        const { data } = await supabase
            .from('favorites')
            .select('professional_id')
            .eq('user_id', user.id);

        if (data) {
            setFavorites(new Set(data.map(f => f.professional_id)));
        }
    };

    const searchProfessionals = async () => {
        setLoading(true);
        try {
            let query = supabase
                .from('profiles')
                .select(`
                    id, 
                    full_name, 
                    nickname, 
                    avatar_url, 
                    rating, 
                    review_count, 
                    specialties(name),
                    address_city,
                    address_state
                `)
                .eq('role', 'profissional');

            // Text Search
            if (debouncedSearch) {
                query = query.or(`full_name.ilike.%${debouncedSearch}%,nickname.ilike.%${debouncedSearch}%,professional_code.eq.${debouncedSearch}`);
            }

            // Execute
            const { data, error } = await query;
            if (error) throw error;

            // Client-side filtering for specialty if needed (or join filter)
            // For now, simple client-side logic or improved query later depending on specialty structure
            setProfessionals(data || []);

        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleFavorite = async (proId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!user) return;

        const isFav = favorites.has(proId);

        // Optimistic UI update
        const newFavs = new Set(favorites);
        if (isFav) newFavs.delete(proId);
        else newFavs.add(proId);
        setFavorites(newFavs);

        try {
            if (isFav) {
                await supabase.from('favorites').delete().match({ user_id: user.id, professional_id: proId });
            } else {
                await supabase.from('favorites').insert({ user_id: user.id, professional_id: proId });
            }
        } catch (err) {
            console.error('Fav error:', err);
            fetchFavorites(); // Revert on error
        }
    };

    return (
        <FluidBackground variant="luminous" className="pb-32 font-sans px-5 min-h-screen">
            <header className="pt-8 mb-6">
                <div className="flex justify-between items-center mb-6">
                    <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400">
                        <ChevronLeft size={24} />
                    </button>
                    <h1 className="text-white font-bold text-lg">Encontrar <span className="text-[#CCFF00]">Profissional</span></h1>
                    <div className="w-10" />
                </div>

                {/* Search Bar */}
                <div className="relative mb-6">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <Search size={20} />
                    </div>
                    <input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Nome, Apelido ou ID..."
                        className="w-full h-14 bg-white/10 border border-white/10 rounded-2xl pl-12 pr-4 text-white placeholder:text-slate-500 focus:border-[#CCFF00]/50 outline-none transition-all"
                    />
                </div>

                {/* Filters Carousel */}
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {SPECIALTIES.map(s => (
                        <button
                            key={s.id}
                            onClick={() => setActiveFilter(s.id)}
                            className={cn(
                                "px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border",
                                activeFilter === s.id
                                    ? "bg-[#CCFF00] text-black border-[#CCFF00]"
                                    : "bg-white/5 text-slate-400 border-white/10"
                            )}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>
            </header>

            {/* Results */}
            <div className="space-y-4">
                {loading ? (
                    <div className="text-center text-slate-500 py-10">Buscando...</div>
                ) : professionals.length > 0 ? (
                    professionals.map((pro) => (
                        <div
                            key={pro.id}
                            onClick={() => navigate(`/profile/${pro.id}`)}
                            className="bg-black/40 backdrop-blur-md border border-white/10 rounded-[1.5rem] p-4 relative overflow-hidden group active:scale-98 transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/10">
                                    <img
                                        src={pro.avatar_url || `https://ui-avatars.com/api/?name=${pro.full_name}&background=random`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-white font-bold text-sm leading-tight mb-1">
                                                {pro.nickname ? `"${pro.nickname}"` : pro.full_name}
                                            </h3>
                                            <p className="text-[#CCFF00] text-[10px] uppercase font-black tracking-wider">
                                                {pro.specialties?.name || 'Especialista'}
                                            </p>
                                        </div>
                                        <button
                                            onClick={(e) => toggleFavorite(pro.id, e)}
                                            className="text-slate-500 hover:text-red-500 transition-colors"
                                        >
                                            <Heart
                                                size={20}
                                                fill={favorites.has(pro.id) ? "#ef4444" : "none"}
                                                className={favorites.has(pro.id) ? "text-red-500" : ""}
                                            />
                                        </button>
                                    </div>

                                    <div className="mt-3 flex items-center gap-4 text-xs text-slate-400">
                                        <div className="flex items-center gap-1">
                                            <Star size={12} className="text-amber-400 fill-amber-400" />
                                            <span className="text-white font-bold">{pro.rating || '5.0'}</span>
                                            <span className="text-[10px]">({pro.review_count || 0})</span>
                                        </div>
                                        {pro.address_city && (
                                            <div className="flex items-center gap-1">
                                                <MapPin size={12} />
                                                <span>{pro.address_city}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-600">
                            <Search size={32} />
                        </div>
                        <p className="text-slate-400 text-sm">Nenhum profissional encontrado.</p>
                    </div>
                )}
            </div>

            <BottomNav activeTab="search" />
        </FluidBackground>
    );
};
