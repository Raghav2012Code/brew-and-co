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

function App() {
  return (
    <StoreProvider>
      <div className="min-h-screen bg-[#FBF9F5] dark:bg-[#11100F] text-[#1A1816] dark:text-[#EAE6DF] flex flex-col font-sans selection:bg-[#1A1816] dark:selection:bg-[#EAE6DF] selection:text-[#FBF9F5] dark:selection:text-[#11100F] transition-colors">
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
      </div>
    </StoreProvider>
  );
}

export default App;

