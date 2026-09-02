import React from 'react';
import { ArrowRight, Clock, Coffee, Sparkles, MapPin, Star, Flame } from 'lucide-react';

const TODAY_TASTING_SPECIMENS = [
  { name: 'Ethiopia Guji Anaerobic', notes: 'Candied Lime • Jasmine', badge: 'Special Roast' },
  { name: 'Panama Boquete Geisha', notes: 'Bergamot • White Peach', badge: 'Reserve Lot' },
  { name: 'Smoked Amber Cortado', notes: 'Bourbon Vanilla • Smoked Oak', badge: 'Signature' },
];

export const HeroSection = () => {

  return (
    <section className="relative overflow-hidden border-b border-[#E8E4DC] dark:border-[#262420] bg-[#FBF9F5] dark:bg-[#11100F] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-18 lg:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left: Rich Editorial & Roastery Telemetry (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Live Micro-Roastery Status Badge */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F3EFE6] dark:bg-[#1C1B18] border border-[#E0DACB] dark:border-[#302D27] text-xs font-semibold text-[#1A1816] dark:text-[#EAE6DF] shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#C84B31] animate-pulse" aria-hidden="true" />
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#C84B31]">Batch #842</span>
                <span className="text-[#888276] dark:text-[#777064]">•</span>
                <span className="text-xs">Roasted Fresh Today at 6:30 AM</span>
              </div>

              <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F3EFE6]/60 dark:bg-[#1C1B18]/60 border border-[#E0DACB]/60 dark:border-[#302D27]/60 text-[11px] font-medium text-[#666056] dark:text-[#A09A8E]">
                <MapPin className="w-3 h-3 text-[#888276]" />
                <span>San Francisco, CA</span>
              </div>
            </div>

            {/* Authoritative Editorial Headline */}
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#1A1816] dark:text-[#EAE6DF] leading-[1.08]">
              Exceptional coffee, <br />
              <span className="font-light italic text-[#C84B31] dark:text-[#FF6B4A]">
                roasted fresh daily.
              </span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-[#555047] dark:text-[#A09A8E] max-w-xl leading-relaxed">
              We source direct-trade coffees from smallholder farms and roast them in small batches on Industrial Way. Order ahead for quick counter pickup, or have a seat at the bar.
            </p>

            {/* Today on the Bar: Interactive Specimen Tags */}
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#888276] block">
                On Bar Today:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {TODAY_TASTING_SPECIMENS.map((specimen, idx) => (
                  <a
                    key={idx}
                    href="#menu"
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F3EFE6] dark:bg-[#1C1B18] border border-[#E0DACB] dark:border-[#302D27] hover:border-[#1A1816] dark:hover:border-[#EAE6DF] transition-all group active:scale-95"
                  >
                    <span className="text-xs font-semibold text-[#1A1816] dark:text-[#EAE6DF] group-hover:text-[#C84B31] transition-colors">
                      {specimen.name}
                    </span>
                    <span className="text-[11px] text-[#888276] dark:text-[#888276] hidden sm:inline">
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
                  className="min-h-[50px] inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#1A1816] dark:bg-[#EAE6DF] text-[#FBF9F5] dark:text-[#11100F] hover:bg-[#C84B31] dark:hover:bg-[#C84B31] dark:hover:text-[#FBF9F5] font-semibold text-sm shadow-md active:scale-98 transition-all text-center"
                >
                  <span>Order Ahead</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </a>

                <a
                  href="#location"
                  className="min-h-[50px] inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-[#D5CFBF] dark:border-[#38342E] bg-[#FBF9F5] dark:bg-[#11100F] text-[#1A1816] dark:text-[#EAE6DF] hover:border-[#1A1816] dark:hover:border-[#EAE6DF] font-medium text-sm active:scale-98 transition-all text-center"
                >
                  <MapPin className="w-4 h-4 text-[#888276]" aria-hidden="true" />
                  <span>Find Our Cafe</span>
                </a>
              </div>

              {/* Social Proof Rating */}
              <div className="flex items-center gap-3 text-xs text-[#666056] dark:text-[#A09A8E]">
                <div className="flex items-center text-[#E5A93C]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="font-medium">
                  <strong className="text-[#1A1816] dark:text-[#EAE6DF]">4.9 stars</strong> from over 1,200 neighborhood reviews
                </span>
              </div>
            </div>

            {/* 4 Rich Roastery Metric Ribbon Cells */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-[#E8E4DC] dark:border-[#262420] text-xs">
              <div className="p-3 rounded-xl bg-[#F3EFE6] dark:bg-[#161513] border border-[#E0DACB] dark:border-[#262420] space-y-1">
                <Coffee className="w-4 h-4 text-[#C84B31]" aria-hidden="true" />
                <strong className="block font-semibold text-[#1A1816] dark:text-[#EAE6DF]">Single-Origin</strong>
                <span className="text-[11px] text-[#888276] block leading-tight">High-altitude micro-lots</span>
              </div>

              <div className="p-3 rounded-xl bg-[#F3EFE6] dark:bg-[#161513] border border-[#E0DACB] dark:border-[#262420] space-y-1">
                <Clock className="w-4 h-4 text-[#C84B31]" aria-hidden="true" />
                <strong className="block font-semibold text-[#1A1816] dark:text-[#EAE6DF]">Quick Pickup</strong>
                <span className="text-[11px] text-[#888276] block leading-tight">Ready in ~8 mins</span>
              </div>

              <div className="p-3 rounded-xl bg-[#F3EFE6] dark:bg-[#161513] border border-[#E0DACB] dark:border-[#262420] space-y-1">
                <Flame className="w-4 h-4 text-[#C84B31]" aria-hidden="true" />
                <strong className="block font-semibold text-[#1A1816] dark:text-[#EAE6DF]">Roasted in SF</strong>
                <span className="text-[11px] text-[#888276] block leading-tight">Small batches weekly</span>
              </div>

              <div className="p-3 rounded-xl bg-[#F3EFE6] dark:bg-[#161513] border border-[#E0DACB] dark:border-[#262420] space-y-1">
                <Sparkles className="w-4 h-4 text-[#C84B31]" aria-hidden="true" />
                <strong className="block font-semibold text-[#1A1816] dark:text-[#EAE6DF]">Tasting Pass</strong>
                <span className="text-[11px] text-[#888276] block leading-tight">7th coffee on the house</span>
              </div>
            </div>

          </div>

          {/* Right: High-Res Coffee & Atmosphere Visual (5 cols) */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-[#E8E4DC] dark:border-[#262420] aspect-[4/3] sm:aspect-[4/5] bg-[#E8E4DC] dark:bg-[#1A1816] group">
              <img
                src="/images/hero-warm-table.jpg"
                alt="Artisan ceramic coffee cups with delicate latte art on warm rustic wood table in cafe"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Subtle Overlay Card for Today's Special Roast */}
              <div className="absolute bottom-3 sm:bottom-5 left-3 sm:left-5 right-3 sm:right-5 p-4 sm:p-5 rounded-2xl bg-[#FBF9F5]/95 dark:bg-[#11100F]/95 backdrop-blur-md border border-[#E8E4DC] dark:border-[#262420] shadow-xl text-left">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C84B31]" />
                      <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#C84B31] block truncate">
                        TODAY'S HARVEST LOT
                      </span>
                    </div>
                    <h3 className="font-serif font-bold text-base sm:text-lg text-[#1A1816] dark:text-[#EAE6DF] truncate">
                      Ethiopia Guji Natural #04
                    </h3>
                    <p className="text-[11px] sm:text-xs text-[#666056] dark:text-[#A09A8E] truncate">
                      Notes of candied lime, jasmine & raw honey
                    </p>
                  </div>
                  <a
                    href="#menu"
                    className="shrink-0 min-h-[40px] px-4 py-2 rounded-xl bg-[#1A1816] dark:bg-[#EAE6DF] text-[#FBF9F5] dark:text-[#11100F] hover:bg-[#C84B31] text-xs font-semibold active:scale-95 transition-all flex items-center justify-center shadow-xs cursor-pointer"
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
