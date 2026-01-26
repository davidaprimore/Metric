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
    ArrowUpDown
} from 'lucide-react';
import { BottomNav } from '@/components/layout/BottomNav';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/useDebounce';

// Categories: More Solid Pastels & Defined Wireframes
const CATEGORIES = [
    {
        id: 'favorites',
        label: 'Favoritos',
        icon: Heart,
        // Gradient: Solid Rose/Pink (Stronger)
        gradient: 'bg-gradient-to-br from-rose-100 to-rose-200',
        border: 'border-rose-300',
        iconColor: 'text-rose-600'
    },
    {
        id: 'all',
        label: 'Tudo',
        icon: Search,
        // Gradient: Solid Gray
        gradient: 'bg-gradient-to-br from-gray-100 to-gray-200',
        border: 'border-gray-300',
        iconColor: 'text-gray-600'
    },
    {
        id: 'personal',
        label: 'Personal',
        icon: Dumbbell,
        // Gradient: Solid Blue
        gradient: 'bg-gradient-to-br from-blue-100 to-blue-200',
        border: 'border-blue-300',
        iconColor: 'text-blue-600'
    },
    {
        id: 'nutri',
        label: 'Nutri',
        icon: Salad,
        // Gradient: Solid Emerald
        gradient: 'bg-gradient-to-br from-emerald-100 to-emerald-200',
        border: 'border-emerald-300',
        iconColor: 'text-emerald-700'
    },
    {
        id: 'fisioterapeuta',
        label: 'Fisioterapeuta',
        icon: Stethoscope,
        // Gradient: Solid Teal
        gradient: 'bg-gradient-to-br from-teal-100 to-teal-200',
        border: 'border-teal-300',
        iconColor: 'text-teal-700'
    },
    {
        id: 'consultoria',
        label: 'Consultoria',
        icon: Activity,
        // Gradient: Solid Violet
        gradient: 'bg-gradient-to-br from-violet-100 to-violet-200',
        border: 'border-violet-300',
        iconColor: 'text-violet-700'
    },
    {
        id: 'endocrino',
        label: 'Endócrino',
        icon: Activity,
        // Gradient: Solid Orange
        gradient: 'bg-gradient-to-br from-orange-100 to-orange-200',
        border: 'border-orange-300',
        iconColor: 'text-orange-700'
    }
];

