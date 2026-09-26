import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { ROASTERY_BEANS, SUBSCRIPTION_FREQUENCIES, GRIND_PROFILES, BAG_SIZES } from '../data/roasteryData';

export interface ActiveSubscription {
  id: string;
  beanId: string;
  beanName: string;
  image: string;
  roastLevel: string;
  origin: string;
  grindId: string;
  grindName: string;
  bagSizeId: string;
  bagSizeName: string;
  frequencyId: string;
  frequencyName: string;
  unitPrice: number;
  quantity: number;
  status: 'active' | 'paused';
  createdAt: string;
  nextDispatchDate: string;
  totalDeliveredCount: number;
  basePrice?: number;
}

interface SubscriptionContextType {
  subscriptions: ActiveSubscription[];
  activeSubscriptionCount: number;
  isSubscribeModalOpen: boolean;
  setIsSubscribeModalOpen: (open: boolean) => void;
  selectedBean: any | null;
  setSelectedBean: (bean: any | null) => void;
  initialFrequency: string;
  isManageDrawerOpen: boolean;
  setIsManageDrawerOpen: (open: boolean) => void;
  openSubscriptionModalFor: (bean: any, initialFrequency?: string) => void;
  addSubscription: (sub: Omit<ActiveSubscription, 'id' | 'createdAt' | 'nextDispatchDate' | 'totalDeliveredCount' | 'status'>) => ActiveSubscription;
  pauseSubscription: (id: string) => void;
  resumeSubscription: (id: string) => void;
  cancelSubscription: (id: string) => void;
  /** Puts a cancelled plan back exactly as it was. Exists so cancelling can
   *  be an optimistic update with an Undo rather than a confirmation gate. */
  restoreSubscription: (sub: ActiveSubscription) => void;
  updateFrequency: (id: string, newFreqId: string) => void;
  updateGrind: (id: string, newGrindId: string) => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

const STORAGE_KEY = 'brew_co_active_subscriptions';

const calculateNextDispatch = (daysAhead: number = 7): string => {
  const target = new Date();
  target.setDate(target.getDate() + daysAhead);
  return target.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const DEFAULT_SAMPLE_SUBSCRIPTIONS: ActiveSubscription[] = [
  {
    id: 'sub-sample-01',
    beanId: 'ethiopia-yirgacheffe-aricha',
    beanName: 'Ethiopia Yirgacheffe Aricha',
    image: '/images/beans-guji.jpg',
    roastLevel: 'Light',
    origin: 'Gedeo Zone, Yirgacheffe',
    grindId: 'chemex-pourover',
    grindName: 'Chemex & V60 Pour-Over',
    bagSizeId: '250g',
    bagSizeName: '250g Bag',
    frequencyId: 'biweekly',
    frequencyName: 'Every 2 Weeks',
    unitPrice: 18.70,
    quantity: 1,
    status: 'active',
    createdAt: 'Feb 15, 2026',
    nextDispatchDate: calculateNextDispatch(10),
    totalDeliveredCount: 2,
    basePrice: 22,
  },
];

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Allow empty array [] in localStorage hydration so cancelled subscriptions stay cancelled on reload
  const [subscriptions, setSubscriptions] = useState<ActiveSubscription[]>(() => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return DEFAULT_SAMPLE_SUBSCRIPTIONS;
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading subscriptions:', e);
    }
    return DEFAULT_SAMPLE_SUBSCRIPTIONS;
  });

  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);
  const [selectedBean, setSelectedBean] = useState<any | null>(null);
  const [initialFrequency, setInitialFrequency] = useState<string>('biweekly');
  const [isManageDrawerOpen, setIsManageDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.isArray(subscriptions) ? subscriptions : []));
    } catch (e) {
      console.error('Error saving subscriptions:', e);
    }
  }, [subscriptions]);

  const openSubscriptionModalFor = useCallback((bean: any, initialFreq: string = 'biweekly') => {
    const beanWithFreq = bean ? { ...bean, initialFrequency: initialFreq } : bean;
    setSelectedBean(beanWithFreq);
    setInitialFrequency(initialFreq);
    setIsSubscribeModalOpen(true);
  }, []);

  const addSubscription = useCallback((subData: Omit<ActiveSubscription, 'id' | 'createdAt' | 'nextDispatchDate' | 'totalDeliveredCount' | 'status'>) => {
    const freq = SUBSCRIPTION_FREQUENCIES.find((f) => f.id === subData.frequencyId) || SUBSCRIPTION_FREQUENCIES[1];
    const newSub: ActiveSubscription = {
      ...subData,
      id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      nextDispatchDate: calculateNextDispatch(freq?.days ?? 14),
      totalDeliveredCount: 0,
      status: 'active',
    };

    setSubscriptions((prev) => (Array.isArray(prev) ? [newSub, ...prev] : [newSub]));
    return newSub;
  }, []);

  const pauseSubscription = useCallback((id: string) => {
    setSubscriptions((prev) =>
      Array.isArray(prev) ? prev.map((sub) => (sub.id === id ? { ...sub, status: 'paused' } : sub)) : []
    );
  }, []);

  // Respect subscription's actual frequency interval (freq?.days ?? 14) when resuming instead of hardcoding 7 days
  const resumeSubscription = useCallback((id: string) => {
    setSubscriptions((prev) =>
      Array.isArray(prev)
        ? prev.map((sub) => {
            if (sub.id === id) {
              const freq = SUBSCRIPTION_FREQUENCIES.find((f) => f.id === sub.frequencyId);
              return {
                ...sub,
                status: 'active',
                nextDispatchDate: calculateNextDispatch(freq?.days ?? 14),
              };
            }
            return sub;
          })
        : []
    );
  }, []);

  const cancelSubscription = useCallback((id: string) => {
    setSubscriptions((prev) => (Array.isArray(prev) ? prev.filter((sub) => sub.id !== id) : []));
  }, []);

  const restoreSubscription = useCallback((sub: ActiveSubscription) => {
    setSubscriptions((prev) => {
      const list = Array.isArray(prev) ? prev : [];
      // Guard against a double-undo re-adding a plan the user cancelled again.
      if (list.some((s) => s.id === sub.id)) return list;
      return [...list, sub];
    });
  }, []);

  // Retain custom bean base prices, do not calculate imminent dispatch date on paused subs, use nullish coalescing
  const updateFrequency = useCallback((id: string, newFreqId: string) => {
    const freq = SUBSCRIPTION_FREQUENCIES.find((f) => f.id === newFreqId);
    if (!freq) return;
    setSubscriptions((prev) =>
      Array.isArray(prev)
        ? prev.map((sub) => {
            if (sub.id === id) {
              const bagSize = BAG_SIZES.find((s) => s.id === sub.bagSizeId) || BAG_SIZES[0];

              let beanBasePrice = sub.basePrice;
              if (beanBasePrice === undefined && typeof window !== 'undefined' && window.localStorage) {
                try {
                  const saved = window.localStorage.getItem('brew_co_tenant_beans');
                  if (saved) {
                    const beans = JSON.parse(saved);
                    const found = Array.isArray(beans) ? beans.find((b: any) => b?.id === sub.beanId) : null;
                    if (found && typeof found.basePrice === 'number') {
                      beanBasePrice = found.basePrice;
                    }
                  }
                } catch {
                  // ignore
                }
              }
              if (beanBasePrice === undefined) {
                const canonicalBean = ROASTERY_BEANS.find((b) => b.id === sub.beanId);
                if (canonicalBean) {
                  beanBasePrice = canonicalBean.basePrice;
                }
              }

              let baseRaw: number;
              if (beanBasePrice !== undefined) {
                baseRaw = beanBasePrice * bagSize.multiplier;
              } else {
                const oldFreq = SUBSCRIPTION_FREQUENCIES.find((f) => f.id === sub.frequencyId);
                const oldDiscount = oldFreq ? oldFreq.discountPct / 100 : 0;
                baseRaw = oldDiscount < 1 && oldDiscount > 0 ? sub.unitPrice / (1 - oldDiscount) : sub.unitPrice;
              }

              const discountedPrice = Number((baseRaw * (1 - freq.discountPct / 100)).toFixed(2));

              // Do not calculate imminent dispatch date on paused subscriptions
              const nextDispatchDate =
                sub.status === 'paused'
                  ? sub.nextDispatchDate
                  : calculateNextDispatch(freq?.days ?? 14);

              return {
                ...sub,
                frequencyId: freq.id,
                frequencyName: freq.name,
                unitPrice: discountedPrice,
                nextDispatchDate,
                basePrice: beanBasePrice ?? sub.basePrice,
              };
            }
            return sub;
          })
        : []
    );
  }, []);

  const updateGrind = useCallback((id: string, newGrindId: string) => {
    const grind = GRIND_PROFILES.find((g) => g.id === newGrindId);
    if (!grind) return;
    setSubscriptions((prev) =>
      Array.isArray(prev) ? prev.map((sub) => (sub.id === id ? { ...sub, grindId: grind.id, grindName: grind.name } : sub)) : []
    );
  }, []);

  const activeSubscriptionCount = useMemo(() => {
    return Array.isArray(subscriptions) ? subscriptions.filter((s) => s?.status === 'active').length : 0;
  }, [subscriptions]);

  const value = useMemo(
    () => ({
      subscriptions: Array.isArray(subscriptions) ? subscriptions : [],
      activeSubscriptionCount,
      isSubscribeModalOpen,
      setIsSubscribeModalOpen,
      selectedBean,
      setSelectedBean,
      initialFrequency,
      isManageDrawerOpen,
      setIsManageDrawerOpen,
      openSubscriptionModalFor,
      addSubscription,
      pauseSubscription,
      resumeSubscription,
      cancelSubscription,
      restoreSubscription,
      updateFrequency,
      updateGrind,
    }),
    [
      subscriptions,
      activeSubscriptionCount,
      isSubscribeModalOpen,
      selectedBean,
      initialFrequency,
      isManageDrawerOpen,
      openSubscriptionModalFor,
      addSubscription,
      pauseSubscription,
      resumeSubscription,
      cancelSubscription,
      restoreSubscription,
      updateFrequency,
      updateGrind,
    ]
  );

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
