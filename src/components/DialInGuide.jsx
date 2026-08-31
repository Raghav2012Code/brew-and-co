import React, { useState } from 'react';
import { Coffee, Droplets, Thermometer, Sparkles, Clock, CheckCircle, Flame } from 'lucide-react';

const CUP_PRESETS = [
  {
    id: '1cup',
    label: '1 Cup',
    subtitle: '8 oz / 250ml',
    dose: 16,
    water: 250,
    time: '2.5 mins',
    bloom: 50,
    spoons: 'about 2 level tbsp',
  },
  {
    id: '2cups',
    label: '2 Mugs',
    subtitle: '16 oz / 500ml',
    dose: 30,
    water: 500,
    time: '3.5 mins',
    bloom: 80,
    spoons: 'about 4 level tbsp',
  },
  {
    id: 'travel',
    label: 'Travel Mug',
    subtitle: '12 oz / 380ml',
    dose: 24,
    water: 380,
    time: '3.0 mins',
    bloom: 60,
    spoons: 'about 3 level tbsp',
  },
  {
    id: 'pot',
    label: 'Large Carafe',
    subtitle: '26 oz / 800ml',
    dose: 50,
    water: 800,
    time: '4.5 mins',
    bloom: 120,
    spoons: 'about 6 level tbsp',
  },
];

const BREW_STEPS = [
  {
    num: '1',
    title: 'Grind',
    desc: 'Grind your coffee medium-coarse, similar in texture to coarse sea salt.',
    tip: 'Grinding right before brewing protects aroma and natural sweetness.',
  },
  {
    num: '2',
    title: 'Bloom',
    desc: 'Pour just enough hot water to saturate the grounds, then wait 30 seconds.',
    tip: 'This lets trapped roasting gases escape so the water extracts evenly.',
  },
  {
    num: '3',
    title: 'Pour',
    desc: 'Pour the remaining water in slow, steady circles from center outward.',
    tip: 'Maintain an even water level and let the brew draw down smoothly.',
  },
];

