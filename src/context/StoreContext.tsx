import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { STORE_HOURS } from '../data/menuData';

// ----- Types -----

export interface CartItemOptions {
  size?: { id?: string; name: string; priceDelta?: number } | null;
  temp?: string | null;
  milk?: { name: string; priceDelta?: number } | null;
  shot?: { id?: string; name: string; priceDelta?: number } | null;
  syrup?: { name: string; priceDelta?: number } | null;
  sweetness?: string | null;
  specialNotes?: string;
}

export interface CartItem {
  id: string;
  productId?: string;
  name: string;
  category?: string;
  basePrice?: number;
  unitPrice: number;
  quantity: number;
  image: string;
  isSubscription?: boolean;
  subscriptionMeta?: Record<string, unknown> | null;
  beanMeta?: Record<string, unknown> | null;
  options?: CartItemOptions;
}

export interface LiveOrder {
  orderId: string;
  timestamp: string;
  date?: string;
  pickupName: string;
  status: string;
  items: CartItem[];
  total: number;
  elapsedMinutes?: number;
  subtotal?: number;
  discount?: number;
  tax?: number;
  tipAmount?: number;
  prepMinutes?: number;
  qrToken?: string;
}

export interface StoreStatus {
  isOpen: boolean;
  statusText: string;
  closesAt: string;
  isClosingSoon: boolean;
}

export interface PlaceOrderParams {
  pickupName: string;
  tipPercent?: number;
  tipAmount?: number;
  appliedFreeDrink?: boolean;
  tip?: number;
}

export interface StoreContextType {
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
  customizerItem: any | null;
  setCustomizerItem: React.Dispatch<React.SetStateAction<any | null>>;
  addToCart: (product: any, options?: any) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  loyaltyStamps: number;
  setLoyaltyStamps: React.Dispatch<React.SetStateAction<number>>;
  freeDrinksAvailable: number;
  setFreeDrinksAvailable: React.Dispatch<React.SetStateAction<number>>;
  isLoyaltyModalOpen: boolean;
  setIsLoyaltyModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isBaristaModalOpen: boolean;
  setIsBaristaModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isMatchmakerOpen: boolean;
  setIsMatchmakerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isRoasteryStudioOpen: boolean;
  setIsRoasteryStudioOpen: React.Dispatch<React.SetStateAction<boolean>>;
  activeOrder: LiveOrder | null;
  setActiveOrder: React.Dispatch<React.SetStateAction<LiveOrder | null>>;
  liveOrders: LiveOrder[];
  activeOrdersCount: number;
  updateOrderStatus: (orderId: string, nextStatus: string) => void;
  clearCompletedOrders: () => void;
  placeOrder: (params: PlaceOrderParams) => void;
  favorites: string[];
  toggleFavorite: (productId: string) => void;
  storeStatus: StoreStatus;
  theme: string;
  effectiveTheme: string;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
  toggleTheme: () => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

// Lazy confetti loader for bundle size optimization
const triggerConfetti = async (opts: unknown) => {
  try {
    // @ts-ignore - canvas-confetti has no types bundled
    const confettiModule = await import('canvas-confetti');
    const confetti = (confettiModule as unknown as { default: (o: unknown) => void }).default || (confettiModule as unknown as (o: unknown) => void);
    (confetti as (o: unknown) => void)(opts);
  } catch (e) {
    console.error('Failed to load confetti:', e);
  }
};

// Web Audio API pure synth chime for Barista KDS alerts
export const playBaristaChime = (type: string = 'new-order') => {
  try {
    if (typeof window === 'undefined') return;
    const AudioContextClass: typeof AudioContext | undefined = (window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext }).AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (type === 'new-order') {
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc1.frequency.setValueAtTime(880, ctx.currentTime + 0.12); // A5
      gain1.gain.setValueAtTime(0.15, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.5);
    } else if (type === 'ready') {
      [659.25, 830.61, 987.77].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);
        gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.1 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.1);
        osc.stop(ctx.currentTime + idx * 0.1 + 0.35);
      });
    }
  } catch (e) {
    console.warn('Audio chime skipped (user gesture required or unsupported):', e);
  }
};

