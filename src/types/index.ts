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

export interface CartProduct extends MenuItem {
  isSubscription?: boolean;
  subscriptionMeta?: Record<string, unknown> | null;
  beanMeta?: Record<string, unknown> | null;
}

export type OrderStatus = 'received' | 'brewing' | 'ready' | 'completed';
