import { Variants } from 'framer-motion';

// Entrada suave de baixo pra cima
export const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (delay: number = 0) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay,
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1]
        }
    })
};

// Stagger container (lista de itens)
export const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

// Item staggered
export const staggerItem: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.4,
            ease: "easeOut"
        }
    }
};

// Scale hover effect
export const scaleOnHover = {
    scale: 1.05,
    transition: { duration: 0.2 }
};

// Tap effect
export const tapEffect = {
    scale: 0.95
};

// Page transition
export const pageTransition: Variants = {
    initial: { opacity: 0, x: 20 },
    animate: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.3, ease: "easeInOut" }
    },
    exit: {
        opacity: 0,
        x: -20,
        transition: { duration: 0.2 }
    }
};

// Card 3D tilt effect (para usar com mouse move)
export const getTiltStyle = (x: number, y: number, rect: DOMRect) => {
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    return {
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`,
        transition: 'transform 0.1s ease-out'
    };
};