export const SearchScreen: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    // Search States
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('all'); // Default 'all'
    const [professionals, setProfessionals] = useState<any[]>([]);
    const [favorites, setFavorites] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(false);

    // Advanced Filters
    const [showFilters, setShowFilters] = useState(false);
    const [filterCity, setFilterCity] = useState('');
    const [filterState, setFilterState] = useState('');
    const [sortBy, setSortBy] = useState<'rating' | 'price' | 'none'>('none');

    // Scroll / Nav Logic
    const [showNav, setShowNav] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const debouncedSearch = useDebounce(searchTerm, 500);

    // Smart Scroll: Hide on Down, Show on Up
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setShowNav(false); // Scrolling DOWN -> Hide
            } else {
                setShowNav(true); // Scrolling UP -> Show
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

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

        // Helper to build the query chain
        const buildQuery = (selectString: string) => {
            let query = supabase
                .from('profiles')
                .select(selectString)
                .eq('role', 'profissional');

            // Text Search
            if (debouncedSearch) {
                query = query.or(`full_name.ilike.%${debouncedSearch}%,nickname.ilike.%${debouncedSearch}%,professional_code.eq.${debouncedSearch}`);
            }

            // Location Filters
            if (filterCity) query = query.ilike('address_city', `%${filterCity}%`);
            if (filterState) query = query.ilike('address_state', `%${filterState}%`);

            return query;
        };

        try {
            // 1. Try fetching with NEW columns (bio, nano_bio)
            const { data, error } = await buildQuery(`
                id, full_name, nickname, avatar_url,
                rating, review_count, specialties(name),
                address_city, address_state, bio, nano_bio
            `);

            if (error) throw error; // If this fails (e.g. column missing), go to catch
            processResults(data || []);

        } catch (err) {
            console.warn('Rich query failed (likely missing columns), falling back to basic:', err);

            try {
                // 2. Fallback to BASIC columns (Safe Mode)
                const { data, error } = await buildQuery(`
                    id, full_name, nickname, avatar_url,
                    specialties(name),
                    address_city, address_state
                `);

                if (error) {
                    console.error('Basic query also failed:', error);
                    return;
                }
                processResults(data || []);
            } catch (fatalErr) {
                console.error('Fatal search error:', fatalErr);
            }
        } finally {
            setLoading(false);
        }
    };

    const processResults = (data: any[]) => {
        let results = data || [];

        // 1. Filter by Specialty / Favorites
        if (activeFilter !== 'all') {
            if (activeFilter === 'favorites') {
                results = results.filter(p => favorites.has(p.id));
            } else {
                results = results.filter(p =>
                    p.specialties?.[0]?.name?.toLowerCase().includes(activeFilter === 'personal' ? 'personal' : activeFilter)
                );
            }
        }

        // 2. Sort Logic
        results.sort((a, b) => {
            const aFav = favorites.has(a.id);
            const bFav = favorites.has(b.id);
            if (aFav && !bFav) return -1;
            if (!aFav && bFav) return 1;

            if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);

            return 0;
        });

        setProfessionals(results);
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
        // Less Translucent (opacity-95 to solid)
        const base = "shadow-sm transition-all";

        if (!specialtyName) return `${base} bg-gray-50 border-gray-200`; // Default stronger gray glass

        const lower = specialtyName.toLowerCase();

        // Solid Colors (90-95% opacity for slight blur but mostly solid)
        if (lower.includes('personal')) return `${base} bg-blue-50/95 border-blue-200 hover:border-blue-300`;
        if (lower.includes('nutri')) return `${base} bg-emerald-50/95 border-emerald-200 hover:border-emerald-300`;
        if (lower.includes('fisio')) return `${base} bg-teal-50/95 border-teal-200 hover:border-teal-300`;
        if (lower.includes('avalia')) return `${base} bg-orange-50/95 border-orange-200 hover:border-orange-300`;

        return `${base} bg-gray-50/95 border-gray-200 hover:border-gray-300`; // Fallback
    };

    const hasActiveSearch = searchTerm.length > 0 || activeFilter !== 'all' || filterCity || filterState;

    return (
        <div className="min-h-screen bg-[#F7F7F7] text-[#222222] font-sans pb-32 w-full max-w-[100vw] overflow-x-hidden">
            <div className="max-w-md mx-auto w-full relative min-h-screen bg-white shadow-xl shadow-black/5 overflow-hidden flex flex-col">

                {/* Header - Search Only */}
                <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md pt-6 pb-4 px-5 border-b border-gray-100 max-w-full overflow-hidden">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-[#222222] hover:bg-gray-100 transition-all shrink-0">
                            <ChevronLeft size={24} strokeWidth={2.5} />
                        </button>

                        <div className="flex-1 h-12 bg-white rounded-full flex items-center px-2 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.1)] border border-gray-100 min-w-0">
                            <div className="w-9 h-9 rounded-full bg-[#FF385C] flex items-center justify-center shadow-sm shrink-0">
                                <Search size={16} className="text-white" strokeWidth={3} />
                            </div>
                            <div className="flex-1 px-3 min-w-0">
                                <span className="block text-[10px] font-bold text-gray-400 leading-none mb-0.5 truncate">Encontre seu profissional</span>
                                <input
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Nome, ID ou Especialidade..."
                                    className="w-full bg-transparent text-sm font-semibold text-[#222222] placeholder:text-gray-300 outline-none leading-none h-4"
                                />
                            </div>
                            {(hasActiveSearch) && (
                                <button
                                    onClick={() => { setSearchTerm(''); setActiveFilter('all'); setFilterCity(''); setFilterState(''); }}
                                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <div className="p-5 flex-1 relative">
                    {!hasActiveSearch ? (
                        // HERO GRID MODE -- Updated Title Layout
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Single Line Title */}
                            <h1 className="text-xl font-black text-[#222222] mb-4 leading-tight flex flex-wrap items-baseline gap-1.5">
                                Escolha o seu <span className="text-[#FF385C]">Especialista</span>
                            </h1>

                            <div className="grid grid-cols-2 gap-4">
                                {CATEGORIES.filter(c => c.id !== 'all').map((cat) => {
                                    const Icon = cat.icon;
                                    const isFavorites = cat.id === 'favorites';

                                    return (
                                        <button
                                            key={cat.id}
                                            onClick={() => setActiveFilter(cat.id)}
                                            className={cn(
                                                "group relative h-40 rounded-[2rem] overflow-hidden shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] hover:shadow-[0_15px_35px_-10px_rgba(0,0,0,0.12)] transition-all active:scale-[0.98] w-full text-left border",
                                                cat.gradient, cat.border
                                            )}
                                        >
                                            {/* 'Wireframe' Large Symbol - Watermark Effect */}
                                            <Icon
                                                size={100}
                                                strokeWidth={0.5}
                                                className={cn(
                                                    "absolute -bottom-4 -right-4 transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-12 opacity-20",
                                                    isFavorites ? "text-rose-600 fill-rose-200" : cat.iconColor // Increased contrast
                                                )}
                                            />

                                            {/* Content */}
                                            <div className="absolute inset-0 p-5 flex flex-col justify-between z-10">
                                                <div className={cn(
                                                    "w-10 h-10 rounded-full flex items-center justify-center border shadow-sm transition-colors",
                                                    "bg-white/60 backdrop-blur-md border-white/50",
                                                    cat.iconColor
                                                )}>
                                                    <Icon size={20} strokeWidth={2.5} />
                                                </div>

                                                <div>
                                                    <h3 className="text-[#222222] font-extrabold text-lg leading-none mb-1">{cat.label}</h3>
                                                    <span className={cn(
                                                        "text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity",
                                                        cat.iconColor
                                                    )}>
                                                        Ver <ChevronLeft size={10} className="rotate-180" />
                                                    </span>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        // RESULTS LIST MODE
                        <div className="animate-in fade-in duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-[#222222]">
                                    Resultados <span className="text-gray-400 font-normal text-sm">({professionals.length})</span>
                                </h2>
                                <button onClick={() => setShowFilters(true)} className="flex items-center gap-1.5 text-xs font-bold text-[#FF385C] bg-[#FF385C]/10 px-3 py-1.5 rounded-lg active:scale-95 transition-transform">
                                    <SlidersHorizontal size={14} /> Filtros
                                </button>
                            </div>

                            <div className="space-y-4">
                                {loading ? (
                                    <div className="space-y-4 pt-10 text-center">
                                        <div className="w-12 h-12 border-4 border-[#FF385C] border-t-transparent rounded-full animate-spin mx-auto" />
                                        <p className="text-xs text-gray-400 font-bold tracking-widest uppercase">Buscando...</p>
                                    </div>
                                ) : professionals.length > 0 ? (
                                    professionals.map((pro) => {
                                        const isFav = favorites.has(pro.id);
                                        return (
                                            <div
                                                key={pro.id}
                                                onClick={() => navigate(`/professional/${pro.id}`)}
                                                className={cn(
                                                    "group rounded-[2rem] p-4 flex gap-4 active:scale-[0.98] transition-all cursor-pointer border",
                                                    isFav
                                                        ? "bg-rose-50/90 border-rose-200 ring-1 ring-rose-300/50 backdrop-blur-md shadow-rose-100/50"
                                                        : getCardColor(pro.specialties?.[0]?.name)
                                                )}
                                            >
                                                {/* Left Column: Avatar + Location */}
                                                <div className="flex flex-col items-center gap-3 shrink-0 w-20">
                                                    <div className="w-20 h-20 rounded-full overflow-hidden bg-white shadow-sm border-2 border-white relative">
                                                        <img
                                                            src={pro.avatar_url || `https://ui-avatars.com/api/?name=${pro.full_name}&background=f3f4f6&color=000`}
                                                            className="w-full h-full object-cover"
                                                            alt={pro.full_name}
                                                        />
                                                    </div>

                                                    {/* Location - Left Aligned under Photo */}
                                                    <div className="flex items-center gap-1 text-gray-500 text-xs w-full justify-center text-center leading-tight">
                                                        <MapPin size={12} className="shrink-0" />
                                                        <span className="">
                                                            {pro.address_city || 'Online'}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Right Column: Info */}
                                                <div className="flex-1 py-0.5 flex flex-col relative min-w-0">
                                                    {/* Header: Name + Rating/Fav */}
                                                    <div className="flex justify-between items-start mb-1 h-8">
                                                        <div className="pr-16">
                                                            <h3 className="text-[#222222] font-bold text-lg leading-tight truncate">
                                                                {pro.nickname || pro.full_name}
                                                            </h3>
                                                            {/* Specialty Pill REMOVED */}
                                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide inline-block mt-0.5">
                                                                PRO
                                                            </span>
                                                        </div>

                                                        {/* Top Right: Rating + Favorite */}
                                                        <div className="absolute top-0 right-0 flex items-center gap-2">
                                                            {/* Rating */}
                                                            {pro.rating && (
                                                                <div className="flex items-center gap-1 bg-amber-100/50 px-2 py-1 rounded-lg border border-amber-100">
                                                                    <Star size={10} className="text-amber-500 fill-amber-500" />
                                                                    <span className="text-[10px] font-bold text-amber-700">
                                                                        {Number(pro.rating).toFixed(1)}
                                                                    </span>
                                                                </div>
                                                            )}

                                                            {/* Favorite */}
                                                            <button
                                                                onClick={(e) => toggleFavorite(pro.id, e)}
                                                                className="w-8 h-8 rounded-full flex items-center justify-center active:scale-90 transition-transform bg-white/50 hover:bg-white border border-transparent hover:border-gray-100"
                                                            >
                                                                <Heart
                                                                    size={16}
                                                                    fill={isFav ? "#FF385C" : "rgba(0,0,0,0.05)"}
                                                                    className={isFav ? "text-[#FF385C]" : "text-gray-400"}
                                                                />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Nano Bio */}
                                                    <div className="mt-1">
                                                        <p className="text-xs text-gray-600 leading-relaxed line-clamp-2 font-medium">
                                                            {pro.nano_bio || pro.bio || "Especialista em transformação corporal. Agende hoje mesmo."}
                                                        </p>
                                                    </div>

                                                    {/* Price REMOVED */}
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="text-center py-16 opacity-60">
                                        <Search size={40} className="mx-auto mb-3 text-gray-300" />
                                        <p className="text-sm font-medium text-gray-900">Nenhum profissional encontrado</p>
                                        <p className="text-xs text-gray-400 mt-1">Tente ajustar seus filtros</p>
                                        <button
                                            onClick={() => { setActiveFilter('all'); setSearchTerm(''); }}
                                            className="mt-4 text-xs font-bold text-[#FF385C] underline"
                                        >
                                            Limpar Busca
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

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

            {/* Smart Scroll BottomNav */}
            <div className={cn(
                "fixed bottom-0 left-0 right-0 transition-transform duration-300 z-40 max-w-md mx-auto",
                showNav ? "translate-y-0" : "translate-y-full"
            )}>
                <BottomNav activeTab="search" />
            </div>
        </div>
    );
};
