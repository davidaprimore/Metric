import { motion } from 'framer-motion';
import { VerifiedBadge } from './VerifiedBadge';
import { Heart, Star } from 'lucide-react';
import { useState } from 'react';

interface Props {
    image: string;
    name: string;
    specialty: string;
    crm: string;
    rating: number;
    distance: string;
    match: number;
    tags: string[];
    price: number;
    delay: number;
    verified?: boolean;
    onClick?: () => void;
}

export function MatchCard({ image, name, specialty, crm, rating, distance, match, tags, price, delay, verified = true, onClick }: Props) {
    const [isFavorite, setIsFavorite] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
            whileTap={{ scale: 0.98 }}
            className="w-[280px] bg-white rounded-[24px] overflow-hidden shadow-[0_8px_30px_rgb(93,61,107,0.15)] border border-[#E8D5F0] flex-shrink-0 cursor-pointer group snap-center relative"
            onClick={onClick}
        >
            {/* Botão Favoritar - Canto superior direito */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setIsFavorite(!isFavorite);
                }}
                className="absolute top-3 right-3 z-20 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors"
            >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
            </button>

            {/* Header com Imagem */}
            <div className="h-[160px] relative overflow-hidden bg-gradient-to-br from-[#e9d5f0] to-[#d4b8e0]">
                <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />

                {/* Badge Match */}
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-[20px] shadow-sm flex items-center gap-1 z-10">
                    <Star className="w-4 h-4 text-[#FFB800] fill-[#FFB800]" />
                    <span className="text-[#3D2646] font-bold text-xs">{match}% Match</span>
                </div>
            </div>

            {/* Conteúdo */}
            <div className="p-4">
                <div className="flex items-center gap-1 mb-1">
                    <h3 className="font-['Outfit'] text-[20px] font-bold text-[#3D2646]">{name}</h3>
                    {verified && <VerifiedBadge />}
                </div>

                <p className="text-[#8B8591] text-[13px] mb-3">{specialty} • CRM {crm}</p>

                <div className="flex items-center gap-3 mb-3 text-xs text-[#8B8591]">
                    <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-[#FFB800] fill-[#FFB800]" />
                        <span>{rating}</span>
                    </div>
                    <span>•</span>
                    <span>{distance}</span>
                    <span>•</span>
                    <span className="text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full">Disponível</span>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4 min-h-[50px] content-start">
                    {tags.map((tag, i) => (
                        <span key={i} className="px-2.5 py-1 bg-[#F5F0F7] text-[#9B6AB0] rounded-[12px] text-[11px] font-semibold h-fit">
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="mt-auto">
                    <button className="w-full py-3.5 bg-gradient-to-br from-[#9B6AB0] to-[#7D5490] text-white rounded-2xl font-bold text-[15px] shadow-sm active:scale-[0.98] transition-all hover:shadow-md">
                        Agendar R$ {price}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
