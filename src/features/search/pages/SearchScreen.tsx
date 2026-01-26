
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
    X,
    Check,
    ArrowUpDown
} from 'lucide-react';
import { BottomNav } from '@/components/layout/BottomNav';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/useDebounce';

// Rich Categories - Simulating "Image Icons" with Gradients
const CATEGORIES = [
    { id: 'all', label: 'Tudo', icon: Search, gradient: 'from-gray-700 to-gray-900', shadow: 'shadow-gray-200' },
    { id: 'personal', label: 'Personal', icon: Dumbbell, gradient: 'from-blue-500 to-blue-600', shadow: 'shadow-blue-200' },
    { id: 'nutri', label: 'Nutri', icon: Salad, gradient: 'from-emerald-500 to-emerald-600', shadow: 'shadow-emerald-200' },
    { id: 'avaliador', label: 'Avaliação', icon: Activity, gradient: 'from-rose-500 to-rose-600', shadow: 'shadow-rose-200' },
    { id: 'fisioterapeuta', label: 'Fisio', icon: Stethoscope, gradient: 'from-teal-500 to-teal-600', shadow: 'shadow-teal-200' }
];

export const SearchScreen: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    // Search States
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [professionals, setProfessionals] = useState<any[]>([]);
    const [favorites, setFavorites] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(false);

    // Advanced Filters
    const [showFilters, setShowFilters] = useState(false);
    const [filterCity, setFilterCity] = useState('');
    const [filterState, setFilterState] = useState('');
    const [sortBy, setSortBy] = useState<'rating' | 'price' | 'none'>('none');

    const debouncedSearch = useDebounce(searchTerm, 500);

    useEffect(() => {
        fetchFavorites();
    }, [user]);

    useEffect(() => {
        searchProfessionals();
    }, [debouncedSearch, activeFilter, filterCity, filterState, sortBy, favorites]); // Re-run when filters/favs change

    const fetchFavorites = async () => {
        if (!user) return;
        const { data } = await supabase.from('favorites').select('professional_id').eq('user_id', user.id);
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
id, full_name, nickname, avatar_url,
    rating, review_count, specialties(name),
    address_city, address_state
        `)
                .eq('role', 'profissional');

            // Text Search (Name, Nickname, ID)
            if (debouncedSearch) {
                query = query.or(`full_name.ilike.%${debouncedSearch}%,nickname.ilike.%${debouncedSearch}%,professional_code.eq.${debouncedSearch}`);
            }

            // Location Filters
            if (filterCity) query = query.ilike('address_city', `%${filterCity}%`);
            if (filterState) query = query.ilike('address_state', `%${filterState}%`);

            const { data, error } = await query;
            if (error) throw error;

            let results = data || [];

            // 1. Filter by Specialty Client-side (if not 'all')
            if (activeFilter !== 'all') {
                results = results.filter(p =>
                    p.specialties?.[0]?.name?.toLowerCase().includes(activeFilter === 'personal' ? 'personal' : activeFilter)
                );
            }

            // 2. Sort Logic
            results.sort((a, b) => {
                // Priority #1: Favorites always first
                const aFav = favorites.has(a.id);
                const bFav = favorites.has(b.id);
                if (aFav && !bFav) return -1;
                if (!aFav && bFav) return 1;

                // Priority #2: User selected sort
                if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
                // if (sortBy === 'price') return (a.price || 0) - (b.price || 0); // Price not in profile yet

                return 0; // Default order
            });

            setProfessionals(results);
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
        setFavorites(newFavs); // Optimistic

        try {
            if (isFav) {
                await supabase.from('favorites').delete().match({ user_id: user.id, professional_id: proId });
            } else {
                await supabase.from('favorites').insert({ user_id: user.id, professional_id: proId });
            }
        } catch (err) {
            console.error('Fav error:', err);
            fetchFavorites(); // Revert
        }
    };

    const getCardColor = (specialtyName?: string) => {
        if (!specialtyName) return 'bg-white';
        const lower = specialtyName.toLowerCase();
        if (lower.includes('personal')) return 'bg-blue-50/50 hover:bg-blue-50';
        if (lower.includes('nutri')) return 'bg-emerald-50/50 hover:bg-emerald-50';
        if (lower.includes('fisio')) return 'bg-teal-50/50 hover:bg-teal-50';
        return 'bg-white hover:bg-gray-50';
    };

    return (
        <div className="min-h-screen bg-[#F7F7F7] text-[#222222] font-sans pb-32">
            <div className="max-w-md mx-auto w-full relative min-h-screen bg-white shadow-xl shadow-black/5">

                {/* Header */}
                <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md pt-6 pb-2 px-5 border-b border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-[#222222] hover:bg-gray-100 transition-all">
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
                                    placeholder="Nome, ID ou Especialidade..."
                                    className="w-full bg-transparent text-sm font-semibold text-[#222222] placeholder:text-gray-300 outline-none leading-none h-4"
                                />
                            </div>
                            <button
                                onClick={() => setShowFilters(true)}
                                className={cn(
                                    "w-9 h-9 rounded-full flex items-center justify-center transition-colors relative",
                                    (filterCity || filterState || sortBy !== 'none') ? "bg-[#222222] text-white" : "hover:bg-gray-50 text-gray-400"
                                )}
                            >
                                <SlidersHorizontal size={18} />
                                {(filterCity || filterState || sortBy !== 'none') && (
                                    <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#FF385C] rounded-full border border-white" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Rich Categories Carousel */}
                    <div className="flex gap-4 overflow-x-auto pb-4 -mx-5 px-5 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        {CATEGORIES.map((cat) => {
                            const Icon = cat.icon;
                            const isActive = activeFilter === cat.id;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveFilter(cat.id)}
                                    className={cn(
                                        "flex flex-col items-center gap-2 min-w-[72px] transition-all duration-300",
                                        isActive ? "opacity-100 scale-105" : "opacity-60 hover:opacity-90"
                                    )}
                                >
                                    <div className={cn(
                                        "w-16 h-12 rounded-xl flex items-center justify-center shadow-md transition-all bg-gradient-to-br",
                                        cat.gradient,
                                        isActive ? "shadow-lg ring-2 ring-offset-2 ring-gray-900/10" : ""
                                    )}>
                                        {/* Filled White Icon for Picture-Button Look */}
                                        <Icon size={22} className="text-white drop-shadow-sm" strokeWidth={2.5} />
                                    </div>
                                    <span className={cn(
                                        "text-[10px] font-bold transition-colors",
                                        isActive ? "text-[#222222]" : "text-gray-400"
                                    )}>
                                        {cat.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </header>

                {/* Filter Modal / Drawer Overlay */}
                {showFilters && (
                    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="w-full max-w-md bg-white rounded-t-[2rem] sm:rounded-[2rem] p-6 shadow-2xl animate-in slide-in-from-bottom-10 duration-300">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-bold text-[#222222]">Filtros</h2>
                                <button onClick={() => setShowFilters(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Location */}
                                <div className="space-y-3">
                                    <h3 className="text-sm font-extrabold text-[#222222] flex items-center gap-2">
                                        <MapPin size={14} /> Localização
                                    </h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        <input
                                            value={filterState}
                                            onChange={e => setFilterState(e.target.value)}
                                            placeholder="Estado (UF)"
                                            className="px-4 py-3 bg-gray-50 rounded-xl text-sm font-medium outline-none focus:ring-2 ring-gray-200 max-w-[100px]"
                                            maxLength={2}
                                        />
                                        <input
                                            value={filterCity}
                                            onChange={e => setFilterCity(e.target.value)}
                                            placeholder="Cidade..."
                                            className="px-4 py-3 bg-gray-50 rounded-xl text-sm font-medium outline-none focus:ring-2 ring-gray-200"
                                        />
                                    </div>
                                </div>

                                {/* Sort */}
                                <div className="space-y-3">
                                    <h3 className="text-sm font-extrabold text-[#222222] flex items-center gap-2">
                                        <ArrowUpDown size={14} /> Classificar por
                                    </h3>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setSortBy(sortBy === 'rating' ? 'none' : 'rating')}
                                            className={cn(
                                                "px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2",
                                                sortBy === 'rating' ? "bg-black text-white border-black" : "bg-white text-gray-500 border-gray-200"
                                            )}
                                        >
                                            <Star size={12} className={sortBy === 'rating' ? "fill-white" : ""} />
                                            Melhor Avaliação
                                        </button>
                                        <button
                                            onClick={() => setSortBy(sortBy === 'price' ? 'none' : 'price')}
                                            className={cn(
                                                "px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2",
                                                sortBy === 'price' ? "bg-black text-white border-black" : "bg-white text-gray-500 border-gray-200"
                                            )}
                                        >
                                            <span className="text-[10px]">$</span>
                                            Menor Preço
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-4 border-t border-gray-100 flex gap-3">
                                <button
                                    onClick={() => { setFilterCity(''); setFilterState(''); setSortBy('none'); }}
                                    className="px-6 py-3 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50"
                                >
                                    Limpar
                                </button>
                                <button
                                    onClick={() => setShowFilters(false)}
                                    className="flex-1 px-6 py-3 rounded-xl text-sm font-bold bg-[#FF385C] text-white hover:bg-[#e01f45] shadow-lg shadow-rose-200"
                                >
                                    Ver Resultados
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Results List */}
                <div className="p-5 space-y-4">
                    {loading ? (
                        <div className="space-y-4 pt-10 text-center">
                            <div className="w-12 h-12 border-4 border-[#FF385C] border-t-transparent rounded-full animate-spin mx-auto" />
                            <p className="text-xs text-gray-400 font-bold tracking-widest uppercase">Buscando...</p>
                        </div>
                    ) : professionals.length > 0 ? (
                        professionals.map((pro) => {
                            // Logic to display "Favorito" badge if sorted to top
                            const isFav = favorites.has(pro.id);

                            return (
                                <div
                                    key={pro.id}
                                    onClick={() => navigate(`/ profile / ${pro.id} `)}
                                    className={cn(
                                        "group rounded-[2rem] p-4 flex gap-4 active:scale-[0.98] transition-all cursor-pointer border border-transparent hover:border-gray-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]",
                                        getCardColor(pro.specialties?.[0]?.name),
                                        isFav ? "ring-1 ring-[#FF385C]/20 bg-[#fff5f7]" : "" // Subtle highlight for favs
                                    )}
                                >
                                    {/* Photo */}
                                    <div className="w-20 h-20 rounded-full overflow-hidden bg-white shadow-sm border-2 border-white relative shrink-0">
                                        <img
                                            src={pro.avatar_url || `https://ui-avatars.com/api/?name=${pro.full_name}&background=f3f4f6&color=000`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 py-0.5 flex flex-col justify-between relative" >
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-[#222222] font-bold text-lg leading-tight pr-8">
                                                    {pro.nickname || pro.full_name}
                                                </h3>
                                            </div>

                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="bg-white/80 px-2 py-0.5 rounded-md text-[10px] font-bold text-gray-500 uppercase tracking-wide shadow-sm">
                                                    {pro.specialties?.[0]?.name || 'Profissional'}
                                                </span>
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
                                                <span className="truncate max-w-[100px]">
                                                    {/* Smart City Display */}
                                                    {pro.address_city ? `${pro.address_city}` : 'Online'}
                                                    {pro.address_state ? ` - ${pro.address_state}` : ''}
                                                </span>
                                            </div>

                                            <div className="bg-white/90 px-3 py-1 rounded-full shadow-sm">
                                                <span className="text-[#222222] font-black text-xs">R$ 150</span>
                                            </div>
                                        </div>

                                        {/* Favorite Heart */}
                                        <button
                                            onClick={(e) => toggleFavorite(pro.id, e)}
                                            className="absolute top-0 right-0 w-8 h-8 rounded-full flex items-center justify-center -mr-2 -mt-2 active:scale-90 transition-transform bg-white/50 hover:bg-white"
                                        >
                                            <Heart
                                                size={18}
                                                fill={isFav ? "#FF385C" : "rgba(0,0,0,0.05)"}
                                                className={isFav ? "text-[#FF385C]" : "text-gray-400"}
                                            />
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-16 opacity-60">
                            <Search size={40} className="mx-auto mb-3 text-gray-300" />
                            <p className="text-sm font-medium text-gray-900">Nenhum profissional encontrado</p>
                            <p className="text-xs text-gray-400 mt-1">Tento ajustar seus filtros de cidade/estado</p>
                            {(filterCity || filterState) && (
                                <button
                                    onClick={() => { setFilterCity(''); setFilterState(''); }}
                                    className="mt-4 text-xs font-bold text-[#FF385C] underline"
                                >
                                    Limpar filtros de local
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <BottomNav activeTab="search" />
        </div>
    );
};
