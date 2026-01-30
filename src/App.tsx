import { useState } from 'react';
import HomeScreen from './screens/HomeScreen';
import { NotificationsModal } from './components/NotificationsModal';
import { WaterModal } from './components/WaterModal';
import { ProfessionalProfileScreen } from './components/ProfessionalProfileScreen';
import './styles/animations.css';

function App() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showWater, setShowWater] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <>
      <HomeScreen
        onOpenNotifications={() => setShowNotifications(true)}
        onOpenWater={() => setShowWater(true)}
        onOpenProfile={() => setShowProfile(true)}
      />
      <NotificationsModal
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
      <WaterModal
        isOpen={showWater}
        onClose={() => setShowWater(false)}
      />
      <ProfessionalProfileScreen
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
      />
    </>
  );
}

export default App;