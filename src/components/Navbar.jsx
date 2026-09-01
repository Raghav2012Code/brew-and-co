import React, { useState } from 'react';
import { ShoppingBag, Menu as MenuIcon, X, Sun, Moon, Sparkles, MapPin, Package } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useSubscription } from '../context/SubscriptionContext';
import { LogoMark } from './LogoMark';

export const Navbar = () => {
  const { cartCount, setIsCartOpen, loyaltyStamps, setIsLoyaltyModalOpen, storeStatus, effectiveTheme, toggleTheme } = useStore();
  const { subscriptions, activeSubscriptionCount, setIsManageDrawerOpen } = useSubscription();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FBF9F5]/95 dark:bg-[#11100F]/95 backdrop-blur-md border-b border-[#E8E4DC] dark:border-[#262420] transition-colors">
      {/* Friendly Utility Top Bar */}
      <div className="bg-[#F3EFE6] dark:bg-[#191816] border-b border-[#E8E4DC] dark:border-[#262420] text-xs px-4 sm:px-8 py-1.5 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-[#666056] dark:text-[#A09A8E]">
          <div className="flex items-center gap-4 sm:gap-6 truncate">
            <span className="flex items-center gap-1.5 font-medium text-[#1A1816] dark:text-[#EAE6DF]">
              <span className={`w-2 h-2 rounded-full ${storeStatus.isOpen ? 'bg-[#2E7D32]' : 'bg-[#C62828]'}`} aria-hidden="true" />
              {storeStatus.isOpen ? 'Open Today: 7:00 AM – 6:00 PM' : 'Opens Tomorrow at 7:00 AM'}
            </span>
            <span className="hidden sm:inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
              442 Industrial Way, San Francisco
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label={effectiveTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-[#D5CFBF] dark:border-[#38342E] bg-[#FBF9F5] dark:bg-[#11100F] text-xs text-[#1A1816] dark:text-[#EAE6DF] hover:border-[#1A1816] dark:hover:border-[#EAE6DF] transition-all cursor-pointer shadow-xs"
            >
              {effectiveTheme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-[#E5A93C]" aria-hidden="true" />
                  <span className="font-medium">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-[#666056]" aria-hidden="true" />
                  <span className="font-medium">Dark</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Masthead Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
        {/* Brand Identity with LogoMark */}
        <a href="#" className="flex items-center" aria-label="Brew & Co. Home">
          <LogoMark className="w-9 h-9" showText={true} />
        </a>

        {/* Clear Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#555047] dark:text-[#B0ABA0]" aria-label="Primary Navigation">
          <a href="#menu" className="hover:text-[#1A1816] dark:hover:text-[#EAE6DF] transition-colors py-1">
            Menu & Order
          </a>
          <a href="#roastery" className="hover:text-[#1A1816] dark:hover:text-[#EAE6DF] transition-colors py-1 flex items-center gap-1.5">
            <span>Roastery & Subscriptions</span>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.2 bg-vermillion/10 text-vermillion dark:text-dark-vermillion border border-vermillion/30">
              15% Off
            </span>
          </a>
          <a href="#brew-guide" className="hover:text-[#1A1816] dark:hover:text-[#EAE6DF] transition-colors py-1">
            Brew Guide
          </a>
          <a href="#rewards" className="hover:text-[#1A1816] dark:hover:text-[#EAE6DF] transition-colors py-1">
            Tasting Pass
          </a>
          <a href="#location" className="hover:text-[#1A1816] dark:hover:text-[#EAE6DF] transition-colors py-1">
            Visit & Hours
          </a>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Active Subscription Status Pill */}
          {subscriptions.length > 0 && (
            <button
              onClick={() => setIsManageDrawerOpen(true)}
              aria-label={`View Subscriptions: ${activeSubscriptionCount} active plans`}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-full bg-[#F3EFE6] dark:bg-[#1C1B18] border border-[#E0DACB] dark:border-[#302D27] text-[#1A1816] dark:text-[#EAE6DF] hover:border-[#1A1816] dark:hover:border-[#EAE6DF] active:scale-95 transition-all"
            >
              <Package className="w-3.5 h-3.5 text-[#C84B31]" aria-hidden="true" />
              <span>Vault: {activeSubscriptionCount}</span>
            </button>
          )}

          {/* Tasting Pass Status */}
          <button
            onClick={() => setIsLoyaltyModalOpen(true)}
            aria-label={`View Tasting Pass: ${loyaltyStamps} of 6 stamps completed`}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-full bg-[#F3EFE6] dark:bg-[#1C1B18] border border-[#E0DACB] dark:border-[#302D27] text-[#1A1816] dark:text-[#EAE6DF] hover:border-[#1A1816] dark:hover:border-[#EAE6DF] active:scale-95 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C84B31]" aria-hidden="true" />
            <span>Pass: {loyaltyStamps}/6</span>
          </button>

          {/* Primary Order Bag Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            aria-label={`View Bag: ${cartCount} items`}
            className="min-h-[42px] min-w-[42px] flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2 rounded-lg bg-[#1A1816] dark:bg-[#EAE6DF] text-[#FBF9F5] dark:text-[#11100F] hover:bg-[#C84B31] dark:hover:bg-[#C84B31] dark:hover:text-[#FBF9F5] text-xs sm:text-sm font-semibold shadow-sm active:scale-95 transition-all cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" aria-hidden="true" />
            <span className="hidden xs:inline">Bag</span>
            <span className="bg-[#33302C] dark:bg-[#D5CFBF] text-[#FBF9F5] dark:text-[#11100F] px-1.5 py-0.5 rounded text-[11px] font-bold">
              {cartCount}
            </span>
          </button>

          {/* Mobile Menu Hamburger (Min 44x44px hitbox) */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden min-h-[42px] min-w-[42px] flex items-center justify-center p-2.5 rounded-lg border border-[#E0DACB] dark:border-[#302D27] bg-[#F3EFE6] dark:bg-[#1C1B18] text-[#1A1816] dark:text-[#EAE6DF] active:scale-95 transition-all cursor-pointer"
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <MenuIcon className="w-5 h-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#E8E4DC] dark:border-[#262420] bg-[#FBF9F5]/98 dark:bg-[#11100F]/98 backdrop-blur-lg p-4 sm:p-5 space-y-2.5 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <a
            href="#menu"
            onClick={() => setMobileOpen(false)}
            className="block min-h-[44px] p-3 rounded-xl bg-[#F3EFE6] dark:bg-[#1C1B18] text-sm font-semibold text-[#1A1816] dark:text-[#EAE6DF] active:bg-[#E8E4DC] dark:active:bg-[#262420] transition-colors"
          >
            Menu & Order Ahead
          </a>
          <a
            href="#roastery"
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-between min-h-[44px] p-3 rounded-xl bg-[#F3EFE6] dark:bg-[#1C1B18] text-sm font-semibold text-[#1A1816] dark:text-[#EAE6DF] active:bg-[#E8E4DC] dark:active:bg-[#262420] transition-colors"
          >
            <span>Roastery & Subscriptions</span>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 bg-vermillion/10 text-vermillion dark:text-dark-vermillion">
              15% Off
            </span>
          </a>
          <a
            href="#brew-guide"
            onClick={() => setMobileOpen(false)}
            className="block min-h-[44px] p-3 rounded-xl bg-[#F3EFE6] dark:bg-[#1C1B18] text-sm font-semibold text-[#1A1816] dark:text-[#EAE6DF] active:bg-[#E8E4DC] dark:active:bg-[#262420] transition-colors"
          >
            Home Brew Guide
          </a>
          <button
            onClick={() => {
              setMobileOpen(false);
              setIsManageDrawerOpen(true);
            }}
            className="w-full text-left min-h-[44px] block p-3 rounded-xl bg-[#F3EFE6] dark:bg-[#1C1B18] text-sm font-semibold text-[#1A1816] dark:text-[#EAE6DF] active:bg-[#E8E4DC] dark:active:bg-[#262420] transition-colors"
          >
            Subscription Vault ({activeSubscriptionCount} Active)
          </button>
          <button
            onClick={() => {
              setMobileOpen(false);
              setIsLoyaltyModalOpen(true);
            }}
            className="w-full text-left min-h-[44px] block p-3 rounded-xl bg-[#F3EFE6] dark:bg-[#1C1B18] text-sm font-semibold text-[#1A1816] dark:text-[#EAE6DF] active:bg-[#E8E4DC] dark:active:bg-[#262420] transition-colors"
          >
            Tasting Pass ({loyaltyStamps}/6 Stamps)
          </button>
          <a
            href="#location"
            onClick={() => setMobileOpen(false)}
            className="block min-h-[44px] p-3 rounded-xl bg-[#F3EFE6] dark:bg-[#1C1B18] text-sm font-semibold text-[#1A1816] dark:text-[#EAE6DF] active:bg-[#E8E4DC] dark:active:bg-[#262420] transition-colors"
          >
            Visit & Hours
          </a>
          <button
            onClick={() => {
              toggleTheme();
            }}
            className="w-full flex items-center justify-between min-h-[44px] p-3 rounded-xl bg-[#F3EFE6] dark:bg-[#1C1B18] text-sm font-semibold text-[#1A1816] dark:text-[#EAE6DF] active:bg-[#E8E4DC] dark:active:bg-[#262420] transition-colors"
          >
            <span>Appearance Theme</span>
            <span className="flex items-center gap-1.5 text-xs text-[#666056] dark:text-[#A09A8E]">
              {effectiveTheme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-[#E5A93C]" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-[#666056]" />
                  <span>Dark Mode</span>
                </>
              )}
            </span>
          </button>
        </div>
      )}
    </header>
  );
};
