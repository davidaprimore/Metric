import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '../../../components/Layout';

// Dados mockados - Antigravity vai conectar com Supabase
const categories = [
    { id: 'all', label: 'Todos', icon: '✨' },
    { id: 'therapy', label: 'Terapia', icon: '🧠' },
    { id: 'nutrition', label: 'Nutrição', icon: '🥗' },
    { id: 'fitness', label: 'Fitness', icon: '💪' },
    { id: 'yoga', label: 'Yoga', icon: '🧘' },
];

const professionals = [
    { id: 1, name: 'Dra. Ana Paula', specialty: 'Nutricionista', rating: 4.98, distance: '2km' },
    { id: 2, name: 'Dr. Carlos', specialty: 'Fisioterapeuta', rating: 4.95, distance: '5km' },
];

export default function SearchScreen() {
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchFocus, setSearchFocus] = useState(false);

    return (
        <Layout>
            {/* Título animado */}
            <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h1 className="text-3xl font-display font-bold text-lavender-900 mb-2">
                    Olá, David 👋
                </h1>
                <p className="text-ink-muted text-lg">
                    Pronto para cuidar de você hoje?
                </p>
            </motion.div>

            {/* Busca com animação de foco */}
            <motion.div
                className="mb-6"
                animate={{ scale: searchFocus ? 1.02 : 1 }}
                transition={{ duration: 0.2 }}
            >
                <div className="relative group">
                    <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-lavender-400 
                       group-focus-within:text-lavender-600 transition-colors"></i>
                    <input
                        type="text"
                        placeholder="Para onde vamos?"
                        className="input-metric pl-12 shadow-soft hover:shadow-lift text-lg"
                        onFocus={() => setSearchFocus(true)}
                        onBlur={() => setSearchFocus(false)}
                    />
                    <motion.button
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-lavender-50 
                     text-lavender-600 flex items-center justify-center cursor-pointer"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <i className="fas fa-sliders-h"></i>
                    </motion.button>
                </div>
            </motion.div>

            {/* Categorias com stagger */}
            <motion.div
                className="flex gap-3 overflow-x-auto hide-scrollbar mb-8 pb-2"
                initial="hidden"
                animate="visible"
                variants={{
                    visible: { transition: { staggerChildren: 0.05 } }
                }}
            >
                {categories.map((cat) => (
                    <motion.button
                        key={cat.id}
                        variants={{
                            hidden: { opacity: 0, x: -20 },
                            visible: { opacity: 1, x: 0 }
                        }}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`flex-shrink-0 px-5 py-2.5 rounded-full font-medium text-sm transition-all cursor-pointer
              ${activeCategory === cat.id
                                ? 'bg-lavender-600 text-white shadow-glow'
                                : 'bg-white text-lavender-800 border border-lavender-200 hover:border-lavender-400'}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span className="mr-1">{cat.icon}</span>
                        {cat.label}
                    </motion.button>
                ))}
            </motion.div>

            {/* Lista de profissionais com stagger e hover 3D */}
            <div className="space-y-4">
                <h2 className="font-display font-bold text-xl text-lavender-900 mb-4">
                    Especialistas perto de você
                </h2>

                {professionals.map((pro, index) => (
                    <motion.div
                        key={pro.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 + 0.3 }}
                        whileHover={{ y: -4, transition: { duration: 0.2 } }}
                        className="card-metric p-4 cursor-pointer group"
                    >
                        <div className="flex gap-4">
                            {/* Avatar com animação de pulso suave */}
                            <motion.div
                                className="w-20 h-24 rounded-2xl bg-gradient-to-br from-lavender-300 to-lavender-500 
                         flex items-center justify-center text-white text-2xl overflow-hidden"
                                whileHover={{ scale: 1.05 }}
                            >
                                <span className="group-hover:animate-breathe">👤</span>
                            </motion.div>

                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="font-bold text-lg text-lavender-900 group-hover:text-lavender-700 transition-colors">
                                        {pro.name}
                                    </h3>
                                    <div className="flex items-center gap-1 text-sm font-bold text-yellow-500">
                                        <i className="fas fa-star"></i>
                                        {pro.rating}
                                    </div>
                                </div>

                                <p className="text-ink-muted text-sm mb-2">{pro.specialty}</p>

                                <div className="flex items-center gap-3 text-xs text-ink-muted mb-3">
                                    <span><i className="fas fa-map-marker-alt mr-1"></i>{pro.distance}</span>
                                    <span>•</span>
                                    <span className="text-green-600 font-medium">Disponível hoje</span>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-lavender-100">
                                    <span className="font-bold text-lavender-900">R$ 280</span>
                                    <motion.button
                                        className="btn-primary text-sm py-2 px-4 cursor-pointer"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Agendar
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </Layout>
    );
}
