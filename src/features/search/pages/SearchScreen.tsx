import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search,
    MapPin,
    Star,
    Heart,
    ChevronLeft,
    Dumbbell,
    Salad,
    Activity,
    Stethoscope
} from 'lucide-react';
import { FluidBackground } from '@/components/layout/FluidBackground';
import { BottomNav } from '@/components/layout/BottomNav';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/useDebounce';

// Mapping specialty IDs to Icons (Airbnb Style Categories)
const CATEGORIES = [
    { id: 'all', label: 'Tudo', icon: Search },
    { id: 'personal', label: 'Personal', icon: Dumbbell },
    { id: 'nutri', label: 'Nutri', icon: Salad },
    { id: 'avaliador', label: 'Avaliação', icon: Activity },
    { id: 'fisioterapeuta', label: 'Fisio', icon: Stethoscope }
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

            if (debouncedSearch) {
                query = query.or(`full_name.ilike.%${debouncedSearch}%,nickname.ilike.%${debouncedSearch}%,professional_code.eq.${debouncedSearch}`);
            }

            const { data, error } = await query;
            if (error) throw error;
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
            fetchFavorites();
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white font-sans pb-32">
            {/* Mobile Layout Constraint */}
            <div className="max-w-md mx-auto w-full relative min-h-screen bg-[#0A0A0A]">

                {/* Header (Airbnb Style) - Clean & Floating */}
                <header className="sticky top-0 z-30 bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-white/5 pt-6 pb-2 px-5">
                    {/* Search Bar */}
                    <div className="flex items-center gap-3 mb-6">
                        <button
                            onClick={() => navigate(-1)}
                            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white active:scale-90 transition-all"
                        >
                            <ChevronLeft size={22} />
                        </button>
                        <div className="flex-1 h-12 bg-white/10 rounded-full flex items-center px-5 shadow-lg shadow-black/20 border border-white/5">
                            <Search size={18} className="text-white/60 mr-3" />
                            <input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Buscar profissionais..."
                                className="flex-1 bg-transparent text-sm font-medium text-white placeholder:text-white/40 outline-none"
                            />
                        </div>
                    </div>

                    {/* Categories (Airbnb Icons) */}
                    <div className="flex gap-6 overflow-x-auto pb-2 no-scrollbar px-1">
                        {CATEGORIES.map(cat => {
                            const Icon = cat.icon;
                            const isActive = activeFilter === cat.id;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveFilter(cat.id)}
                                    className="flex flex-col items-center gap-2 group min-w-[64px] transition-opacity"
                                >
                                    <div className={cn(
                                        "w-8 h-8 flex items-center justify-center transition-all duration-300",
                                        isActive
                                            ? "text-white scale-110"
                                            : "text-white/40 group-hover:text-white/70"
                                    )}>
                                        <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                                    </div>
                                    <span className={cn(
                                        "text-[10px] font-medium transition-colors relative",
                                        isActive ? "text-white" : "text-white/40"
                                    )}>
                                        {cat.label}
                                        {isActive && (
                                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full mt-1" />
                                        )}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </header>

                {/* Results List */}
                <div className="p-5 space-y-6">
                    {loading ? (
                        <div className="text-center py-20 space-y-3 animate-pulse">
                            <div className="w-12 h-12 bg-white/10 rounded-full mx-auto" />
                            <p className="text-xs font-medium text-white/30 uppercase tracking-widest">Buscando...</p>
                        </div>
                    ) : professionals.length > 0 ? (
                        professionals.map((pro) => (
                            <div
                                key={pro.id}
                                onClick={() => navigate(`/profile/${pro.id}`)}
                                className="group cursor-pointer active:scale-[0.98] transition-transform duration-200"
                            >
                                {/* Card Image Area */}
                                <div className="aspect-[4/3] rounded-[1.5rem] overflow-hidden relative mb-3 bg-white/5">
                                    <img
                                        src={pro.avatar_url || `https://ui-avatars.com/api/?name=${pro.full_name}&background=1A1A1A&color=fff`}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />

                                    {/* Overlay Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                                    {/* Favorite Button (Top Right) */}
                                    <button
                                        onClick={(e) => toggleFavorite(pro.id, e)}
                                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white/80 transition-transform active:scale-75"
                                    >
                                        <Heart
                                            size={18}
                                            fill={favorites.has(pro.id) ? "#ef4444" : "rgba(0,0,0,0.5)"}
                                            className={favorites.has(pro.id) ? "text-red-500" : "text-white"}
                                        />
                                    </button>

                                    {/* Rating Badge (Top Left) */}
                                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                                        <Star size={10} className="text-black fill-black" />
                                        <span className="text-[10px] font-black text-black leading-none">{pro.rating || '5.0'}</span>
                                    </div>
                                </div>

                                {/* Card Details */}
                                <div>
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="text-white font-bold text-lg leading-tight">
                                            {pro.nickname || pro.full_name}
                                        </h3>
                                        {pro.address_city && (
                                            <div className="flex items-center gap-1 text-white/40 text-xs font-medium">
                                                <MapPin size={12} />
                                                <span>{pro.address_city}</span>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-white/50 text-sm font-medium">
                                        {pro.specialties?.name || 'Profissional Certificado'}
                                    </p>
                                    <p className="text-white/30 text-xs mt-1">
                                        <span className="text-white font-bold">R$ 150</span> <span className="font-normal">/ avaliação</span>
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-24 opacity-40">
                            <Search size={40} className="mx-auto mb-4 text-white/20" />
                            <p className="text-sm font-medium text-white mb-1">Nenhum resultado</p>
                            <p className="text-xs text-white/50">Tente ajustar seus filtros</p>
                        </div>
                    )}
                </div>
            </div>

            <BottomNav activeTab="search" />
        </div>
    );
};
