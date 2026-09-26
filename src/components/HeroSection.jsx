import React from 'react';
import { ArrowRight, Clock, Coffee, Sparkles, MapPin, Star, Flame } from 'lucide-react';

const TODAY_TASTING_SPECIMENS = [
  { name: 'Ethiopia Guji Anaerobic', notes: 'Candied Lime • Jasmine', badge: 'Special Roast' },
  { name: 'Panama Boquete Geisha', notes: 'Bergamot • White Peach', badge: 'Reserve Lot' },
  { name: 'Smoked Amber Cortado', notes: 'Bourbon Vanilla • Smoked Oak', badge: 'Signature' },
];

export const HeroSection = () => {

  return (
    <section className="relative overflow-hidden border-b border-hairline dark:border-dark-hairline bg-paper dark:bg-dark-canvas transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-18 lg:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left: Rich Editorial & Roastery Telemetry (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Live Micro-Roastery Status Badge */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface dark:bg-dark-surface border border-hairline-strong dark:border-dark-hairline-strong text-xs font-semibold text-ink dark:text-dark-text-main shadow-xs">
                <span className="w-2 h-2 rounded-full bg-vermillion animate-pulse" aria-hidden="true" />
                <span className="font-mono text-[11px] uppercase tracking-wider text-vermillion">Batch #842</span>
                <span className="text-ink-faint dark:text-dark-text-faint">•</span>
                <span className="text-xs">Roasted Fresh Today at 6:30 AM</span>
              </div>

              <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface/60 dark:bg-dark-surface/60 border border-hairline-strong/60 dark:border-dark-hairline-strong/60 text-[11px] font-medium text-ink-muted dark:text-dark-text-muted">
                <MapPin className="w-3 h-3 text-ink-faint" />
                <span>San Francisco, CA</span>
              </div>
            </div>

            {/* Authoritative Editorial Headline */}
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-ink dark:text-dark-text-main leading-[1.08]">
              Exceptional coffee, <br />
              <span className="font-light italic text-vermillion dark:text-dark-vermillion">
                roasted fresh daily.
              </span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-ink-muted dark:text-dark-text-muted max-w-xl leading-relaxed">
              We source direct-trade coffees from smallholder farms and roast them in small batches on Industrial Way. Order ahead for quick counter pickup, or have a seat at the bar.
            </p>

            {/* Today on the Bar: Interactive Specimen Tags */}
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-mono uppercase tracking-widest text-ink-faint block">
                On Bar Today:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {TODAY_TASTING_SPECIMENS.map((specimen, idx) => (
                  <a
                    key={idx}
                    href="#menu"
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface dark:bg-dark-surface border border-hairline-strong dark:border-dark-hairline-strong hover:border-ink dark:hover:border-dark-text-main transition-[color,background-color,border-color,opacity,transform] group"
                  >
                    <span className="text-xs font-semibold text-ink dark:text-dark-text-main group-hover:text-vermillion transition-colors">
                      {specimen.name}
                    </span>
                    <span className="text-[11px] text-ink-faint dark:text-ink-faint hidden sm:inline">
                      ({specimen.notes})
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Primary Action Buttons & Social Proof */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <a
                  href="#menu"
                  className="min-h-[50px] inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-ink dark:bg-dark-text-main text-paper dark:text-dark-canvas hover:bg-vermillion dark:hover:bg-vermillion dark:hover:text-paper font-semibold text-sm shadow-md transition-[color,background-color,border-color,opacity,transform] text-center"
                >
                  <span>Order Ahead</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </a>

                <a
                  href="#location"
                  className="min-h-[50px] inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-hairline-strong dark:border-dark-hairline-strong bg-paper dark:bg-dark-canvas text-ink dark:text-dark-text-main hover:border-ink dark:hover:border-dark-text-main font-medium text-sm transition-[color,background-color,border-color,opacity,transform] text-center"
                >
                  <MapPin className="w-4 h-4 text-ink-faint" aria-hidden="true" />
                  <span>Find Our Cafe</span>
                </a>
              </div>

              {/* Social Proof Rating */}
              <div className="flex items-center gap-3 text-xs text-ink-muted dark:text-dark-text-muted">
                <div className="flex items-center text-rating">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="font-medium">
                  <strong className="text-ink dark:text-dark-text-main">4.9 stars</strong> from over 1,200 neighborhood reviews
                </span>
              </div>
            </div>

            {/* 4 Rich Roastery Metric Ribbon Cells */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-hairline dark:border-dark-hairline text-xs">
              <div className="p-3 rounded-xl bg-surface dark:bg-dark-card border border-hairline-strong dark:border-dark-hairline space-y-1">
                <Coffee className="w-4 h-4 text-vermillion" aria-hidden="true" />
                <strong className="block font-semibold text-ink dark:text-dark-text-main">Single-Origin</strong>
                <span className="text-[11px] text-ink-faint block leading-tight">High-altitude micro-lots</span>
              </div>

              <div className="p-3 rounded-xl bg-surface dark:bg-dark-card border border-hairline-strong dark:border-dark-hairline space-y-1">
                <Clock className="w-4 h-4 text-vermillion" aria-hidden="true" />
                <strong className="block font-semibold text-ink dark:text-dark-text-main">Quick Pickup</strong>
                <span className="text-[11px] text-ink-faint block leading-tight">Ready in ~8 mins</span>
              </div>

              <div className="p-3 rounded-xl bg-surface dark:bg-dark-card border border-hairline-strong dark:border-dark-hairline space-y-1">
                <Flame className="w-4 h-4 text-vermillion" aria-hidden="true" />
                <strong className="block font-semibold text-ink dark:text-dark-text-main">Roasted in SF</strong>
                <span className="text-[11px] text-ink-faint block leading-tight">Small batches weekly</span>
              </div>

              <div className="p-3 rounded-xl bg-surface dark:bg-dark-card border border-hairline-strong dark:border-dark-hairline space-y-1">
                <Sparkles className="w-4 h-4 text-vermillion" aria-hidden="true" />
                <strong className="block font-semibold text-ink dark:text-dark-text-main">Tasting Pass</strong>
                <span className="text-[11px] text-ink-faint block leading-tight">7th coffee on the house</span>
              </div>
            </div>

          </div>

          {/* Right: High-Res Coffee & Atmosphere Visual (5 cols) */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-hairline dark:border-dark-hairline aspect-[4/3] sm:aspect-[4/5] bg-surface-hover dark:bg-ink group">
              <img
                src="/images/hero-warm-table.jpg"
                alt="Artisan ceramic coffee cups with delicate latte art on warm rustic wood table in cafe"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Subtle Overlay Card for Today's Special Roast */}
              <div className="absolute bottom-3 sm:bottom-5 left-3 sm:left-5 right-3 sm:right-5 p-4 sm:p-5 rounded-2xl bg-paper/95 dark:bg-dark-canvas/95 backdrop-blur-md border border-hairline dark:border-dark-hairline shadow-xl text-left">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-vermillion" />
                      <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-vermillion block truncate">
                        TODAY'S HARVEST LOT
                      </span>
                    </div>
                    <h3 className="font-serif font-bold text-base sm:text-lg text-ink dark:text-dark-text-main truncate">
                      Ethiopia Guji Natural #04
                    </h3>
                    <p className="text-[11px] sm:text-xs text-ink-muted dark:text-dark-text-muted truncate">
                      Notes of candied lime, jasmine & raw honey
                    </p>
                  </div>
                  <a
                    href="#menu"
                    className="shrink-0 min-h-[40px] px-4 py-2 rounded-xl bg-ink dark:bg-dark-text-main text-paper dark:text-dark-canvas hover:bg-vermillion text-xs font-semibold transition-[color,background-color,border-color,opacity,transform] flex items-center justify-center shadow-xs cursor-pointer"
                  >
                    Order $5.50
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
