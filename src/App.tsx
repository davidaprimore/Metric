import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import HomeScreen from './features/dashboard/pages/HomeScreen';
import { ProfessionalProfileScreen } from './screens/ProfessionalProfileScreen.tsx';
import { BookingScreen } from './screens/BookingScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { ProfessionalAgendaScreen } from './screens/ProfessionalAgendaScreen';
import { SearchScreen } from './screens/SearchScreen';
import { MedicalRecordsScreen } from './screens/MedicalRecordsScreen';
import { BottomNavigation } from './components/BottomNavigation';
import { NotificationsModal } from './components/NotificationsModal';
import { WaterModal } from './components/WaterModal';
import './styles/animations.css';

export default function App() {
  // Estados principais de navegação do BottomNav
  const [mainTab, setMainTab] = useState<'home' | 'agenda' | 'search' | 'records' | 'profile'>('home');

  // Estados para overlays/modais (telas que abrem por cima)
  const [overlay, setOverlay] = useState<{
    type: 'none' | 'professional' | 'booking';
    data?: any;
  }>({ type: 'none' });

  // Estados dos modais da Home (Herança)
  const [showNotifications, setShowNotifications] = useState(false);
  const [showWater, setShowWater] = useState(false);

  // Handler de navegação principal
  const handleMainNavigate = (tab: string) => {
    setMainTab(tab as any);
    // Fechar overlays ao trocar de abas principais
    setOverlay({ type: 'none' });
  };

  return (
    <div className="min-h-screen bg-gray-50 relative pb-20">
      {/* CONTEÚDO PRINCIPAL (switch entre tabs) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={mainTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="min-h-screen"
        >
          {mainTab === 'home' && (
            <HomeScreen
              onOpenProfile={(id) => setOverlay({ type: 'professional', data: id })}
              onOpenAgenda={() => setMainTab('agenda')}
              onOpenNotifications={() => setShowNotifications(true)}
              onOpenWater={() => setShowWater(true)}
              onOpenSettings={() => setMainTab('profile')}
              onOpenSearch={() => setMainTab('search')}
              onOpenRecords={() => setMainTab('records')}
            />
          )}

          {mainTab === 'agenda' && (
            <ProfessionalAgendaScreen
              isOpen={true}
              onClose={() => setMainTab('home')}
            />
          )}

          {mainTab === 'search' && (
            <SearchScreen
              isOpen={true}
              onClose={() => setMainTab('home')}
            />
          )}

          {mainTab === 'records' && (
            <MedicalRecordsScreen
              isOpen={true}
              onClose={() => setMainTab('home')}
            />
          )}

          {mainTab === 'profile' && (
            <SettingsScreen
              isOpen={true}
              onClose={() => setMainTab('home')}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* BOTTOM NAVIGATION - SEMPRE VISÍVEL */}
      {overlay.type === 'none' && (
        <BottomNavigation
          currentScreen={mainTab}
          onNavigate={handleMainNavigate}
        />
      )}

      {/* OVERLAYS (ficam por cima de tudo) */}
      <AnimatePresence>
        {overlay.type === 'professional' && (
          <ProfessionalProfileScreen
            isOpen={true}
            onClose={() => setOverlay({ type: 'none' })}
            onBook={() => setOverlay({ type: 'booking' })}
            professionalId={overlay.data}
          />
        )}

        {overlay.type === 'booking' && (
          <BookingScreen
            isOpen={true}
            onClose={() => setOverlay({ type: 'none' })}
          />
        )}
      </AnimatePresence>

      {/* MODALS DA HOME */}
      <NotificationsModal
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
      <WaterModal
        isOpen={showWater}
        onClose={() => setShowWater(false)}
      />
    </div>
  );
}