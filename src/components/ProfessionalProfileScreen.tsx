import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useState, useRef } from 'react';
import {
    Star,
    MapPin,
    Clock,
    CheckCircle2,
    Award,
    TrendingUp,
    Heart,
    Share2,
    ArrowLeft,
    Calendar,
    Video,
    MessageCircle,
    BadgeCheck,
    Shield
} from 'lucide-react';

// Dados mockados do profissional (depois virão do Supabase)
const professionalData = {
    id: '1',
    name: 'Dr. Ricardo Silva',
    specialty: 'Nutricionista Esportivo',
    crm: 'CRN-3 12345',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&h=800&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=600&fit=crop',
    rating: 4.9,
    reviewsCount: 128,
    location: 'São Paulo, SP',
    distance: '2.5 km',
    bio: 'Especialista em nutrição esportiva há 8 anos. Ajudo atletas e entusiastas a otimizarem performance através da alimentação. Pós-graduado em fisiologia do exercício pela USP.',
    languages: ['Português', 'Inglês'],
    education: [
        { degree: 'Pós-graduação Fisiologia do Exercício', school: 'USP', year: '2019' },
        { degree: 'Graduação Nutrição', school: 'UNIFESP', year: '2016' }
    ],
    certifications: ['Nutrição Esportiva Avançada', 'Prescrição de Suplementos', 'Ergogenia'],
    services: [
        {
            id: 1,
            name: 'Consulta Inicial',
            duration: '60 min',
            price: 300,
            isPopular: true,
            description: 'Avaliação completa, plano alimentar personalizado e suplementação'
        },
        {
            id: 2,
            name: 'Consulta de Retorno',
            duration: '30 min',
            price: 180,
            isPopular: false,
            description: 'Acompanhamento, ajustes no plano e evolução'
        },
        {
            id: 3,
            name: 'Plano Mensal Premium',
            duration: 'Mensal',
            price: 750,
            isPopular: false,
            description: '4 consultas + suporte via WhatsApp + plano de treino integrado'
        }
    ],
    availability: {
        nextAvailable: 'Hoje, 16:00',
        slots: ['14:00', '15:00', '16:00', '17:30', '18:00'],
        dates: ['Hoje', 'Amanhã', 'Qua', 'Qui', 'Sex']
    },
    stats: {
        patients: 450,
        sessions: 1200,
        experience: '8 anos'
    }
};

