import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import HomeScreen from './screens/HomeScreen';
import { NotificationsModal } from './components/NotificationsModal';
import { WaterModal } from './components/WaterModal';
import { ProfessionalProfileScreen } from './screens/ProfessionalProfileScreen.tsx';
import { BookingScreen } from './screens/BookingScreen';
import './styles/animations.css';

function App() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showWater, setShowWater] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showBooking, setShowBooking] = useState(false);

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
        onBook={() => {
          setShowProfile(false);
          setShowBooking(true);
        }}
      />
      <BookingScreen
        isOpen={showBooking}
        onClose={() => setShowBooking(false)}
      />
    </>
  );
}

export default App;