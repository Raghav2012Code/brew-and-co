import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { ROASTERY_BEANS } from '../data/roasteryData';
import type { RoasteryBean } from '../types';

export interface RoasteryBrandProfile {
  brandName: string;
  tagline: string;
  locationCity: string;
  accentColorId: 'vermillion' | 'amber' | 'emerald' | 'cobalt' | 'espresso';
  accentHex: string;
  currencySymbol: string;
  roastDiscountPct: number;
}

export const ACCENT_COLOR_PRESETS: Record<string, { name: string; hex: string; darkHex: string }> = {
  vermillion: { name: 'Artisan Vermillion', hex: '#C84B31', darkHex: '#FF451A' },
  amber: { name: 'Kissa Roasted Amber', hex: '#D97706', darkHex: '#F59E0B' },
  emerald: { name: 'Highland Forest', hex: '#15803D', darkHex: '#22C55E' },
  cobalt: { name: 'Direct Trade Cobalt', hex: '#2563EB', darkHex: '#3B82F6' },
  espresso: { name: 'Vintage Cast-Iron', hex: '#78350F', darkHex: '#92400E' },
};

const DEFAULT_PROFILE: RoasteryBrandProfile = {
  brandName: 'Brew & Co.',
  tagline: 'Single-Origin Roastery & Cafe',
  locationCity: 'San Francisco, CA',
  accentColorId: 'vermillion',
  accentHex: '#C84B31',
  currencySymbol: '$',
  roastDiscountPct: 15,
};

interface TenantContextType {
  brandProfile: RoasteryBrandProfile;
  roasteryBeans: RoasteryBean[];
  updateBrandProfile: (fields: Partial<RoasteryBrandProfile>) => void;
  updateRoastItem: (id: string, fields: Partial<RoasteryBean>) => void;
  addRoastItem: (newBean: RoasteryBean) => void;
  resetToDefaults: () => void;
}

const TenantContext = createContext<TenantContextType | null>(null);

const BRAND_STORAGE_KEY = 'brew_co_tenant_brand';
const BEANS_STORAGE_KEY = 'brew_co_tenant_beans';

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [brandProfile, setBrandProfile] = useState<RoasteryBrandProfile>(() => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return DEFAULT_PROFILE;
      const saved = window.localStorage.getItem(BRAND_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && parsed.brandName) {
          return { ...DEFAULT_PROFILE, ...parsed };
        }
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_PROFILE;
  });

  // Merge canonical ROASTERY_BEANS with saved modifications by ID, allowing new catalog items to populate
  const [roasteryBeans, setRoasteryBeans] = useState<RoasteryBean[]>(() => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return ROASTERY_BEANS as RoasteryBean[];
      const saved = window.localStorage.getItem(BEANS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const savedMap = new Map<string, Partial<RoasteryBean>>(parsed.map((item) => [item?.id, item]));

          // 1. Merge canonical beans with saved modifications by ID
          const mergedCanonical = (ROASTERY_BEANS as RoasteryBean[]).map((canonical) => {
            const savedItem = savedMap.get(canonical.id);
            if (savedItem) {
              return {
                ...canonical,
                ...savedItem,
                image: canonical.image, // keep latest image asset path
              };
            }
            return canonical;
          });

          // 2. Include any custom items created by the user not in ROASTERY_BEANS
          const customItems = parsed.filter(
            (item: RoasteryBean) => item?.id && !ROASTERY_BEANS.some((b) => b.id === item.id)
          );

          return [...mergedCanonical, ...customItems];
        }
      }
    } catch (e) {
      console.error(e);
    }
    return ROASTERY_BEANS as RoasteryBean[];
  });

  const syncAccentToDOM = useCallback((profile: RoasteryBrandProfile) => {
    if (typeof document === 'undefined') return;
    const preset = ACCENT_COLOR_PRESETS[profile?.accentColorId || 'vermillion'] || ACCENT_COLOR_PRESETS.vermillion;
    const root = document.documentElement;
    const isDark = root.classList.contains('dark');
    const accentHex = isDark ? preset.darkHex : preset.hex;
    root.style.setProperty('--accent', accentHex);
    root.style.setProperty('--color-vermillion', accentHex);
    root.style.setProperty('--color-dark-vermillion', preset.darkHex);
    root.style.setProperty('--color-vermillion-dark', preset.darkHex);
  }, []);

  useEffect(() => {
    syncAccentToDOM(brandProfile || DEFAULT_PROFILE);
    try {
      localStorage.setItem(BRAND_STORAGE_KEY, JSON.stringify(brandProfile || DEFAULT_PROFILE));
    } catch (e) {
      console.error(e);
    }
  }, [brandProfile, syncAccentToDOM]);

  // Re-sync accent when theme class toggles (dark/light switch)
  useEffect(() => {
    if (typeof document === 'undefined' || typeof MutationObserver === 'undefined') return;
    const root = document.documentElement;
    const obs = new MutationObserver(() => syncAccentToDOM(brandProfile || DEFAULT_PROFILE));
    obs.observe(root, { attributes: true, attributeFilter: ['class'] });
    // Also listen to system preference changes when in system mode
    const mql = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
    const handleMql = () => syncAccentToDOM(brandProfile || DEFAULT_PROFILE);
    mql?.addEventListener('change', handleMql);
    return () => {
      obs.disconnect();
      mql?.removeEventListener('change', handleMql);
    };
  }, [brandProfile, syncAccentToDOM]);

  useEffect(() => {
    try {
      localStorage.setItem(BEANS_STORAGE_KEY, JSON.stringify(Array.isArray(roasteryBeans) ? roasteryBeans : ROASTERY_BEANS));
    } catch (e) {
      console.error(e);
    }
  }, [roasteryBeans]);

  const updateBrandProfile = useCallback((fields: Partial<RoasteryBrandProfile>) => {
    setBrandProfile((prev) => {
      const current = prev || DEFAULT_PROFILE;
      const updated = { ...current, ...fields };
      if (fields.accentColorId && ACCENT_COLOR_PRESETS[fields.accentColorId]) {
        updated.accentHex = ACCENT_COLOR_PRESETS[fields.accentColorId].hex;
      }
      return updated;
    });
  }, []);

  const updateRoastItem = useCallback((id: string, fields: Partial<RoasteryBean>) => {
    setRoasteryBeans((prev) =>
      Array.isArray(prev) ? prev.map((bean) => (bean?.id === id ? { ...bean, ...fields } : bean)) : (ROASTERY_BEANS as RoasteryBean[])
    );
  }, []);

  const addRoastItem = useCallback((newBean: RoasteryBean) => {
    setRoasteryBeans((prev) => (Array.isArray(prev) ? [newBean, ...prev] : [newBean, ...(ROASTERY_BEANS as RoasteryBean[])]));
  }, []);

  const resetToDefaults = useCallback(() => {
    setBrandProfile(DEFAULT_PROFILE);
    setRoasteryBeans(ROASTERY_BEANS as RoasteryBean[]);
    try {
      localStorage.removeItem(BRAND_STORAGE_KEY);
      localStorage.removeItem(BEANS_STORAGE_KEY);
    } catch {}
  }, []);

  const value = useMemo(
    () => ({
      brandProfile: brandProfile || DEFAULT_PROFILE,
      roasteryBeans: Array.isArray(roasteryBeans) ? roasteryBeans : (ROASTERY_BEANS as RoasteryBean[]),
      updateBrandProfile,
      updateRoastItem,
      addRoastItem,
      resetToDefaults,
    }),
    [brandProfile, roasteryBeans, updateBrandProfile, updateRoastItem, addRoastItem, resetToDefaults]
  );

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};