export function ProfessionalProfileScreen({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [activeTab, setActiveTab] = useState<'about' | 'services' | 'reviews'>('about');
    const [selectedService, setSelectedService] = useState<number | null>(1);
    const [isLiked, setIsLiked] = useState(false);

    const containerRef = useRef(null);
    const { scrollY } = useScroll({ container: containerRef });

    // Parallax effect na imagem de capa
    const y = useTransform(scrollY, [0, 300], [0, 100]);
    const opacity = useTransform(scrollY, [0, 200], [1, 0]);
    const scale = useTransform(scrollY, [0, 300], [1, 1.1]);

    // Removido o if (!isOpen) return null; para permitir animação de saída

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center ps-safe pe-safe"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="w-full sm:w-[430px] h-[95vh] sm:h-[90vh] bg-white rounded-t-[32px] sm:rounded-[32px] overflow-hidden shadow-2xl relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Scroll Container */}
                        <div ref={containerRef} className="h-full overflow-y-auto scrollbar-hide pb-32">

                            {/* Hero Section com Parallax */}
                            <div className="relative h-[45vh] overflow-hidden">
                                {/* Imagem de fundo com parallax */}
                                <motion.div
                                    style={{ y, scale }}
                                    className="absolute inset-0"
                                >
                                    <img
                                        src={professionalData.coverImage}
                                        alt="Cover"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
                                </motion.div>

                                {/* Header flutuante */}
                                <motion.div
                                    style={{ opacity }}
                                    className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20 pt-safe"
                                >
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={onClose}
                                        className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30"
                                    >
                                        <ArrowLeft className="w-5 h-5" />
                                    </motion.button>

                                    <div className="flex gap-2">
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => setIsLiked(!isLiked)}
                                            className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30"
                                        >
                                            <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30"
                                        >
                                            <Share2 className="w-5 h-5" />
                                        </motion.button>
                                    </div>
                                </motion.div>

                                {/* Badge de Match flutuante */}
                                <motion.div
                                    initial={{ x: -100, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.3, type: 'spring' }}
                                    className="absolute top-24 left-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2"
                                >
                                    <Star className="w-4 h-4 fill-white" />
                                    95% Match
                                </motion.div>

                                {/* Info do profissional na parte inferior */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <h1 className="text-3xl font-bold">{professionalData.name}</h1>
                                            <BadgeCheck className="w-6 h-6 text-blue-400 fill-blue-400" />
                                        </div>
                                        <p className="text-white/90 text-lg font-medium mb-3">{professionalData.specialty}</p>

                                        <div className="flex items-center gap-4 text-sm text-white/80">
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                <span className="font-bold">{professionalData.rating}</span>
                                                <span>({professionalData.reviewsCount})</span>
                                            </div>
                                            <span>•</span>
                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4" />
                                                <span>{professionalData.distance}</span>
                                            </div>
                                            <span>•</span>
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                <span>Disponível hoje</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>

                            {/* Stats Rápidos */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="px-6 -mt-6 relative z-10"
                            >
                                <div className="bg-white rounded-2xl shadow-lg p-4 flex justify-between items-center border border-gray-100">
                                    <div className="text-center flex-1 border-r border-gray-100">
                                        <p className="text-2xl font-bold text-gray-800">{professionalData.stats.patients}+</p>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Pacientes</p>
                                    </div>
                                    <div className="text-center flex-1 border-r border-gray-100">
                                        <p className="text-2xl font-bold text-gray-800">{professionalData.stats.experience}</p>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Experiência</p>
                                    </div>
                                    <div className="text-center flex-1">
                                        <p className="text-2xl font-bold text-gray-800">{professionalData.stats.sessions}</p>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Consultas</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Tabs Navigation */}
                            <div className="sticky top-0 bg-white z-20 mt-6 px-6 border-b border-gray-100">
                                <div className="flex gap-8">
                                    {['about', 'services', 'reviews'].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab as any)}
                                            className={`pb-4 text-sm font-bold transition-colors relative ${activeTab === tab ? 'text-purple-600' : 'text-gray-400'
                                                }`}
                                        >
                                            {tab === 'about' && 'Sobre'}
                                            {tab === 'services' && 'Serviços'}
                                            {tab === 'reviews' && 'Avaliações'}
                                            {activeTab === tab && (
                                                <motion.div
                                                    layoutId="activeTab"
                                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600"
                                                />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Conteúdo das Tabs */}
                            <div className="px-6 py-6">
                                <AnimatePresence mode='wait'>
                                    {activeTab === 'about' && (
                                        <motion.div
                                            key="about"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="space-y-6"
                                        >
                                            {/* Bio */}
                                            <section>
                                                <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                                                    <TrendingUp className="w-5 h-5 text-purple-600" />
                                                    Sobre mim
                                                </h3>
                                                <p className="text-gray-600 leading-relaxed text-sm">
                                                    {professionalData.bio}
                                                </p>
                                            </section>

                                            {/* Educação */}
                                            <section>
                                                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                                    <Award className="w-5 h-5 text-purple-600" />
                                                    Formação
                                                </h3>
                                                <div className="space-y-3">
                                                    {professionalData.education.map((edu, idx) => (
                                                        <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                                                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                                <span className="text-purple-600 font-bold text-xs">USP</span>
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-gray-800 text-sm">{edu.degree}</p>
                                                                <p className="text-gray-500 text-xs">{edu.school} • {edu.year}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </section>

                                            {/* Certificações */}
                                            <section>
                                                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                                    <Shield className="w-5 h-5 text-purple-600" />
                                                    Certificações
                                                </h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {professionalData.certifications.map((cert, idx) => (
                                                        <span key={idx} className="px-3 py-1.5 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-100 flex items-center gap-1">
                                                            <CheckCircle2 className="w-3 h-3" />
                                                            {cert}
                                                        </span>
                                                    ))}
                                                </div>
                                            </section>

                                            {/* Idiomas */}
                                            <section>
                                                <h3 className="font-bold text-gray-800 mb-2">Idiomas</h3>
                                                <div className="flex gap-2">
                                                    {professionalData.languages.map((lang) => (
                                                        <span key={lang} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                                                            {lang}
                                                        </span>
                                                    ))}
                                                </div>
                                            </section>
                                        </motion.div>
                                    )}

                                    {activeTab === 'services' && (
                                        <motion.div
                                            key="services"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="space-y-4"
                                        >
                                            {professionalData.services.map((service) => (
                                                <motion.div
                                                    key={service.id}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => setSelectedService(service.id)}
                                                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedService === service.id
                                                        ? 'border-purple-500 bg-purple-50/50 shadow-md'
                                                        : 'border-gray-100 bg-white hover:border-purple-200'
                                                        }`}
                                                >
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <h4 className="font-bold text-gray-800">{service.name}</h4>
                                                            <p className="text-gray-500 text-xs flex items-center gap-1 mt-1">
                                                                <Clock className="w-3 h-3" />
                                                                {service.duration}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-xl font-bold text-purple-600">R$ {service.price}</p>
                                                            {service.isPopular && (
                                                                <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-bold">
                                                                    POPULAR
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-600 text-sm mt-2">{service.description}</p>

                                                    {selectedService === service.id && (
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{
                                                                opacity: 1, height: 'auto'
                                                            }}
                                                            className="mt-3 pt-3 border-t border-purple-200"
                                                        >
                                                            <p className="text-xs text-purple-600 font-medium flex items-center gap-1">
                                                                <CheckCircle2 className="w-3 h-3" />
                                                                Selecionado para agendamento
                                                            </p>
                                                        </motion.div>
                                                    )}
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    )}

                                    {activeTab === 'reviews' && (
                                        <motion.div
                                            key="reviews"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="space-y-4"
                                        >
                                            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-2xl">
                                                <div>
                                                    <p className="text-3xl font-bold text-purple-600">4.9</p>
                                                    <div className="flex gap-0.5 my-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                        ))}
                                                    </div>
                                                    <p className="text-gray-600 text-xs">Baseado em 128 avaliações</p>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-2xl font-bold text-gray-800">98%</p>
                                                    <p className="text-gray-500 text-xs">Recomendam</p>
                                                </div>
                                            </div>

                                            {[1, 2, 3].map((review) => (
                                                <div key={review} className="border-b border-gray-100 pb-4 last:border-0">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden">
                                                                <img src={`https://i.pravatar.cc/150?img=${review + 10}`} alt="User" className="w-full h-full object-cover" />
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-sm text-gray-800">Marina S.</p>
                                                                <p className="text-xs text-gray-500">2 dias atrás</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-0.5">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-600 text-sm leading-relaxed">
                                                        Atendimento excelente! O Dr. Ricardo me ajudou muito com meu plano alimentar para a maratona. Super recomendo!
                                                    </p>
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Bottom Bar Fixa com CTA */}
                        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                            <div className="flex gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex-1 bg-purple-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-purple-600/25"
                                >
                                    <Calendar className="w-5 h-5" />
                                    Agendar Consulta
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-4 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center"
                                >
                                    <Video className="w-5 h-5" />
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-4 bg-gray-100 text-gray-600 rounded-2xl flex items-center justify-center"
                                >
                                    <MessageCircle className="w-5 h-5" />
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
