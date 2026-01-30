import { motion } from 'framer-motion';

export function LoadingTransition({ isVisible }: { isVisible: boolean }) {
    if (!isVisible) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-gradient-to-br from-purple-50 to-white flex items-center justify-center"
        >
            <div className="flex flex-col items-center gap-6">
                {/* Logo Animada */}
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="w-24 h-24 bg-purple-600 rounded-3xl flex items-center justify-center text-white text-4xl font-bold shadow-2xl shadow-purple-600/30 relative overflow-hidden"
                >
                    M
                    {/* Shimmer effect */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        animate={{ x: ['-200%', '200%'] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    />
                </motion.div>

                {/* Texto */}
                <div className="text-center">
                    <motion.p
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="text-purple-900 font-semibold text-lg"
                    >
                        Metrika
                    </motion.p>
                    <p className="text-purple-400 text-sm">Carregando...</p>
                </div>

                {/* Barra de progresso indeterminada */}
                <div className="w-48 h-1 bg-purple-100 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-purple-600 rounded-full"
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                </div>
            </div>
        </motion.div>
    );
}
