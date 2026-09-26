import React, { useState } from 'react';
import { Droplets, Thermometer, Coffee, Sparkles } from 'lucide-react';

const CUP_PRESETS = [
  {
    id: '1cup',
    label: '1 Cup',
    subtitle: '8 oz / 250ml',
    dose: 16,
    water: 256,
    time: '2.5 mins',
    bloom: 50,
    spoons: 'about 2 level tbsp',
  },
  {
    id: '2cups',
    label: '2 Mugs',
    subtitle: '16 oz / 500ml',
    dose: 32,
    water: 512,
    time: '3.5 mins',
    bloom: 80,
    spoons: 'about 4 level tbsp',
  },
  {
    id: 'travel',
    label: 'Travel Mug',
    subtitle: '12 oz / 380ml',
    dose: 24,
    water: 384,
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
    <section id="brew-guide" className="border-b border-hairline dark:border-dark-hairline bg-paper dark:bg-dark-canvas py-14 sm:py-20 scroll-mt-16 text-left transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface dark:bg-dark-surface border border-hairline-strong dark:border-dark-hairline-strong text-xs font-semibold text-vermillion">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Home Brew Guide</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink dark:text-dark-text-main tracking-tight">
            How to Brew at Home
          </h2>
          <p className="text-sm sm:text-base text-ink-muted dark:text-dark-text-muted leading-relaxed">
            A simple guide to making delicious coffee without special equipment. Choose your cup size below for the exact measurements.
          </p>
        </div>

        {/* Interactive Cup Size Selector & Quick Recipe Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-surface dark:bg-dark-card border border-hairline dark:border-dark-hairline shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-hairline-strong dark:border-dark-hairline pb-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-vermillion block">
                1. Choose Serving Size
              </span>
              <h3 className="font-serif font-bold text-xl text-ink dark:text-dark-text-main">
                How much coffee are you making?
              </h3>
            </div>
            <span className="text-xs text-ink-faint">
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
                  type="button"
                  onClick={() => setSelectedPresetId(preset.id)}
                  aria-pressed={isSelected}
                  className={`p-4 rounded-xl border text-left transition-colors ${
                    isSelected
                      ? 'border-ink dark:border-dark-text-main bg-ink dark:bg-dark-text-main text-paper dark:text-dark-canvas shadow-sm'
                      : 'border-hairline-strong dark:border-dark-hairline-strong bg-paper dark:bg-dark-surface text-ink dark:text-dark-text-main hover:border-ink'
                  }`}
                >
                  <p className="font-semibold text-sm">{preset.label}</p>
                  <p className={`text-xs mt-0.5 ${isSelected ? 'text-hairline-strong dark:text-ink-muted' : 'text-ink-faint'}`}>
                    {preset.subtitle}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Clean Recipe Summary Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-paper dark:bg-dark-surface border border-hairline-strong dark:border-dark-hairline-strong text-center space-y-1">
              <span className="text-xs text-ink-muted dark:text-dark-text-muted block">Coffee Amount</span>
              <span className="font-serif text-2xl font-bold text-vermillion">
                {activePreset.dose}g
              </span>
              <span className="text-[11px] text-ink-faint block">
                ({activePreset.spoons})
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-paper dark:bg-dark-surface border border-hairline-strong dark:border-dark-hairline-strong text-center space-y-1">
              <span className="text-xs text-ink-muted dark:text-dark-text-muted block">Water Amount</span>
              <span className="font-serif text-2xl font-bold text-ink dark:text-dark-text-main">
                {activePreset.water}ml
              </span>
              <span className="text-[11px] text-ink-faint block">
                (~{activePreset.subtitle.split('/')[0].trim()})
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-paper dark:bg-dark-surface border border-hairline-strong dark:border-dark-hairline-strong text-center space-y-1">
              <span className="text-xs text-ink-muted dark:text-dark-text-muted block">Water Temp</span>
              <span className="font-serif text-2xl font-bold text-ink dark:text-dark-text-main">
                200°F
              </span>
              <span className="text-[11px] text-ink-faint block">
                (30s after boiling)
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-paper dark:bg-dark-surface border border-hairline-strong dark:border-dark-hairline-strong text-center space-y-1">
              <span className="text-xs text-ink-muted dark:text-dark-text-muted block">Brew Time</span>
              <span className="font-serif text-2xl font-bold text-ink dark:text-dark-text-main">
                {activePreset.time}
              </span>
              <span className="text-[11px] text-ink-faint block">
                (total pour time)
              </span>
            </div>
          </div>
        </div>

        {/* 3 Simple Steps Flow */}
        <div className="space-y-6">
          <div className="text-left">
            <span className="text-xs font-semibold uppercase tracking-wider text-vermillion block mb-1">
              2. The Routine
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-ink dark:text-dark-text-main">
              3 Steps to a Great Cup
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BREW_STEPS.map((step) => (
              <div
                key={step.num}
                className="p-6 rounded-2xl bg-surface dark:bg-dark-card border border-hairline dark:border-dark-hairline flex flex-col justify-between space-y-4 text-left transition-colors hover:border-ink dark:hover:border-dark-text-main"
              >
                <div className="space-y-3">
                  <div className="w-9 h-9 rounded-full bg-ink dark:bg-dark-text-main text-paper dark:text-dark-canvas flex items-center justify-center font-serif font-bold text-base shadow-sm">
                    {step.num}
                  </div>
                  <h4 className="font-serif font-bold text-xl text-ink dark:text-dark-text-main">
                    {step.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-ink-muted dark:text-dark-text-muted leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-hairline-strong dark:border-dark-hairline text-xs text-ink-faint dark:text-ink-faint">
                  <strong className="text-ink dark:text-dark-text-main block mb-0.5">Barista Tip:</strong>
                  {step.tip}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3 Friendly Roaster Secrets */}
        <div className="p-6 sm:p-8 rounded-2xl bg-surface dark:bg-dark-card border border-hairline dark:border-dark-hairline text-left space-y-4">
          <h4 className="font-serif font-bold text-lg text-ink dark:text-dark-text-main">
            Three Barista Tips for Better Taste
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-paper dark:bg-dark-surface border border-hairline-strong dark:border-dark-hairline-strong space-y-1.5">
              <span className="font-semibold text-sm text-ink dark:text-dark-text-main flex items-center gap-2">
                <Droplets className="w-4 h-4 text-vermillion dark:text-dark-vermillion shrink-0" aria-hidden="true" />
                Use Filtered Water
              </span>
              <p className="text-ink-muted dark:text-dark-text-muted leading-relaxed">
                Coffee is mostly water. Filtered tap water removes mineral harshness and brings out natural fruit and chocolate notes.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-paper dark:bg-dark-surface border border-hairline-strong dark:border-dark-hairline-strong space-y-1.5">
              <span className="font-semibold text-sm text-ink dark:text-dark-text-main flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-vermillion dark:text-dark-vermillion shrink-0" aria-hidden="true" />
                Let Water Cool 30 Seconds
              </span>
              <p className="text-ink-muted dark:text-dark-text-muted leading-relaxed">
                Water straight off the boil (212°F) can over-extract and turn bitter. Let the kettle rest for 30–45 seconds (~200°F) before pouring.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-paper dark:bg-dark-surface border border-hairline-strong dark:border-dark-hairline-strong space-y-1.5">
              <span className="font-semibold text-sm text-ink dark:text-dark-text-main flex items-center gap-2">
                <Coffee className="w-4 h-4 text-vermillion dark:text-dark-vermillion shrink-0" aria-hidden="true" />
                Use Fresh Beans
              </span>
              <p className="text-ink-muted dark:text-dark-text-muted leading-relaxed">
                Coffee beans taste best within 4 weeks of their roast date, when the natural sugars and aromas are freshest.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
