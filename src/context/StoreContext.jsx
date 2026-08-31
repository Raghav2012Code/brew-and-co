import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { STORE_HOURS } from '../data/menuData';

const StoreContext = createContext(null);

// Lazy confetti loader for bundle size optimization
const triggerConfetti = async (opts) => {
  try {
    const confettiModule = await import('canvas-confetti');
    const confetti = confettiModule.default || confettiModule;
    confetti(opts);
  } catch (e) {
    console.error('Failed to load confetti:', e);
  }
};

export const StoreProvider = ({ children }) => {
  // Cart State with LocalStorage
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('brew_co_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Customizer Modal State
  const [customizerItem, setCustomizerItem] = useState(null);

  // Loyalty Program State (6 stamps)
  const [loyaltyStamps, setLoyaltyStamps] = useState(() => {
    try {
      const saved = localStorage.getItem('brew_co_loyalty');
      return saved !== null ? parseInt(saved, 10) : 3;
    } catch {
      return 3;
    }
  });

  const [freeDrinksAvailable, setFreeDrinksAvailable] = useState(() => {
    try {
      const saved = localStorage.getItem('brew_co_free_drinks');
      return saved !== null ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  // Active Order / Success Modal State
  const [activeOrder, setActiveOrder] = useState(null);
  const [isLoyaltyModalOpen, setIsLoyaltyModalOpen] = useState(false);

  // Favorites
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('brew_co_favorites');
      return saved ? JSON.parse(saved) : ['smoked-amber-cortado', 'nitro-cascade-cold-brew'];
    } catch {
      return ['smoked-amber-cortado', 'nitro-cascade-cold-brew'];
    }
  });

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('brew_co_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('brew_co_loyalty', loyaltyStamps.toString());
      localStorage.setItem('brew_co_free_drinks', freeDrinksAvailable.toString());
    } catch (e) {
      console.error(e);
    }
  }, [loyaltyStamps, freeDrinksAvailable]);

  useEffect(() => {
    try {
      localStorage.setItem('brew_co_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error(e);
    }
  }, [favorites]);

  // Lock background scroll when any modal or drawer is active
  const isAnyModalOpen = isCartOpen || !!customizerItem || isLoyaltyModalOpen || !!activeOrder;
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

  // Global Escape key listener to close topmost active modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (customizerItem) {
          setCustomizerItem(null);
        } else if (activeOrder) {
          setActiveOrder(null);
        } else if (isLoyaltyModalOpen) {
          setIsLoyaltyModalOpen(false);
        } else if (isCartOpen) {
          setIsCartOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [customizerItem, activeOrder, isLoyaltyModalOpen, isCartOpen]);

  // Theme State ('system' | 'light' | 'dark')
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('brew_co_theme');
      return saved || 'system';
    } catch {
      return 'system';
    }
  });

  const [systemIsDark, setSystemIsDark] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Effective Theme Calculation
  const effectiveTheme = theme === 'system' ? (systemIsDark ? 'dark' : 'light') : theme;

  // Listen to system color scheme changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => setSystemIsDark(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Sync dark class on document element
  useEffect(() => {
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
    // Immediate synchronous DOM mutation for instant visual reaction
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

  const [storeStatus, setStoreStatus] = useState({
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
        const todayHours = STORE_HOURS[dayName] || STORE_HOURS.monday;

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
        setStoreStatus({
          isOpen: true,
          statusText: 'Open Today • 7:00 AM – 6:00 PM',
          closesAt: '6:00 PM',
          isClosingSoon: false,
        });
      }
    };

    calculateStatus();
    const interval = setInterval(calculateStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  // Stable Cart operations (using functional setState & useCallback)
  const addToCart = useCallback((product, options = {}) => {
    const sizeDelta = options.size?.priceDelta || 0;
    const milkDelta = options.milk?.priceDelta || 0;
    const shotDelta = options.shot?.priceDelta || 0;
    const syrupDelta = options.syrup?.priceDelta || 0;
    const unitPrice = Number((product.price + sizeDelta + milkDelta + shotDelta + syrupDelta).toFixed(2));

    const cartItem = {
      id: `${product.id}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      productId: product.id,
      name: product.name,
      category: product.category,
      basePrice: product.price,
      unitPrice,
      quantity: options.quantity || 1,
      image: product.image,
      options: {
        size: options.size || { id: 'standard', name: 'Standard' },
        temp: options.temp || product.defaultTemp || 'hot',
        milk: options.milk || null,
        shot: options.shot || null,
        syrup: options.syrup || null,
        sweetness: options.sweetness || null,
        specialNotes: options.specialNotes || '',
      },
    };

    setCart((prev) => [...prev, cartItem]);
    setIsCartOpen(true);
  }, []);

  const removeFromCart = useCallback((cartItemId) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  }, []);

  const updateQuantity = useCallback((cartItemId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleFavorite = useCallback((productId) => {
    setFavorites((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  }, []);

  // Place simulated order
  const placeOrder = useCallback(({ pickupName, tipPercent, tipAmount, appliedFreeDrink }) => {
    const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const discount = appliedFreeDrink ? (cart[0]?.unitPrice || 5.50) : 0;
    const finalSubtotal = Math.max(0, subtotal - discount);
    const tax = Number((finalSubtotal * 0.0825).toFixed(2));
    const total = Number((finalSubtotal + tax + tipAmount).toFixed(2));

    const orderNumber = `BC-${Math.floor(1000 + Math.random() * 9000)}`;
    const prepMinutes = Math.floor(7 + Math.random() * 6);

    const orderData = {
      orderId: orderNumber,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      pickupName: pickupName || 'Guest',
      items: [...cart],
      subtotal,
      discount,
      tax,
      tipAmount,
      total,
      prepMinutes,
      qrToken: `BREWCO:${orderNumber}:${Date.now()}`,
    };

    // Increment stamp card
    let newStamps = loyaltyStamps + cart.reduce((count, item) => count + item.quantity, 0);
    let newFreeDrinks = freeDrinksAvailable;

    if (appliedFreeDrink && newFreeDrinks > 0) {
      newFreeDrinks -= 1;
    }

    while (newStamps >= 6) {
      newStamps -= 6;
      newFreeDrinks += 1;
      triggerConfetti({
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

    triggerConfetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#C84B31', '#FBF9F5', '#E5A93C'],
    });
  }, [cart, loyaltyStamps, freeDrinksAvailable, clearCart]);

  // Derived state memoization
  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const cartSubtotal = useMemo(() => cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0), [cart]);

  // Context value memoization
  const contextValue = useMemo(() => ({
    cart,
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
    loyaltyStamps,
    setLoyaltyStamps,
    freeDrinksAvailable,
    setFreeDrinksAvailable,
    isLoyaltyModalOpen,
    setIsLoyaltyModalOpen,
    activeOrder,
    setActiveOrder,
    placeOrder,
    favorites,
    toggleFavorite,
    storeStatus,
    theme,
    effectiveTheme,
    setTheme,
    toggleTheme,
  }), [
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
    activeOrder,
    placeOrder,
    favorites,
    toggleFavorite,
    storeStatus,
    theme,
    effectiveTheme,
    toggleTheme,
  ]);

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
