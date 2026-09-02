import React, { useState, useMemo, useCallback } from 'react';
import { Trash2, Plus, Minus, ShoppingBag, Sparkles, Zap } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useSubscription } from '../context/SubscriptionContext';
import { formatPrice } from '@/lib/format';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    placeOrder,
    freeDrinksAvailable,
  } = useStore();

  const { addSubscription } = useSubscription();

  const [pickupName, setPickupName] = useState('');
  const [tipPercent, setTipPercent] = useState(15);
  const [applyFreeDrink, setApplyFreeDrink] = useState(false);

  const rawSubtotal = useMemo(() => (cart || []).reduce((sum: number, item: any) => sum + (item?.unitPrice || 0) * (item?.quantity || 1), 0), [cart]);

  const discountAmount = useMemo(() => {
    if (!applyFreeDrink || (freeDrinksAvailable || 0) <= 0 || (cart?.length || 0) === 0) return 0;
    const eligible = (cart as any[]).filter((i) => !i.isSubscription && !i.subscriptionMeta);
    const pool = eligible.length > 0 ? eligible : (cart as any[]);
    return Math.min(...pool.map((i) => i?.unitPrice || 0));
  }, [applyFreeDrink, freeDrinksAvailable, cart]);

  const subtotal = useMemo(() => Math.max(0, rawSubtotal - discountAmount), [rawSubtotal, discountAmount]);
  const tax = useMemo(() => Number((subtotal * 0.0825).toFixed(2)), [subtotal]);
  const calculatedTip = useMemo(() => Number(((subtotal * tipPercent) / 100).toFixed(2)), [subtotal, tipPercent]);
  const total = useMemo(() => Number((subtotal + tax + calculatedTip).toFixed(2)), [subtotal, tax, calculatedTip]);

  const hasSubscriptions = useMemo(() => cart.some((item: any) => item.isSubscription || item.subscriptionMeta), [cart]);

  const handleCheckout = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    // If order contains coffee subscriptions, register them to active subscriptions
    let registeredCount = 0;
    cart.forEach((item: any) => {
      if (item.isSubscription && item.subscriptionMeta) {
        addSubscription({
          beanId: item.subscriptionMeta.beanId,
          beanName: item.name,
          image: item.image,
          roastLevel: item.subscriptionMeta.roastLevel || 'Micro-Lot',
          origin: item.subscriptionMeta.origin || 'Single Origin',
          grindId: item.subscriptionMeta.grindId,
          grindName: item.subscriptionMeta.grindName,
          bagSizeId: item.subscriptionMeta.bagSizeId,
          bagSizeName: item.subscriptionMeta.bagSizeName,
          frequencyId: item.subscriptionMeta.frequencyId,
          frequencyName: item.subscriptionMeta.frequencyName,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
        });
        registeredCount += 1;
      }
    });

    placeOrder({
      pickupName: pickupName.trim() || 'Counter Guest',
      tipPercent,
      tipAmount: calculatedTip,
      appliedFreeDrink: applyFreeDrink && freeDrinksAvailable > 0,
    });

    if (registeredCount > 0) {
      toast.success(`Order placed & ${registeredCount} Subscription${registeredCount > 1 ? 's' : ''} Activated!`, {
        description: `Your recurring dispatch is scheduled. Manage your plan anytime in the Subscription Vault.`,
      });
    } else {
      toast.success('Order placed successfully!', {
        description: `Preparing your coffee for ${pickupName.trim() || 'Counter Guest'}.`,
      });
    }
  }, [cart, addSubscription, placeOrder, pickupName, tipPercent, calculatedTip, applyFreeDrink, freeDrinksAvailable]);

  const handleRemove = useCallback((id: string, name: string) => {
    removeFromCart(id);
    toast.info(`Removed ${name} from bag.`);
  }, [removeFromCart]);

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 bg-paper dark:bg-dark-subtle border-l border-hairline dark:border-dark-hairline flex flex-col justify-between"
      >
        {/* Header */}
        <SheetHeader className="p-4 sm:p-6 bg-paper-dim dark:bg-dark-card border-b border-hairline dark:border-dark-hairline flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-vermillion dark:text-dark-vermillion" aria-hidden="true" />
            <SheetTitle className="font-serif font-bold text-lg sm:text-xl text-ink dark:text-dark-text-main">
              Your Bag
            </SheetTitle>
          </div>
          {hasSubscriptions && (
            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider text-vermillion dark:text-dark-vermillion bg-vermillion/10 dark:bg-dark-vermillion/20 px-2 py-0.5 border border-vermillion/30 dark:border-dark-vermillion/30">
              <Zap className="w-3 h-3 fill-current" />
              Includes Sub
            </span>
          )}
        </SheetHeader>

        {/* Drawer Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 text-sm text-ink dark:text-dark-text-main scroll-smooth">
          {cart.length === 0 ? (
            <div className="py-16 sm:py-20 text-center space-y-3">
              <ShoppingBag className="w-10 h-10 mx-auto text-ink-muted dark:text-dark-text-muted stroke-[1.5]" aria-hidden="true" />
              <h3 className="font-serif text-xl font-bold text-ink dark:text-dark-text-main">Your bag is empty</h3>
              <p className="text-xs text-ink-muted dark:text-dark-text-muted max-w-xs mx-auto">
                Add fresh coffee, pastries, or roastery bean subscriptions to start your order.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setIsCartOpen(false)}
                >
                  Browse Cafe Menu
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsCartOpen(false);
                    const el = document.getElementById('roastery');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Explore Roastery Beans
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCheckout} className="space-y-4 flex flex-col flex-1">
              {/* Item List */}
              <div className="space-y-3">
                {cart.map((item: any) => {
                  const isItemSub = item.isSubscription || !!item.subscriptionMeta;

                  return (
                    <div
                      key={item.id}
                      className={`p-3.5 sm:p-4 border space-y-2.5 ${
                        isItemSub
                          ? 'bg-paper-dim dark:bg-dark-card border-vermillion/40 dark:border-dark-vermillion/40 shadow-xs'
                          : 'bg-paper-dim dark:bg-dark-card border-hairline dark:border-dark-hairline'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 object-cover border border-hairline dark:border-dark-hairline shrink-0"
                          />
                          <div>
                            {isItemSub && (
                              <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold uppercase tracking-wider text-vermillion dark:text-dark-vermillion mb-0.5">
                                <Zap className="w-2.5 h-2.5 fill-current" />
                                Subscription • 15% Off
                              </span>
                            )}
                            <h4 className="font-serif font-bold text-base text-ink dark:text-dark-text-main leading-snug">
                              {item.name}
                            </h4>
                            <p className="text-xs font-mono font-semibold text-vermillion dark:text-dark-vermillion">
                              ${(item.unitPrice * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemove(item.id, item.name)}
                          aria-label={`Remove ${item.name} from bag`}
                          className="min-h-[36px] min-w-[36px] flex items-center justify-center text-ink-faint hover:text-vermillion dark:hover:text-dark-vermillion active:scale-90 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Customization Details */}
                      <div className="text-xs text-ink-muted dark:text-dark-text-muted space-y-0.5 bg-paper dark:bg-dark-canvas p-2.5 border border-hairline dark:border-dark-hairline">
                        {isItemSub ? (
                          <>
                            <div>
                              <span>Frequency: </span>
                              <strong className="text-vermillion dark:text-dark-vermillion font-mono text-[11px]">
                                {item.subscriptionMeta?.frequencyName || 'Recurring'}
                              </strong>
                            </div>
                            <div>
                              <span>Grind: </span>
                              <strong className="text-ink dark:text-dark-text-main font-mono text-[11px]">
                                {item.subscriptionMeta?.grindName || item.beanMeta?.grindName || 'Whole Bean'}
                              </strong>
                            </div>
                            <div>
                              <span>Size: </span>
                              <strong className="text-ink dark:text-dark-text-main font-mono text-[11px]">
                                {item.subscriptionMeta?.bagSizeName || item.options?.size?.name || 'Standard'}
                              </strong>
                            </div>
                          </>
                        ) : (
                          <>
                            <div>
                              <span>Size & Temp: </span>
                              <strong className="text-ink dark:text-dark-text-main font-mono text-[11px]">
                                {item.options?.size?.name || 'Standard'} • {item.options?.temp?.toUpperCase()}
                              </strong>
                            </div>
                            {item.options?.milk && (
                              <div>
                                <span>Milk: </span>
                                <strong className="text-ink dark:text-dark-text-main font-mono text-[11px]">{item.options.milk.name}</strong>
                              </div>
                            )}
                            {item.options?.shot && item.options.shot.id !== 'standard' && (
                              <div>
                                <span>Shots: </span>
                                <strong className="text-ink dark:text-dark-text-main font-mono text-[11px]">{item.options.shot.name}</strong>
                              </div>
                            )}
                            {item.options?.specialNotes && (
                              <div className="italic text-ink dark:text-dark-text-main pt-0.5 truncate">
                                Note: "{item.options.specialNotes}"
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      {/* Stepper with accessible touch targets */}
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs font-mono text-ink-muted dark:text-dark-text-muted">Qty:</span>
                        <div className="flex items-center border border-hairline dark:border-dark-hairline bg-paper dark:bg-dark-canvas">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, -1)}
                            aria-label="Decrease quantity"
                            className="min-h-[36px] min-w-[36px] flex items-center justify-center text-ink-muted hover:text-ink dark:hover:text-dark-text-main active:scale-90 transition-transform cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 font-mono font-bold text-xs text-ink dark:text-dark-text-main">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, 1)}
                            aria-label="Increase quantity"
                            className="min-h-[36px] min-w-[36px] flex items-center justify-center text-ink-muted hover:text-ink dark:hover:text-dark-text-main active:scale-90 transition-transform cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Free Drink Reward Toggle */}
              {freeDrinksAvailable > 0 && (
                <div className="p-3.5 bg-paper-dim dark:bg-dark-card border border-vermillion/40 dark:border-dark-vermillion/40 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-ink dark:text-dark-text-main flex items-center gap-1.5 font-mono">
                      <Sparkles className="w-3.5 h-3.5 text-vermillion dark:text-dark-vermillion" aria-hidden="true" />
                      Free Drink Reward Available
                    </p>
                    <p className="text-[11px] text-ink-muted dark:text-dark-text-muted">
                      Redeem a free drink on this order
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant={applyFreeDrink ? 'destructive' : 'default'}
                    onClick={() => setApplyFreeDrink(!applyFreeDrink)}
                  >
                    {applyFreeDrink ? 'Applied' : 'Apply'}
                  </Button>
                </div>
              )}

              {/* Tip Selector */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs font-mono font-medium text-ink-muted dark:text-dark-text-muted">
                  <span>Add Tip:</span>
                  <span className="font-semibold text-ink dark:text-dark-text-main">${calculatedTip.toFixed(2)}</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[10, 15, 20, 0].map((pct) => {
                    const isSelected = tipPercent === pct;
                    return (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => {
                          setTipPercent(pct);
                        }}
                        className={`min-h-[38px] py-2 border text-xs font-mono font-semibold active:scale-95 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-ink dark:border-dark-text-main bg-ink dark:bg-dark-text-main text-paper dark:text-dark-canvas shadow-sm'
                            : 'border-hairline dark:border-dark-hairline bg-paper-dim dark:bg-dark-card text-ink dark:text-dark-text-main hover:border-ink dark:hover:border-dark-text-main'
                        }`}
                      >
                        {pct === 0 ? 'None' : `${pct}%`}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Pickup Name Input */}
              <div className="space-y-1.5 pt-2">
                <label htmlFor="pickup-guest-name" className="text-xs font-mono font-medium text-ink-muted dark:text-dark-text-muted block">
                  Name for Order / Delivery
                </label>
                <input
                  id="pickup-guest-name"
                  type="text"
                  required
                  value={pickupName}
                  onChange={(e) => setPickupName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full min-h-[42px] p-3 bg-paper-dim dark:bg-dark-card border border-hairline dark:border-dark-hairline text-ink dark:text-dark-text-main placeholder:text-ink-faint font-sans text-xs focus:outline-none focus:border-ink dark:focus:border-dark-text-main"
                />
              </div>

              {/* Drawer Footer & Checkout (With Safe Area Inset) */}
              <div className="p-4 sm:p-6 bg-paper-dim dark:bg-dark-card border-t border-hairline dark:border-dark-hairline space-y-3.5 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
                <div className="space-y-1.5 text-xs text-ink-muted dark:text-dark-text-muted font-mono">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-medium text-ink dark:text-dark-text-main">{formatPrice(rawSubtotal)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-vermillion dark:text-dark-vermillion font-semibold">
                      <span>Free Drink Reward:</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Tax (8.25%):</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tip:</span>
                    <span>{formatPrice(calculatedTip)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-ink dark:text-dark-text-main pt-2 border-t border-hairline dark:border-dark-hairline font-sans">
                    <span>Total:</span>
                    <span className="text-vermillion dark:text-dark-vermillion font-mono">{formatPrice(total)}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="editorial"
                  size="lg"
                  className="w-full justify-between"
                >
                  <span>{hasSubscriptions ? 'Place Order & Start Subscription' : 'Place Pickup Order'}</span>
                  <span className="font-bold">{formatPrice(total)}</span>
                </Button>
              </div>
            </form>
          )}
        </div>

      </SheetContent>
    </Sheet>
  );
};
