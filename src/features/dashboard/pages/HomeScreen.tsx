import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MetricCard } from '../../../components/MetricCard';
import { MatchCard } from '../../../components/MatchCard';
import { QuickActions } from '../../../components/QuickActions';
import { SponsorCardPremium } from '../../../components/SponsorCardPremium';

// Importação das Novas Telas Overlays Internas (Mantidas da versão anterior se necessário)
import { BodyAssessmentScreen } from '../../../screens/BodyAssessmentScreen';
import { ChatScreen } from '../../../screens/ChatScreen';
import { FeedScreen } from '../../../screens/FeedScreen';
import { FoodDiaryScreen } from '../../../screens/FoodDiaryScreen';
import { ProfessionalOnboarding } from '../../../screens/ProfessionalOnboardingScreen';

interface HomeScreenProps {
    onOpenNotifications?: () => void;
    onOpenWater?: () => void;
    onOpenProfile: (id?: string) => void;
    onOpenSettings: () => void;
    onOpenAgenda: () => void;
    onOpenSearch: () => void;
    onOpenRecords: () => void;
}

export default function HomeScreen({
    onOpenNotifications,
    onOpenWater,
    onOpenProfile,
    onOpenSettings,
    onOpenAgenda,
    onOpenSearch,
    onOpenRecords
}: HomeScreenProps) {
    const [hour, setHour] = useState(0);
    const [currentScreen, setCurrentScreen] = useState<'home' | 'body' | 'chat' | 'feed' | 'diary' | 'onboarding'>('home');

    useEffect(() => {
        setHour(new Date().getHours());
    }, []);

    const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';

    const handleActionClick = (id: string) => {
        if (id === 'health' || id === 'evolution') setCurrentScreen('body');
        if (id === 'schedule') onOpenAgenda();
        if (id === 'diet') setCurrentScreen('diary');
        if (id === 'chat') setCurrentScreen('chat');
    };

    return (
        <div className="min-h-screen bg-[#FAF8FC] pb-28 max-w-[430px] mx-auto relative overflow-x-hidden">
            {/* Indicador de Versão Ativa */}
            <div className="fixed top-2 left-1/2 -translate-x-1/2 z-[60] px-3 py-1 bg-[#9B6AB0] text-white text-[10px] font-bold rounded-full shadow-lg pointer-events-none opacity-50">
                METRIKA PRO ACTIVE
            </div>

            <header className="sticky top-0 z-50 bg-[#FAF8FC]/95 backdrop-blur-md border-b border-[#E8D5F0]/50 px-5 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#C8A4D4] to-[#9B6AB0] rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        M
                    </div>
                    <span className="font-[Outfit] font-bold text-xl text-[#3D2646]">Metrika</span>
                </div>

                <button
                    onClick={onOpenNotifications}
                    className="w-10 h-10 bg-white rounded-full border border-[#E8D5F0] flex items-center justify-center relative hover:bg-[#F3E8F7] transition-colors"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3D2646" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                    </svg>
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
            </header>

            <main className="px-5 pt-6">
                {/* SAUDAÇÃO */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                >
                    <p className="text-[#8B8591] text-[15px] mb-1">{greeting},</p>
                    <div className="flex items-center gap-2">
                        <h1 className="font-[Outfit] text-[36px] font-bold text-[#3D2646]">David</h1>
                        <span className="text-3xl animate-wave">👋</span>
                    </div>
                </motion.div>

                {/* MÉTRICAS */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-[Outfit] text-[18px] font-bold text-[#3D2646]">Suas Métricas</h2>
                        <span className="text-[13px] text-[#9B6AB0] font-medium">Hoje →</span>
                    </div>

                    <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2 -mx-5 px-5">
                        <MetricCard
                            icon="📊"
                            value="18.5%"
                            label="Gordura"
                            progress={65}
                            progressColor="bg-gradient-to-r from-orange-400 to-red-400"
                            subtext="-2% este mês"
                            subColor="text-green-600"
                            delay={0.1}
                            onClick={() => setCurrentScreen('body')}
                        />
                        <MetricCard
                            icon="🥗"
                            value="1.450"
                            label="kcal"
                            progress={80}
                            progressColor="bg-gradient-to-r from-green-400 to-emerald-500"
                            subtext="Na meta"
                            subColor="text-green-600"
                            delay={0.2}
                            onClick={() => setCurrentScreen('diary')}
                        />
                        <MetricCard
                            icon="💧"
                            value="1.2L"
                            label="Água"
                            progress={60}
                            progressColor="bg-gradient-to-r from-blue-400 to-cyan-500"
                            subtext="+500ml"
                            subColor="text-blue-600"
                            delay={0.3}
                            onClick={onOpenWater}
                        />
                    </div>
                </div>

                {/* MATCH PERFEITO */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-[Outfit] text-[18px] font-bold text-[#3D2646]">Seu Match Perfeito</h2>
                        <span onClick={onOpenSearch} className="text-[13px] text-[#9B6AB0] font-medium cursor-pointer">Ver todos →</span>
                    </div>

                    <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 -mx-5 px-5 snap-x">
                        <div className="snap-center">
                            <MatchCard
                                image="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&h=400&fit=crop"
                                name="Dra. Ana Paula"
                                specialty="Nutricionista Funcional"
                                crm="12345"
                                rating={4.98}
                                distance="2km"
                                match={98}
                                tags={['Emagrecimento', 'Performance']}
                                price={280}
                                delay={0.1}
                                verified={true}
                                onClick={() => onOpenProfile('ana-paula')}
                            />
                        </div>
                        <div className="snap-center">
                            <MatchCard
                                image="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop"
                                name="Dr. Ricardo Silva"
                                specialty="Nutricionista Esportivo"
                                crm="12345"
                                rating={4.9}
                                distance="2.5 km"
                                match={95}
                                tags={['Nutrição Esportiva', 'Hipertrofia', 'Emagrecimento']}
                                price={300}
                                delay={0.6}
                                onClick={() => onOpenProfile('ricardo-silva')}
                                verified={true}
                            />
                        </div>
                    </div>
                </div>

                {/* AÇÕES RÁPIDAS */}
                <QuickActions onActionClick={handleActionClick} />

                {/* PATROCINADOR PREMIUM */}
                <div className="mb-6">
                    <SponsorCardPremium />
                </div>

                {/* PLANO */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mb-6 bg-gradient-to-br from-[#2D2A32] to-[#3D2646] rounded-[24px] p-6 text-white relative overflow-hidden"
                >
                    <div className="absolute top-[-100px] right-[-50px] w-[200px] h-[200px] bg-[radial-gradient(circle,rgba(155,106,176,0.4),transparent)] rounded-full animate-[spin_20s_linear_infinite]"></div>
                    <div className="relative z-10">
                        <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-[10px] font-bold tracking-wider mb-3">⭐ RECOMENDADO</span>
                        <h3 className="font-[Outfit] text-[22px] font-bold mb-2">Metrika Clube</h3>
                        <p className="text-[14px] opacity-90 mb-4">Economize 40% em todas as consultas</p>
                        <button
                            onClick={() => setCurrentScreen('diary')}
                            className="w-full py-3 bg-white text-[#3D2646] rounded-2xl font-bold text-[15px] active:scale-[0.98] transition-transform"
                        >
                            7 dias grátis
                        </button>
                    </div>
                </motion.div>
            </main>

            {/* TELAS OVERLAY INTERNAS */}
            <AnimatePresence mode="wait">
                {currentScreen === 'body' && (
                    <BodyAssessmentScreen
                        isOpen={true}
                        onClose={() => setCurrentScreen('home')}
                    />
                )}
                {currentScreen === 'chat' && (
                    <ChatScreen
                        isOpen={true}
                        onClose={() => setCurrentScreen('home')}
                    />
                )}
                {currentScreen === 'feed' && (
                    <FeedScreen
                        isOpen={true}
                        onClose={() => setCurrentScreen('home')}
                    />
                )}
                {currentScreen === 'diary' && (
                    <FoodDiaryScreen
                        isOpen={true}
                        onClose={() => setCurrentScreen('home')}
                    />
                )}
                {currentScreen === 'onboarding' && (
                    <ProfessionalOnboarding
                        isOpen={true}
                        onClose={() => setCurrentScreen('home')}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
