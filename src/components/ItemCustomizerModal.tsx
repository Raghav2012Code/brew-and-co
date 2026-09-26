import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Minus } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CUSTOMIZATION_OPTIONS } from '../data/menuData';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface CustomizerSize {
  id: string;
  name: string;
  priceDelta: number;
}

const getAvailableSizes = (item: any): CustomizerSize[] => {
  if (Array.isArray(item?.availableSizes) && item.availableSizes.length > 0) {
    return item.availableSizes.map((size: any, index: number) => {
      if (typeof size === 'object' && size !== null) {
        return {
          id: size.id || `size-${index}`,
          name: size.name || size.id,
          priceDelta: typeof size.priceDelta === 'number' ? size.priceDelta : 0,
        };
      }
      const sizeStr = String(size);
      let priceDelta = 0;
      if (index > 0) {
        if (sizeStr.includes('16oz') || sizeStr.toLowerCase().includes('large') || sizeStr.includes('Carafe')) {
          priceDelta = 0.75;
        } else if (sizeStr.includes('12oz')) {
          priceDelta = 0.50;
        } else if (sizeStr.includes('8oz') || sizeStr.includes('6oz')) {
          priceDelta = 0.50;
        } else {
          priceDelta = index * 0.50;
        }
      }
      return {
        id: `size-${sizeStr.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        name: sizeStr,
        priceDelta,
      };
    });
  }
  return CUSTOMIZATION_OPTIONS.sizes;
};

const supportsMilk = (item: any): boolean => {
  if (!item) return false;
  if (item.category === 'espresso') return true;
  if (item.category === 'cold') {
    const text = `${item.name} ${item.description || ''}`.toLowerCase();
    return text.includes('milk') || text.includes('latte') || text.includes('shakerato') || text.includes('cream');
  }
  return false;
};

export const ItemCustomizerModal: React.FC = () => {
  const { customizerItem, setCustomizerItem, addToCart } = useStore();

  const availableSizes = useMemo(() => getAvailableSizes(customizerItem), [customizerItem]);
  const hasMilkOption = useMemo(() => supportsMilk(customizerItem), [customizerItem]);

  const [selectedSize, setSelectedSize] = useState<CustomizerSize>(CUSTOMIZATION_OPTIONS.sizes[0]);
  const [selectedTemp, setSelectedTemp] = useState('hot');
  const [selectedMilk, setSelectedMilk] = useState<any>(CUSTOMIZATION_OPTIONS.milks[0]);
  const [selectedShot, setSelectedShot] = useState(CUSTOMIZATION_OPTIONS.shots[0]);
  const [selectedSyrup, setSelectedSyrup] = useState(CUSTOMIZATION_OPTIONS.syrups[0]);
  const [selectedSweetness, setSelectedSweetness] = useState(CUSTOMIZATION_OPTIONS.sweetness[0]);
  const [specialNotes, setSpecialNotes] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Reset options cleanly when customizer item changes
  useEffect(() => {
    if (customizerItem) {
      const sizes = getAvailableSizes(customizerItem);
      setSelectedSize(sizes[0]);
      setSelectedTemp(customizerItem.defaultTemp || 'hot');
      setSelectedMilk(supportsMilk(customizerItem) ? CUSTOMIZATION_OPTIONS.milks[0] : null);
      setSelectedShot(CUSTOMIZATION_OPTIONS.shots[0]);
      setSelectedSyrup(CUSTOMIZATION_OPTIONS.syrups[0]);
      setSelectedSweetness(CUSTOMIZATION_OPTIONS.sweetness[0]);
      setSpecialNotes('');
      setQuantity(1);
    }
  }, [customizerItem]);

  if (!customizerItem) return null;

  const basePrice = customizerItem.price;
  const sizeDelta = selectedSize?.priceDelta || 0;
  const milkDelta = hasMilkOption && selectedMilk ? selectedMilk.priceDelta || 0 : 0;
  const shotDelta = selectedShot?.priceDelta || 0;
  const syrupDelta = selectedSyrup?.priceDelta || 0;

  const unitPrice = Math.max(0, basePrice + sizeDelta + milkDelta + shotDelta + syrupDelta);
  const totalPrice = unitPrice * quantity;

  const handleAdd = () => {
    addToCart(customizerItem, {
      size: selectedSize,
      temp: selectedTemp,
      milk: hasMilkOption ? selectedMilk : null,
      shot: selectedShot,
      syrup: selectedSyrup,
      sweetness: selectedSweetness,
      specialNotes: specialNotes.slice(0, 150),
      quantity,
    });
    toast.success(`Added ${quantity}× ${customizerItem.name} to bag!`);
    setCustomizerItem(null);
  };

  return (
    <Dialog open={Boolean(customizerItem)} onOpenChange={(open) => !open && setCustomizerItem(null)}>
      <DialogContent className="max-w-lg p-0 bg-paper dark:bg-dark-subtle border border-hairline dark:border-dark-hairline flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <DialogHeader className="p-4 sm:p-6 bg-surface dark:bg-dark-card border-b border-hairline dark:border-dark-hairline space-y-0">
          <div className="flex items-center gap-3 sm:gap-4 pr-6">
            <img
              src={customizerItem.image}
              alt={customizerItem.name}
              className="w-12 h-12 sm:w-14 sm:h-14 object-cover border border-hairline dark:border-dark-hairline shrink-0"
            />
            <div className="min-w-0">
              <span className="text-[10px] sm:text-[11px] font-mono font-semibold text-vermillion dark:text-dark-vermillion uppercase tracking-wider block">
                Customize
              </span>
              <DialogTitle className="font-serif font-bold text-lg sm:text-2xl text-ink dark:text-dark-text-main truncate">
                {customizerItem.name}
              </DialogTitle>
              <p className="text-xs font-mono text-ink-muted dark:text-dark-text-muted">
                Base price: ${customizerItem.price.toFixed(2)}
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable Customization Options */}
        <div className="p-4 sm:p-6 space-y-5 sm:space-y-6 overflow-y-auto flex-1 text-sm text-ink dark:text-dark-text-main scroll-smooth">
          
          {/* Size Choice */}
          <div className="space-y-2">
            <label className="font-mono font-semibold text-xs text-ink-muted dark:text-dark-text-muted uppercase tracking-wide block">
              Size
            </label>
            <div className={`grid gap-2 ${availableSizes.length === 1 ? 'grid-cols-1' : availableSizes.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
              {availableSizes.map((s) => {
                const isSelected = selectedSize?.id === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelectedSize(s)}
                    className={`p-3 border text-left active:scale-95 transition-[color,background-color,border-color,opacity,transform] cursor-pointer ${
                      isSelected
                        ? 'border-ink dark:border-dark-text-main bg-ink dark:bg-dark-text-main text-paper dark:text-dark-canvas shadow-sm font-semibold'
                        : 'border-hairline dark:border-dark-hairline bg-surface dark:bg-dark-card text-ink dark:text-dark-text-main hover:border-ink dark:hover:border-dark-text-main'
                    }`}
                  >
                    <p className="text-xs sm:text-sm font-medium">{s.name}</p>
                    <p className={`text-[11px] font-mono ${isSelected ? 'text-hairline dark:text-dark-hairline' : 'text-ink-muted dark:text-dark-text-muted'}`}>
                      {s.priceDelta === 0 ? 'Standard' : s.priceDelta > 0 ? `+$${s.priceDelta.toFixed(2)}` : `-$${Math.abs(s.priceDelta).toFixed(2)}`}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Temperature Choice */}
          <div className="space-y-2">
            <label className="font-mono font-semibold text-xs text-ink-muted dark:text-dark-text-muted uppercase tracking-wide block">
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
                    className={`min-h-[42px] py-2.5 px-4 border text-center font-mono text-xs active:scale-95 transition-[color,background-color,border-color,opacity,transform] cursor-pointer ${
                      isSelected
                        ? 'border-ink dark:border-dark-text-main bg-ink dark:bg-dark-text-main text-paper dark:text-dark-canvas shadow-sm font-semibold'
                        : 'border-hairline dark:border-dark-hairline bg-surface dark:bg-dark-card text-ink dark:text-dark-text-main hover:border-ink dark:hover:border-dark-text-main'
                    }`}
                  >
                    {t.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Milk Choice */}
          {hasMilkOption && (
            <div className="space-y-2">
              <label className="font-mono font-semibold text-xs text-ink-muted dark:text-dark-text-muted uppercase tracking-wide block">
                Milk
              </label>
              <div className="grid grid-cols-2 gap-2">
                {CUSTOMIZATION_OPTIONS.milks.map((m) => {
                  const isSelected = selectedMilk?.id === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedMilk(m)}
                      className={`min-h-[42px] p-2.5 border text-left active:scale-95 transition-[color,background-color,border-color,opacity,transform] cursor-pointer ${
                        isSelected
                          ? 'border-ink dark:border-dark-text-main bg-ink dark:bg-dark-text-main text-paper dark:text-dark-canvas shadow-sm font-semibold'
                          : 'border-hairline dark:border-dark-hairline bg-surface dark:bg-dark-card text-ink dark:text-dark-text-main hover:border-ink dark:hover:border-dark-text-main'
                      }`}
                    >
                      <span className="block text-xs font-medium">{m.name}</span>
                      <span className={`text-[11px] font-mono ${isSelected ? 'text-hairline dark:text-dark-hairline' : 'text-ink-muted dark:text-dark-text-muted'}`}>
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
            <label className="font-mono font-semibold text-xs text-ink-muted dark:text-dark-text-muted uppercase tracking-wide block">
              Espresso Shots
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CUSTOMIZATION_OPTIONS.shots.map((sh) => {
                const isSelected = selectedShot?.id === sh.id;
                return (
                  <button
                    key={sh.id}
                    type="button"
                    onClick={() => setSelectedShot(sh)}
                    className={`min-h-[42px] p-2.5 border text-left active:scale-95 transition-[color,background-color,border-color,opacity,transform] cursor-pointer ${
                      isSelected
                        ? 'border-ink dark:border-dark-text-main bg-ink dark:bg-dark-text-main text-paper dark:text-dark-canvas shadow-sm font-semibold'
                        : 'border-hairline dark:border-dark-hairline bg-surface dark:bg-dark-card text-ink dark:text-dark-text-main hover:border-ink dark:hover:border-dark-text-main'
                    }`}
                  >
                    <span className="block text-xs font-medium">{sh.name}</span>
                    <span className={`text-[11px] font-mono ${isSelected ? 'text-hairline dark:text-dark-hairline' : 'text-ink-muted dark:text-dark-text-muted'}`}>
                      {sh.priceDelta === 0 ? 'Standard' : `+$${sh.priceDelta.toFixed(2)}`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Syrup Choice */}
          <div className="space-y-2">
            <label className="font-mono font-semibold text-xs text-ink-muted dark:text-dark-text-muted uppercase tracking-wide block">
              Flavor Syrup
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CUSTOMIZATION_OPTIONS.syrups.map((sy) => {
                const isSelected = selectedSyrup?.id === sy.id;
                return (
                  <button
                    key={sy.id}
                    type="button"
                    onClick={() => setSelectedSyrup(sy)}
                    className={`min-h-[42px] p-2.5 border text-left active:scale-95 transition-[color,background-color,border-color,opacity,transform] cursor-pointer ${
                      isSelected
                        ? 'border-ink dark:border-dark-text-main bg-ink dark:bg-dark-text-main text-paper dark:text-dark-canvas shadow-sm font-semibold'
                        : 'border-hairline dark:border-dark-hairline bg-surface dark:bg-dark-card text-ink dark:text-dark-text-main hover:border-ink dark:hover:border-dark-text-main'
                    }`}
                  >
                    <span className="block text-xs font-medium">{sy.name}</span>
                    <span className={`text-[11px] font-mono ${isSelected ? 'text-hairline dark:text-dark-hairline' : 'text-ink-muted dark:text-dark-text-muted'}`}>
                      {sy.priceDelta === 0 ? 'None' : `+$${sy.priceDelta.toFixed(2)}`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sweetness Level */}
          <div className="space-y-2">
            <label className="font-mono font-semibold text-xs text-ink-muted dark:text-dark-text-muted uppercase tracking-wide block">
              Sweetness
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CUSTOMIZATION_OPTIONS.sweetness.map((sw) => {
                const isSelected = selectedSweetness?.id === sw.id;
                return (
                  <button
                    key={sw.id}
                    type="button"
                    onClick={() => setSelectedSweetness(sw)}
                    className={`min-h-[42px] p-2.5 border text-center font-mono text-xs active:scale-95 transition-[color,background-color,border-color,opacity,transform] cursor-pointer ${
                      isSelected
                        ? 'border-ink dark:border-dark-text-main bg-ink dark:bg-dark-text-main text-paper dark:text-dark-canvas shadow-sm font-semibold'
                        : 'border-hairline dark:border-dark-hairline bg-surface dark:bg-dark-card text-ink dark:text-dark-text-main hover:border-ink dark:hover:border-dark-text-main'
                    }`}
                  >
                    {sw.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Special Notes */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="item-notes" className="font-mono font-semibold text-xs text-ink-muted dark:text-dark-text-muted uppercase tracking-wide block">
                Special Instructions (Optional)
              </label>
              <span className="text-[10px] font-mono text-ink-muted dark:text-dark-text-muted">
                {specialNotes.length}/150
              </span>
            </div>
            <input
              id="item-notes"
              type="text"
              maxLength={150}
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value.slice(0, 150))}
              placeholder="e.g. extra hot, light ice, oat milk foam..."
              className="w-full min-h-[42px] p-3 bg-surface dark:bg-dark-card border border-hairline dark:border-dark-hairline text-ink dark:text-dark-text-main placeholder:text-ink-faint text-xs focus:border-ink dark:focus:border-dark-text-main"
            />
          </div>

        </div>

        {/* Modal Footer: Stepper & Add Button */}
        <div className="p-4 sm:p-5 bg-surface dark:bg-dark-card border-t border-hairline dark:border-dark-hairline flex items-center justify-between gap-3 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
          {/* Quantity Stepper */}
          <div className="flex items-center border border-hairline dark:border-dark-hairline bg-paper dark:bg-dark-canvas">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              aria-label={`Decrease quantity for ${customizerItem.name}`}
              className="min-h-[40px] min-w-[38px] flex items-center justify-center text-ink-muted dark:text-dark-text-muted hover:text-ink dark:hover:text-dark-text-main active:scale-90 transition-transform cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="px-3 font-mono font-bold text-sm text-ink dark:text-dark-text-main">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(99, q + 1))}
              disabled={quantity >= 99}
              aria-label={`Increase quantity for ${customizerItem.name}`}
              className="min-h-[40px] min-w-[38px] flex items-center justify-center text-ink-muted dark:text-dark-text-muted hover:text-ink dark:hover:text-dark-text-main active:scale-90 transition-transform cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Order CTA */}
          <Button
            onClick={handleAdd}
            variant="editorial"
            size="lg"
            className="flex-1 justify-between"
          >
            <span>Add to Bag</span>
            <span className="font-bold font-mono">${totalPrice.toFixed(2)}</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
