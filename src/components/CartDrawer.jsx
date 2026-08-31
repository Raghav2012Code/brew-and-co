import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CartDrawer = () => {
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

  if (!isCartOpen) return null;

  const rawSubtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  
  const discountAmount = applyFreeDrink && freeDrinksAvailable > 0 && cart.length > 0
    ? (cart[0]?.unitPrice || 0)
    : 0;

  const subtotal = Math.max(0, rawSubtotal - discountAmount);
  const tax = Number((subtotal * 0.0825).toFixed(2));
  
  const calculatedTip = customTip !== '' 
    ? parseFloat(customTip) || 0 
    : Number(((subtotal * tipPercent) / 100).toFixed(2));
    
  const total = Number((subtotal + tax + calculatedTip).toFixed(2));

  const handleCheckout = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    placeOrder({
      pickupName: pickupName.trim() || 'Counter Guest',
      tipPercent,
      tipAmount: calculatedTip,
      appliedFreeDrink: applyFreeDrink && freeDrinksAvailable > 0,
    });
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-manifest-title"
    >
      <div 
        className="absolute inset-0" 
        onClick={() => setIsCartOpen(false)}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-full sm:max-w-md bg-[#FBF9F5] dark:bg-[#161513] border-l border-[#E8E4DC] dark:border-[#262420] shadow-2xl flex flex-col justify-between text-left transition-colors animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-4 sm:p-6 bg-[#F3EFE6] dark:bg-[#1C1B18] border-b border-[#E8E4DC] dark:border-[#262420] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#C84B31]" aria-hidden="true" />
              <h2 id="cart-manifest-title" className="font-serif font-bold text-lg sm:text-xl text-[#1A1816] dark:text-[#EAE6DF]">
                Your Bag
              </h2>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              aria-label="Close Bag"
              className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-full border border-[#D5CFBF] dark:border-[#38342E] text-[#666056] dark:text-[#A09A8E] hover:text-[#1A1816] dark:hover:text-[#EAE6DF] active:scale-90 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 text-sm text-[#1A1816] dark:text-[#EAE6DF] scroll-smooth">
            {cart.length === 0 ? (
              <div className="py-16 sm:py-20 text-center space-y-3">
                <ShoppingBag className="w-10 h-10 mx-auto text-[#888276] stroke-[1.5]" aria-hidden="true" />
                <h3 className="font-serif text-xl font-bold text-[#1A1816] dark:text-[#EAE6DF]">Your bag is empty</h3>
                <p className="text-xs text-[#666056] dark:text-[#A09A8E] max-w-xs mx-auto">
                  Add coffee, tea, or pastries from our menu to start your order.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 min-h-[44px] px-6 py-2.5 rounded-xl bg-[#1A1816] dark:bg-[#EAE6DF] text-[#FBF9F5] dark:text-[#11100F] text-xs font-semibold active:scale-95 transition-all cursor-pointer"
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              <>
                {/* Item List */}
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 sm:p-4 rounded-xl bg-[#F3EFE6] dark:bg-[#1C1B18] border border-[#E0DACB] dark:border-[#302D27] space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 rounded-lg object-cover border border-[#E0DACB] dark:border-[#302D27] shrink-0"
                          />
                          <div>
                            <h4 className="font-serif font-bold text-base text-[#1A1816] dark:text-[#EAE6DF] leading-snug">
                              {item.name}
                            </h4>
                            <p className="text-xs font-semibold text-[#C84B31]">
                              ${(item.unitPrice * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          aria-label={`Remove ${item.name} from bag`}
                          className="min-h-[36px] min-w-[36px] flex items-center justify-center text-[#888276] hover:text-[#C84B31] active:scale-90 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Customization Details */}
                      <div className="text-xs text-[#666056] dark:text-[#A09A8E] space-y-0.5 bg-[#FBF9F5] dark:bg-[#161513] p-2.5 rounded-lg border border-[#E8E4DC] dark:border-[#262420]">
                        <div>
                          <span>Size & Temp: </span>
                          <strong className="text-[#1A1816] dark:text-[#EAE6DF]">{item.options.size?.name || 'Standard'} • {item.options.temp.toUpperCase()}</strong>
                        </div>
                        {item.options.milk && (
                          <div>
                            <span>Milk: </span>
                            <strong className="text-[#1A1816] dark:text-[#EAE6DF]">{item.options.milk.name}</strong>
                          </div>
                        )}
                        {item.options.shot && item.options.shot.id !== 'standard' && (
                          <div>
                            <span>Shots: </span>
                            <strong className="text-[#1A1816] dark:text-[#EAE6DF]">{item.options.shot.name}</strong>
                          </div>
                        )}
                        {item.options.specialNotes && (
                          <div className="italic text-[#1A1816] dark:text-[#EAE6DF] pt-0.5 truncate">
                            Note: "{item.options.specialNotes}"
                          </div>
                        )}
                      </div>

                      {/* Stepper with accessible touch targets */}
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs text-[#888276]">Quantity:</span>
                        <div className="flex items-center rounded-xl border border-[#E0DACB] dark:border-[#302D27] bg-[#FBF9F5] dark:bg-[#161513]">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            aria-label="Decrease quantity"
                            className="min-h-[38px] min-w-[38px] flex items-center justify-center text-[#666056] hover:text-[#1A1816] active:scale-90 transition-transform cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 font-bold text-xs">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            aria-label="Increase quantity"
                            className="min-h-[38px] min-w-[38px] flex items-center justify-center text-[#666056] hover:text-[#1A1816] active:scale-90 transition-transform cursor-pointer"
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
                  <div className="p-3.5 rounded-xl bg-[#F3EFE6] dark:bg-[#1C1B18] border border-[#C84B31]/40 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[#1A1816] dark:text-[#EAE6DF] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#C84B31]" aria-hidden="true" />
                        Free Drink Reward Available
                      </p>
                      <p className="text-[11px] text-[#666056] dark:text-[#A09A8E]">
                        Redeem a free drink on this order
                      </p>
                    </div>
                    <button
                      onClick={() => setApplyFreeDrink(!applyFreeDrink)}
                      className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-semibold active:scale-95 transition-all cursor-pointer ${
                        applyFreeDrink
                          ? 'bg-[#2E7D32] text-white'
                          : 'bg-[#1A1816] dark:bg-[#EAE6DF] text-[#FBF9F5] dark:text-[#11100F]'
                      }`}
                    >
                      {applyFreeDrink ? 'Applied' : 'Apply'}
                    </button>
                  </div>
                )}

                {/* Tip Selector */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-xs font-medium text-[#666056] dark:text-[#A09A8E]">
                    <span>Add Tip:</span>
                    <span className="font-semibold text-[#1A1816] dark:text-[#EAE6DF]">${calculatedTip.toFixed(2)}</span>
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
                          className={`min-h-[40px] py-2 rounded-xl border text-xs font-semibold active:scale-95 transition-all cursor-pointer ${
                            isSelected
                              ? 'border-[#1A1816] dark:border-[#EAE6DF] bg-[#1A1816] dark:bg-[#EAE6DF] text-[#FBF9F5] dark:text-[#11100F] shadow-sm'
                              : 'border-[#E0DACB] dark:border-[#302D27] bg-[#F3EFE6] dark:bg-[#1C1B18] text-[#1A1816] dark:text-[#EAE6DF] hover:border-[#1A1816]'
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
                  <label htmlFor="pickup-guest-name" className="text-xs font-medium text-[#666056] dark:text-[#A09A8E] block">
                    Name for Order
                  </label>
                  <input
                    id="pickup-guest-name"
                    type="text"
                    required
                    value={pickupName}
                    onChange={(e) => setPickupName(e.target.value)}
                    placeholder="Your name"
                    className="w-full min-h-[44px] p-3 rounded-xl bg-[#F3EFE6] dark:bg-[#1C1B18] border border-[#E0DACB] dark:border-[#302D27] text-[#1A1816] dark:text-[#EAE6DF] placeholder:text-[#888276] text-xs focus:outline-none focus:border-[#1A1816]"
                  />
                </div>
              </>
            )}
          </div>

          {/* Drawer Footer & Checkout (With Safe Area Inset) */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-6 bg-[#F3EFE6] dark:bg-[#1C1B18] border-t border-[#E8E4DC] dark:border-[#262420] space-y-3.5 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
              <div className="space-y-1.5 text-xs text-[#666056] dark:text-[#A09A8E]">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-medium text-[#1A1816] dark:text-[#EAE6DF]">${rawSubtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#2E7D32] font-semibold">
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
                <div className="flex justify-between text-base font-bold text-[#1A1816] dark:text-[#EAE6DF] pt-2 border-t border-[#E0DACB] dark:border-[#302D27]">
                  <span>Total:</span>
                  <span className="text-[#C84B31]">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleCheckout}
                className="w-full min-h-[48px] py-3.5 px-5 rounded-xl bg-[#1A1816] dark:bg-[#EAE6DF] hover:bg-[#C84B31] dark:hover:bg-[#C84B31] text-[#FBF9F5] dark:text-[#11100F] dark:hover:text-[#FBF9F5] font-semibold text-xs sm:text-sm active:scale-98 transition-all flex items-center justify-between shadow-md cursor-pointer"
              >
                <span>Place Pickup Order</span>
                <span className="font-bold">${total.toFixed(2)}</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
