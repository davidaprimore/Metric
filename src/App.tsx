import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HomeScreen from './features/dashboard/pages/HomeScreen';
import { ClientAgendaScreen } from './screens/ClientAgendaScreen';
import { AppointmentDetailScreen } from './screens/AppointmentDetailScreen';
import { SearchScreen } from './screens/SearchScreen';
import { MedicalRecordsScreen } from './screens/MedicalRecordsScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { BookingScreen } from './screens/BookingScreen';
import { PaymentScreen } from './screens/PaymentScreen';
import { AnamneseScreen } from './screens/AnamneseScreen';
import { BottomNavigation } from './components/BottomNavigation';
import { LoadingTransition } from './components/LoadingTransition';

export default function App() {
  const [mainTab, setMainTab] = useState<'home' | 'agenda' | 'search' | 'records' | 'profile'>('home');
  const [isLoading, setIsLoading] = useState(false);

  // Estados de telas modais/overlay
  const [activeOverlay, setActiveOverlay] = useState<{
    screen: 'none' | 'appointment-detail' | 'booking' | 'payment' | 'anamnese' | 'professional-profile';
    data?: any;
  }>({ screen: 'none' });

  // Handler de navegação com loading
  const handleNavigate = (tab: typeof mainTab) => {
    if (tab === mainTab) return;

    setIsLoading(true);
    setTimeout(() => {
      setMainTab(tab);
      setIsLoading(false);
    }, 800); // Tempo da animação
  };

  const handleOpenAppointment = (appointment: any) => {
    setActiveOverlay({ screen: 'appointment-detail', data: appointment });
  };

  const handleOpenPayment = () => {
    setActiveOverlay({ screen: 'payment', data: null });
  };

  const handleOpenAnamnese = () => {
    setActiveOverlay({ screen: 'anamnese', data: null });
  };

  const handlePaymentSuccess = () => {
    setActiveOverlay({ screen: 'none' });
    setMainTab('agenda');
  };

  return (
    <div className="min-h-screen bg-gray-50 relative pb-20">
      <AnimatePresence mode="wait">
        {isLoading && <LoadingTransition isVisible={true} />}
      </AnimatePresence>

      {/* Conteúdo Principal */}
      <div className={isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}>
        <AnimatePresence mode="wait">
          <motion.div
            key={mainTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {mainTab === 'home' && <HomeScreen />}

            {mainTab === 'agenda' && (
              <ClientAgendaScreen
                isOpen={true}
                onClose={() => handleNavigate('home')}
                onSelectAppointment={handleOpenAppointment}
              />
            )}

            {mainTab === 'search' && <SearchScreen isOpen={true} onClose={() => { }} />}
            {mainTab === 'records' && <MedicalRecordsScreen isOpen={true} onClose={() => { }} />}
            {mainTab === 'profile' && (
              <SettingsScreen
                isOpen={true}
                onClose={() => handleNavigate('home')}
                onOpenAnamnese={handleOpenAnamnese}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Bottom Navigation - SEMPRE visível na base */}
        <BottomNavigation
          currentScreen={mainTab}
          onNavigate={handleNavigate}
        />
      </div>

      {/* Overlays/Modais */}
      {activeOverlay.screen === 'appointment-detail' && (
        <AppointmentDetailScreen
          isOpen={true}
          appointment={activeOverlay.data}
          onClose={() => setActiveOverlay({ screen: 'none' })}
          onReschedule={() => {
            setActiveOverlay({ screen: 'booking', data: activeOverlay.data });
          }}
          onCancel={() => setActiveOverlay({ screen: 'none' })}
        />
      )}

      {activeOverlay.screen === 'booking' && (
        <BookingScreen
          isOpen={true}
          onClose={() => setActiveOverlay({ screen: 'none' })}
          // @ts-ignore - Adaptado para o fluxo experimental
          onAdvance={handleOpenPayment}
        />
      )}

      {activeOverlay.screen === 'payment' && (
        <PaymentScreen
          isOpen={true}
          onClose={() => setActiveOverlay({ screen: 'none' })}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {activeOverlay.screen === 'payment' && (
        <PaymentScreen
          isOpen={true}
          onClose={() => setActiveOverlay({ screen: 'none' })}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {activeOverlay.screen === 'anamnese' && (
        <AnamneseScreen
          isOpen={true}
          onClose={() => setActiveOverlay({ screen: 'none' })}
          onComplete={() => setActiveOverlay({ screen: 'none' })}
        />
      )}
    </div>
  );
}