const DEFAULT_SEED_ORDERS: LiveOrder[] = [
  {
    orderId: 'BC-1042',
    timestamp: '10:14 AM',
    date: 'Today',
    pickupName: 'Elena Rostova',
    status: 'brewing',
    items: [
      {
        id: 'item-seed-1',
        name: 'Smoked Amber Cortado',
        unitPrice: 5.50,
        quantity: 1,
        image: '/images/flat-white.jpg',
        options: { size: { name: '4oz' }, temp: 'HOT', milk: { name: 'Oat Milk (Oatly)' }, specialNotes: 'Extra hot microfoam' },
      },
      {
        id: 'item-seed-2',
        name: 'Cardamom Morning Bun',
        unitPrice: 4.75,
        quantity: 1,
        image: '/images/flat-white.jpg',
        options: { size: { name: '1 Pastry' }, temp: 'WARM' },
      },
    ],
    total: 11.25,
    elapsedMinutes: 4,
  },
  {
    orderId: 'BC-1043',
    timestamp: '10:18 AM',
    date: 'Today',
    pickupName: 'Marcus Vance',
    status: 'received',
    items: [
      {
        id: 'item-seed-3',
        name: 'Ethiopia Guji (Pour Over)',
        unitPrice: 7.00,
        quantity: 2,
        image: '/images/flat-white.jpg',
        options: { size: { name: '10oz Carafe' }, temp: 'HOT', specialNotes: 'V60 1:16 ratio' },
      },
    ],
    total: 15.15,
    elapsedMinutes: 1,
  },
];

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Cart State with LocalStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('brew_co_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed as CartItem[];
      }
    } catch {
      // ignore
    }
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [customizerItem, setCustomizerItem] = useState<any | null>(null);

  const [loyaltyStamps, setLoyaltyStamps] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('brew_co_loyalty');
      if (saved !== null) {
        const num = parseInt(saved, 10);
        if (!isNaN(num)) return num;
      }
    } catch {
      // ignore
    }
    return 3;
  });

  const [freeDrinksAvailable, setFreeDrinksAvailable] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('brew_co_free_drinks');
      if (saved !== null) {
        const num = parseInt(saved, 10);
        if (!isNaN(num)) return num;
      }
    } catch {
      // ignore
    }
    return 0;
  });

  const [activeOrder, setActiveOrder] = useState<LiveOrder | null>(null);
  const [isLoyaltyModalOpen, setIsLoyaltyModalOpen] = useState<boolean>(false);
  const [isBaristaModalOpen, setIsBaristaModalOpen] = useState<boolean>(false);
  const [isMatchmakerOpen, setIsMatchmakerOpen] = useState<boolean>(false);
  const [isRoasteryStudioOpen, setIsRoasteryStudioOpen] = useState<boolean>(false);

  const [liveOrders, setLiveOrders] = useState<LiveOrder[]>(() => {
    try {
      const saved = localStorage.getItem('brew_co_live_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed as LiveOrder[];
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_SEED_ORDERS;
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('brew_co_favorites');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed as string[];
      }
    } catch {
      // ignore
    }
    return ['smoked-amber-cortado', 'nitro-cascade-cold-brew'];
  });

  // Sync to LocalStorage safely
  useEffect(() => {
    try {
      localStorage.setItem('brew_co_cart', JSON.stringify(Array.isArray(cart) ? cart : []));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('brew_co_live_orders', JSON.stringify(Array.isArray(liveOrders) ? liveOrders : []));
    } catch (e) {
      console.error(e);
    }
  }, [liveOrders]);

  useEffect(() => {
    try {
      localStorage.setItem('brew_co_loyalty', (loyaltyStamps || 0).toString());
      localStorage.setItem('brew_co_free_drinks', (freeDrinksAvailable || 0).toString());
    } catch (e) {
      console.error(e);
    }
  }, [loyaltyStamps, freeDrinksAvailable]);

  useEffect(() => {
    try {
      localStorage.setItem('brew_co_favorites', JSON.stringify(Array.isArray(favorites) ? favorites : []));
    } catch (e) {
      console.error(e);
    }
  }, [favorites]);

  const isAnyModalOpen =
    isCartOpen ||
    !!customizerItem ||
    isLoyaltyModalOpen ||
    !!activeOrder ||
    isBaristaModalOpen ||
    isMatchmakerOpen ||
    isRoasteryStudioOpen;

  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (isAnyModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isAnyModalOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (customizerItem) {
          setCustomizerItem(null);
        } else if (activeOrder) {
          setActiveOrder(null);
        } else if (isLoyaltyModalOpen) {
          setIsLoyaltyModalOpen(false);
        } else if (isCartOpen) {
          setIsCartOpen(false);
        } else if (isBaristaModalOpen) {
          setIsBaristaModalOpen(false);
        } else if (isMatchmakerOpen) {
          setIsMatchmakerOpen(false);
        } else if (isRoasteryStudioOpen) {
          setIsRoasteryStudioOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    customizerItem,
    activeOrder,
    isLoyaltyModalOpen,
    isCartOpen,
    isBaristaModalOpen,
    isMatchmakerOpen,
    isRoasteryStudioOpen,
  ]);

  const [theme, setTheme] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('brew_co_theme');
      return saved === 'light' || saved === 'dark' || saved === 'system' ? saved : 'system';
    } catch {
      return 'system';
    }
  });

  const [systemIsDark, setSystemIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const effectiveTheme = theme === 'system' ? (systemIsDark ? 'dark' : 'light') : theme;

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => setSystemIsDark(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    if (effectiveTheme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }

    try {
      localStorage.setItem('brew_co_theme', theme);
    } catch (e) {
      console.error(e);
    }
  }, [theme, effectiveTheme]);

  const toggleTheme = useCallback(() => {
    const nextTheme = effectiveTheme === 'dark' ? 'light' : 'dark';
    const root = document.documentElement;
    if (nextTheme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
    setTheme(nextTheme);
    try {
      localStorage.setItem('brew_co_theme', nextTheme);
    } catch (e) {
      console.error(e);
    }
  }, [effectiveTheme]);

  const [storeStatus, setStoreStatus] = useState<StoreStatus>({
    isOpen: true,
    statusText: 'Open Today • 7:00 AM – 6:00 PM',
    closesAt: '6:00 PM',
    isClosingSoon: false,
  });

  useEffect(() => {
    const calculateStatus = () => {
      try {
        const now = new Date();
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const dayName = days[now.getDay()];
        const todayHours = (STORE_HOURS as Record<string, { open?: string; close?: string; label?: string }>)[dayName] || (STORE_HOURS as Record<string, unknown>).monday as { open?: string; close?: string; label?: string };

        if (!todayHours || !todayHours.open || !todayHours.close) {
          setStoreStatus({
            isOpen: true,
            statusText: 'Open Today • 7:00 AM – 6:00 PM',
            closesAt: '6:00 PM',
            isClosingSoon: false,
          });
          return;
        }

        const [openHour = 7, openMin = 0] = todayHours.open.split(':').map(Number);
        const [closeHour = 18, closeMin = 0] = todayHours.close.split(':').map(Number);

        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        const openMinutes = openHour * 60 + openMin;
        const closeMinutes = closeHour * 60 + closeMin;

        const labelParts = todayHours.label ? todayHours.label.split(/[–—-]/) : ['7:00 AM', '6:00 PM'];
        const closingTimeLabel = (labelParts[1] || '6:00 PM').trim();
        const openingTimeLabel = (labelParts[0] || '7:00 AM').trim();

        if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
          const remainingMinutes = closeMinutes - currentMinutes;
          if (remainingMinutes <= 45) {
            setStoreStatus({
              isOpen: true,
              statusText: `Closing in ${remainingMinutes}m`,
              closesAt: closingTimeLabel,
              isClosingSoon: true,
            });
          } else {
            setStoreStatus({
              isOpen: true,
              statusText: `Open until ${closingTimeLabel}`,
              closesAt: closingTimeLabel,
              isClosingSoon: false,
            });
          }
        } else {
          setStoreStatus({
            isOpen: false,
            statusText: `Closed • Opens at ${openingTimeLabel}`,
            closesAt: openingTimeLabel,
            isClosingSoon: false,
          });
        }
      } catch (err) {
        console.error('Error calculating store status:', err);
      }
    };

    calculateStatus();
    const interval = setInterval(calculateStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const addToCart = useCallback<StoreContextType['addToCart']>((product, options = {}) => {
    if (!product) return;
    const sizeDelta = (options.size as { priceDelta?: number } | undefined)?.priceDelta || 0;
    const milkDelta = (options.milk as { priceDelta?: number } | undefined)?.priceDelta || 0;
    const shotDelta = (options.shot as { priceDelta?: number } | undefined)?.priceDelta || 0;
    const syrupDelta = (options.syrup as { priceDelta?: number } | undefined)?.priceDelta || 0;
    const unitPrice = Number((((product.price as number) || 0) + sizeDelta + milkDelta + shotDelta + syrupDelta).toFixed(2));

    const cartItem: CartItem = {
      id: `${(product.id as string) || 'item'}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      productId: product.id as string | undefined,
      name: (product.name as string) || 'Coffee Item',
      category: (product.category as string) || 'all',
      basePrice: (product.price as number) || 0,
      unitPrice,
      quantity: (options.quantity as number) || 1,
      image: (product.image as string) || '/images/flat-white.jpg',
      isSubscription: (product.isSubscription as boolean) || false,
      subscriptionMeta: (product.subscriptionMeta as Record<string, unknown>) || null,
      beanMeta: (product.beanMeta as Record<string, unknown>) || null,
      options: {
        size: (options.size as CartItemOptions['size']) || { id: 'standard', name: 'Standard' },
        temp: (options.temp as string) || (product.defaultTemp as string) || 'hot',
        milk: (options.milk as CartItemOptions['milk']) || null,
        shot: (options.shot as CartItemOptions['shot']) || null,
        syrup: (options.syrup as CartItemOptions['syrup']) || null,
        sweetness: (options.sweetness as string) || null,
        specialNotes: (options.specialNotes as string) || '',
      },
    };

    setCart((prev) => (Array.isArray(prev) ? [...prev, cartItem] : [cartItem]));
    setIsCartOpen(true);
  }, []);

  const removeFromCart = useCallback((cartItemId: string) => {
    setCart((prev) => (Array.isArray(prev) ? prev.filter((item) => item?.id !== cartItemId) : []));
  }, []);

  const updateQuantity = useCallback((cartItemId: string, delta: number) => {
    setCart((prev) =>
      Array.isArray(prev)
        ? prev
            .map((item) => {
              if (item?.id === cartItemId) {
                const newQty = (item.quantity || 1) + delta;
                return newQty > 0 ? { ...item, quantity: newQty } : null;
              }
              return item;
            })
            .filter(Boolean) as CartItem[]
        : []
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleFavorite = useCallback((productId: string) => {
    setFavorites((prev) => {
      const arr = Array.isArray(prev) ? prev : [];
      return arr.includes(productId) ? arr.filter((id) => id !== productId) : [...arr, productId];
    });
  }, []);

  const updateOrderStatus = useCallback((orderId: string, nextStatus: string) => {
    setLiveOrders((prev) =>
      Array.isArray(prev)
        ? prev.map((order) => {
            if (order?.orderId === orderId) {
              if (nextStatus === 'ready') {
                playBaristaChime('ready');
              }
              return { ...order, status: nextStatus };
            }
            return order;
          })
        : []
    );
  }, []);

  const clearCompletedOrders = useCallback(() => {
    setLiveOrders((prev) => (Array.isArray(prev) ? prev.filter((o) => o?.status !== 'completed') : []));
  }, []);

  const placeOrder = useCallback(
    ({ pickupName, tipAmount = 0, appliedFreeDrink }: PlaceOrderParams) => {
      const safeCart = Array.isArray(cart) ? cart : [];
      const subtotal = safeCart.reduce((sum, item) => sum + (item?.unitPrice || 0) * (item?.quantity || 1), 0);
      const discount = appliedFreeDrink ? safeCart[0]?.unitPrice || 5.5 : 0;
      const finalSubtotal = Math.max(0, subtotal - discount);
      const tax = Number((finalSubtotal * 0.0825).toFixed(2));
      const total = Number((finalSubtotal + tax + tipAmount).toFixed(2));

      const orderNumber = `BC-${Math.floor(1000 + Math.random() * 9000)}`;
      const prepMinutes = Math.floor(7 + Math.random() * 6);

      const orderData: LiveOrder = {
        orderId: orderNumber,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        pickupName: pickupName || 'Counter Guest',
        items: [...safeCart],
        subtotal,
        discount,
        tax,
        tipAmount,
        total,
        prepMinutes,
        qrToken: `BREWCO:${orderNumber}:${Date.now()}`,
        status: 'received',
      };

      setLiveOrders((prev) => (Array.isArray(prev) ? [orderData, ...prev] : [orderData]));
      playBaristaChime('new-order');

      let newStamps = (loyaltyStamps || 0) + safeCart.reduce((count, item) => count + (item?.quantity || 1), 0);
      let newFreeDrinks = freeDrinksAvailable || 0;

      if (appliedFreeDrink && newFreeDrinks > 0) {
        newFreeDrinks -= 1;
      }

      while (newStamps >= 6) {
        newStamps -= 6;
        newFreeDrinks += 1;
        void triggerConfetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#C84B31', '#E5A93C', '#FBF9F5', '#1A1816'],
        });
      }

      setLoyaltyStamps(newStamps);
      setFreeDrinksAvailable(newFreeDrinks);
      setActiveOrder(orderData);
      clearCart();
      setIsCartOpen(false);

      void triggerConfetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#C84B31', '#FBF9F5', '#E5A93C'],
      });
    },
    [cart, loyaltyStamps, freeDrinksAvailable, clearCart]
  );

  const cartCount = useMemo(() => {
    return Array.isArray(cart) ? cart.reduce((sum, item) => sum + (item?.quantity || 0), 0) : 0;
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    return Array.isArray(cart) ? cart.reduce((sum, item) => sum + (item?.unitPrice || 0) * (item?.quantity || 0), 0) : 0;
  }, [cart]);

  const activeOrdersCount = useMemo(() => {
    return Array.isArray(liveOrders) ? liveOrders.filter((o) => o?.status !== 'completed').length : 0;
  }, [liveOrders]);

  const contextValue = useMemo<StoreContextType>(
    () => ({
      cart: Array.isArray(cart) ? cart : [],
      cartCount,
      cartSubtotal,
      isCartOpen,
      setIsCartOpen,
      customizerItem,
      setCustomizerItem,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      loyaltyStamps: loyaltyStamps || 0,
      setLoyaltyStamps,
      freeDrinksAvailable: freeDrinksAvailable || 0,
      setFreeDrinksAvailable,
      isLoyaltyModalOpen,
      setIsLoyaltyModalOpen,
      isBaristaModalOpen,
      setIsBaristaModalOpen,
      isMatchmakerOpen,
      setIsMatchmakerOpen,
      isRoasteryStudioOpen,
      setIsRoasteryStudioOpen,
      activeOrder,
      setActiveOrder,
      liveOrders: Array.isArray(liveOrders) ? liveOrders : [],
      activeOrdersCount,
      updateOrderStatus,
      clearCompletedOrders,
      placeOrder,
      favorites: Array.isArray(favorites) ? favorites : [],
      toggleFavorite,
      storeStatus,
      theme,
      effectiveTheme,
      setTheme,
      toggleTheme,
    }),
    [
      cart,
      cartCount,
      cartSubtotal,
      isCartOpen,
      customizerItem,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      loyaltyStamps,
      freeDrinksAvailable,
      isLoyaltyModalOpen,
      isBaristaModalOpen,
      isMatchmakerOpen,
      isRoasteryStudioOpen,
      activeOrder,
      liveOrders,
      activeOrdersCount,
      updateOrderStatus,
      clearCompletedOrders,
      placeOrder,
      favorites,
      toggleFavorite,
      storeStatus,
      theme,
      effectiveTheme,
      toggleTheme,
    ]
  );

  return <StoreContext.Provider value={contextValue}>{children}</StoreContext.Provider>;
};

export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
