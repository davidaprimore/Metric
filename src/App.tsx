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

// Importações do Ambiente Profissional
import { DashboardProScreen } from './screens/professional/DashboardProScreen';
import { BottomNavigationPro } from './components/BottomNavigationPro';
import { AvailabilityManagerScreen } from './screens/professional/AvailabilityManagerScreen';

export default function App() {
  const [userMode, setUserMode] = useState<'client' | 'professional'>('client');
  const [proTab, setProTab] = useState('dashboard');
  const [mainTab, setMainTab] = useState<'home' | 'agenda' | 'search' | 'records' | 'profile'>('home');
  const [isLoading, setIsLoading] = useState(false);

  const [selectedProfessionalId, setSelectedProfessionalId] = useState<string | null>(null);
  const [pendingBooking, setPendingBooking] = useState<any>(null);

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

  const switchUserMode = () => {
    setIsLoading(true);
    setTimeout(() => {
      setUserMode(userMode === 'client' ? 'professional' : 'client');
      setIsLoading(false);
    }, 800);
  };

  const handleOpenProfessionalProfile = (id: string) => {
    setSelectedProfessionalId(id);
    setActiveOverlay({ screen: 'professional-profile', data: id });
  };

  const handleStartBooking = () => setActiveOverlay({ screen: 'booking', data: null });
  const handleBookingAdvance = (bookingData: any) => {
    setPendingBooking(bookingData);
    setActiveOverlay({ screen: 'payment', data: bookingData });
  };
  const handlePaymentSuccess = () => setActiveOverlay({ screen: 'success', data: pendingBooking });
  const handleGoToAnamnese = () => setActiveOverlay({ screen: 'anamnese', data: null });
  const handleSuccessComplete = () => {
    setActiveOverlay({ screen: 'none' });
    setPendingBooking(null);
    setMainTab('agenda');
  };
  const handleOpenAnamneseFromSettings = () => setActiveOverlay({ screen: 'anamnese', data: null });
  const handleOpenAppointment = (appointment: any) => setActiveOverlay({ screen: 'appointment-detail', data: appointment });

  return (
    <div className="min-h-screen bg-gray-50 relative pb-20 overflow-x-hidden">
      <AnimatePresence>
        {isLoading && <LoadingTransition isVisible={true} />}
      </AnimatePresence>

      <div className={isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}>
        {userMode === 'client' ? (
          /* MODO CLIENTE */
          <>
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
                    onSwitchMode={switchUserMode}
                  />
                )}

                {mainTab === 'agenda' && <ClientAgendaScreen isOpen={true} onClose={() => handleNavigate('home')} onSelectAppointment={handleOpenAppointment} />}
                {mainTab === 'search' && <SearchScreen isOpen={true} onClose={() => handleNavigate('home')} onSelectProfessional={handleOpenProfessionalProfile} />}
                {mainTab === 'records' && <MedicalRecordsScreen isOpen={true} onClose={() => handleNavigate('home')} />}
                {mainTab === 'profile' && <SettingsScreen isOpen={true} onClose={() => handleNavigate('home')} onOpenAnamnese={handleOpenAnamneseFromSettings} />}
              </motion.div>
            </AnimatePresence>

            {!['professional-profile', 'booking', 'payment', 'success', 'anamnese'].includes(activeOverlay.screen) && (
              <BottomNavigation currentScreen={mainTab} onNavigate={handleNavigate} />
            )}

            {/* Overlays Cliente */}
            {activeOverlay.screen === 'professional-profile' && (
              <ProfessionalProfileScreen
                isOpen={true}
                onClose={() => setActiveOverlay({ screen: 'none' })}
                onBook={handleStartBooking}
                professionalId={selectedProfessionalId || ''}
              />
            )}
            {activeOverlay.screen === 'booking' && (
              <BookingScreen isOpen={true} onClose={() => setActiveOverlay({ screen: 'none' })} onAdvance={handleBookingAdvance} />
            )}
            {activeOverlay.screen === 'payment' && (
              <PaymentScreen
                isOpen={true}
                onClose={() => setActiveOverlay({ screen: 'booking' })}
                onSuccess={handlePaymentSuccess}
                amount={pendingBooking?.price || 300}
                professionalName={pendingBooking?.professionalName || 'Dr. Ricardo Silva'}
              />
            )}
            {activeOverlay.screen === 'success' && <SuccessScreen isOpen={true} bookingData={pendingBooking} onGoToAnamnese={handleGoToAnamnese} onGoToHome={handleSuccessComplete} />}
            {activeOverlay.screen === 'anamnese' && (
              <AnamneseScreen
                isOpen={true}
                onClose={() => (activeOverlay.screen === 'success' || pendingBooking) ? handleSuccessComplete() : setActiveOverlay({ screen: 'none' })}
                onComplete={() => (activeOverlay.screen === 'success' || pendingBooking) ? handleSuccessComplete() : setActiveOverlay({ screen: 'none' })}
              />
            )}
            {activeOverlay.screen === 'appointment-detail' && <AppointmentDetailScreen isOpen={true} appointment={activeOverlay.data} onClose={() => setActiveOverlay({ screen: 'none' })} onReschedule={() => setActiveOverlay({ screen: 'booking', data: activeOverlay.data })} onCancel={() => setActiveOverlay({ screen: 'none' })} />}
          </>
        ) : (
          /* MODO PROFISSIONAL */
          <div className="min-h-screen bg-gray-50 relative pb-20">
            <AnimatePresence mode="wait">
              <motion.div
                key={proTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {proTab === 'dashboard' && <DashboardProScreen onSwitchMode={switchUserMode} />}
                {proTab === 'agenda' && <AvailabilityManagerScreen isOpen={true} onClose={() => setProTab('dashboard')} />}
                {/* Outras abas Pro serão adicionadas futuramente */}
                {['patients', 'finance', 'profile'].includes(proTab) && (
                  <div className="flex items-center justify-center min-h-screen text-gray-400">
                    Tela de {proTab} em desenvolvimento
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <BottomNavigationPro
              currentScreen={proTab}
              onNavigate={setProTab}
            />
          </div>
        )}
      </div>
    </div>
  );
}