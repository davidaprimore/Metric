import { useState } from 'react';
import HomeScreen from './screens/HomeScreen';
import { NotificationsModal } from './components/NotificationsModal';
import { WaterModal } from './components/WaterModal';
import './styles/animations.css';

function App() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showWater, setShowWater] = useState(false);

  return (
    <>
      <HomeScreen
        onOpenNotifications={() => setShowNotifications(true)}
        onOpenWater={() => setShowWater(true)}
      />
      <NotificationsModal
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
      <WaterModal
        isOpen={showWater}
        onClose={() => setShowWater(false)}
      />
    </>
  );
}

export default App;