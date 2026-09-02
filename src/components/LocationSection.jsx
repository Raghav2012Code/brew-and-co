import React from 'react';
import { ArrowUpRight, Wifi, Music, Bike } from 'lucide-react';
import { STORE_INFO } from '../data/menuData';

export const LocationSection = () => {
  return (
    <section id="location" className="border-b border-[#E8E4DC] dark:border-[#262420] bg-[#FBF9F5] dark:bg-[#11100F] py-12 sm:py-20 scroll-mt-16 text-left transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E8E4DC] dark:border-[#262420] pb-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#C84B31] block mb-1">
              Find Us
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1816] dark:text-[#EAE6DF] tracking-tight">
              Hours & Location
            </h2>
          </div>
          <p className="text-sm text-[#666056] dark:text-[#A09A8E] max-w-md">
            Indoor seating, sunny outdoor patio, and fresh single-origin coffee roasted on-site daily.
          </p>
        </div>

        {/* 2-Column Split: Hours & Directions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left: Operating Hours (6 cols) */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-2xl bg-[#F3EFE6] dark:bg-[#161513] border border-[#E8E4DC] dark:border-[#262420] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#E8E4DC] dark:border-[#262420] pb-3">
                <h3 className="font-serif font-bold text-xl text-[#1A1816] dark:text-[#EAE6DF]">
                  Cafe Hours
                </h3>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#2E7D32] text-white">
                  Open Today
                </span>
              </div>

              <div className="divide-y divide-[#E8E4DC] dark:divide-[#262420] text-sm">
                {STORE_INFO.hours.map((h, i) => (
                  <div key={i} className="py-2.5 flex justify-between items-center">
                    <span className="font-medium text-[#1A1816] dark:text-[#EAE6DF]">{h.days}</span>
                    <span className="text-[#666056] dark:text-[#A09A8E] font-medium">{h.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Atmosphere Badges */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#E8E4DC] dark:border-[#262420] text-center text-xs text-[#666056] dark:text-[#A09A8E]">
              <div className="p-3 rounded-lg bg-[#FBF9F5] dark:bg-[#1C1B18] border border-[#E0DACB] dark:border-[#302D27] space-y-1">
                <Wifi className="w-4 h-4 mx-auto text-[#C84B31]" aria-hidden="true" />
                <span className="block font-semibold text-[#1A1816] dark:text-[#EAE6DF]">Free Wi-Fi</span>
              </div>
              <div className="p-3 rounded-lg bg-[#FBF9F5] dark:bg-[#1C1B18] border border-[#E0DACB] dark:border-[#302D27] space-y-1">
                <Music className="w-4 h-4 mx-auto text-[#C84B31]" aria-hidden="true" />
                <span className="block font-semibold text-[#1A1816] dark:text-[#EAE6DF]">Patio Seating</span>
              </div>
              <div className="p-3 rounded-lg bg-[#FBF9F5] dark:bg-[#1C1B18] border border-[#E0DACB] dark:border-[#302D27] space-y-1">
                <Bike className="w-4 h-4 mx-auto text-[#C84B31]" aria-hidden="true" />
                <span className="block font-semibold text-[#1A1816] dark:text-[#EAE6DF]">Bike Parking</span>
              </div>
            </div>
          </div>

          {/* Right: Address & Maps Link (6 cols) */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-2xl bg-[#F3EFE6] dark:bg-[#161513] border border-[#E8E4DC] dark:border-[#262420] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#E8E4DC] dark:border-[#262420] pb-3">
                <h3 className="font-serif font-bold text-xl text-[#1A1816] dark:text-[#EAE6DF]">
                  Location & Transit
                </h3>
                <span className="text-xs text-[#888276]">San Francisco</span>
              </div>

              <div className="space-y-1">
                <p className="font-bold text-lg text-[#1A1816] dark:text-[#EAE6DF]">
                  {STORE_INFO.address}
                </p>
                <p className="text-sm text-[#666056] dark:text-[#A09A8E]">
                  {STORE_INFO.neighborhood}
                </p>
                <p className="text-xs text-[#888276] pt-1">
                  A short walk from the 16th St transit stop. Street parking and bike racks available out front.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FBF9F5] dark:bg-[#1C1B18] border border-[#E0DACB] dark:border-[#302D27] text-xs text-[#666056] dark:text-[#A09A8E] space-y-1">
                <strong className="block text-[#1A1816] dark:text-[#EAE6DF]">Online Order Pickup</strong>
                <p>Pick up your drinks at the counter just inside the front entrance.</p>
              </div>
            </div>

            {/* Launch Map CTA */}
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full min-h-[48px] py-3.5 px-6 rounded-xl bg-[#1A1816] dark:bg-[#EAE6DF] text-[#FBF9F5] dark:text-[#11100F] hover:bg-[#C84B31] dark:hover:bg-[#C84B31] dark:hover:text-[#FBF9F5] text-sm font-semibold active:scale-98 transition-all flex items-center justify-between shadow-sm"
            >
              <span>Get Directions</span>
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>

        </div>
      </div>
    </section>
  );
};
