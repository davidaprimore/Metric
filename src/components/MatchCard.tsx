import { motion } from 'framer-motion';
import { VerifiedBadge } from './VerifiedBadge';

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
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay, duration: 0.5, ease: "easeOut" }}
            onClick={onClick}
            whileTap={onClick ? { scale: 0.98 } : undefined}
            className={`min-w-[280px] max-w-[280px] bg-white rounded-[28px] overflow-hidden shadow-[0_10px_40px_rgba(93,61,107,0.12)] border border-[#E8D5F0] ${onClick ? 'cursor-pointer' : ''}`}
        >
            {/* Imagem com Overlay */}
            <div className="relative h-[180px] bg-gradient-to-br from-[#e9d5f0] to-[#d4b8e0]">
                <img src={image} alt={name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                {/* Badge Match */}
                <div className="absolute top-3 right-3 bg-white/95 px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
                    <span className="text-[#FFB800] text-sm">⭐</span>
                    <span className="text-[#3D2646] font-bold text-sm">{match}% Match</span>
                </div>
            </div>

            {/* Conteúdo */}
            <div className="p-5">
                <div className="flex items-center mb-1">
                    <h3 className="font-[Outfit] text-[20px] font-bold text-[#3D2646]">{name}</h3>
                    {verified && <VerifiedBadge />}
                </div>
                <p className="text-[13px] text-[#8B8591] mb-3">{specialty} • CRM {crm}</p>

                <div className="flex items-center gap-2 text-[12px] text-[#8B8591] mb-3">
                    <span className="text-[#FFB800] font-bold">★ {rating}</span>
                    <span>•</span>
                    <span>{distance}</span>
                    <span>•</span>
                    <span className="text-green-600 font-semibold text-[10px] bg-green-50 px-2 py-0.5 rounded-full">Disponível</span>
                </div>

                <div className="flex gap-2 mb-4 flex-wrap">
                    {tags.map(tag => (
                        <span key={tag} className="px-2.5 py-1 bg-[#F3E8F7] text-[#9B6AB0] rounded-full text-[11px] font-semibold">
                            {tag}
                        </span>
                    ))}
                </div>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        if (onClick) onClick();
                    }}
                    className="w-full py-3.5 bg-gradient-to-r from-[#9B6AB0] to-[#7D5490] text-white rounded-2xl font-bold text-[15px] active:scale-[0.98] transition-transform"
                >
                    Agendar R$ {price}
                </button>
            </div>
        </motion.div>
    );
}
