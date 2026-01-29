import { useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

// Mock data - Antigravity conecta com Supabase
const professional = {
    id: 1,
    name: 'Dra. Ana Paula Mendes',
    specialty: 'Nutricionista Funcional',
    crm: 'CRN-3 12345',
    rating: 4.98,
    reviews: 127,
    about: 'Especialista em emagrecimento saudável e performance física. Mais de 10 anos ajudando pacientes a transformarem sua relação com a comida através da nutrição personalizada e biohacking.',
    price: 280,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800',
    tags: ['Emagrecimento', 'Performance', 'Vegano', 'Detox'],
    availability: ['09:00', '10:30', '14:00', '15:30', '17:00'],
    location: {
        address: 'Rua Oscar Freire, 1000 - Jardins, São Paulo',
        distance: '2.3km',
        lat: -23.5505,
        lng: -46.6823
    }
};

export default function ProfessionalDetailScreen() {
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [showBookingConfirm, setShowBookingConfirm] = useState(false);
    const scrollRef = useRef(null);

    const { scrollY } = useScroll({ container: scrollRef });
    const imageScale = useTransform(scrollY, [0, 300], [1, 1.2]);
    const imageOpacity = useTransform(scrollY, [0, 300], [1, 0.3]);
    const headerOpacity = useTransform(scrollY, [100, 250], [0, 1]);

    return (
        <div className="h-screen overflow-hidden bg-background flex flex-col">
            {/* Sticky Header (aparece ao scrollar) */}
            <motion.header
                style={{ opacity: headerOpacity }}
                className="fixed top-0 left-0 right-0 max-w-md mx-auto z-50 bg-white/95 backdrop-blur-md 
                   border-b border-lavender-100 px-5 py-4 flex items-center gap-3 pointer-events-none"
            >
                <button className="w-10 h-10 rounded-full bg-lavender-50 flex items-center justify-center text-lavender-800 pointer-events-auto cursor-pointer" onClick={() => window.history.back()}>
                    <i className="fas fa-arrow-left"></i>
                </button>
                <div className="flex-1">
                    <h2 className="font-display font-bold text-lavender-900 truncate">{professional.name}</h2>
                    <p className="text-xs text-ink-muted">{professional.specialty}</p>
                </div>
                <button className="w-10 h-10 rounded-full bg-lavender-50 flex items-center justify-center text-coral-500 pointer-events-auto cursor-pointer">
                    <i className="fas fa-heart"></i>
                </button>
            </motion.header>

            {/* Conteúdo Scrollável */}
            <motion.div
                ref={scrollRef}
                className="h-full overflow-y-auto hide-scrollbar pb-32 flex-1"
            >
                {/* Hero Image com Parallax */}
                <div className="relative h-96 overflow-hidden">
                    <motion.img
                        src={professional.image}
                        style={{ scale: imageScale, opacity: imageOpacity }}
                        className="w-full h-full object-cover"
                    />

                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

                    {/* Botão de voltar flutuante */}
                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => window.history.back()}
                        className="absolute top-6 left-6 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm 
                     shadow-soft flex items-center justify-center text-lavender-900 z-10 cursor-pointer"
                        whileTap={{ scale: 0.9 }}
                    >
                        <i className="fas fa-arrow-left text-lg"></i>
                    </motion.button>

                    {/* Botão de favoritar */}
                    <motion.button
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm 
                     shadow-soft flex items-center justify-center text-ink-muted hover:text-coral-500 z-10 cursor-pointer"
                        whileTap={{ scale: 0.9 }}
                    >
                        <i className="fas fa-heart text-xl"></i>
                    </motion.button>
                </div>

                {/* Conteúdo */}
                <div className="px-6 -mt-20 relative z-10">
                    {/* Card de Informações Principais */}
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="bg-white rounded-3xl shadow-lift p-6 mb-6"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h1 className="font-display font-bold text-2xl text-lavender-900 mb-1">
                                    {professional.name}
                                </h1>
                                <p className="text-ink-muted flex items-center gap-2">
                                    {professional.specialty}
                                    <span className="w-1 h-1 bg-lavender-300 rounded-full"></span>
                                    <span className="text-lavender-600 text-sm">CRM {professional.crm}</span>
                                </p>
                            </div>

                            {/* Badge de avaliação */}
                            <div className="bg-yellow-50 px-3 py-2 rounded-2xl flex items-center gap-1 border border-yellow-100">
                                <i className="fas fa-star text-yellow-500 text-sm"></i>
                                <span className="font-bold text-yellow-700">{professional.rating}</span>
                                <span className="text-xs text-yellow-600">({professional.reviews})</span>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {professional.tags.map((tag, i) => (
                                <motion.span
                                    key={tag}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3 + i * 0.1 }}
                                    className="px-3 py-1 bg-lavender-50 text-lavender-800 rounded-full text-xs font-medium"
                                >
                                    {tag}
                                </motion.span>
                            ))}
                        </div>

                        {/* Preço */}
                        <div className="flex items-center justify-between pt-4 border-t border-lavender-100">
                            <div>
                                <span className="text-xs text-ink-muted uppercase tracking-wide">Consulta</span>
                                <p className="text-2xl font-bold text-lavender-900">R$ {professional.price}</p>
                            </div>
                            <span className="text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full">
                                <i className="fas fa-check-circle mr-1"></i>Disponível hoje
                            </span>
                        </div>
                    </motion.div>

                    {/* Sobre */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mb-6"
                    >
                        <h3 className="font-display font-bold text-lg text-lavender-900 mb-3">Sobre</h3>
                        <p className="text-ink leading-relaxed text-sm">
                            {professional.about}
                        </p>
                        <button className="text-lavender-600 text-sm font-semibold mt-2 hover:underline cursor-pointer">
                            Ler mais
                        </button>
                    </motion.section>

                    {/* Localização */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mb-6"
                    >
                        <h3 className="font-display font-bold text-lg text-lavender-900 mb-3">Localização</h3>
                        <div className="bg-lavender-50 rounded-2xl p-4 flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-lavender-200 rounded-full flex items-center justify-center text-lavender-700">
                                <i className="fas fa-map-marker-alt text-xl"></i>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-lavender-900">{professional.location.address}</p>
                                <p className="text-xs text-ink-muted">{professional.location.distance} de distância</p>
                            </div>
                        </div>
                        {/* Aqui viria o mapa - Antigravity integra Google Maps ou Mapbox */}
                        <div className="h-32 bg-lavender-200 rounded-2xl flex items-center justify-center text-lavender-500">
                            <i className="fas fa-map text-3xl"></i>
                        </div>
                    </motion.section>

                    {/* Seletor de Data */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="mb-6"
                    >
                        <h3 className="font-display font-bold text-lg text-lavender-900 mb-3">Escolha uma data</h3>
                        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
                            {['Hoje', 'Amanhã', 'Qua', 'Qui', 'Sex', 'Sab'].map((day, i) => (
                                <motion.button
                                    key={day}
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedDate(day)}
                                    className={`flex-shrink-0 w-20 h-24 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer
                    ${selectedDate === day
                                            ? 'bg-lavender-600 text-white shadow-glow'
                                            : 'bg-white border border-lavender-200 text-lavender-800 hover:border-lavender-400'}`}
                                >
                                    <span className="text-xs opacity-80">{i < 2 ? '' : 'Nov'}</span>
                                    <span className="font-bold text-lg">{i < 2 ? day : 30 + i}</span>
                                    <span className="text-xs opacity-80">{i < 2 ? '' : day}</span>
                                </motion.button>
                            ))}
                        </div>
                    </motion.section>

                    {/* Horários */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="mb-32"
                    >
                        <h3 className="font-display font-bold text-lg text-lavender-900 mb-3">Horários disponíveis</h3>
                        <div className="grid grid-cols-3 gap-3">
                            {professional.availability.map((time) => (
                                <motion.button
                                    key={time}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedTime(time)}
                                    className={`py-3 rounded-xl font-medium text-sm transition-all cursor-pointer
                    ${selectedTime === time
                                            ? 'bg-lavender-600 text-white shadow-glow'
                                            : 'bg-white border border-lavender-200 text-lavender-800 hover:border-lavender-400'}`}
                                >
                                    {time}
                                </motion.button>
                            ))}
                        </div>
                    </motion.section>
                </div>
            </motion.div>

            {/* Footer Fixo com Botão de Ação */}
            <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.8, type: 'spring' }}
                className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-lavender-100 
                   px-6 py-4 shadow-lift z-40 pb-safe"
            >
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <p className="text-xs text-ink-muted">Total</p>
                        <p className="text-2xl font-bold text-lavender-900">R$ {professional.price}</p>
                    </div>
                    {selectedTime && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-right"
                        >
                            <p className="text-xs text-ink-muted">Horário</p>
                            <p className="font-semibold text-lavender-800">{selectedTime}</p>
                        </motion.div>
                    )}
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={!selectedTime}
                    onClick={() => setShowBookingConfirm(true)}
                    className={`w-full py-4 rounded-2xl font-bold text-lg transition-all cursor-pointer
            ${selectedTime
                            ? 'bg-lavender-600 text-white shadow-glow hover:shadow-lift'
                            : 'bg-lavender-100 text-lavender-400 cursor-not-allowed'}`}
                >
                    {selectedTime ? 'Confirmar Agendamento' : 'Selecione um horário'}
                </motion.button>
            </motion.div>

            {/* Modal de Confirmação */}
            <AnimatePresence>
                {showBookingConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
                        onClick={() => setShowBookingConfirm(false)}
                    >
                        <motion.div
                            initial={{ y: '100%', opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: '100%', opacity: 0 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="bg-white rounded-3xl p-6 w-full max-w-sm max-w-md mx-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <i className="fas fa-calendar-check text-green-600 text-2xl"></i>
                                </div>
                                <h3 className="font-display font-bold text-xl text-lavender-900 mb-2">Confirmar agendamento?</h3>
                                <p className="text-ink-muted text-sm">
                                    {professional.name}<br />
                                    {selectedDate || 'Hoje'} às {selectedTime}
                                </p>
                            </div>

                            <div className="space-y-3">
                                <button
                                    className="w-full btn-primary py-4 text-lg rounded-2xl cursor-pointer"
                                    onClick={() => {
                                        // Antigravity chama API de criação de booking
                                        alert('Agendado! Redirecionando...');
                                        setShowBookingConfirm(false);
                                    }}
                                >
                                    Confirmar Pagamento
                                </button>
                                <button
                                    onClick={() => setShowBookingConfirm(false)}
                                    className="w-full py-4 text-ink-muted font-medium hover:text-ink transition-colors cursor-pointer"
                                >
                                    Voltar
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
