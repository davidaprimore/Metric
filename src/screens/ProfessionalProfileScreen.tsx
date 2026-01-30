import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
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
    ChevronRight
} from 'lucide-react';
import type { ProfessionalData } from '../types/professional';

const professionalData: ProfessionalData = {
    id: '1',
    name: 'Dr. Ricardo Silva',
    specialty: 'Nutricionista Esportivo',
    crm: 'CRN-3 12345',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&h=600&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=800&fit=crop',
    rating: 4.9,
    reviewsCount: 128,
    location: 'São Paulo, SP',
    distance: '2.5 km',
    nextAvailable: 'Hoje, 16:00',
    bio: 'Especialista em nutrição esportiva há 8 anos. Ajudo atletas e entusiastas a otimizarem performance através da alimentação. Pós-graduado em fisiologia do exercício pela USP.',
    languages: ['Português', 'Inglês'],
    education: [
        { degree: 'Pós-graduação Fisiologia do Exercício', school: 'USP', year: '2019' },
        { degree: 'Graduação Nutrição', school: 'UNIFESP', year: '2016' }
    ],
    certifications: ['Nutrição Esportiva Avançada', 'Prescrição de Suplementos'],
    services: [
        { id: 1, name: 'Consulta Inicial', duration: '60 min', price: 300, isPopular: true, description: 'Avaliação completa e plano alimentar' },
        { id: 2, name: 'Retorno', duration: '30 min', price: 180, isPopular: false, description: 'Acompanhamento e ajustes' },
    ],
    stats: {
        patients: 450,
        sessions: 1200,
        experience: '8 anos'
    }
};

