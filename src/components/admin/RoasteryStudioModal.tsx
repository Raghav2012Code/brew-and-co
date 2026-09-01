import React, { useState } from 'react';
import {
  X,
  Palette,
  Coffee,
  Sparkles,
  Sliders,
  Check,
  RotateCcw,
  Store,
  DollarSign,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useTenant, ACCENT_COLOR_PRESETS } from '../../context/TenantContext';
import { toast } from 'sonner';

export const RoasteryStudioModal: React.FC = () => {
  const { isRoasteryStudioOpen, setIsRoasteryStudioOpen } = useStore();
  const {
    brandProfile,
    roasteryBeans,
    updateBrandProfile,
    updateRoastItem,
    resetToDefaults,
  } = useTenant();

  const [activeTab, setActiveTab] = useState<'brand' | 'catalog'>('brand');

  if (!isRoasteryStudioOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="roastery-studio-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-4xl h-[92vh] flex flex-col bg-paper dark:bg-dark-card border border-hairline dark:border-dark-hairline shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-paper-dim dark:bg-dark-subtle border-b border-hairline dark:border-dark-hairline flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-ink dark:bg-dark-text-main text-paper dark:text-dark-canvas flex items-center justify-center font-mono font-bold text-xs">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <h2 id="roastery-studio-title" className="font-serif font-bold text-xl sm:text-2xl text-ink dark:text-dark-text-main">
                Roastery SaaS Brand Studio
              </h2>
              <p className="text-xs font-mono text-ink-muted dark:text-dark-text-muted">
                Multi-Tenant Customizer • Instant Live Preview
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsRoasteryStudioOpen(false)}
            aria-label="Close Studio"
            className="min-h-[38px] min-w-[38px] flex items-center justify-center border border-hairline dark:border-dark-hairline bg-paper dark:bg-dark-canvas text-ink-muted hover:text-ink cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-4 sm:px-6 bg-paper dark:bg-dark-canvas border-b border-hairline dark:border-dark-hairline flex items-center gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('brand')}
            className={`px-4 py-2.5 text-xs font-mono font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'brand'
                ? 'border-vermillion text-vermillion dark:text-dark-vermillion'
                : 'border-transparent text-ink-muted hover:text-ink'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Brand Theme & Colors</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-2.5 text-xs font-mono font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'catalog'
                ? 'border-vermillion text-vermillion dark:text-dark-vermillion'
                : 'border-transparent text-ink-muted hover:text-ink'
            }`}
          >
            <Coffee className="w-4 h-4" />
            <span>Roast Catalog & Pricing ({roasteryBeans.length})</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 p-5 sm:p-7 overflow-y-auto space-y-6 text-sm text-ink dark:text-dark-text-main">
          {activeTab === 'brand' ? (
            <div className="space-y-6 max-w-2xl">
              {/* Brand Name & Tagline */}
              <div className="space-y-4 p-5 bg-paper-dim dark:bg-dark-subtle border border-hairline dark:border-dark-hairline">
                <h3 className="font-serif text-lg font-bold">Store Identity</h3>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-mono font-bold text-ink-muted dark:text-dark-text-muted block mb-1">
                      Roastery Brand Name:
                    </label>
                    <input
                      type="text"
                      value={brandProfile.brandName}
                      onChange={(e) => updateBrandProfile({ brandName: e.target.value })}
                      className="w-full p-2.5 bg-paper dark:bg-dark-card border border-hairline dark:border-dark-hairline text-xs font-serif font-bold text-lg text-ink dark:text-dark-text-main focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono font-bold text-ink-muted dark:text-dark-text-muted block mb-1">
                      Tagline / Subtitle:
                    </label>
                    <input
                      type="text"
                      value={brandProfile.tagline}
                      onChange={(e) => updateBrandProfile({ tagline: e.target.value })}
                      className="w-full p-2.5 bg-paper dark:bg-dark-card border border-hairline dark:border-dark-hairline text-xs font-sans text-ink dark:text-dark-text-main focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono font-bold text-ink-muted dark:text-dark-text-muted block mb-1">
                      Location / Roastery City:
                    </label>
                    <input
                      type="text"
                      value={brandProfile.locationCity}
                      onChange={(e) => updateBrandProfile({ locationCity: e.target.value })}
                      className="w-full p-2.5 bg-paper dark:bg-dark-card border border-hairline dark:border-dark-hairline text-xs font-sans text-ink dark:text-dark-text-main focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Accent Color Palette Customizer */}
              <div className="space-y-3 p-5 bg-paper-dim dark:bg-dark-subtle border border-hairline dark:border-dark-hairline">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold">Theme Accent Color</h3>
                  <span className="text-xs font-mono text-ink-muted">Live CSS Sync</span>
                </div>
                <p className="text-xs text-ink-muted leading-relaxed">
                  Selecting an accent immediately repaints all badges, buttons, and callouts across the whole application in real time.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                  {Object.entries(ACCENT_COLOR_PRESETS).map(([key, val]) => {
                    const isSelected = brandProfile.accentColorId === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => {
                          updateBrandProfile({ accentColorId: key as any });
                          toast.success(`Theme updated to ${val.name}`);
                        }}
                        className={`p-3 text-left border flex items-center justify-between gap-3 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-ink dark:border-dark-text-main bg-paper dark:bg-dark-canvas ring-1 ring-ink'
                            : 'border-hairline dark:border-dark-hairline bg-paper dark:bg-dark-card hover:border-ink-muted'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-5 h-5 rounded-full shadow-xs border border-black/10"
                            style={{ backgroundColor: val.hex }}
                          />
                          <span className="font-mono text-xs font-bold text-ink dark:text-dark-text-main">
                            {val.name}
                          </span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-ink dark:text-dark-text-main" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-xl font-bold">Manage Single-Origin Catalog</h3>
                  <p className="text-xs font-mono text-ink-muted">
                    Adjust base pricing, cupping scores, and badges.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {roasteryBeans.map((bean) => (
                  <div
                    key={bean.id}
                    className="p-4 bg-paper-dim dark:bg-dark-subtle border border-hairline dark:border-dark-hairline space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h4 className="font-serif font-bold text-base text-ink dark:text-dark-text-main">
                          {bean.name}
                        </h4>
                        <span className="text-xs font-mono text-ink-muted">
                          {bean.origin} • {bean.roastLevel} Roast
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <label className="text-xs font-mono text-ink-muted">Price ($):</label>
                          <input
                            type="number"
                            step="0.50"
                            value={bean.basePrice}
                            onChange={(e) =>
                              updateRoastItem(bean.id, { basePrice: parseFloat(e.target.value) || 20 })
                            }
                            className="w-20 p-1.5 text-xs font-mono font-bold bg-paper dark:bg-dark-card border border-hairline text-ink dark:text-dark-text-main focus:outline-none"
                          />
                        </div>

                        <div className="flex items-center gap-1.5">
                          <label className="text-xs font-mono text-ink-muted">Cupping:</label>
                          <input
                            type="number"
                            step="0.5"
                            value={bean.cuppingScore}
                            onChange={(e) =>
                              updateRoastItem(bean.id, { cuppingScore: parseFloat(e.target.value) || 90 })
                            }
                            className="w-16 p-1.5 text-xs font-mono font-bold bg-paper dark:bg-dark-card border border-hairline text-ink dark:text-dark-text-main focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-paper-dim dark:bg-dark-subtle border-t border-hairline dark:border-dark-hairline flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset all brand and catalog settings to factory default?')) {
                resetToDefaults();
                toast.info('Settings reset to default');
              }
            }}
            className="inline-flex items-center gap-1 text-xs font-mono text-ink-faint hover:text-ink cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsRoasteryStudioOpen(false);
              toast.success('Roastery Studio changes saved');
            }}
            className="px-5 py-2 text-xs font-mono font-bold bg-ink dark:bg-dark-text-main text-paper dark:text-dark-canvas hover:bg-vermillion cursor-pointer shadow-xs"
          >
            Save & Exit Studio
          </button>
        </div>
      </div>
    </div>
  );
};
