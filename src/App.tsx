import React from 'react';
import { MemoryRouter as Router } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { OfflineQueueProvider } from '@/contexts/OfflineQueueContext';
import { AppRoutes } from '@/AppRoutes';
import { ScrollToTop } from '@/components/ScrollToTop';

function App() {
  return (
    <AuthProvider>
      <OfflineQueueProvider>
        <Router>
          <ScrollToTop />
          <div className="font-sans text-foreground bg-background min-h-screen">
            <AppRoutes />
          </div>
        </Router>
      </OfflineQueueProvider>
    </AuthProvider>
  );
}

export default App;