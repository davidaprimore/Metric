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
    Stethoscope,
    SlidersHorizontal,
    FilterX
} from 'lucide-react';
import { BottomNav } from '@/components/layout/BottomNav';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/useDebounce';

// Colors added to categories for visual appeal
const CATEGORIES = [
    { id: 'all', label: 'Todos', icon: Search, color: 'text-gray-600', bg: 'bg-gray-100', cardBg: 'bg-white' },
    { id: 'personal', label: 'Personal', icon: Dumbbell, color: 'text-blue-500', bg: 'bg-blue-50', cardBg: 'bg-blue-50/60' },
    { id: 'nutri', label: 'Nutri', icon: Salad, color: 'text-emerald-500', bg: 'bg-emerald-50', cardBg: 'bg-emerald-50/60' },
    { id: 'avaliador', label: 'Avaliação', icon: Activity, color: 'text-rose-500', bg: 'bg-rose-50', cardBg: 'bg-rose-50/60' },
    { id: 'fisioterapeuta', label: 'Fisio', icon: Stethoscope, color: 'text-teal-500', bg: 'bg-teal-50', cardBg: 'bg-teal-50/60' }
];

export const SearchScreen: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [professionals, setProfessionals] = useState<any[]>([]);
    const [favorites, setFavorites] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

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

    const getCardBackground = (specialtyName?: string) => {
        if (!specialtyName) return 'bg-white/80';
        const lower = specialtyName.toLowerCase();
        if (lower.includes('personal')) return 'bg-blue-50/80 hover:bg-blue-100/80';
        if (lower.includes('nutri')) return 'bg-emerald-50/80 hover:bg-emerald-100/80';
        if (lower.includes('fisio')) return 'bg-teal-50/80 hover:bg-teal-100/80';
        if (lower.includes('avalia')) return 'bg-rose-50/80 hover:bg-rose-100/80';
        return 'bg-white/80 hover:bg-gray-50/90';
    };

    return (
        <div className="min-h-screen bg-[#F7F7F7] text-[#222222] font-sans pb-32">
            {/* Mobile Layout Constraint */}
            <div className="max-w-md mx-auto w-full relative min-h-screen bg-white shadow-xl shadow-black/5">

                {/* Header */}
                <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md pt-6 pb-2 px-5 border-b border-gray-100/50">
                    {/* Search Bar */}
                    <div className="flex items-center gap-3 mb-6">
                        <button
                            onClick={() => navigate(-1)}
                            className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-[#222222] hover:bg-gray-100 active:scale-95 transition-all"
                        >
                            <ChevronLeft size={24} strokeWidth={2.5} />
                        </button>

                        <div className="flex-1 h-12 bg-white rounded-full flex items-center px-2 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.1)] border border-gray-100">
                            <div className="w-9 h-9 rounded-full bg-[#FF385C] flex items-center justify-center shadow-sm">
                                <Search size={16} className="text-white" strokeWidth={3} />
                            </div>
                            <div className="flex-1 px-3">
                                <span className="block text-[10px] font-bold text-gray-400 leading-none mb-0.5">Encontre seu pro</span>
                                <input
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Nome, Apelido ou ID..."
                                    className="w-full bg-transparent text-sm font-semibold text-[#222222] placeholder:text-gray-300 outline-none leading-none h-4"
                                />
                            </div>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="w-9 h-9 rounded-full hover:bg-gray-50 flex items-center justify-center text-gray-400 transition-colors"
                            >
                                <SlidersHorizontal size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Filter Chips (Location/Price/Rating stub) */}
                    {showFilters && (
                        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                            <button className="px-3 py-1.5 rounded-full bg-gray-100 text-xs font-bold text-gray-600 border border-transparent hover:border-gray-200">📍 Perto de mim</button>
                            <button className="px-3 py-1.5 rounded-full bg-gray-100 text-xs font-bold text-gray-600 border border-transparent hover:border-gray-200">⭐ Melhor avaliados</button>
                            <button className="px-3 py-1.5 rounded-full bg-gray-100 text-xs font-bold text-gray-600 border border-transparent hover:border-gray-200">💲 Menor preço</button>
                        </div>
                    )}

                    {/* Categories - Colored & Scrollable */}
                    <div className="flex gap-4 overflow-x-auto pb-4 -mx-5 px-5 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        {CATEGORIES.map((cat) => {
                            const Icon = cat.icon;
                            const isActive = activeFilter === cat.id;

                            // Always colored, but semi-transparent if inactive
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveFilter(cat.id)}
                                    className={cn(
                                        "flex flex-col items-center gap-2 min-w-[70px] transition-all duration-300",
                                        isActive ? "opacity-100 scale-105" : "opacity-70 hover:opacity-100 hover:scale-105"
                                    )}
                                >
                                    <div className={cn(
                                        "w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm transition-all border",
                                        isActive
                                            ? `${cat.bg} border-${cat.color.split('-')[1]}-200 shadow-${cat.color.split('-')[1]}-200/50`
                                            : `${cat.bg.replace('50', '50/50')} border-transparent`
                                    )}>
                                        <Icon
                                            size={24}
                                            // Always use the category color
                                            className={cat.color}
                                            strokeWidth={2.5}
                                        />
                                    </div>
                                    <span className={cn(
                                        "text-[11px] font-bold transition-colors",
                                        isActive ? "text-[#222222]" : "text-gray-400"
                                    )}>
                                        {cat.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </header>

                {/* Results List - Pastel Cards */}
                <div className="p-5 space-y-4">
                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex gap-4 animate-pulse">
                                    <div className="w-20 h-20 bg-gray-100 rounded-full shrink-0" />
                                    <div className="flex-1 space-y-2 py-4">
                                        <div className="h-4 bg-gray-100 rounded w-3/4" />
                                        <div className="h-3 bg-gray-100 rounded w-1/2" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : professionals.length > 0 ? (
                        professionals.map((pro) => (
                            <div
                                key={pro.id}
                                onClick={() => navigate(`/profile/${pro.id}`)}
                                className={cn(
                                    "group rounded-[2rem] p-4 flex gap-4 active:scale-[0.98] transition-all cursor-pointer backdrop-blur-md border border-white/40 shadow-sm",
                                    getCardBackground(pro.specialties?.name)
                                )}
                            >
                                {/* Photo - Round Avatar */}
                                <div className="w-20 h-20 rounded-full overflow-hidden bg-white shadow-sm border-2 border-white relative shrink-0">
                                    <img
                                        src={pro.avatar_url || `https://ui-avatars.com/api/?name=${pro.full_name}&background=f3f4f6&color=000`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Info - Right Side */}
                                <div className="flex-1 py-1 flex flex-col justify-between relative">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-[#222222] font-bold text-lg leading-tight pr-8">
                                                {pro.nickname || pro.full_name}
                                            </h3>
                                        </div>

                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="bg-white/60 px-2 py-0.5 rounded-md text-[10px] font-bold text-gray-500 uppercase tracking-wide">
                                                {pro.specialties?.name || 'Profissional'}
                                            </span>
                                            {/* Rating - 2 Decimals */}
                                            {pro.rating && (
                                                <div className="flex items-center gap-1">
                                                    <Star size={12} className="text-amber-400 fill-amber-400" />
                                                    <span className="text-xs font-bold text-[#222222]">
                                                        {Number(pro.rating).toFixed(2)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-end justify-between mt-2">
                                        <div className="flex items-center gap-1 text-gray-500 text-xs">
                                            <MapPin size={12} />
                                            <span className="truncate max-w-[120px]">
                                                {pro.address_city || 'Online'}
                                            </span>
                                        </div>

                                        {/* Simple Price - Without "A partir de" clutter if possible, or kept minimal */}
                                        <div className="bg-white/80 px-3 py-1 rounded-full shadow-sm">
                                            <span className="text-[#222222] font-black text-xs">R$ 150</span>
                                        </div>
                                    </div>

                                    {/* Favorite - Absolute Top Right */}
                                    <button
                                        onClick={(e) => toggleFavorite(pro.id, e)}
                                        className="absolute top-0 right-0 w-8 h-8 rounded-full flex items-center justify-center -mr-2 -mt-2 active:scale-90 transition-transform bg-white/50 hover:bg-white"
                                    >
                                        <Heart
                                            size={18}
                                            fill={favorites.has(pro.id) ? "#FF385C" : "rgba(0,0,0,0.05)"}
                                            className={favorites.has(pro.id) ? "text-[#FF385C]" : "text-gray-400"}
                                        />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 opacity-60">
                            <Search size={32} className="mx-auto mb-3 text-gray-300" />
                            <p className="text-sm font-medium text-gray-900">Nenhum profissional</p>
                            <p className="text-xs text-gray-400 mt-1">Busque por ID, nome ou apelido</p>
                        </div>
                    )}
                </div>
            </div>

            <BottomNav activeTab="search" />
        </div>
    );
};
