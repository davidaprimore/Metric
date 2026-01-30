import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Search,
    SlidersHorizontal,
    MapPin,
    Star,
    BadgeCheck,
    Heart,
    X
} from 'lucide-react';

const categories = [
    { id: 'all', name: 'Todos', icon: '👨‍⚕️' },
    { id: 'nutrition', name: 'Nutrição', icon: '🥗' },
    { id: 'fitness', name: 'Fitness', icon: '💪' },
    { id: 'physio', name: 'Fisioterapia', icon: '🦴' },
    { id: 'mental', name: 'Mental', icon: '🧠' },
    { id: 'medical', name: 'Médicos', icon: '🩺' },
];

const results = [
    {
        id: '1',
        name: 'Dra. Marina Costa',
        specialty: 'Nutricionista Esportiva',
        rating: 4.9,
        reviews: 89,
        distance: '1.2 km',
        price: '280',
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop',
        tags: ['Online', 'Presencial'],
        match: 98
    },
    {
        id: '2',
        name: 'Dr. Pedro Oliveira',
        specialty: 'Fisioterapeuta',
        rating: 4.7,
        reviews: 124,
        distance: '2.8 km',
        price: '200',
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop',
        tags: ['Presencial'],
        match: 95
    },
    {
        id: '3',
        name: 'Dra. Ana Paula',
        specialty: 'Psicóloga Esportiva',
        rating: 5.0,
        reviews: 67,
        distance: 'Online',
        price: '250',
        image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop',
        tags: ['Online'],
        match: 92
    },
];

interface SearchScreenProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectProfessional: (id: string) => void;
}

export function SearchScreen({ isOpen, onClose, onSelectProfessional }: SearchScreenProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [favorites, setFavorites] = useState<string[]>([]);

    if (!isOpen) return null;

    const toggleFavorite = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setFavorites(prev => prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-50 z-50 flex flex-col"
        >
            {/* Header Sticky */}
            <div className="bg-white px-4 py-3 pt-safe border-b border-gray-100 sticky top-0 z-10">
                <div className="flex items-center justify-between mb-3">
                    <button onClick={onClose} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
                        <ArrowLeft className="w-6 h-6 text-gray-700" />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800">Descubra</h1>
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                        <Search className="w-6 h-6 text-gray-600" />
                    </button>
                </div>

                {/* Barra de busca */}
                <div className="relative mb-3">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar especialista..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-gray-100 rounded-full py-3 pl-12 pr-10 outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2">
                            <X className="w-4 h-4 text-gray-400" />
                        </button>
                    )}
                </div>

                {/* Categories */}
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${selectedCategory === cat.id
                                ? 'bg-gray-900 text-white'
                                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <span>{cat.icon}</span>
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results */}
            <div className="flex-1 overflow-y-auto p-4">
                <p className="text-gray-500 text-sm mb-4">{results.length} profissionais encontrados</p>

                <div className="space-y-4">
                    {results.map((pro, idx) => (
                        <motion.div
                            key={pro.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            onClick={() => onSelectProfessional(pro.id)}
                            className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 cursor-pointer active:scale-95 transition-transform relative"
                        >
                            {/* BOTÃO FAVORITAR - CANTO SUPERIOR DIREITO DO CARD */}
                            <button
                                onClick={(e) => toggleFavorite(pro.id, e)}
                                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors"
                            >
                                <Heart
                                    className={`w-5 h-5 ${favorites.includes(pro.id)
                                        ? 'fill-red-500 text-red-500'
                                        : 'text-gray-400'
                                        }`}
                                />
                            </button>

                            <div className="flex gap-4">
                                {/* Image */}
                                <div className="relative flex-shrink-0">
                                    <img src={pro.image} className="w-24 h-24 rounded-2xl object-cover" />
                                    <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                                        {pro.match}% Match
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 pr-12">
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <div>
                                            <h3 className="font-bold text-gray-800 flex items-center gap-1">
                                                {pro.name}
                                                <BadgeCheck className="w-4 h-4 text-blue-500" />
                                            </h3>
                                            <p className="text-purple-600 text-sm font-medium">{pro.specialty}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                                        <span className="flex items-center gap-1 text-yellow-600 font-bold">
                                            <Star className="w-3 h-3 fill-yellow-500" />
                                            {pro.rating}
                                        </span>
                                        <span>({pro.reviews})</span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            {pro.distance}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex gap-2">
                                            {pro.tags.map(tag => (
                                                <span key={tag} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <p className="font-bold text-gray-900 text-lg">R$ {pro.price}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
