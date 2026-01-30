import { useState } from 'react';
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
import { ProfessionalProfileScreen } from './screens/ProfessionalProfileScreen';
import { SuccessScreen } from './screens/SuccessScreen';
import { BottomNavigation } from './components/BottomNavigation';
import { LoadingTransition } from './components/LoadingTransition';

export default function App() {
  const [mainTab, setMainTab] = useState<'home' | 'agenda' | 'search' | 'records' | 'profile'>('home');
  const [isLoading, setIsLoading] = useState(false);

  const [selectedProfessionalId, setSelectedProfessionalId] = useState<string | null>(null);

  // Dados do agendamento em progresso
  const [pendingBooking, setPendingBooking] = useState<any>(null);

  // Estados de telas modais/overlay
  const [activeOverlay, setActiveOverlay] = useState<{
    screen: 'none' | 'professional-profile' | 'booking' | 'payment' | 'success' | 'anamnese' | 'appointment-detail';
    data?: any;
  }>({ screen: 'none' });

  const handleNavigate = (tab: typeof mainTab) => {
    if (tab === mainTab) return;

    setIsLoading(true);
    setTimeout(() => {
      setMainTab(tab);
      setIsLoading(false);
    }, 600);
  };

  const handleOpenProfessionalProfile = (id: string) => {
    setSelectedProfessionalId(id);
    setActiveOverlay({ screen: 'professional-profile', data: id });
  };

  // FLUXO DE AGENDAMENTO
  const handleStartBooking = () => {
    setActiveOverlay({ screen: 'booking', data: null });
  };

  const handleBookingAdvance = (bookingData: any) => {
    setPendingBooking(bookingData);
    setActiveOverlay({ screen: 'payment', data: bookingData });
  };

  const handlePaymentSuccess = () => {
    setActiveOverlay({ screen: 'success', data: pendingBooking });
  };

  const handleGoToAnamnese = () => {
    setActiveOverlay({ screen: 'anamnese', data: null });
  };

  const handleSuccessComplete = () => {
    setActiveOverlay({ screen: 'none' });
    setPendingBooking(null);
    setMainTab('agenda');
  };

  const handleOpenAnamneseFromSettings = () => {
    setActiveOverlay({ screen: 'anamnese', data: null });
  };

  const handleOpenAppointment = (appointment: any) => {
    setActiveOverlay({ screen: 'appointment-detail', data: appointment });
  };

  return (
    <div className="min-h-screen bg-gray-50 relative pb-20">
      <AnimatePresence>
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
            {mainTab === 'home' && (
              <HomeScreen
                onOpenProfile={handleOpenProfessionalProfile}
                onOpenSettings={() => handleNavigate('profile')}
                onOpenAgenda={() => handleNavigate('agenda')}
                onOpenSearch={() => handleNavigate('search')}
                onOpenRecords={() => handleNavigate('records')}
              />
            )}

            {mainTab === 'agenda' && (
              <ClientAgendaScreen
                isOpen={true}
                onClose={() => handleNavigate('home')}
                onSelectAppointment={handleOpenAppointment}
              />
            )}

            {mainTab === 'search' && (
              <SearchScreen
                isOpen={true}
                onClose={() => handleNavigate('home')}
                // @ts-ignore
                onSelectProfessional={handleOpenProfessionalProfile}
              />
            )}

            {mainTab === 'records' && <MedicalRecordsScreen isOpen={true} onClose={() => handleNavigate('home')} />}

            {mainTab === 'profile' && (
              <SettingsScreen
                isOpen={true}
                onClose={() => handleNavigate('home')}
                onOpenAnamnese={handleOpenAnamneseFromSettings}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Bottom Navigation - Escondido durante o fluxo de agendamento/pagamento */}
        {!['professional-profile', 'booking', 'payment', 'success', 'anamnese'].includes(activeOverlay.screen) && (
          <BottomNavigation
            currentScreen={mainTab}
            onNavigate={handleNavigate}
          />
        )}
      </div>

      {/* Overlays */}

      {activeOverlay.screen === 'professional-profile' && (
        <ProfessionalProfileScreen
          isOpen={true}
          onClose={() => setActiveOverlay({ screen: 'none' })}
          onBook={handleStartBooking}
          // @ts-ignore
          professionalId={selectedProfessionalId}
        />
      )}

      {activeOverlay.screen === 'booking' && (
        <BookingScreen
          isOpen={true}
          onClose={() => setActiveOverlay({ screen: 'none' })}
          onAdvance={handleBookingAdvance}
        />
      )}

      {activeOverlay.screen === 'payment' && (
        <PaymentScreen
          isOpen={true}
          onClose={() => setActiveOverlay({ screen: 'booking' })}
          onSuccess={handlePaymentSuccess}
          // @ts-ignore
          amount={pendingBooking?.price || 300}
          // @ts-ignore
          professionalName={pendingBooking?.professionalName || 'Dr. Ricardo Silva'}
        />
      )}

      {activeOverlay.screen === 'success' && (
        <SuccessScreen
          isOpen={true}
          bookingData={pendingBooking}
          onGoToAnamnese={handleGoToAnamnese}
          onGoToHome={handleSuccessComplete}
        />
      )}

      {activeOverlay.screen === 'anamnese' && (
        <AnamneseScreen
          isOpen={true}
          onClose={() => {
            if (activeOverlay.screen === 'success' || pendingBooking) {
              handleSuccessComplete();
            } else {
              setActiveOverlay({ screen: 'none' });
            }
          }}
          onComplete={() => {
            if (activeOverlay.screen === 'success' || pendingBooking) {
              handleSuccessComplete();
            } else {
              setActiveOverlay({ screen: 'none' });
            }
          }}
        />
      )}

      {activeOverlay.screen === 'appointment-detail' && (
        <AppointmentDetailScreen
          isOpen={true}
          appointment={activeOverlay.data}
          onClose={() => setActiveOverlay({ screen: 'none' })}
          onReschedule={() => setActiveOverlay({ screen: 'booking', data: activeOverlay.data })}
          onCancel={() => setActiveOverlay({ screen: 'none' })}
        />
      )}
    </div>
  );
}