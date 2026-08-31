import React, { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CUSTOMIZATION_OPTIONS } from '../data/menuData';

export const ItemCustomizerModal = () => {
  const { customizerItem, setCustomizerItem, addToCart } = useStore();

  const [selectedSize, setSelectedSize] = useState(CUSTOMIZATION_OPTIONS.sizes[1]);
  const [selectedTemp, setSelectedTemp] = useState('hot');
  const [selectedMilk, setSelectedMilk] = useState(CUSTOMIZATION_OPTIONS.milks[0]);
  const [selectedShot, setSelectedShot] = useState(CUSTOMIZATION_OPTIONS.shots[0]);
  const [selectedSyrup, setSelectedSyrup] = useState(CUSTOMIZATION_OPTIONS.syrups[0]);
  const [selectedSweetness, setSelectedSweetness] = useState(CUSTOMIZATION_OPTIONS.sweetness[2]);
  const [specialNotes, setSpecialNotes] = useState('');
  const [quantity, setQuantity] = useState(1);

  if (!customizerItem) return null;

  const basePrice = customizerItem.price;
  const sizeDelta = selectedSize?.priceDelta || 0;
  const milkDelta = selectedMilk?.priceDelta || 0;
  const shotDelta = selectedShot?.priceDelta || 0;
  const syrupDelta = selectedSyrup?.priceDelta || 0;

  const unitPrice = Math.max(0, basePrice + sizeDelta + milkDelta + shotDelta + syrupDelta);
  const totalPrice = unitPrice * quantity;

  const handleAdd = () => {
    addToCart(customizerItem, {
      size: selectedSize,
      temp: selectedTemp,
      milk: selectedMilk,
      shot: selectedShot,
      syrup: selectedSyrup,
      sweetness: selectedSweetness,
      specialNotes,
      quantity,
    });
    setCustomizerItem(null);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="customizer-item-title"
      onClick={() => setCustomizerItem(null)}
    >
      <div 
        className="relative w-full max-w-lg bg-[#FBF9F5] dark:bg-[#161513] rounded-t-3xl sm:rounded-2xl border-t sm:border border-[#E8E4DC] dark:border-[#262420] shadow-2xl overflow-hidden max-h-[88vh] sm:max-h-[90vh] flex flex-col text-left transition-colors animate-in slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag Indicator */}
        <div className="sm:hidden w-12 h-1.5 bg-[#D5CFBF] dark:bg-[#38342E] rounded-full mx-auto mt-3 mb-1" />

        {/* Modal Header */}
        <div className="p-4 sm:p-6 bg-[#F3EFE6] dark:bg-[#1C1B18] border-b border-[#E8E4DC] dark:border-[#262420] flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 sm:gap-4">
            <img
              src={customizerItem.image}
              alt={customizerItem.name}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover border border-[#E0DACB] dark:border-[#302D27] shrink-0"
            />
            <div className="min-w-0">
              <span className="text-[10px] sm:text-[11px] font-semibold text-[#C84B31] uppercase tracking-wider block">
                Customize
              </span>
              <h3 id="customizer-item-title" className="font-serif font-bold text-lg sm:text-2xl text-[#1A1816] dark:text-[#EAE6DF] truncate">
                {customizerItem.name}
              </h3>
              <p className="text-xs text-[#666056] dark:text-[#A09A8E]">
                Base price: ${customizerItem.price.toFixed(2)}
              </p>
            </div>
          </div>

          <button
            onClick={() => setCustomizerItem(null)}
            aria-label="Close customizer"
            className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-full border border-[#D5CFBF] dark:border-[#38342E] text-[#666056] dark:text-[#A09A8E] hover:text-[#1A1816] dark:hover:text-[#EAE6DF] active:scale-90 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Scrollable Customization Options */}
        <div className="p-4 sm:p-6 space-y-5 sm:space-y-6 overflow-y-auto flex-1 text-sm text-[#1A1816] dark:text-[#EAE6DF] scroll-smooth">
          
          {/* Size Choice */}
          <div className="space-y-2">
            <label className="font-semibold text-xs text-[#666056] dark:text-[#A09A8E] uppercase tracking-wide block">
              Size
            </label>
            <div className="grid grid-cols-3 gap-2">
              {CUSTOMIZATION_OPTIONS.sizes.map((s) => {
                const isSelected = selectedSize.id === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelectedSize(s)}
                    className={`p-3 rounded-xl border text-left active:scale-95 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#1A1816] dark:border-[#EAE6DF] bg-[#1A1816] dark:bg-[#EAE6DF] text-[#FBF9F5] dark:text-[#11100F] shadow-sm font-semibold'
                        : 'border-[#E0DACB] dark:border-[#302D27] bg-[#F3EFE6] dark:bg-[#1C1B18] text-[#1A1816] dark:text-[#EAE6DF] hover:border-[#1A1816]'
                    }`}
                  >
                    <p className="text-xs sm:text-sm font-semibold">{s.name}</p>
                    <p className={`text-[11px] ${isSelected ? 'text-[#D5CFBF] dark:text-[#555047]' : 'text-[#888276]'}`}>
                      {s.priceDelta === 0 ? 'Standard' : `+$${s.priceDelta.toFixed(2)}`}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Temperature Choice */}
          <div className="space-y-2">
            <label className="font-semibold text-xs text-[#666056] dark:text-[#A09A8E] uppercase tracking-wide block">
              Temperature
            </label>
            <div className="grid grid-cols-3 gap-2">
              {CUSTOMIZATION_OPTIONS.temperatures.map((t) => {
                const isSelected = selectedTemp === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedTemp(t.id)}
                    className={`min-h-[44px] py-2.5 px-4 rounded-xl border text-center font-medium active:scale-95 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#1A1816] dark:border-[#EAE6DF] bg-[#1A1816] dark:bg-[#EAE6DF] text-[#FBF9F5] dark:text-[#11100F] shadow-sm font-semibold'
                        : 'border-[#E0DACB] dark:border-[#302D27] bg-[#F3EFE6] dark:bg-[#1C1B18] text-[#1A1816] dark:text-[#EAE6DF] hover:border-[#1A1816]'
                    }`}
                  >
                    {t.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Milk Choice */}
          {customizerItem.category === 'espresso' && (
            <div className="space-y-2">
              <label className="font-semibold text-xs text-[#666056] dark:text-[#A09A8E] uppercase tracking-wide block">
                Milk
              </label>
              <div className="grid grid-cols-2 gap-2">
                {CUSTOMIZATION_OPTIONS.milks.map((m) => {
                  const isSelected = selectedMilk.id === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedMilk(m)}
                      className={`min-h-[44px] p-2.5 rounded-xl border text-left active:scale-95 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#1A1816] dark:border-[#EAE6DF] bg-[#1A1816] dark:bg-[#EAE6DF] text-[#FBF9F5] dark:text-[#11100F] shadow-sm font-semibold'
                          : 'border-[#E0DACB] dark:border-[#302D27] bg-[#F3EFE6] dark:bg-[#1C1B18] text-[#1A1816] dark:text-[#EAE6DF] hover:border-[#1A1816]'
                      }`}
                    >
                      <span className="block text-xs font-semibold">{m.name}</span>
                      <span className={`text-[11px] ${isSelected ? 'text-[#D5CFBF] dark:text-[#555047]' : 'text-[#888276]'}`}>
                        {m.priceDelta === 0 ? 'Included' : `+$${m.priceDelta.toFixed(2)}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Extra Espresso Shots */}
          <div className="space-y-2">
            <label className="font-semibold text-xs text-[#666056] dark:text-[#A09A8E] uppercase tracking-wide block">
              Espresso Shots
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CUSTOMIZATION_OPTIONS.shots.map((sh) => {
                const isSelected = selectedShot.id === sh.id;
                return (
                  <button
                    key={sh.id}
                    type="button"
                    onClick={() => setSelectedShot(sh)}
                    className={`min-h-[44px] p-2.5 rounded-xl border text-left active:scale-95 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#1A1816] dark:border-[#EAE6DF] bg-[#1A1816] dark:bg-[#EAE6DF] text-[#FBF9F5] dark:text-[#11100F] shadow-sm font-semibold'
                        : 'border-[#E0DACB] dark:border-[#302D27] bg-[#F3EFE6] dark:bg-[#1C1B18] text-[#1A1816] dark:text-[#EAE6DF] hover:border-[#1A1816]'
                    }`}
                  >
                    <span className="block text-xs font-semibold">{sh.name}</span>
                    <span className={`text-[11px] ${isSelected ? 'text-[#D5CFBF] dark:text-[#555047]' : 'text-[#888276]'}`}>
                      {sh.priceDelta === 0 ? 'Standard' : `+$${sh.priceDelta.toFixed(2)}`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Special Notes */}
          <div className="space-y-2">
            <label htmlFor="item-notes" className="font-semibold text-xs text-[#666056] dark:text-[#A09A8E] uppercase tracking-wide block">
              Special Instructions (Optional)
            </label>
            <input
              id="item-notes"
              type="text"
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              placeholder="e.g. extra hot, light ice, oat milk foam..."
              className="w-full min-h-[44px] p-3 rounded-xl bg-[#F3EFE6] dark:bg-[#1C1B18] border border-[#E0DACB] dark:border-[#302D27] text-[#1A1816] dark:text-[#EAE6DF] placeholder:text-[#888276] text-xs focus:outline-none focus:border-[#1A1816]"
            />
          </div>

        </div>

        {/* Modal Footer: Stepper & Add Button (With Mobile Safe Area) */}
        <div className="p-4 sm:p-5 bg-[#F3EFE6] dark:bg-[#1C1B18] border-t border-[#E8E4DC] dark:border-[#262420] flex items-center justify-between gap-3 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
          {/* Quantity Stepper */}
          <div className="flex items-center rounded-xl border border-[#E0DACB] dark:border-[#302D27] bg-[#FBF9F5] dark:bg-[#161513]">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              aria-label="Decrease quantity"
              className="min-h-[44px] min-w-[40px] flex items-center justify-center text-[#666056] dark:text-[#A09A8E] hover:text-[#1A1816] dark:hover:text-[#EAE6DF] active:scale-90 transition-transform cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="px-3 font-bold text-sm">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              aria-label="Increase quantity"
              className="min-h-[44px] min-w-[40px] flex items-center justify-center text-[#666056] dark:text-[#A09A8E] hover:text-[#1A1816] dark:hover:text-[#EAE6DF] active:scale-90 transition-transform cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Order CTA */}
          <button
            onClick={handleAdd}
            className="flex-1 min-h-[46px] py-3 px-4 sm:px-5 rounded-xl bg-[#1A1816] dark:bg-[#EAE6DF] text-[#FBF9F5] dark:text-[#11100F] hover:bg-[#C84B31] dark:hover:bg-[#C84B31] dark:hover:text-[#FBF9F5] font-semibold text-xs sm:text-sm active:scale-98 transition-all flex items-center justify-between shadow-sm cursor-pointer"
          >
            <span>Add to Bag</span>
            <span className="font-bold">${totalPrice.toFixed(2)}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
