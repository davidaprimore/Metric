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

// Mapping specialty IDs to Icons (Airbnb Style Categories - Light Mode)
const CATEGORIES = [
    { id: 'all', label: 'Todos', icon: Search },
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
        <div className="min-h-screen bg-white text-[#222222] font-sans pb-32">
            {/* Mobile Layout Constraint */}
            <div className="max-w-md mx-auto w-full relative min-h-screen bg-white">

                {/* Header (Light - Airbnb Style) */}
                <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 pt-4 pb-2 px-5 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
                    {/* Search Bar - Floating Shadow Pill */}
                    <div className="flex items-center gap-3 mb-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="w-10 h-10 rounded-full bg-transparent flex items-center justify-center text-[#222222] hover:bg-gray-100 active:scale-95 transition-all"
                        >
                            <ChevronLeft size={24} strokeWidth={2.5} />
                        </button>

                        <div className="flex-1 h-14 bg-white rounded-full flex items-center px-2 shadow-[0_6px_16px_-4px_rgba(0,0,0,0.12)] border border-gray-100/50">
                            <div className="w-10 h-10 rounded-full bg-[#FF385C] flex items-center justify-center shadow-md">
                                <Search size={18} className="text-white" strokeWidth={3} />
                            </div>
                            <div className="flex-1 px-3 flex flex-col justify-center">
                                <span className="text-[11px] font-bold text-[#222222] leading-tight">Para onde vamos?</span>
                                <input
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Buscar profissionais..."
                                    className="w-full bg-transparent text-[13px] text-gray-600 placeholder:text-gray-400 outline-none leading-tight"
                                />
                            </div>
                            <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-[#222222]">
                                <SlidersHorizontal size={16} />
                            </div>
                        </div>
                    </div>

                    {/* Categories (Airbnb Icons - Light) */}
                    <div className="flex gap-8 overflow-x-auto pb-2 no-scrollbar px-2 pt-2">
                        {CATEGORIES.map(cat => {
                            const Icon = cat.icon;
                            const isActive = activeFilter === cat.id;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveFilter(cat.id)}
                                    className="flex flex-col items-center gap-2 group min-w-[60px] cursor-pointer"
                                >
                                    <div className={cn(
                                        "transition-all duration-300 relative",
                                        isActive ? "text-[#222222]" : "text-gray-400 group-hover:text-gray-600"
                                    )}>
                                        <Icon size={26} strokeWidth={isActive ? 2.5 : 2} />
                                    </div>
                                    <span className={cn(
                                        "text-[11px] font-medium transition-colors relative pb-2",
                                        isActive ? "text-[#222222] border-b-2 border-[#222222]" : "text-gray-400 border-b-2 border-transparent"
                                    )}>
                                        {cat.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </header>

                {/* Results List */}
                <div className="p-6 space-y-8">
                    {loading ? (
                        <div className="text-center py-20 space-y-3 animate-pulse">
                            <div className="w-12 h-12 bg-gray-100 rounded-full mx-auto" />
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">Carregando...</p>
                        </div>
                    ) : professionals.length > 0 ? (
                        professionals.map((pro) => (
                            <div
                                key={pro.id}
                                onClick={() => navigate(`/profile/${pro.id}`)}
                                className="group cursor-pointer active:scale-[0.98] transition-transform duration-200"
                            >
                                {/* Card Image - Clean rounded square */}
                                <div className="aspect-square rounded-[1.2rem] overflow-hidden relative mb-4 bg-gray-100 shadow-sm border border-gray-100">
                                    <img
                                        src={pro.avatar_url || `https://ui-avatars.com/api/?name=${pro.full_name}&background=f3f4f6&color=000`}
                                        className="w-full h-full object-cover"
                                    />

                                    {/* Favorite Button (White Circle) */}
                                    <button
                                        onClick={(e) => toggleFavorite(pro.id, e)}
                                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center transition-transform active:scale-75 hover:scale-110"
                                    >
                                        <Heart
                                            size={18}
                                            fill={favorites.has(pro.id) ? "#FF385C" : "rgba(0,0,0,0.1)"}
                                            className={favorites.has(pro.id) ? "text-[#FF385C]" : "text-gray-600"}
                                        />
                                    </button>

                                    {/* Superhost / Rating Badge (White Pill) */}
                                    {pro.rating && (
                                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1 shadow-sm border border-white/50">
                                            <Star size={12} className="text-[#222222] fill-[#222222]" />
                                            <span className="text-[12px] font-bold text-[#222222] leading-none">{pro.rating}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Card Details (Clean Typography) */}
                                <div>
                                    <div className="flex justify-between items-start mb-0.5">
                                        <h3 className="text-[#222222] font-semibold text-[15px] leading-tight hover:underline">
                                            {pro.nickname || pro.full_name}
                                        </h3>
                                        <div className="flex items-center gap-1 text-[#222222] text-[15px] font-light">
                                            <Star size={12} className="fill-[#222222]" />
                                            <span>{pro.rating || 'New'}</span>
                                        </div>
                                    </div>

                                    <p className="text-gray-500 text-[15px] leading-tight mb-1">
                                        {pro.specialties?.name || 'Profissional Certificado'}
                                    </p>

                                    <p className="text-gray-500 text-[15px] leading-tight">
                                        {pro.address_city ? `${pro.address_city}` : 'Atendimento Online'}
                                    </p>

                                    <div className="mt-2 flex items-baseline gap-1 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                        <span className="text-[#222222] font-semibold text-[15px]">R$ 150</span>
                                        <span className="text-gray-500 text-[15px]"> consulta</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-24 opacity-60">
                            <Search size={40} className="mx-auto mb-4 text-gray-300" />
                            <p className="text-sm font-medium text-gray-900 mb-1">Nenhum resultado exato</p>
                            <p className="text-xs text-gray-500">Tente mudar ou remover alguns filtros</p>
                        </div>
                    )}
                </div>
            </div>

            <BottomNav activeTab="search" />
        </div>
    );
};
