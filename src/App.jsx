import React from 'react';
import { StoreProvider } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { MenuSection } from './components/MenuSection';
import { DialInGuide } from './components/DialInGuide';
import { LoyaltySection } from './components/LoyaltySection';
import { LocationSection } from './components/LocationSection';
import { Footer } from './components/Footer';
import { ItemCustomizerModal } from './components/ItemCustomizerModal';
import { CartDrawer } from './components/CartDrawer';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { Toaster } from '@/components/ui/sonner';

function App() {
  return (
    <StoreProvider>
      <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-ink selection:text-paper dark:selection:bg-dark-text-main dark:selection:text-dark-canvas transition-colors">
        {/* Sticky Header */}
        <Navbar />

        {/* Main Content Flow */}
        <main className="flex-1 w-full">
          <HeroSection />
          <MenuSection />
          <DialInGuide />
          <LoyaltySection />
          <LocationSection />
        </main>

        {/* Footer */}
        <Footer />

        {/* Global Modals & Drawers */}
        <ItemCustomizerModal />
        <CartDrawer />
        <OrderSuccessModal />

        {/* Accessible Toast Notifications */}
        <Toaster position="bottom-right" />
      </div>
    </StoreProvider>
  );
}

export default App;
