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

// Rich Categories with "Artistic" Image Backgrounds
const CATEGORIES = [
    {
        id: 'favorites', // Vibrant, "Alive" Favorites Card
        label: 'Favoritos',
        icon: Heart,
        image: '', // No image, pure gradient power
        color: 'bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-rose-400 via-fuchsia-500 to-indigo-500 animate-gradient-slow'
    },
    {
        id: 'all',
        label: 'Tudo',
        icon: Search,
        image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop', // Abstract Dark
        color: 'from-gray-900/90 to-black/90'
    },
    {
        id: 'personal',
        label: 'Personal',
        icon: Dumbbell,
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop', // Gym Aesthetic
        color: 'from-blue-900/80 to-blue-950/90'
    },
    {
        id: 'nutri',
        label: 'Nutri',
        icon: Salad,
        image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=800&auto=format&fit=crop', // Avocados/Food Art
        color: 'from-emerald-900/80 to-emerald-950/90'
    },
    {
        id: 'fisioterapeuta', // Renamed from 'fisio'
        label: 'Fisioterapeuta',
        icon: Stethoscope,
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop', // Medical Abstract
        color: 'from-teal-900/80 to-teal-950/90'
    },
    {
        id: 'consultoria', // NEW
        label: 'Consultoria',
        icon: Activity,
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop', // Strategy/Meeting
        color: 'from-violet-900/80 to-violet-950/90'
    },
    {
        id: 'endocrino', // NEW
        label: 'Endócrino',
        icon: Activity,
        image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop', // DNA/Science
        color: 'from-rose-900/80 to-rose-950/90'
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

            // 1. Filter by Specialty / Favorites
            if (activeFilter !== 'all') {
                if (activeFilter === 'favorites') {
                    // Show ONLY favorites
                    results = results.filter(p => favorites.has(p.id));
                } else {
                    // Filter by Specialty Name
                    results = results.filter(p =>
                        p.specialties?.[0]?.name?.toLowerCase().includes(activeFilter === 'personal' ? 'personal' : activeFilter)
                    );
                }
            }

            // 2. Sort Logic
            results.sort((a, b) => {
                // Priority #1: Favorites always first (unless filtered by favorite, then they are all favorites)
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
        // Base glass + border classes
        const base = "backdrop-blur-sm shadow-sm";

        if (!specialtyName) return `${base} bg-gray-100/80 border-gray-300 hover:bg-gray-200/50`; // Default stronger gray glass

        const lower = specialtyName.toLowerCase();

        // Glassy Pastels
        if (lower.includes('personal')) return `${base} bg-blue-50/60 border-blue-200 hover:bg-blue-100/50`;
        if (lower.includes('nutri')) return `${base} bg-emerald-50/60 border-emerald-200 hover:bg-emerald-100/50`;
        if (lower.includes('fisio')) return `${base} bg-teal-50/60 border-teal-200 hover:bg-teal-100/50`;
        if (lower.includes('avalia')) return `${base} bg-orange-50/60 border-orange-200 hover:bg-orange-100/50`;

        return `${base} bg-gray-100/80 border-gray-300 hover:bg-gray-200/50`; // Fallback Gray
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
                                    const isFavorites = cat.id === 'favorites'; // Special check

                                    return (
                                        <button
                                            key={cat.id}
                                            onClick={() => setActiveFilter(cat.id)}
                                            className={cn(
                                                "group relative h-40 rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all active:scale-[0.98] w-full text-left",
                                                isFavorites ? "ring-2 ring-white/50" : ""
                                            )}
                                        >
                                            {/* Background: Image or Pure Animation for Favorites */}
                                            {isFavorites ? (
                                                <div className={cn("absolute inset-0 transition-opacity", cat.color)}>
                                                    {/* Pulse Heart Animation */}
                                                    <div className="absolute inset-0 flex items-center justify-center opacity-30">
                                                        <Heart size={80} className="animate-pulse text-white" fill="currentColor" />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="absolute inset-0">
                                                    <img
                                                        src={cat.image}
                                                        alt={cat.label}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    />
                                                    <div className={cn("absolute inset-0 bg-gradient-to-t opacity-90 transition-opacity", cat.color)} />
                                                </div>
                                            )}

                                            {/* Content */}
                                            <div className="absolute inset-0 p-5 flex flex-col justify-between z-10">
                                                <div className={cn(
                                                    "w-10 h-10 rounded-full flex items-center justify-center border",
                                                    isFavorites ? "bg-white text-[#FF385C] border-white shadow-lg" : "bg-white/20 backdrop-blur-md border-white/10 text-white"
                                                )}>
                                                    <Icon size={20} className={isFavorites ? "fill-[#FF385C]" : ""} strokeWidth={2.5} />
                                                </div>

                                                <div>
                                                    <h3 className="text-white font-extrabold text-lg leading-none mb-1 shadow-black/50 drop-shadow-md">{cat.label}</h3>
                                                    <span className="text-white/90 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 opacity-80 group-hover:opacity-100">
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
                                                onClick={() => navigate(`/profile/${pro.id}`)}
                                                className={cn(
                                                    "group rounded-[2rem] p-4 flex gap-4 active:scale-[0.98] transition-all cursor-pointer border",
                                                    isFav
                                                        ? "bg-rose-50/90 border-rose-200 ring-1 ring-rose-300/50 backdrop-blur-md shadow-rose-100/50"
                                                        : getCardColor(pro.specialties?.[0]?.name)
                                                )}
                                            >
                                                {/* Card Content (Same as before) */}
                                                <div className="w-20 h-20 rounded-full overflow-hidden bg-white shadow-sm border-2 border-white relative shrink-0">
                                                    <img
                                                        src={pro.avatar_url || `https://ui-avatars.com/api/?name=${pro.full_name}&background=f3f4f6&color=000`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>

                                                <div className="flex-1 py-0.5 flex flex-col justify-between relative">
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
                                                                {pro.address_city ? `${pro.address_city}` : 'Online'}
                                                                {pro.address_state ? ` - ${pro.address_state}` : ''}
                                                            </span>
                                                        </div>

                                                        <div className="bg-white/90 px-3 py-1 rounded-full shadow-sm">
                                                            <span className="text-[#222222] font-black text-xs">R$ 150</span>
                                                        </div>
                                                    </div>

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
