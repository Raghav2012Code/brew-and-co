export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  roastOrigin?: string;
  image: string;
  tastingNotes?: string[];
  tags?: string[];
  isPopular?: boolean;
  customizable?: boolean;
  availableSizes?: string[];
  defaultTemp?: string;
  calories?: number;
}

export interface RoasteryBean {
  id: string;
  name: string;
  origin: string;
  roastLevel: 'Light' | 'Medium-Light' | 'Medium' | 'Medium-Dark' | string;
  basePrice: number;
  cuppingScore: number;
  image: string;
  badge?: string;
  description: string;
  process?: string;
  elevation?: string;
  tastingNotes?: string[];
  isDirectTrade?: boolean;
}

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

/**
 * Unified CartItem and CartProduct
 */
export type CartProduct = CartItem;

export type OrderStatus = 'received' | 'brewing' | 'ready' | 'completed';
