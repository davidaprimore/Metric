import { motion } from 'framer-motion';

interface LogoProps {
    size?: 'sm' | 'md' | 'lg';
    animated?: boolean;
}

const sizes = {
    sm: { text: 'text-xl', circle: 'w-8 h-8' },
    md: { text: 'text-2xl', circle: 'w-10 h-10' },
    lg: { text: 'text-4xl', circle: 'w-16 h-16' },
};

export function Logo({ size = 'md', animated = true }: LogoProps) {
    const { text, circle } = sizes[size];

    if (animated) {
        return (
            <motion.div
                className="flex items-center gap-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
                <motion.div
                    className={`${circle} rounded-full bg-gradient-to-br from-lavender-400 to-lavender-600 
                     flex items-center justify-center shadow-glow`}
                    animate={{
                        scale: [1, 1.05, 1],
                        rotate: [0, 5, -5, 0]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <span className={`${text} font-display font-bold text-white`}>M</span>
                </motion.div>

                <motion.span
                    className={`${text} font-display font-bold text-lavender-800`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    Metrika
                </motion.span>
            </motion.div>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <div className={`${circle} rounded-full bg-gradient-to-br from-lavender-400 to-lavender-600 
                      flex items-center justify-center`}>
                <span className={`${text} font-display font-bold text-white`}>M</span>
            </div>
            <span className={`${text} font-display font-bold text-lavender-800`}>Metrika</span>
        </div>
    );
}
