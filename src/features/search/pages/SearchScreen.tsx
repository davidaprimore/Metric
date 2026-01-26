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
    SlidersHorizontal
} from 'lucide-react';
import { BottomNav } from '@/components/layout/BottomNav';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/useDebounce';

// Colors added to categories for visual appeal
const CATEGORIES = [
    { id: 'all', label: 'Todos', icon: Search, color: 'text-gray-600', bg: 'bg-gray-100' },
    { id: 'personal', label: 'Personal', icon: Dumbbell, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'nutri', label: 'Nutri', icon: Salad, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { id: 'avaliador', label: 'Avaliação', icon: Activity, color: 'text-rose-500', bg: 'bg-rose-50' },
    { id: 'fisioterapeuta', label: 'Fisio', icon: Stethoscope, color: 'text-teal-500', bg: 'bg-teal-50' }
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
        <div className="min-h-screen bg-[#F7F7F7] text-[#222222] font-sans pb-32">
            {/* Mobile Layout Constraint */}
            <div className="max-w-md mx-auto w-full relative min-h-screen bg-white shadow-xl shadow-black/5">

                {/* Header */}
                <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md pt-6 pb-2 px-5">
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
                                <span className="block text-[10px] font-bold text-gray-400 leading-none mb-0.5">Buscar</span>
                                <input
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Nome ou especialidade..."
                                    className="w-full bg-transparent text-sm font-semibold text-[#222222] placeholder:text-gray-300 outline-none leading-none h-4"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Categories - Colored & Scrollable */}
                    <div className="flex gap-4 overflow-x-auto pb-4 -mx-5 px-5 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        {CATEGORIES.map((cat) => {
                            const Icon = cat.icon;
                            const isActive = activeFilter === cat.id;

                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveFilter(cat.id)}
                                    className={cn(
                                        "flex flex-col items-center gap-2 min-w-[70px] transition-all duration-300",
                                        isActive ? "opacity-100 scale-105" : "opacity-60 hover:opacity-100"
                                    )}
                                >
                                    <div className={cn(
                                        "w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm transition-all border",
                                        isActive
                                            ? `${cat.bg} border-${cat.color.split('-')[1]}-200 shadow-${cat.color.split('-')[1]}-200/50`
                                            : "bg-white border-gray-100"
                                    )}>
                                        <Icon
                                            size={24}
                                            className={cn("transition-colors", isActive ? cat.color : "text-gray-400")}
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

                {/* Results List - Compact Horizontal Cards */}
                <div className="p-5 space-y-4">
                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex gap-4 animate-pulse">
                                    <div className="w-24 h-24 bg-gray-100 rounded-2xl shrink-0" />
                                    <div className="flex-1 space-y-2 py-2">
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
                                className="group bg-white rounded-3xl p-3 shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)] border border-gray-50 flex gap-4 active:scale-[0.98] transition-all cursor-pointer hover:shadow-md"
                            >
                                {/* Photo - Compact Left Side */}
                                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 relative shrink-0">
                                    <img
                                        src={pro.avatar_url || `https://ui-avatars.com/api/?name=${pro.full_name}&background=f3f4f6&color=000`}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/5" /> {/* Subtle overlay for depth */}

                                    {/* Rating Pill - Tiny Overlay */}
                                    {pro.rating && (
                                        <div className="absolute bottom-1 left-1 right-1 bg-white/90 backdrop-blur-[2px] rounded-lg py-1 flex items-center justify-center gap-1 shadow-sm">
                                            <Star size={8} className="text-[#222222] fill-[#222222]" />
                                            <span className="text-[9px] font-black text-[#222222]">{pro.rating}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Info - Right Side */}
                                <div className="flex-1 py-1 flex flex-col justify-between relative">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-[#222222] font-bold text-base leading-tight pr-8">
                                                {pro.nickname || pro.full_name}
                                            </h3>
                                        </div>

                                        <p className="text-gray-500 text-xs font-medium uppercase tracking-wide mt-1">
                                            {pro.specialties?.name || 'Profissional'}
                                        </p>

                                        {pro.address_city && (
                                            <div className="flex items-center gap-1 text-gray-400 text-xs mt-1">
                                                <MapPin size={10} />
                                                <span className="truncate">{pro.address_city}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-end justify-between mt-2">
                                        <div>
                                            <span className="text-[10px] text-gray-400 font-medium">A partir de</span>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-[#222222] font-black text-sm">R$ 150</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Favorite - Absolute Top Right */}
                                    <button
                                        onClick={(e) => toggleFavorite(pro.id, e)}
                                        className="absolute top-0 right-0 w-8 h-8 rounded-full flex items-center justify-center -mr-2 -mt-2 active:scale-90 transition-transform"
                                    >
                                        <Heart
                                            size={18}
                                            fill={favorites.has(pro.id) ? "#FF385C" : "rgba(0,0,0,0.05)"}
                                            className={favorites.has(pro.id) ? "text-[#FF385C]" : "text-gray-300"}
                                        />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 opacity-60">
                            <Search size={32} className="mx-auto mb-3 text-gray-300" />
                            <p className="text-sm font-medium text-gray-900">Nenhum profissional</p>
                            <p className="text-xs text-gray-400 mt-1">Tento "Nutri" ou "Personal"</p>
                        </div>
                    )}
                </div>
            </div>

            <BottomNav activeTab="search" />
        </div>
    );
};
