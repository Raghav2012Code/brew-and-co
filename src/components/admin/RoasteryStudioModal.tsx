import React, { useState, useEffect } from 'react';
import { X, Palette, Coffee, Check, RotateCcw, Store } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useTenant, ACCENT_COLOR_PRESETS, RoasteryBrandProfile } from '../../context/TenantContext';
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

  // Local draft state: changes are only committed to TenantContext upon "Save & Exit"
  const [draftProfile, setDraftProfile] = useState<RoasteryBrandProfile>({ ...brandProfile });
  const [draftBeans, setDraftBeans] = useState<any[]>(roasteryBeans.map((b) => ({ ...b })));
  const [priceInputs, setPriceInputs] = useState<Record<string, string>>({});
  const [cuppingInputs, setCuppingInputs] = useState<Record<string, string>>({});

  // Sync draft whenever modal opens or external tenant state changes
  useEffect(() => {
    if (isRoasteryStudioOpen) {
      setDraftProfile({ ...brandProfile });
      setDraftBeans(roasteryBeans.map((b) => ({ ...b })));
      const p: Record<string, string> = {};
      const c: Record<string, string> = {};
      roasteryBeans.forEach((b) => {
        p[b.id] = String(b.basePrice ?? 20);
        c[b.id] = String(b.cuppingScore ?? 90);
      });
      setPriceInputs(p);
      setCuppingInputs(c);
    }
  }, [isRoasteryStudioOpen, brandProfile, roasteryBeans]);

  if (!isRoasteryStudioOpen) return null;

  const handleDismiss = () => {
    // Revert local draft to current context state and close
    setDraftProfile({ ...brandProfile });
    setDraftBeans(roasteryBeans.map((b) => ({ ...b })));
    setIsRoasteryStudioOpen(false);
  };

  const handleSave = () => {
    // 1. Commit brand profile
    updateBrandProfile(draftProfile);

    // 2. Commit bean catalog updates with parsed numeric values
    draftBeans.forEach((bean) => {
      const rawPrice = priceInputs[bean.id];
      const parsedPrice = rawPrice !== undefined ? parseFloat(rawPrice) : bean.basePrice;
      const finalPrice = isNaN(parsedPrice) || parsedPrice <= 0 ? (bean.basePrice || 20) : parsedPrice;

      const rawCupping = cuppingInputs[bean.id];
      const parsedCupping = rawCupping !== undefined ? parseFloat(rawCupping) : bean.cuppingScore;
      const finalCupping = isNaN(parsedCupping) || parsedCupping <= 0 ? (bean.cuppingScore || 90) : parsedCupping;

      updateRoastItem(bean.id, {
        ...bean,
        basePrice: finalPrice,
        cuppingScore: finalCupping,
      });
    });

    setIsRoasteryStudioOpen(false);
    toast.success('Roastery Studio changes saved');
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all brand and catalog settings to factory default?')) {
      resetToDefaults();
      setIsRoasteryStudioOpen(false);
      toast.info('Settings reset to default');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="roastery-studio-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={handleDismiss}
    >
      <div
        className="relative w-full max-w-4xl h-[92vh] flex flex-col bg-paper dark:bg-dark-card border border-hairline dark:border-dark-hairline shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-surface dark:bg-dark-subtle border-b border-hairline dark:border-dark-hairline flex items-center justify-between">
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
            onClick={handleDismiss}
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
            <span>Roast Catalog & Pricing ({draftBeans.length})</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 p-5 sm:p-7 overflow-y-auto space-y-6 text-sm text-ink dark:text-dark-text-main">
          {activeTab === 'brand' ? (
            <div className="space-y-6 max-w-2xl">
              {/* Brand Name & Tagline */}
              <div className="space-y-4 p-5 bg-surface dark:bg-dark-subtle border border-hairline dark:border-dark-hairline">
                <h3 className="font-serif text-lg font-bold">Store Identity</h3>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-mono font-bold text-ink-muted dark:text-dark-text-muted block mb-1">
                      Roastery Brand Name:
                    </label>
                    <input
                      type="text"
                      value={draftProfile.brandName}
                      onChange={(e) => setDraftProfile((prev) => ({ ...prev, brandName: e.target.value }))}
                      className="w-full p-2.5 bg-paper dark:bg-dark-card border border-hairline dark:border-dark-hairline text-xs font-serif font-bold text-lg text-ink dark:text-dark-text-main"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono font-bold text-ink-muted dark:text-dark-text-muted block mb-1">
                      Tagline / Subtitle:
                    </label>
                    <input
                      type="text"
                      value={draftProfile.tagline}
                      onChange={(e) => setDraftProfile((prev) => ({ ...prev, tagline: e.target.value }))}
                      className="w-full p-2.5 bg-paper dark:bg-dark-card border border-hairline dark:border-dark-hairline text-xs font-sans text-ink dark:text-dark-text-main"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono font-bold text-ink-muted dark:text-dark-text-muted block mb-1">
                      Location / Roastery City:
                    </label>
                    <input
                      type="text"
                      value={draftProfile.locationCity}
                      onChange={(e) => setDraftProfile((prev) => ({ ...prev, locationCity: e.target.value }))}
                      className="w-full p-2.5 bg-paper dark:bg-dark-card border border-hairline dark:border-dark-hairline text-xs font-sans text-ink dark:text-dark-text-main"
                    />
                  </div>
                </div>
              </div>

              {/* Accent Color Palette Customizer */}
              <div className="space-y-3 p-5 bg-surface dark:bg-dark-subtle border border-hairline dark:border-dark-hairline">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold">Theme Accent Color</h3>
                  <span className="text-xs font-mono text-ink-muted">Preview</span>
                </div>
                <p className="text-xs text-ink-muted leading-relaxed">
                  Select a theme accent. Changes will be saved across the entire roastery storefront when clicking Save & Exit.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                  {Object.entries(ACCENT_COLOR_PRESETS).map(([key, val]) => {
                    const isSelected = draftProfile.accentColorId === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => {
                          setDraftProfile((prev) => ({ ...prev, accentColorId: key as any }));
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
                    Adjust base pricing and cupping scores. Changes apply on Save & Exit.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {draftBeans.map((bean) => (
                  <div
                    key={bean.id}
                    className="p-4 bg-surface dark:bg-dark-subtle border border-hairline dark:border-dark-hairline space-y-3"
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
                            value={priceInputs[bean.id] !== undefined ? priceInputs[bean.id] : String(bean.basePrice)}
                            onChange={(e) => {
                              const raw = e.target.value;
                              setPriceInputs((prev) => ({ ...prev, [bean.id]: raw }));
                            }}
                            onBlur={(e) => {
                              const raw = e.target.value.trim();
                              const parsed = parseFloat(raw);
                              const valid = isNaN(parsed) || parsed <= 0 ? (bean.basePrice || 20) : parsed;
                              setPriceInputs((prev) => ({ ...prev, [bean.id]: String(valid) }));
                              setDraftBeans((prev) =>
                                prev.map((b) => (b.id === bean.id ? { ...b, basePrice: valid } : b))
                              );
                            }}
                            className="w-20 p-1.5 text-xs font-mono font-bold bg-paper dark:bg-dark-card border border-hairline text-ink dark:text-dark-text-main"
                          />
                        </div>

                        <div className="flex items-center gap-1.5">
                          <label className="text-xs font-mono text-ink-muted">Cupping:</label>
                          <input
                            type="number"
                            step="0.5"
                            value={cuppingInputs[bean.id] !== undefined ? cuppingInputs[bean.id] : String(bean.cuppingScore)}
                            onChange={(e) => {
                              const raw = e.target.value;
                              setCuppingInputs((prev) => ({ ...prev, [bean.id]: raw }));
                            }}
                            onBlur={(e) => {
                              const raw = e.target.value.trim();
                              const parsed = parseFloat(raw);
                              const valid = isNaN(parsed) || parsed <= 0 ? (bean.cuppingScore || 90) : parsed;
                              setCuppingInputs((prev) => ({ ...prev, [bean.id]: String(valid) }));
                              setDraftBeans((prev) =>
                                prev.map((b) => (b.id === bean.id ? { ...b, cuppingScore: valid } : b))
                              );
                            }}
                            className="w-16 p-1.5 text-xs font-mono font-bold bg-paper dark:bg-dark-card border border-hairline text-ink dark:text-dark-text-main"
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
        <div className="p-4 sm:p-5 bg-surface dark:bg-dark-subtle border-t border-hairline dark:border-dark-hairline flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1 text-xs font-mono text-ink-faint hover:text-ink cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDismiss}
              className="px-4 py-2 text-xs font-mono border border-hairline dark:border-dark-hairline bg-paper dark:bg-dark-canvas text-ink-muted hover:text-ink cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 text-xs font-mono font-bold bg-ink dark:bg-dark-text-main text-paper dark:text-dark-canvas hover:bg-vermillion cursor-pointer shadow-xs"
            >
              Save & Exit Studio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
