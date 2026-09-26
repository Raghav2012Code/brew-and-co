import React from 'react';
import { ArrowRight, MapPin } from 'lucide-react';

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
            {/* Authoritative Editorial Headline — roman display, emphasis by weight + accent */}
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-ink dark:text-dark-text-main leading-[1.08]">
              Exceptional coffee, <br />
              <span className="font-light text-vermillion dark:text-dark-vermillion">
                roasted fresh daily.
              </span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-ink-muted dark:text-dark-text-muted max-w-xl leading-relaxed">
              We source direct-trade coffees from smallholder farms and roast them in small batches on Industrial Way. Order ahead for quick counter pickup, or have a seat at the bar.
            </p>

            {/* Today on the Bar: Interactive Specimen Tags */}
            <div className="space-y-2 pt-1">
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
            </div>

            {/* Roastery facts — a ruled typographic list, not icon tiles */}
            <dl className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4 pt-6 border-t border-hairline dark:border-dark-hairline text-xs">
              <div>
                <dt className="font-semibold text-ink dark:text-dark-text-main">Single-Origin</dt>
                <dd className="text-[11px] text-ink-faint mt-0.5 leading-tight">High-altitude micro-lots</dd>
              </div>

              <div>
                <dt className="font-semibold text-ink dark:text-dark-text-main">Quick Pickup</dt>
                <dd className="text-[11px] text-ink-faint mt-0.5 leading-tight">Ready in ~8 mins</dd>
              </div>

              <div>
                <dt className="font-semibold text-ink dark:text-dark-text-main">Roasted in SF</dt>
                <dd className="text-[11px] text-ink-faint mt-0.5 leading-tight">Small batches weekly</dd>
              </div>

              <div>
                <dt className="font-semibold text-ink dark:text-dark-text-main">Tasting Pass</dt>
                <dd className="text-[11px] text-ink-faint mt-0.5 leading-tight">7th coffee on the house</dd>
              </div>
            </dl>

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
