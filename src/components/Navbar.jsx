import React, { useState, useCallback, memo } from 'react';
import { ShoppingBag, Menu as MenuIcon, X, Sun, Moon, MapPin, Package, Coffee, Settings } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useSubscription } from '../context/SubscriptionContext';
import { useTenant } from '../context/TenantContext';
import { LogoMark } from './LogoMark';

/**
 * N6 newspaper masthead (Hallmark C3).
 *
 * Structure, deliberately not the single-row AI nav: a dateline band
 * (status · address · operations controls) sits above a rule, then the
 * nameplate band carries the wordmark at display scale with the section
 * links and the bag beneath it. Two bands, two rules, different jobs.
 */
export const Navbar = memo(() => {
  const {
    cartCount,
    setIsCartOpen,
    loyaltyStamps,
    setIsLoyaltyModalOpen,
    storeStatus,
    effectiveTheme,
    toggleTheme,
    setIsBaristaModalOpen,
    setIsRoasteryStudioOpen,
    activeOrdersCount,
  } = useStore();

  const { subscriptions, activeSubscriptionCount, setIsManageDrawerOpen } = useSubscription();
  const { brandProfile } = useTenant();
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobile = useCallback(() => setMobileOpen((v) => !v), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <header className="sticky top-0 z-40 w-full bg-paper/95 dark:bg-dark-canvas/95 backdrop-blur-md border-b border-hairline dark:border-dark-hairline transition-colors">
      {/* Dateline band — status, address and the operations controls */}
      <div className="border-b border-hairline dark:border-dark-hairline">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-1.5 flex items-center justify-between gap-4 text-[11px] font-mono text-ink-muted dark:text-dark-text-muted">
          <div className="flex items-center gap-4 sm:gap-6 truncate">
            <span className="flex items-center gap-1.5 font-medium text-ink dark:text-dark-text-main whitespace-nowrap">
              <span className={`w-2 h-2 rounded-full ${storeStatus.isOpen ? 'bg-success dark:bg-dark-success' : 'bg-danger dark:bg-dark-danger'}`} aria-hidden="true" />
              {storeStatus.statusText}
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 truncate">
              <MapPin className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              442 Industrial Way, {brandProfile.locationCity}
            </span>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button
              onClick={() => setIsBaristaModalOpen(true)}
              aria-label="Open Barista KDS and Roastery Operations Station"
              className="inline-flex items-center gap-1.5 px-2 py-1 min-h-[30px] border border-hairline-strong dark:border-dark-hairline-strong text-ink dark:text-dark-text-main hover:border-ink dark:hover:border-dark-text-main transition-colors cursor-pointer font-mono"
            >
              <Coffee className="w-3.5 h-3.5 text-vermillion dark:text-dark-vermillion" aria-hidden="true" />
              <span className="hidden sm:inline">Barista Rail</span>
              {activeOrdersCount > 0 && (
                <span className="w-1.5 h-1.5 rounded-full bg-vermillion dark:bg-dark-vermillion animate-ping" aria-hidden="true" />
              )}
            </button>

            <button
              onClick={() => setIsRoasteryStudioOpen(true)}
              aria-label="Open Roastery SaaS Studio Settings"
              className="inline-flex items-center gap-1.5 px-2 py-1 min-h-[30px] border border-hairline-strong dark:border-dark-hairline-strong text-ink dark:text-dark-text-main hover:border-ink dark:hover:border-dark-text-main transition-colors cursor-pointer font-mono"
            >
              <Settings className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Studio</span>
            </button>

            <button
              onClick={toggleTheme}
              aria-label={effectiveTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="inline-flex items-center gap-1.5 px-2 py-1 min-h-[30px] border border-hairline-strong dark:border-dark-hairline-strong text-ink dark:text-dark-text-main hover:border-ink dark:hover:border-dark-text-main transition-colors cursor-pointer font-mono"
            >
              {effectiveTheme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-rating dark:text-dark-rating" aria-hidden="true" />
                  <span className="hidden sm:inline font-medium">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5" aria-hidden="true" />
                  <span className="hidden sm:inline font-medium">Dark</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Nameplate band — the wordmark alone, at display scale. Newspaper
          mastheads put the name on its own line; the section links live in
          the strip below it, so no single band carries wordmark + links +
          button, which is the AI-nav fingerprint. */}
      <div className="border-b border-hairline dark:border-dark-hairline">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-2.5 flex items-center justify-between gap-3">
          <a href="#hero" className="flex items-center" aria-label={`${brandProfile.brandName} Home`}>
            <LogoMark className="w-10 h-10 sm:w-11 sm:h-11" showText nameplate />
          </a>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label={`View Bag: ${cartCount} items`}
              className="min-h-[42px] min-w-[42px] flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2 bg-ink dark:bg-dark-text-main text-paper dark:text-dark-canvas hover:bg-vermillion dark:hover:bg-dark-vermillion dark:hover:text-paper text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">Bag</span>
              <span className="bg-on-ink dark:bg-hairline-strong text-paper dark:text-dark-canvas px-1.5 py-0.5 text-[11px] font-bold">
                {cartCount}
              </span>
            </button>

            <button
              type="button"
              onClick={toggleMobile}
              className="md:hidden min-h-[42px] min-w-[42px] flex items-center justify-center p-2.5 bg-surface dark:bg-dark-surface text-ink dark:text-dark-text-main transition-colors cursor-pointer"
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <MenuIcon className="w-5 h-5" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Link strip — section links and the account pills, no wordmark */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-1.5 flex items-center justify-between gap-4">
        <nav className="hidden md:flex shrink-0 items-center gap-6 text-sm text-ink-muted dark:text-dark-text-muted" aria-label="Primary Navigation">
          <a href="#menu" className="hover:text-ink dark:hover:text-dark-text-main transition-colors py-1 whitespace-nowrap">
            Menu &amp; Order
          </a>
          <a href="#roastery" className="hover:text-ink dark:hover:text-dark-text-main transition-colors py-1 flex items-center gap-1.5 whitespace-nowrap">
            <span>Roastery &amp; Subscriptions</span>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 bg-vermillion/10 text-vermillion dark:text-dark-vermillion border border-vermillion/30 whitespace-nowrap">
              15% Off
            </span>
          </a>
          <a href="#brew-guide" className="hover:text-ink dark:hover:text-dark-text-main transition-colors py-1 whitespace-nowrap">
            Brew Guide
          </a>
          <a href="#rewards" className="hover:text-ink dark:hover:text-dark-text-main transition-colors py-1 whitespace-nowrap">
            Tasting Pass
          </a>
          <a href="#location" className="hover:text-ink dark:hover:text-dark-text-main transition-colors py-1 whitespace-nowrap">
            Visit &amp; Hours
          </a>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {subscriptions.length > 0 && (
            <button
              onClick={() => setIsManageDrawerOpen(true)}
              aria-label={`View Subscriptions: ${activeSubscriptionCount} active plans`}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] text-xs font-medium bg-surface dark:bg-dark-surface text-ink dark:text-dark-text-main hover:bg-surface-hover dark:hover:bg-dark-card-hover transition-colors"
            >
              <Package className="w-3.5 h-3.5 text-vermillion dark:text-dark-vermillion" aria-hidden="true" />
              <span>Vault: {activeSubscriptionCount}</span>
            </button>
          )}

          <button
            onClick={() => setIsLoyaltyModalOpen(true)}
            aria-label={`View Tasting Pass: ${loyaltyStamps} of 6 stamps completed`}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] text-xs font-medium bg-surface dark:bg-dark-surface text-ink dark:text-dark-text-main hover:bg-surface-hover dark:hover:bg-dark-card-hover transition-colors"
          >
            <SparkleMark />
            <span>Pass: {loyaltyStamps}/6</span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-hairline dark:border-dark-hairline bg-paper dark:bg-dark-canvas p-4 sm:p-5 space-y-2.5 anim-panel-in-sm">
          <a
            href="#menu"
            onClick={closeMobile}
            className="block min-h-[44px] p-3 bg-surface dark:bg-dark-surface text-sm font-semibold text-ink dark:text-dark-text-main active:bg-surface-hover dark:active:bg-dark-card-hover transition-colors"
          >
            Menu &amp; Order Ahead
          </a>
          <a
            href="#roastery"
            onClick={closeMobile}
            className="flex items-center justify-between min-h-[44px] p-3 bg-surface dark:bg-dark-surface text-sm font-semibold text-ink dark:text-dark-text-main active:bg-surface-hover dark:active:bg-dark-card-hover transition-colors"
          >
            <span>Roastery &amp; Subscriptions</span>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 bg-vermillion/10 text-vermillion dark:text-dark-vermillion">
              15% Off
            </span>
          </a>
          <a
            href="#brew-guide"
            onClick={closeMobile}
            className="block min-h-[44px] p-3 bg-surface dark:bg-dark-surface text-sm font-semibold text-ink dark:text-dark-text-main active:bg-surface-hover dark:active:bg-dark-card-hover transition-colors"
          >
            Brew Guide
          </a>
          <button
            type="button"
            onClick={() => {
              closeMobile();
              setIsBaristaModalOpen(true);
            }}
            className="w-full text-left min-h-[44px] flex items-center gap-2.5 p-3 bg-surface dark:bg-dark-surface text-sm font-semibold text-ink dark:text-dark-text-main active:bg-surface-hover dark:active:bg-dark-card-hover transition-colors"
          >
            <Coffee className="w-4 h-4 shrink-0 text-vermillion dark:text-dark-vermillion" aria-hidden="true" />
            <span>Barista Rail &amp; KDS ({activeOrdersCount} Active)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              closeMobile();
              setIsRoasteryStudioOpen(true);
            }}
            className="w-full text-left min-h-[44px] flex items-center gap-2.5 p-3 bg-surface dark:bg-dark-surface text-sm font-semibold text-ink dark:text-dark-text-main active:bg-surface-hover dark:active:bg-dark-card-hover transition-colors"
          >
            <Settings className="w-4 h-4 shrink-0 text-ink-muted dark:text-dark-text-muted" aria-hidden="true" />
            <span>Roastery Studio &amp; Customizer</span>
          </button>
          <button
            type="button"
            onClick={() => {
              closeMobile();
              setIsManageDrawerOpen(true);
            }}
            className="w-full text-left min-h-[44px] p-3 bg-surface dark:bg-dark-surface text-sm font-semibold text-ink dark:text-dark-text-main active:bg-surface-hover dark:active:bg-dark-card-hover transition-colors"
          >
            Subscription Vault ({activeSubscriptionCount} Active)
          </button>
          <button
            type="button"
            onClick={() => {
              closeMobile();
              setIsLoyaltyModalOpen(true);
            }}
            className="w-full text-left min-h-[44px] p-3 bg-surface dark:bg-dark-surface text-sm font-semibold text-ink dark:text-dark-text-main active:bg-surface-hover dark:active:bg-dark-card-hover transition-colors"
          >
            Tasting Pass ({loyaltyStamps}/6 Stamps)
          </button>
          <a
            href="#location"
            onClick={closeMobile}
            className="block min-h-[44px] p-3 bg-surface dark:bg-dark-surface text-sm font-semibold text-ink dark:text-dark-text-main active:bg-surface-hover dark:active:bg-dark-card-hover transition-colors"
          >
            Visit &amp; Hours
          </a>
        </div>
      )}
    </header>
  );
});

/* The pass button's mark: a stamped asterisk, same vermillion as the rest. */
const SparkleMark = () => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-vermillion dark:text-dark-vermillion" aria-hidden="true" fill="currentColor">
    <path d="M12 2.6l1.5 5.1 5.1 1.5-5.1 1.5-1.5 5.1-1.5-5.1L5.4 9.2l5.1-1.5L12 2.6zM18.5 14.2l.8 2.6 2.6.8-2.6.8-.8 2.6-.8-2.6-2.6-.8 2.6-.8.8-2.6z" />
  </svg>
);

Navbar.displayName = 'Navbar';
