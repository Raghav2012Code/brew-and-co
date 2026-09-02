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
}

interface SubscriptionContextType {
  subscriptions: ActiveSubscription[];
  activeSubscriptionCount: number;
  isSubscribeModalOpen: boolean;
  setIsSubscribeModalOpen: (open: boolean) => void;
  selectedBean: any | null;
  setSelectedBean: (bean: any | null) => void;
  isManageDrawerOpen: boolean;
  setIsManageDrawerOpen: (open: boolean) => void;
  openSubscriptionModalFor: (bean: any) => void;
  addSubscription: (sub: Omit<ActiveSubscription, 'id' | 'createdAt' | 'nextDispatchDate' | 'totalDeliveredCount' | 'status'>) => ActiveSubscription;
  pauseSubscription: (id: string) => void;
  resumeSubscription: (id: string) => void;
  cancelSubscription: (id: string) => void;
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
  },
];

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subscriptions, setSubscriptions] = useState<ActiveSubscription[]>(() => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return DEFAULT_SAMPLE_SUBSCRIPTIONS;
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
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
  const [isManageDrawerOpen, setIsManageDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.isArray(subscriptions) ? subscriptions : []));
    } catch (e) {
      console.error('Error saving subscriptions:', e);
    }
  }, [subscriptions]);

  const openSubscriptionModalFor = useCallback((bean: any) => {
    setSelectedBean(bean);
    setIsSubscribeModalOpen(true);
  }, []);

  const addSubscription = useCallback((subData: Omit<ActiveSubscription, 'id' | 'createdAt' | 'nextDispatchDate' | 'totalDeliveredCount' | 'status'>) => {
    const freq = SUBSCRIPTION_FREQUENCIES.find((f) => f.id === subData.frequencyId) || SUBSCRIPTION_FREQUENCIES[1];
    const newSub: ActiveSubscription = {
      ...subData,
      id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      nextDispatchDate: calculateNextDispatch(freq.days || 14),
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

  const resumeSubscription = useCallback((id: string) => {
    setSubscriptions((prev) =>
      Array.isArray(prev)
        ? prev.map((sub) =>
            sub.id === id ? { ...sub, status: 'active', nextDispatchDate: calculateNextDispatch(7) } : sub
          )
        : []
    );
  }, []);

  const cancelSubscription = useCallback((id: string) => {
    setSubscriptions((prev) => (Array.isArray(prev) ? prev.filter((sub) => sub.id !== id) : []));
  }, []);

  const updateFrequency = useCallback((id: string, newFreqId: string) => {
    const freq = SUBSCRIPTION_FREQUENCIES.find((f) => f.id === newFreqId);
    if (!freq) return;
    setSubscriptions((prev) =>
      Array.isArray(prev)
        ? prev.map((sub) => {
            if (sub.id === id) {
              const bean = ROASTERY_BEANS.find((b) => b.id === sub.beanId);
              const bagSize = BAG_SIZES.find((s) => s.id === sub.bagSizeId) || BAG_SIZES[0];
              const baseRaw = (bean?.basePrice || 20) * bagSize.multiplier;
              const discountedPrice = Number((baseRaw * (1 - freq.discountPct / 100)).toFixed(2));
              return {
                ...sub,
                frequencyId: freq.id,
                frequencyName: freq.name,
                unitPrice: discountedPrice,
                nextDispatchDate: calculateNextDispatch(freq.days || 14),
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
      isManageDrawerOpen,
      setIsManageDrawerOpen,
      openSubscriptionModalFor,
      addSubscription,
      pauseSubscription,
      resumeSubscription,
      cancelSubscription,
      updateFrequency,
      updateGrind,
    }),
    [
      subscriptions,
      activeSubscriptionCount,
      isSubscribeModalOpen,
      selectedBean,
      isManageDrawerOpen,
      openSubscriptionModalFor,
      addSubscription,
      pauseSubscription,
      resumeSubscription,
      cancelSubscription,
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