export function ProfessionalProfileScreen({
    isOpen,
    onClose,
    onBook,
    professionalId
}: {
    isOpen: boolean;
    onClose: () => void;
    onBook: () => void;
    professionalId?: string;
}) {
    const [activeTab, setActiveTab] = useState<'about' | 'services' | 'reviews'>('about');
    const [selectedService, setSelectedService] = useState<number | null>(1);
    const [isLiked, setIsLiked] = useState(false);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center"
                onClick={onClose}
            >
                <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="w-full sm:w-[430px] h-[95vh] sm:h-[90vh] bg-gray-50 rounded-t-[32px] sm:rounded-[32px] overflow-hidden shadow-2xl relative flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* CONTEÚDO SCROLLável */}
                    <div className="flex-1 overflow-y-auto scrollbar-hide">

                        {/* FOTO DE CAPA LIMPA */}
                        <div className="relative h-[35vh]">
                            <img
                                src={professionalData.coverImage}
                                alt="Cover"
                                className="w-full h-full object-cover"
                            />

                            {/* BOTOES FLUTUANTES */}
                            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={onClose}
                                    className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-gray-800 shadow-lg"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </motion.button>

                                <div className="flex gap-2">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setIsLiked(!isLiked)}
                                        className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg"
                                    >
                                        <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-gray-600 shadow-lg"
                                    >
                                        <Share2 className="w-5 h-5" />
                                    </motion.button>
                                </div>
                            </div>
                        </div>

                        {/* CARD BRANCO SOBREPOSTO */}
                        <div className="relative -mt-16 px-6 pb-32">
                            <motion.div
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2, type: 'spring' }}
                                className="bg-white rounded-3xl shadow-xl p-6"
                            >
                                {/* HEADER */}
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-16 h-16 rounded-2xl overflow-hidden border-3 border-white shadow-md flex-shrink-0">
                                        <img src={professionalData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h1 className="text-2xl font-bold text-gray-900 leading-tight">{professionalData.name}</h1>
                                            <BadgeCheck className="w-6 h-6 text-blue-500 flex-shrink-0" />
                                        </div>
                                        <p className="text-purple-600 font-semibold text-sm">{professionalData.specialty}</p>
                                        <p className="text-gray-400 text-xs mt-1">CRM: {professionalData.crm}</p>
                                    </div>
                                </div>

                                {/* RATING E LOCAL */}
                                <div className="flex items-center gap-4 text-sm text-gray-600 mb-6 flex-wrap">
                                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        <span className="font-bold text-gray-800">{professionalData.rating}</span>
                                        <span className="text-gray-400">({professionalData.reviewsCount})</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        <span>{professionalData.distance}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-green-600 font-medium">
                                        <Clock className="w-4 h-4" />
                                        <span>Disponível hoje</span>
                                    </div>
                                </div>

                                {/* MATCH BADGE */}
                                <div className="flex items-center justify-between mb-6 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
                                    <div className="flex items-center gap-2">
                                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                                            <Star className="w-5 h-5 text-white fill-white" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800">95% Match</p>
                                            <p className="text-xs text-gray-500">Baseado no seu perfil</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-purple-400" />
                                </div>

                                {/* STATS COMPACTOS */}
                                <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-gray-100">
                                    <div className="text-center">
                                        <p className="text-xl font-bold text-gray-800">{professionalData.stats.patients}+</p>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">Pacientes</p>
                                    </div>
                                    <div className="text-center border-x border-gray-100">
                                        <p className="text-xl font-bold text-gray-800">{professionalData.stats.experience}</p>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">Experiência</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xl font-bold text-gray-800">{professionalData.stats.sessions}</p>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">Consultas</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* TABS */}
                            <div className="sticky top-0 bg-gray-50 z-10 mt-6 px-2 border-b border-gray-200">
                                <div className="flex gap-8">
                                    {['about', 'services', 'reviews'].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab as any)}
                                            className={`pb-3 text-sm font-bold transition-colors relative ${activeTab === tab ? 'text-purple-600' : 'text-gray-400'
                                                }`}
                                        >
                                            {tab === 'about' && 'Sobre'}
                                            {tab === 'services' && 'Serviços'}
                                            {tab === 'reviews' && 'Avaliações'}
                                            {activeTab === tab && (
                                                <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* CONTEÚDO */}
                            <div className="mt-6 px-2">
                                <AnimatePresence mode='wait'>
                                    {activeTab === 'about' && (
                                        <motion.div
                                            key="about"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="space-y-6"
                                        >
                                            <section>
                                                <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2 text-sm">
                                                    <TrendingUp className="w-4 h-4 text-purple-600" />
                                                    Sobre
                                                </h3>
                                                <p className="text-gray-600 text-sm leading-relaxed">
                                                    {professionalData.bio}
                                                </p>
                                            </section>

                                            <section>
                                                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2 text-sm">
                                                    <Award className="w-4 h-4 text-purple-600" />
                                                    Formação
                                                </h3>
                                                <div className="space-y-2">
                                                    {professionalData.education.map((edu, idx) => (
                                                        <div key={idx} className="flex items-start gap-3 p-3 bg-white rounded-xl border border-gray-100">
                                                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 text-purple-600 font-bold text-xs">
                                                                USP
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-gray-800 text-sm">{edu.degree}</p>
                                                                <p className="text-gray-400 text-xs">{edu.school} • {edu.year}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </section>

                                            <section>
                                                <h3 className="font-bold text-gray-800 mb-2 text-sm">Idiomas</h3>
                                                <div className="flex gap-2">
                                                    {professionalData.languages.map((lang) => (
                                                        <span key={lang} className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 text-xs rounded-full font-medium">
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
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="space-y-3"
                                        >
                                            {professionalData.services.map((service) => (
                                                <motion.div
                                                    key={service.id}
                                                    whileHover={{ scale: 1.01 }}
                                                    whileTap={{ scale: 0.99 }}
                                                    onClick={() => setSelectedService(service.id)}
                                                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all bg-white ${selectedService === service.id
                                                        ? 'border-purple-500 shadow-md'
                                                        : 'border-gray-200'
                                                        }`}
                                                >
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <h4 className="font-bold text-gray-800 text-sm">{service.name}</h4>
                                                            <p className="text-gray-500 text-xs flex items-center gap-1 mt-1">
                                                                <Clock className="w-3 h-3" />
                                                                {service.duration}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-lg font-bold text-purple-600">R$ {service.price}</p>
                                                            {service.isPopular && (
                                                                <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-bold">
                                                                    POPULAR
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-600 text-xs">{service.description}</p>
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    )}

                                    {activeTab === 'reviews' && (
                                        <motion.div
                                            key="reviews"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="space-y-6"
                                        >
                                            {/* Score Header */}
                                            <div className="bg-[#FBF7FC] rounded-[24px] p-5 flex items-center justify-between">
                                                <div>
                                                    <div className="text-[32px] font-bold text-[#9B6AB0] leading-none mb-1">4.9</div>
                                                    <div className="flex gap-1 mb-1">
                                                        {[1, 2, 3, 4, 5].map(i => (
                                                            <Star key={i} className="w-3.5 h-3.5 fill-[#FFB800] text-[#FFB800]" />
                                                        ))}
                                                    </div>
                                                    <div className="text-xs text-gray-500">Baseado em 128 avaliações</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-[24px] font-bold text-[#3D2646] leading-none mb-1">98%</div>
                                                    <div className="text-xs text-gray-500 text-right">Recomendam</div>
                                                </div>
                                            </div>

                                            {/* Reviews List */}
                                            <div className="space-y-0 divide-y divide-gray-100">
                                                {[1, 2, 3].map((review) => (
                                                    <div key={review} className="py-4 first:pt-0">
                                                        <div className="flex justify-between items-start mb-3">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                                                                    <img
                                                                        src={review === 1 ? "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop" : review === 2 ? "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" : "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop"}
                                                                        alt="Avatar"
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <p className="font-['Outfit'] font-bold text-[#3D2646] text-[15px]">
                                                                        {review === 1 ? 'Marina S.' : review === 2 ? 'Pedro H.' : 'Lucas M.'}
                                                                    </p>
                                                                    <p className="text-[11px] text-gray-400">2 dias atrás</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-0.5">
                                                                {[1, 2, 3, 4, 5].map(i => (
                                                                    <Star key={i} className="w-3 h-3 fill-[#FFB800] text-[#FFB800]" />
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <p className="text-[#5D5D5D] text-[13px] leading-relaxed">
                                                            Atendimento excelente! O Dr. Ricardo me ajudou muito com meu plano alimentar para a maratona. Super recomendo!
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {/* BOTTOM BAR FIXA */}
                    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                        <div className="flex gap-3">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onBook}
                                className="flex-1 bg-purple-600 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-purple-600/25 text-sm"
                            >
                                <Calendar className="w-4 h-4" />
                                Agendar Consulta
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-4 bg-purple-100 text-purple-600 rounded-2xl"
                            >
                                <Video className="w-5 h-5" />
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-4 bg-gray-100 text-gray-600 rounded-2xl"
                            >
                                <MessageCircle className="w-5 h-5" />
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
