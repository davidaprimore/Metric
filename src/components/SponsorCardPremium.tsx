import { motion, useAnimation } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Sparkles, ExternalLink } from 'lucide-react';
import type { SponsorData } from '../types/sponsor';

// PROPS: Recebe os dados do patrocinador (mock por enquanto, depois vem do banco)
interface SponsorCardPremiumProps {
    data?: SponsorData; // Opcional por enquanto (usa mock)
}

// MOCK PROFISSIONAL: Dados da Growth Suplementos (template bonito)
const defaultSponsor: SponsorData = {
    id: '1',
    companyName: 'Growth Suplementos',
    productName: 'Whey Protein Isolado',
    headline: '40% OFF Exclusivo',
    description: 'Economize em todas as consultas + frete grátis',
    ctaText: 'Pegar Oferta Agora',
    ctaUrl: '#',
    primaryColor: '#F97316',    // Laranja vibrante
    secondaryColor: '#7C3AED',  // Roxo (combina com seu app)
    backgroundType: 'gradient',
    backgroundValue: 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 50%, #7c3aed 100%)',
    badgeText: 'PATROCINADO',
    animationStyle: 'gradient-flow',
    logoUrl: 'https://placehold.co/60x60/orange/white?text=G',
    isActive: true,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    priority: 1
};

export function SponsorCardPremium({ data = defaultSponsor }: SponsorCardPremiumProps) {
    const [isHovered, setIsHovered] = useState(false);
    const controls = useAnimation();

    // Animação automática de "breathing" (respiração) para chamar atenção
    useEffect(() => {
        controls.start({
            scale: [1, 1.02, 1],
            transition: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
            }
        });
    }, [controls]);

    // Estilos dinâmicos baseados nos dados (futuramente editáveis)
    const gradientStyle = {
        background: data.backgroundValue,
        backgroundSize: '200% 200%',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="relative w-full"
        >
            {/* CARD PRINCIPAL */}
            <motion.div
                animate={controls}
                whileHover={{
                    scale: 1.03,
                    y: -5,
                    transition: { duration: 0.3 }
                }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                className="relative overflow-hidden rounded-3xl shadow-2xl cursor-pointer group"
                style={{ aspectRatio: '16/9' }} // Proporção de cinema/banner
            >
                {/* BACKGROUND ANIMADO */}
                <motion.div
                    className="absolute inset-0"
                    style={gradientStyle}
                    animate={data.animationStyle === 'gradient-flow' ? {
                        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                    } : {}}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />

                {/* OVERLAY DE BRILHO (Shimmer Effect) */}
                <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                        background: 'linear-gradient(110deg, transparent 20%, rgba(255,255,255,0.15) 50%, transparent 80%)',
                        backgroundSize: '200% 100%',
                    }}
                    animate={isHovered ? {
                        backgroundPosition: ['200% 0%', '-200% 0%'],
                    } : {}}
                    transition={{
                        duration: 1.5,
                        ease: "easeInOut"
                    }}
                />

                {/* PARTÍCULAS DE BRILHO (Partículas douradas) */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-white rounded-full"
                            style={{
                                left: `${20 + i * 15}%`,
                                top: `${30 + (i % 2) * 40}%`,
                                boxShadow: '0 0 10px 2px rgba(255,255,255,0.8)',
                            }}
                            animate={{
                                y: [-20, -100],
                                opacity: [0, 1, 0],
                                scale: [0, 1, 0],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                delay: i * 0.8,
                                ease: "easeOut"
                            }}
                        />
                    ))}
                </div>

                {/* CONTEÚDO DO CARD */}
                <div className="relative z-10 h-full flex flex-col justify-between p-6 text-white">

                    {/* HEADER: Badge + Logo */}
                    <div className="flex justify-between items-start">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", delay: 0.2 }}
                            className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full"
                        >
                            <Sparkles className="w-3 h-3 text-yellow-300" />
                            <span className="text-[10px] font-bold tracking-wider">
                                {data.badgeText}
                            </span>
                        </motion.div>

                        {/* Logo da empresa (círculo) */}
                        <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.8 }}
                            className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/30 flex items-center justify-center text-lg font-bold"
                            style={{
                                boxShadow: `0 0 20px ${data.primaryColor}40`,
                                background: `linear-gradient(135deg, ${data.primaryColor}20, ${data.secondaryColor}20)`
                            }}
                        >
                            {data.companyName.charAt(0)}
                        </motion.div>
                    </div>

                    {/* CORPO: Textos */}
                    <div className="space-y-2">
                        <motion.p
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-white/80 text-sm font-medium"
                        >
                            {data.companyName}
                        </motion.p>

                        <motion.h3
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-2xl font-bold leading-tight"
                            style={{
                                textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                            }}
                        >
                            {data.headline}
                        </motion.h3>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-white/70 text-sm"
                        >
                            {data.description}
                        </motion.p>
                    </div>

                    {/* FOOTER: Botão CTA */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full bg-white text-gray-900 font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg mt-4 group/btn overflow-hidden relative"
                    >
                        {/* Efeito de onda no botão */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100 to-transparent"
                            initial={{ x: '-100%' }}
                            whileHover={{ x: '100%' }}
                            transition={{ duration: 0.6 }}
                        />

                        <span className="relative z-10">{data.ctaText}</span>
                        <ExternalLink className="w-4 h-4 relative z-10 group-hover/btn:translate-x-1 transition-transform" />
                    </motion.button>
                </div>

                {/* BORDA BRILHANTE (Animated Border) */}
                <motion.div
                    className="absolute inset-0 rounded-3xl pointer-events-none"
                    style={{
                        background: `linear-gradient(90deg, transparent, ${data.primaryColor}40, transparent)`,
                        backgroundSize: '200% 100%',
                        padding: '2px',
                        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        WebkitMaskComposite: 'xor',
                        maskComposite: 'exclude',
                    }}
                    animate={{
                        backgroundPosition: ['200% 0%', '-200% 0%'],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
            </motion.div>

            {/* SOMBRA DINÂMICA (sai do card) */}
            <motion.div
                className="absolute -bottom-4 left-4 right-4 h-8 bg-black/20 blur-xl rounded-full -z-10"
                animate={{
                    scale: isHovered ? 1.1 : 1,
                    opacity: isHovered ? 0.3 : 0.2,
                }}
            />
        </motion.div>
    );
}


