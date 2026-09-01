import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  Flame,
  ArrowUpRight,
  ShieldCheck,
  Package,
  SlidersHorizontal,
  Compass,
} from 'lucide-react';
import { useSubscription } from '../context/SubscriptionContext';
import { useStore } from '../context/StoreContext';
import { useTenant } from '../context/TenantContext';

export const RoasterySection: React.FC = () => {
  const {
    openSubscriptionModalFor,
    subscriptions,
    activeSubscriptionCount,
    setIsManageDrawerOpen,
  } = useSubscription();

  const { setIsMatchmakerOpen } = useStore();
  const { roasteryBeans, brandProfile } = useTenant();

  const [filterRoast, setFilterRoast] = useState<'all' | 'Light' | 'Medium-Light' | 'Medium' | 'Medium-Dark'>('all');

  const filteredBeans = filterRoast === 'all'
    ? roasteryBeans
    : roasteryBeans.filter((b) => b.roastLevel === filterRoast);

  return (
    <section
      id="roastery"
      className="py-16 sm:py-24 px-4 sm:px-8 max-w-7xl mx-auto border-b border-hairline dark:border-dark-hairline transition-colors"
      aria-label="Direct Trade Roastery & Subscriptions"
    >
      {/* Section Pre-header & Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 sm:pb-12 border-b border-hairline dark:border-dark-hairline">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-vermillion dark:bg-dark-vermillion" aria-hidden="true" />
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-ink-muted dark:text-dark-text-muted">
              Micro-Lot Roastery & Doorstep Subscriptions • {brandProfile.locationCity}
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-ink dark:text-dark-text-main tracking-tight leading-none">
            Freshly Roasted Beans, Calibrated to Your Cup.
          </h2>
          <p className="text-sm sm:text-base text-ink-muted dark:text-dark-text-muted leading-relaxed font-sans">
            Directly traded from generational high-elevation estates. Roasted on our vintage cast-iron drum roaster and dispatched at peak degassing with {brandProfile.roastDiscountPct}% recurring savings.
          </p>
        </div>

        {/* Action / Vault Trigger */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Interactive Palate Quiz Launcher */}
          <button
            onClick={() => setIsMatchmakerOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-vermillion dark:bg-dark-vermillion text-paper dark:text-dark-canvas text-xs font-mono font-bold hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-xs"
          >
            <Compass className="w-3.5 h-3.5 animate-spin-slow" />
            <span>Find Your Roast (30s Quiz)</span>
          </button>

          {subscriptions.length > 0 && (
            <button
              onClick={() => setIsManageDrawerOpen(true)}
              aria-label="Manage your active subscriptions"
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-ink dark:border-dark-text-main bg-paper-dim dark:bg-dark-card text-xs font-mono font-bold text-ink dark:text-dark-text-main hover:bg-ink hover:text-paper dark:hover:bg-dark-text-main dark:hover:text-dark-canvas active:scale-95 transition-all cursor-pointer shadow-xs"
            >
              <Package className="w-3.5 h-3.5 text-vermillion dark:text-dark-vermillion" />
              <span>Subscription Vault ({activeSubscriptionCount} Active)</span>
            </button>
          )}

          <a
            href="#brew-guide"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-vermillion dark:text-dark-vermillion hover:underline py-2"
          >
            <span>Dial-In Guide</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Subscription Value Proposition Banner */}
      <div className="my-8 sm:my-10 p-5 sm:p-6 bg-paper-dim dark:bg-dark-card border border-hairline dark:border-dark-hairline grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-vermillion/10 dark:bg-dark-vermillion/20 flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4 text-vermillion dark:text-dark-vermillion" />
          </div>
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider font-mono text-ink dark:text-dark-text-main">
              {brandProfile.roastDiscountPct}% Recurring Discount
            </h3>
            <p className="text-xs text-ink-muted dark:text-dark-text-muted mt-1 leading-snug">
              Save on every bag compared to retail. Applied automatically.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-vermillion/10 dark:bg-dark-vermillion/20 flex items-center justify-center shrink-0">
            <Flame className="w-4 h-4 text-vermillion dark:text-dark-vermillion" />
          </div>
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider font-mono text-ink dark:text-dark-text-main">
              Roasted Within 48 Hours
            </h3>
            <p className="text-xs text-ink-muted dark:text-dark-text-muted mt-1 leading-snug">
              Small batch roasted to order. Never sitting on a shelf.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-vermillion/10 dark:bg-dark-vermillion/20 flex items-center justify-center shrink-0">
            <SlidersHorizontal className="w-4 h-4 text-vermillion dark:text-dark-vermillion" />
          </div>
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider font-mono text-ink dark:text-dark-text-main">
              Precision Grinding
            </h3>
            <p className="text-xs text-ink-muted dark:text-dark-text-muted mt-1 leading-snug">
              Whole bean or dialed for Chemex, Espresso, or French Press.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-vermillion/10 dark:bg-dark-vermillion/20 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4 text-vermillion dark:text-dark-vermillion" />
          </div>
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider font-mono text-ink dark:text-dark-text-main">
              Total Freedom
            </h3>
            <p className="text-xs text-ink-muted dark:text-dark-text-muted mt-1 leading-snug">
              Skip weeks, swap origins, or cancel anytime in 1 click.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-6">
        <span className="text-xs font-mono font-bold text-ink-muted dark:text-dark-text-muted mr-2 shrink-0">
          Roast Level:
        </span>
        {[
          { id: 'all', label: 'All Roasts' },
          { id: 'Light', label: 'Light Roast' },
          { id: 'Medium-Light', label: 'Medium-Light' },
          { id: 'Medium', label: 'Medium Roast' },
          { id: 'Medium-Dark', label: 'Medium-Dark & Espresso' },
        ].map((tab) => {
          const isSelected = filterRoast === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setFilterRoast(tab.id as any)}
              className={`px-3 py-1.5 text-xs font-mono font-medium transition-all shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-ink dark:bg-dark-text-main text-paper dark:text-dark-canvas shadow-xs font-bold'
                  : 'bg-paper-dim dark:bg-dark-card border border-hairline dark:border-dark-hairline text-ink dark:text-dark-text-main hover:border-ink dark:hover:border-dark-text-main'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Roastery Bean Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {(filteredBeans || []).map((bean) => {
          const basePrice = bean.basePrice || 20;
          const discountPct = brandProfile?.roastDiscountPct ?? 15;
          const subPrice = (basePrice * (1 - discountPct / 100)).toFixed(2);

          return (
            <article
              key={bean.id}
              className="group flex flex-col justify-between bg-paper-dim dark:bg-dark-card border border-hairline dark:border-dark-hairline hover:border-ink dark:hover:border-dark-text-main transition-all duration-200 overflow-hidden shadow-xs hover:shadow-md"
            >
              {/* Top Image & Badge Header */}
              <div>
                <div className="relative aspect-4/3 w-full bg-paper dark:bg-dark-subtle overflow-hidden border-b border-hairline dark:border-dark-hairline">
                  <img
                    src={bean.image}
                    alt={bean.name}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Badges on Image */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 text-[10px] font-mono font-bold tracking-wider uppercase bg-paper/95 dark:bg-dark-card/95 text-ink dark:text-dark-text-main border border-hairline dark:border-dark-hairline shadow-xs">
                      {bean.badge}
                    </span>
                  </div>

                  {/* Cupping Score Pill */}
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-ink/90 dark:bg-dark-card/90 text-paper dark:text-dark-text-main border border-hairline/40 text-xs font-mono font-bold flex items-center gap-1 shadow-sm">
                    <Sparkles className="w-3 h-3 text-vermillion dark:text-dark-vermillion" />
                    <span>Cupping {bean.cuppingScore}</span>
                  </div>

                  {/* Elevation */}
                  <div className="absolute bottom-3 left-3 text-white text-[11px] font-mono font-medium drop-shadow-sm">
                    {bean.elevation}
                  </div>
                </div>

                {/* Card Content & Specs */}
                <div className="p-5 sm:p-6 space-y-4">
                  {/* Origin & Name */}
                  <div>
                    <span className="text-[11px] font-mono text-vermillion dark:text-dark-vermillion font-bold uppercase tracking-wider block">
                      {bean.origin}
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-ink dark:text-dark-text-main mt-1 leading-snug group-hover:text-vermillion dark:group-hover:text-dark-vermillion transition-colors">
                      {bean.name}
                    </h3>
                    <p className="text-xs text-ink-muted dark:text-dark-text-muted mt-1 line-clamp-2">
                      {bean.description}
                    </p>
                  </div>

                  {/* Varietal & Process Meta */}
                  <div className="grid grid-cols-2 gap-2 p-3 bg-paper dark:bg-dark-canvas border border-hairline/70 dark:border-dark-hairline/70 text-[11px] font-mono">
                    <div>
                      <span className="text-ink-faint block">Process:</span>
                      <strong className="text-ink dark:text-dark-text-main font-semibold truncate block">
                        {bean.process}
                      </strong>
                    </div>
                    <div>
                      <span className="text-ink-faint block">Roast Level:</span>
                      <strong className="text-ink dark:text-dark-text-main font-semibold block">
                        {bean.roastLevel}
                      </strong>
                    </div>
                  </div>

                  {/* Tasting Notes */}
                  <div className="flex flex-wrap gap-1">
                    {bean.tastingNotes?.map((note: string) => (
                      <span
                        key={note}
                        className="px-2 py-0.5 text-[11px] font-mono bg-paper dark:bg-dark-subtle border border-hairline/80 dark:border-dark-hairline/80 text-ink dark:text-dark-text-main"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer: Pricing & Action Steppers */}
              <div className="p-5 sm:p-6 pt-0 border-t border-hairline/60 dark:border-dark-hairline/60 mt-auto">
                <div className="flex items-baseline justify-between py-3 font-mono">
                  <div>
                    <span className="text-xs text-ink-muted dark:text-dark-text-muted">From </span>
                    <span className="text-lg font-bold text-vermillion dark:text-dark-vermillion">
                      ${subPrice}
                    </span>
                    <span className="text-[10px] text-ink-muted dark:text-dark-text-muted"> /sub</span>
                  </div>
                  <div className="text-right text-[11px] text-ink-faint">
                    One-time: ${bean.basePrice.toFixed(2)}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => openSubscriptionModalFor(bean)}
                    className="min-h-[42px] px-3 py-2 bg-ink dark:bg-dark-text-main text-paper dark:text-dark-canvas hover:bg-vermillion dark:hover:bg-dark-vermillion dark:hover:text-paper text-xs font-bold font-sans flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer shadow-xs"
                  >
                    <Zap className="w-3.5 h-3.5 fill-current text-vermillion dark:text-dark-canvas" />
                    <span>Subscribe</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => openSubscriptionModalFor(bean)}
                    className="min-h-[42px] px-3 py-2 bg-paper dark:bg-dark-subtle border border-hairline dark:border-dark-hairline hover:border-ink dark:hover:border-dark-text-main text-ink dark:text-dark-text-main text-xs font-bold font-sans active:scale-95 transition-all cursor-pointer"
                  >
                    <span>One-Time Bag</span>
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
