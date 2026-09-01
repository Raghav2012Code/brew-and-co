import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { ROASTERY_BEANS } from '../data/roasteryData';

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
  vermillion: { name: 'Artisan Vermillion', hex: '#E03410', darkHex: '#FF451A' },
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
  accentHex: '#E03410',
  currencySymbol: '$',
  roastDiscountPct: 15,
};

interface TenantContextType {
  brandProfile: RoasteryBrandProfile;
  roasteryBeans: any[];
  updateBrandProfile: (fields: Partial<RoasteryBrandProfile>) => void;
  updateRoastItem: (id: string, fields: Partial<any>) => void;
  addRoastItem: (newBean: any) => void;
  resetToDefaults: () => void;
}

const TenantContext = createContext<TenantContextType | null>(null);

const BRAND_STORAGE_KEY = 'brew_co_tenant_brand';
const BEANS_STORAGE_KEY = 'brew_co_tenant_beans';

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [brandProfile, setBrandProfile] = useState<RoasteryBrandProfile>(() => {
    try {
      const saved = localStorage.getItem(BRAND_STORAGE_KEY);
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

  const [roasteryBeans, setRoasteryBeans] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem(BEANS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge with latest image paths and data from ROASTERY_BEANS
          return parsed.map((item) => {
            const canonical = ROASTERY_BEANS.find((b) => b.id === item.id);
            return canonical ? { ...item, image: canonical.image } : item;
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
    return ROASTERY_BEANS;
  });

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const preset = ACCENT_COLOR_PRESETS[brandProfile?.accentColorId || 'vermillion'] || ACCENT_COLOR_PRESETS.vermillion;
    const root = document.documentElement;
    root.style.setProperty('--accent', preset.hex);
    root.style.setProperty('--color-vermillion', preset.hex);

    try {
      localStorage.setItem(BRAND_STORAGE_KEY, JSON.stringify(brandProfile || DEFAULT_PROFILE));
    } catch (e) {
      console.error(e);
    }
  }, [brandProfile]);

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

  const updateRoastItem = useCallback((id: string, fields: Partial<any>) => {
    setRoasteryBeans((prev) =>
      Array.isArray(prev) ? prev.map((bean) => (bean?.id === id ? { ...bean, ...fields } : bean)) : ROASTERY_BEANS
    );
  }, []);

  const addRoastItem = useCallback((newBean: any) => {
    setRoasteryBeans((prev) => (Array.isArray(prev) ? [newBean, ...prev] : [newBean, ...ROASTERY_BEANS]));
  }, []);

  const resetToDefaults = useCallback(() => {
    setBrandProfile(DEFAULT_PROFILE);
    setRoasteryBeans(ROASTERY_BEANS);
    try {
      localStorage.removeItem(BRAND_STORAGE_KEY);
      localStorage.removeItem(BEANS_STORAGE_KEY);
    } catch {}
  }, []);

  const value = useMemo(
    () => ({
      brandProfile: brandProfile || DEFAULT_PROFILE,
      roasteryBeans: Array.isArray(roasteryBeans) ? roasteryBeans : ROASTERY_BEANS,
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
