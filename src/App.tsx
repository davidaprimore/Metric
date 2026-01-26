import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { OfflineQueueProvider } from '@/contexts/OfflineQueueContext';
import { AppRoutes } from '@/AppRoutes';

function App() {
  return (
    <AuthProvider>
      <OfflineQueueProvider>
        <Router>
          <div className="font-sans text-foreground bg-background min-h-screen">
            <AppRoutes />
          </div>
        </Router>
      </OfflineQueueProvider>
    </AuthProvider>
  );
}

export default App;