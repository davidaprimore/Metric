import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MetricCard } from '../components/MetricCard';
import { MatchCard } from '../components/MatchCard';
import { QuickActions } from '../components/QuickActions';
import { BottomNav } from '../components/BottomNav';

interface HomeScreenProps {
    onOpenNotifications: () => void;
    onOpenWater: () => void;
}

export default function HomeScreen({ onOpenNotifications, onOpenWater }: HomeScreenProps) {
    const [hour, setHour] = useState(0);

    useEffect(() => {
        setHour(new Date().getHours());
    }, []);

    const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';

    return (
        <div className="min-h-screen bg-[#FAF8FC] pb-28 max-w-[430px] mx-auto relative overflow-x-hidden">
            {/* HEADER FIXO */}
            <header className="sticky top-0 z-50 bg-[#FAF8FC]/95 backdrop-blur-md border-b border-[#E8D5F0]/50 px-5 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#C8A4D4] to-[#9B6AB0] rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        M
                    </div>
                    <span className="font-[Outfit] font-bold text-xl text-[#3D2646]">Metrika</span>
                </div>

                {/* SININHO GARANTIDO - SVG inline visível */}
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
                        <MetricCard icon="📊" value="18.5%" label="Gordura" progress={65} progressColor="bg-gradient-to-r from-orange-400 to-red-400" subtext="-2% este mês" subColor="text-green-600" delay={0.1} />
                        <MetricCard icon="🥗" value="1.450" label="kcal" progress={80} progressColor="bg-gradient-to-r from-green-400 to-emerald-500" subtext="Na meta" subColor="text-green-600" delay={0.2} />
                        <MetricCard icon="💧" value="1.2L" label="Água" progress={60} progressColor="bg-gradient-to-r from-blue-400 to-cyan-500" subtext="+500ml" subColor="text-blue-600" delay={0.3} onClick={onOpenWater} />
                    </div>
                </div>

                {/* MATCH PERFEITO - Abaixo das métricas como solicitado */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-[Outfit] text-[18px] font-bold text-[#3D2646]">Seu Match Perfeito</h2>
                        <span className="text-[13px] text-[#9B6AB0] font-medium">Ver todos →</span>
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
                            />
                        </div>
                        <div className="snap-center">
                            <MatchCard
                                image="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&h=400&fit=crop"
                                name="Dr. Ricardo Silva"
                                specialty="Fisioterapeuta"
                                crm="54321"
                                rating={4.92}
                                distance="3.5km"
                                match={95}
                                tags={['Reabilitação', 'Dor']}
                                price={220}
                                delay={0.2}
                                verified={true}
                            />
                        </div>
                    </div>

                    {/* Indicadores */}
                    <div className="flex justify-center gap-2 mt-2">
                        <div className="w-6 h-1.5 bg-[#9B6AB0] rounded-full"></div>
                        <div className="w-1.5 h-1.5 bg-[#E8D5F0] rounded-full"></div>
                    </div>
                </div>

                {/* AÇÕES RÁPIDAS */}
                <QuickActions />

                {/* PATROCINADOR GROWTH */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-[24px] p-5 border border-[#E8D5F0] shadow-[0_4px_20px_rgba(93,61,107,0.06)] flex gap-4 items-center relative overflow-hidden mb-6 cursor-pointer group"
                >
                    {/* Badge sutil */}
                    <div className="absolute top-3 right-3 text-[9px] text-[#8B8591] font-semibold tracking-wider uppercase opacity-60">
                        Patrocinado
                    </div>

                    {/* Imagem/Ícone */}
                    <motion.div
                        className="w-20 h-20 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0 border border-green-100"
                        whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                    >
                        💪
                    </motion.div>

                    <div className="flex-1 pt-2">
                        <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-[Outfit] text-[16px] font-bold text-[#3D2646]">Growth Suplementos</h4>
                            <span className="px-1.5 py-0.5 bg-green-100 text-green-600 text-[9px] font-bold rounded">PARCEIRO</span>
                        </div>
                        <p className="text-[13px] text-[#8B8591] leading-snug mb-3">
                            Whey Protein Isolado com <span className="text-green-600 font-bold">30% OFF</span> exclusivo para membros Metrika
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 bg-[#FAF8FC] border border-[#E8D5F0] rounded-full text-[12px] font-bold text-[#3D2646] hover:bg-[#F3E8F7] hover:border-[#9B6AB0] transition-colors group-hover:shadow-md"
                        >
                            Ver oferta →
                        </motion.button>
                    </div>

                    {/* Efeito de brilho sutil no hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </div>
                </motion.div>

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
                        <button className="w-full py-3 bg-white text-[#3D2646] rounded-2xl font-bold text-[15px] active:scale-[0.98] transition-transform">
                            7 dias grátis
                        </button>
                    </div>
                </motion.div>

                {/* PRÓXIMA CONSULTA */}
                <div className="mb-6">
                    <div className="flex items-center gap-6 border-b border-[#E8D5F0] mb-4">
                        <button className="pb-3 text-[#3D2646] font-bold text-[15px] relative">
                            Próximos <span className="ml-2 bg-[#E8D5F0] text-[#3D2646] text-[11px] px-2 py-0.5 rounded-full font-bold">2</span>
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#9B6AB0] rounded-full"></div>
                        </button>
                        <button className="pb-3 text-[#8B8591] font-semibold text-[15px]">Para Você</button>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-white rounded-[24px] p-4 border border-[#E8D5F0] shadow-[0_4px_20px_rgba(93,61,107,0.06)] flex gap-4 mb-3"
                    >
                        <div className="w-16 h-16 bg-[#E6F7F0] border-2 border-[#A7F3D0] rounded-2xl flex flex-col items-center justify-center flex-shrink-0">
                            <span className="text-[10px] font-bold text-[#059669] uppercase">HOJE</span>
                            <span className="font-[Outfit] text-xl font-bold text-[#3D2646]">14:00</span>
                        </div>
                        <div className="flex-1">
                            <h4 className="font-[Outfit] text-lg font-bold text-[#3D2646] mb-0.5 flex items-center">
                                Dra. Ana Paula
                                {/* Selo no card também */}
                                <span className="ml-1 inline-flex items-center justify-center w-4 h-4 bg-blue-500 rounded-full">
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </span>
                            </h4>
                            <p className="text-[13px] text-[#8B8591] mb-2">Nutricionista</p>
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#E6F7F0] text-[#059669] rounded-full text-[11px] font-bold">
                                ✓ Confirmado
                            </span>
                        </div>
                        <button className="w-11 h-11 bg-[#F3E8F7] rounded-full flex items-center justify-center text-[#9B6AB0] flex-shrink-0">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M23 7l-7 5 7 5V7z" />
                                <rect x="1" y="5" width="15" height="14" rx="2" />
                            </svg>
                        </button>
                    </motion.div>
                </div>
            </main>

            {/* NAV INFERIOR */}
            <BottomNav />
        </div>
    );
}
