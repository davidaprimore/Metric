import { useState } from 'react';
import HomeScreen from './features/dashboard/pages/HomeScreen';
import { ProfessionalProfileScreen } from './screens/ProfessionalProfileScreen';
import { BookingScreen } from './screens/BookingScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { ProfessionalAgendaScreen } from './screens/ProfessionalAgendaScreen';
import { SearchScreen } from './screens/SearchScreen';
import { MedicalRecordsScreen } from './screens/MedicalRecordsScreen';
import { NotificationsModal } from './components/NotificationsModal';
import { WaterModal } from './components/WaterModal';
import './styles/animations.css';

export default function App() {
  // Estados de navegação
  const [activeScreen, setActiveScreen] = useState<'home' | 'profile' | 'booking' | 'settings' | 'agenda' | 'search' | 'records'>('home');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showWater, setShowWater] = useState(false);

  // Pro profissional específico (mock)
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<string | null>(null);

  return (
    <div className="relative">
      {/* Tela Principal sempre montada (performance) */}
      <div className={activeScreen !== 'home' ? 'hidden' : ''}>
        <HomeScreen
          onOpenNotifications={() => setShowNotifications(true)}
          onOpenWater={() => setShowWater(true)}
          onOpenProfile={(id) => {
            setSelectedProfessionalId(id || '123');
            setActiveScreen('profile');
          }}
          onOpenSettings={() => setActiveScreen('settings')}
          onOpenAgenda={() => setActiveScreen('agenda')}
          onOpenSearch={() => setActiveScreen('search')}
          onOpenRecords={() => setActiveScreen('records')}
        />
      </div>

      {/* Telas Overlay */}
      <ProfessionalProfileScreen
        isOpen={activeScreen === 'profile'}
        onClose={() => setActiveScreen('home')}
        onBook={() => setActiveScreen('booking')}
        professionalId={selectedProfessionalId}
      />

      <BookingScreen
        isOpen={activeScreen === 'booking'}
        onClose={() => setActiveScreen('home')}
      />

      <SettingsScreen
        isOpen={activeScreen === 'settings'}
        onClose={() => setActiveScreen('home')}
      />

      <ProfessionalAgendaScreen
        isOpen={activeScreen === 'agenda'}
        onClose={() => setActiveScreen('home')}
      />

      <SearchScreen
        isOpen={activeScreen === 'search'}
        onClose={() => setActiveScreen('home')}
      />

      <MedicalRecordsScreen
        isOpen={activeScreen === 'records'}
        onClose={() => setActiveScreen('home')}
      />

      {/* Modais Legados Integrados */}
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