export const DialInGuide = () => {
  const [selectedPresetId, setSelectedPresetId] = useState('1cup');

  const activePreset = CUP_PRESETS.find((p) => p.id === selectedPresetId) || CUP_PRESETS[0];

  return (
    <section id="brew-guide" className="border-b border-[#E8E4DC] dark:border-[#262420] bg-[#FBF9F5] dark:bg-[#11100F] py-14 sm:py-20 scroll-mt-16 text-left transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F3EFE6] dark:bg-[#1C1B18] border border-[#E0DACB] dark:border-[#302D27] text-xs font-semibold text-[#C84B31]">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Home Brew Guide</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1816] dark:text-[#EAE6DF] tracking-tight">
            How to Brew at Home
          </h2>
          <p className="text-sm sm:text-base text-[#666056] dark:text-[#A09A8E] leading-relaxed">
            A simple guide to making delicious coffee without special equipment. Choose your cup size below for the exact measurements.
          </p>
        </div>

        {/* Interactive Cup Size Selector & Quick Recipe Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#F3EFE6] dark:bg-[#161513] border border-[#E8E4DC] dark:border-[#262420] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E0DACB] dark:border-[#262420] pb-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#C84B31] block">
                1. Choose Serving Size
              </span>
              <h3 className="font-serif font-bold text-xl text-[#1A1816] dark:text-[#EAE6DF]">
                How much coffee are you making?
              </h3>
            </div>
            <span className="text-xs text-[#888276]">
              Standard 1:16 ratio
            </span>
          </div>

          {/* Preset Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {CUP_PRESETS.map((preset) => {
              const isSelected = preset.id === selectedPresetId;
              return (
                <button
                  key={preset.id}
                  onClick={() => setSelectedPresetId(preset.id)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-[#1A1816] dark:border-[#EAE6DF] bg-[#1A1816] dark:bg-[#EAE6DF] text-[#FBF9F5] dark:text-[#11100F] shadow-sm'
                      : 'border-[#E0DACB] dark:border-[#302D27] bg-[#FBF9F5] dark:bg-[#1C1B18] text-[#1A1816] dark:text-[#EAE6DF] hover:border-[#1A1816]'
                  }`}
                >
                  <p className="font-semibold text-sm">{preset.label}</p>
                  <p className={`text-xs mt-0.5 ${isSelected ? 'text-[#D5CFBF] dark:text-[#555047]' : 'text-[#888276]'}`}>
                    {preset.subtitle}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Clean Recipe Summary Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-[#FBF9F5] dark:bg-[#1C1B18] border border-[#E0DACB] dark:border-[#302D27] text-center space-y-1">
              <span className="text-xs text-[#666056] dark:text-[#A09A8E] block">Coffee Amount</span>
              <span className="font-serif text-2xl font-bold text-[#C84B31]">
                {activePreset.dose}g
              </span>
              <span className="text-[11px] text-[#888276] block">
                ({activePreset.spoons})
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FBF9F5] dark:bg-[#1C1B18] border border-[#E0DACB] dark:border-[#302D27] text-center space-y-1">
              <span className="text-xs text-[#666056] dark:text-[#A09A8E] block">Water Amount</span>
              <span className="font-serif text-2xl font-bold text-[#1A1816] dark:text-[#EAE6DF]">
                {activePreset.water}ml
              </span>
              <span className="text-[11px] text-[#888276] block">
                (~{activePreset.subtitle.split('/')[0].trim()})
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FBF9F5] dark:bg-[#1C1B18] border border-[#E0DACB] dark:border-[#302D27] text-center space-y-1">
              <span className="text-xs text-[#666056] dark:text-[#A09A8E] block">Water Temp</span>
              <span className="font-serif text-2xl font-bold text-[#1A1816] dark:text-[#EAE6DF]">
                200°F
              </span>
              <span className="text-[11px] text-[#888276] block">
                (30s after boiling)
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FBF9F5] dark:bg-[#1C1B18] border border-[#E0DACB] dark:border-[#302D27] text-center space-y-1">
              <span className="text-xs text-[#666056] dark:text-[#A09A8E] block">Brew Time</span>
              <span className="font-serif text-2xl font-bold text-[#1A1816] dark:text-[#EAE6DF]">
                {activePreset.time}
              </span>
              <span className="text-[11px] text-[#888276] block">
                (total pour time)
              </span>
            </div>
          </div>
        </div>

        {/* 3 Simple Steps Flow */}
        <div className="space-y-6">
          <div className="text-left">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#C84B31] block mb-1">
              2. The Routine
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1816] dark:text-[#EAE6DF]">
              3 Steps to a Great Cup
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BREW_STEPS.map((step) => (
              <div
                key={step.num}
                className="p-6 rounded-2xl bg-[#F3EFE6] dark:bg-[#161513] border border-[#E8E4DC] dark:border-[#262420] flex flex-col justify-between space-y-4 text-left transition-all hover:border-[#1A1816] dark:hover:border-[#EAE6DF]"
              >
                <div className="space-y-3">
                  <div className="w-9 h-9 rounded-full bg-[#1A1816] dark:bg-[#EAE6DF] text-[#FBF9F5] dark:text-[#11100F] flex items-center justify-center font-serif font-bold text-base shadow-sm">
                    {step.num}
                  </div>
                  <h4 className="font-serif font-bold text-xl text-[#1A1816] dark:text-[#EAE6DF]">
                    {step.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#555047] dark:text-[#A09A8E] leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E0DACB] dark:border-[#262420] text-xs text-[#888276] dark:text-[#888276]">
                  <strong className="text-[#1A1816] dark:text-[#EAE6DF] block mb-0.5">Barista Tip:</strong>
                  {step.tip}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3 Friendly Roaster Secrets */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#F3EFE6] dark:bg-[#161513] border border-[#E8E4DC] dark:border-[#262420] text-left space-y-4">
          <h4 className="font-serif font-bold text-lg text-[#1A1816] dark:text-[#EAE6DF]">
            Three Barista Tips for Better Taste
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#FBF9F5] dark:bg-[#1C1B18] border border-[#E0DACB] dark:border-[#302D27] space-y-1.5">
              <span className="font-semibold text-sm text-[#1A1816] dark:text-[#EAE6DF] block">
                💧 Use Filtered Water
              </span>
              <p className="text-[#666056] dark:text-[#A09A8E] leading-relaxed">
                Coffee is mostly water. Filtered tap water removes mineral harshness and brings out natural fruit and chocolate notes.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#FBF9F5] dark:bg-[#1C1B18] border border-[#E0DACB] dark:border-[#302D27] space-y-1.5">
              <span className="font-semibold text-sm text-[#1A1816] dark:text-[#EAE6DF] block">
                🌡️ Let Water Cool 30 Seconds
              </span>
              <p className="text-[#666056] dark:text-[#A09A8E] leading-relaxed">
                Water straight off the boil (212°F) can over-extract and turn bitter. Let the kettle rest for 30–45 seconds (~200°F) before pouring.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#FBF9F5] dark:bg-[#1C1B18] border border-[#E0DACB] dark:border-[#302D27] space-y-1.5">
              <span className="font-semibold text-sm text-[#1A1816] dark:text-[#EAE6DF] block">
                ☕ Use Fresh Beans
              </span>
              <p className="text-[#666056] dark:text-[#A09A8E] leading-relaxed">
                Coffee beans taste best within 4 weeks of their roast date, when the natural sugars and aromas are freshest.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
