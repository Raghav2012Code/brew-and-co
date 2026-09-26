import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { LogoMark } from './LogoMark';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    // Industry-level: basic RFC5322-lite validation before marking subscribed
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return;
    setSubscribed(true);
  };

  return (
    <footer className="bg-surface dark:bg-dark-sunken border-t border-hairline dark:border-dark-hairline text-ink dark:text-dark-text-main pt-14 pb-10 text-left transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Brand Col (5 cols) */}
          <div className="md:col-span-5 space-y-3">
            <LogoMark className="w-8 h-8" showText={true} />

            <p className="text-sm text-ink-muted dark:text-dark-text-muted leading-relaxed max-w-sm">
              Single-origin coffees sourced directly from smallholder farms, roasted in small batches, and served daily in San Francisco.
            </p>

            <div className="pt-2 text-xs text-ink-faint space-y-1">
              <p>442 Industrial Way, San Francisco, CA 94107</p>
              <p>Mon–Thu 7:00 AM – 6:00 PM</p>
              <p>Fri–Sun 7:00 AM – 8:00 PM</p>
            </div>
          </div>

          {/* Quick Navigation Links (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-vermillion">
              Explore
            </h4>
            <ul className="space-y-2 text-sm text-ink-muted dark:text-dark-text-muted">
              <li><a href="#menu" className="hover:text-ink dark:hover:text-dark-text-main transition-colors">Menu & Online Order</a></li>
              <li><a href="#roastery" className="hover:text-ink dark:hover:text-dark-text-main transition-colors">Roastery & Subscriptions</a></li>
              <li><a href="#location" className="hover:text-ink dark:hover:text-dark-text-main transition-colors">Hours & Location</a></li>
              <li><a href="#brew-guide" className="hover:text-ink dark:hover:text-dark-text-main transition-colors">Home Brew Guide</a></li>
              <li><a href="#rewards" className="hover:text-ink dark:hover:text-dark-text-main transition-colors">Tasting Pass</a></li>
            </ul>
          </div>

          {/* Newsletter Signup (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-vermillion">
              Roastery Newsletter
            </h4>
            <p className="text-xs text-ink-muted dark:text-dark-text-muted">
              Get updates on new seasonal coffee arrivals, special roast releases, and cafe events.
            </p>

            {subscribed ? (
              <div 
                role="status"
                aria-live="polite"
                className="p-3 rounded-lg bg-success/10 border border-success/30 text-success text-xs font-semibold flex items-center gap-2"
              >
                <Check className="w-4 h-4" aria-hidden="true" />
                <span>You're on the list. Thank you for following along.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col xs:flex-row gap-2">
                <label htmlFor="newsletter-email" className="sr-only">Your email address</label>
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  aria-label="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="flex-1 min-h-[44px] bg-paper dark:bg-dark-card border border-hairline-strong dark:border-dark-hairline-strong text-ink dark:text-dark-text-main text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-ink dark:focus:border-dark-text-main"
                />
                <button
                  type="submit"
                  aria-label="Subscribe to newsletter"
                  className="min-h-[44px] px-5 py-2.5 rounded-xl bg-ink dark:bg-dark-text-main text-paper dark:text-dark-canvas hover:bg-vermillion dark:hover:bg-vermillion dark:hover:text-paper text-xs font-semibold active:scale-95 transition-all cursor-pointer"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Legal & Copyright */}
        <div className="pt-6 border-t border-hairline dark:border-dark-hairline flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-faint">
          <p>© {new Date().getFullYear()} Brew & Co. Roastery & Cafe. San Francisco, California.</p>
          <div className="flex items-center gap-4">
            <span>Direct Trade</span>
            <span>•</span>
            <span>Single-Origin</span>
            <span>•</span>
            <span>San Francisco</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
