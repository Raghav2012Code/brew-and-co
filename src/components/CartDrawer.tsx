import React, { useState } from 'react';
import { Trash2, Plus, Minus, ShoppingBag, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
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

  const [pickupName, setPickupName] = useState('');
  const [tipPercent, setTipPercent] = useState(15);
  const [customTip, setCustomTip] = useState('');
  const [applyFreeDrink, setApplyFreeDrink] = useState(false);

  const rawSubtotal = cart.reduce((sum: number, item: any) => sum + item.unitPrice * item.quantity, 0);
  
  const discountAmount = applyFreeDrink && freeDrinksAvailable > 0 && cart.length > 0
    ? (cart[0]?.unitPrice || 0)
    : 0;

  const subtotal = Math.max(0, rawSubtotal - discountAmount);
  const tax = Number((subtotal * 0.0825).toFixed(2));
  
  const calculatedTip = customTip !== '' 
    ? parseFloat(customTip) || 0 
    : Number(((subtotal * tipPercent) / 100).toFixed(2));
    
  const total = Number((subtotal + tax + calculatedTip).toFixed(2));

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    placeOrder({
      pickupName: pickupName.trim() || 'Counter Guest',
      tipPercent,
      tipAmount: calculatedTip,
      appliedFreeDrink: applyFreeDrink && freeDrinksAvailable > 0,
    });
    toast.success('Order placed successfully!', {
      description: `Preparing your coffee for ${pickupName.trim() || 'Counter Guest'}.`,
    });
  };

  const handleRemove = (id: string, name: string) => {
    removeFromCart(id);
    toast.info(`Removed ${name} from bag.`);
  };

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
        </SheetHeader>

        {/* Drawer Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 text-sm text-ink dark:text-dark-text-main scroll-smooth">
          {cart.length === 0 ? (
            <div className="py-16 sm:py-20 text-center space-y-3">
              <ShoppingBag className="w-10 h-10 mx-auto text-ink-muted dark:text-dark-text-muted stroke-[1.5]" aria-hidden="true" />
              <h3 className="font-serif text-xl font-bold text-ink dark:text-dark-text-main">Your bag is empty</h3>
              <p className="text-xs text-ink-muted dark:text-dark-text-muted max-w-xs mx-auto">
                Add coffee, tea, or pastries from our menu to start your order.
              </p>
              <Button
                variant="default"
                size="sm"
                onClick={() => setIsCartOpen(false)}
                className="mt-2"
              >
                Browse Menu
              </Button>
            </div>
          ) : (
            <>
              {/* Item List */}
              <div className="space-y-3">
                {cart.map((item: any) => (
                  <div
                    key={item.id}
                    className="p-3.5 sm:p-4 bg-paper-dim dark:bg-dark-card border border-hairline dark:border-dark-hairline space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover border border-hairline dark:border-dark-hairline shrink-0"
                        />
                        <div>
                          <h4 className="font-serif font-bold text-base text-ink dark:text-dark-text-main leading-snug">
                            {item.name}
                          </h4>
                          <p className="text-xs font-mono font-semibold text-vermillion dark:text-dark-vermillion">
                            ${(item.unitPrice * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemove(item.id, item.name)}
                        aria-label={`Remove ${item.name} from bag`}
                        className="min-h-[36px] min-w-[36px] flex items-center justify-center text-ink-faint hover:text-vermillion dark:hover:text-dark-vermillion active:scale-90 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Customization Details */}
                    <div className="text-xs text-ink-muted dark:text-dark-text-muted space-y-0.5 bg-paper dark:bg-dark-canvas p-2.5 border border-hairline dark:border-dark-hairline">
                      <div>
                        <span>Size & Temp: </span>
                        <strong className="text-ink dark:text-dark-text-main font-mono text-[11px]">{item.options.size?.name || 'Standard'} • {item.options.temp.toUpperCase()}</strong>
                      </div>
                      {item.options.milk && (
                        <div>
                          <span>Milk: </span>
                          <strong className="text-ink dark:text-dark-text-main font-mono text-[11px]">{item.options.milk.name}</strong>
                        </div>
                      )}
                      {item.options.shot && item.options.shot.id !== 'standard' && (
                        <div>
                          <span>Shots: </span>
                          <strong className="text-ink dark:text-dark-text-main font-mono text-[11px]">{item.options.shot.name}</strong>
                        </div>
                      )}
                      {item.options.specialNotes && (
                        <div className="italic text-ink dark:text-dark-text-main pt-0.5 truncate">
                          Note: "{item.options.specialNotes}"
                        </div>
                      )}
                    </div>

                    {/* Stepper with accessible touch targets */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs font-mono text-ink-muted dark:text-dark-text-muted">Qty:</span>
                      <div className="flex items-center border border-hairline dark:border-dark-hairline bg-paper dark:bg-dark-canvas">
                        <button
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
                          onClick={() => updateQuantity(item.id, 1)}
                          aria-label="Increase quantity"
                          className="min-h-[36px] min-w-[36px] flex items-center justify-center text-ink-muted hover:text-ink dark:hover:text-dark-text-main active:scale-90 transition-transform cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
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
                    const isSelected = tipPercent === pct && customTip === '';
                    return (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => {
                          setTipPercent(pct);
                          setCustomTip('');
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
                  Name for Order
                </label>
                <input
                  id="pickup-guest-name"
                  type="text"
                  required
                  value={pickupName}
                  onChange={(e) => setPickupName(e.target.value)}
                  placeholder="Your name"
                  className="w-full min-h-[42px] p-3 bg-paper-dim dark:bg-dark-card border border-hairline dark:border-dark-hairline text-ink dark:text-dark-text-main placeholder:text-ink-faint font-sans text-xs focus:outline-none focus:border-ink dark:focus:border-dark-text-main"
                />
              </div>
            </>
          )}
        </div>

        {/* Drawer Footer & Checkout (With Safe Area Inset) */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-6 bg-paper-dim dark:bg-dark-card border-t border-hairline dark:border-dark-hairline space-y-3.5 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
            <div className="space-y-1.5 text-xs text-ink-muted dark:text-dark-text-muted font-mono">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-medium text-ink dark:text-dark-text-main">${rawSubtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-vermillion dark:text-dark-vermillion font-semibold">
                  <span>Free Drink Reward:</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Tax (8.25%):</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tip:</span>
                <span>${calculatedTip.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-ink dark:text-dark-text-main pt-2 border-t border-hairline dark:border-dark-hairline font-sans">
                <span>Total:</span>
                <span className="text-vermillion dark:text-dark-vermillion font-mono">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <Button
              onClick={handleCheckout}
              variant="editorial"
              size="lg"
              className="w-full justify-between"
            >
              <span>Place Pickup Order</span>
              <span className="font-bold">${total.toFixed(2)}</span>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
