import { motion } from 'framer-motion';
import { Zap, TrendingUp, Award } from 'lucide-react';

// VARIAÇÃO 2: Card "Neon" (estilo Cyberpunk/Tecnológico)
export function SponsorCardNeon() {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative overflow-hidden rounded-3xl bg-black border border-cyan-500/30 p-6 cursor-pointer"
            style={{
                boxShadow: '0 0 30px rgba(6, 182, 212, 0.15), inset 0 0 30px rgba(6, 182, 212, 0.05)',
            }}
        >
            {/* Scanlines */}
            <div className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #000 3px)',
                    backgroundSize: '100% 4px',
                }}
            />

            <div className="relative z-10 text-cyan-400">
                <div className="flex items-center gap-2 mb-4">
                    <Zap className="w-5 h-5 animate-pulse" />
                    <span className="text-xs font-mono tracking-widest">DESTAQUE PREMIUM</span>
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">Black Growth</h3>
                <p className="text-cyan-200/70 text-sm mb-4">Pré-treino com 50% OFF</p>

                <button className="w-full bg-cyan-500/20 border border-cyan-400 text-cyan-300 py-3 rounded-xl font-bold hover:bg-cyan-500/30 transition-colors">
                    RESGATAR CUPOM
                </button>
            </div>
        </motion.div>
    );
}

// VARIAÇÃO 3: Card "Elegance" (estilo Luxo/Apple)
export function SponsorCardElegance() {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-100 to-slate-200 p-1 shadow-xl cursor-pointer"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-[2rem]" />

            <div className="relative bg-white rounded-[1.8rem] p-6 h-full">
                <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white text-xl">
                        <Award className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 tracking-wider">PARCEIRO</span>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-1">Clube VIP</h3>
                <p className="text-gray-500 text-sm mb-4">Acesso exclusivo a nutricionistas</p>

                <div className="flex items-center gap-2 text-green-600 text-sm font-semibold">
                    <TrendingUp className="w-4 h-4" />
                    <span>Economize R$ 200/mês</span>
                </div>
            </div>
        </motion.div>
    );
}

// VARIAÇÃO 4: Card "Holographic" (Efeito de cartão de crédito)
export function SponsorCardHolo() {
    return (
        <div className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 cursor-pointer group">
            {/* Efeito de brilho de holograma */}
            <div className="absolute inset-0 opacity-30 mix-blend-overlay"
                style={{
                    background: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
                    transform: 'translateX(-100%)',
                    transition: 'transform 0.6s',
                }}
            />
            <div className="absolute inset-0 group-hover:translate-x-full transition-transform duration-700"
                style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                }}
            />

            <div className="relative z-10 text-white">
                <p className="text-white/60 text-xs font-bold mb-4 tracking-widest">PATROCINADOR OFICIAL</p>
                <h3 className="text-3xl font-bold mb-2 italic">Growth</h3>
                <p className="text-white/80 text-sm">Nova fórmula disponível</p>

                <div className="mt-6 flex gap-2">
                    <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs">Novo</span>
                    <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs">Exclusivo</span>
                </div>
            </div>
        </div>
    );
}
