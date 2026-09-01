import React, { useState, useEffect, useId } from 'react';
import {
  X,
  Sparkles,
  Check,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  Flame,
  Zap,
} from 'lucide-react';
import { useSubscription } from '../context/SubscriptionContext';
import { useStore } from '../context/StoreContext';
import {
  GRIND_PROFILES,
  BAG_SIZES,
  SUBSCRIPTION_FREQUENCIES,
} from '../data/roasteryData';
import { toast } from 'sonner';

export const SubscriptionModal: React.FC = () => {
  const {
    isSubscribeModalOpen,
    setIsSubscribeModalOpen,
    selectedBean,
  } = useSubscription();

  const { addToCart } = useStore();

  const grindGroupId = useId();
  const bagGroupId = useId();
  const freqGroupId = useId();

  const [selectedGrind, setSelectedGrind] = useState(GRIND_PROFILES[0].id);
  const [selectedBagSize, setSelectedBagSize] = useState(BAG_SIZES[0].id);
  const [selectedFrequency, setSelectedFrequency] = useState(SUBSCRIPTION_FREQUENCIES[1].id); // biweekly default
  const [quantity, setQuantity] = useState(1);

  // Reset defaults on bean change
  useEffect(() => {
    if (selectedBean) {
      setSelectedGrind(GRIND_PROFILES[0].id);
      setSelectedBagSize(BAG_SIZES[0].id);
      setSelectedFrequency(SUBSCRIPTION_FREQUENCIES[1].id);
      setQuantity(1);
    }
  }, [selectedBean]);

  if (!isSubscribeModalOpen || !selectedBean) return null;

  const currentGrind = GRIND_PROFILES.find((g) => g.id === selectedGrind) || GRIND_PROFILES[0];
  const currentBag = BAG_SIZES.find((b) => b.id === selectedBagSize) || BAG_SIZES[0];
  const currentFreq = SUBSCRIPTION_FREQUENCIES.find((f) => f.id === selectedFrequency) || SUBSCRIPTION_FREQUENCIES[1];

  // Pricing calculations
  const basePricePerBag = selectedBean.basePrice * currentBag.multiplier;
  const isSubscription = currentFreq.id !== 'onetime';
  const discountMultiplier = isSubscription ? 1 - currentFreq.discountPct / 100 : 1;
  const unitPrice = Number((basePricePerBag * discountMultiplier).toFixed(2));
  const fullPrice = Number(basePricePerBag.toFixed(2));
  const totalSavings = Number(((fullPrice - unitPrice) * quantity).toFixed(2));
  const totalPrice = Number((unitPrice * quantity).toFixed(2));

  const handleAddToCart = () => {
    // Construct cart payload with subscription metadata
    const itemPayload = {
      id: `${selectedBean.id}-${selectedGrind}-${selectedBagSize}-${selectedFrequency}`,
      name: selectedBean.name,
      category: 'beans',
      price: unitPrice,
      image: selectedBean.image,
      isSubscription,
      subscriptionMeta: isSubscription
        ? {
            beanId: selectedBean.id,
            origin: selectedBean.origin,
            roastLevel: selectedBean.roastLevel,
            grindId: currentGrind.id,
            grindName: currentGrind.name,
            bagSizeId: currentBag.id,
            bagSizeName: currentBag.name,
            frequencyId: currentFreq.id,
            frequencyName: currentFreq.name,
            discountPct: currentFreq.discountPct,
          }
        : null,
      beanMeta: {
        grindName: currentGrind.name,
        bagSizeName: currentBag.name,
        cupYield: currentBag.cupYield,
      },
    };

    addToCart(itemPayload, {
      quantity,
      size: { id: currentBag.id, name: `${currentBag.name} (${currentBag.weightOz})` },
      temp: 'whole-bean',
      specialNotes: isSubscription
        ? `Recurring Roast: ${currentFreq.name} • Grind: ${currentGrind.name}`
        : `Grind: ${currentGrind.name} • ${currentBag.name}`,
    });

    setIsSubscribeModalOpen(false);

    if (isSubscription) {
      toast.success(`Subscribed to ${selectedBean.name}!`, {
        description: `Delivered ${currentFreq.name.toLowerCase()} (${currentGrind.name}) with 15% recurring savings.`,
      });
    } else {
      toast.success(`Added ${selectedBean.name} to Bag`, {
        description: `${currentBag.name} • ${currentGrind.name}`,
      });
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="subscription-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-paper dark:bg-dark-card border border-hairline dark:border-dark-hairline shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Spec Banner */}
        <div className="p-4 sm:p-6 bg-paper-dim dark:bg-dark-subtle border-b border-hairline dark:border-dark-hairline flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider bg-vermillion/10 dark:bg-dark-vermillion/20 text-vermillion dark:text-dark-vermillion border border-vermillion/30 dark:border-dark-vermillion/30">
                <Sparkles className="w-3 h-3" />
                {selectedBean.badge || 'Micro-Lot Roastery'}
              </span>
              <span className="text-[11px] font-mono text-ink-muted dark:text-dark-text-muted">
                Cupping: <strong className="text-ink dark:text-dark-text-main font-bold">{selectedBean.cuppingScore} / 100</strong>
              </span>
              <span className="text-[11px] font-mono text-ink-muted dark:text-dark-text-muted">
                • {selectedBean.elevation}
              </span>
            </div>
            <h2 id="subscription-modal-title" className="font-serif text-xl sm:text-2xl font-bold text-ink dark:text-dark-text-main leading-tight">
              {selectedBean.name}
            </h2>
            <p className="text-xs text-ink-muted dark:text-dark-text-muted">
              {selectedBean.origin} • <span className="font-medium text-ink dark:text-dark-text-main">{selectedBean.process}</span>
            </p>
          </div>

          <button
            onClick={() => setIsSubscribeModalOpen(false)}
            aria-label="Close modal"
            className="min-h-[40px] min-w-[40px] flex items-center justify-center text-ink-muted hover:text-ink dark:hover:text-dark-text-main border border-transparent hover:border-hairline dark:hover:border-dark-hairline active:scale-95 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-sm text-ink dark:text-dark-text-main">
          {/* Tasting Note Tags */}
          <div className="flex flex-wrap gap-1.5 pb-2 border-b border-hairline/60 dark:border-dark-hairline/60">
            {selectedBean.tastingNotes?.map((note: string) => (
              <span
                key={note}
                className="px-2.5 py-1 text-xs font-mono bg-paper-dim dark:bg-dark-canvas border border-hairline dark:border-dark-hairline text-ink dark:text-dark-text-main"
              >
                {note}
              </span>
            ))}
          </div>

          {/* 1. Frequency & Purchase Mode */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label id={freqGroupId} className="text-xs font-mono font-bold uppercase tracking-wider text-ink-muted dark:text-dark-text-muted flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-vermillion dark:text-dark-vermillion" />
                1. Delivery Frequency & Savings
              </label>
              {isSubscription && (
                <span className="text-[11px] font-mono font-bold text-vermillion dark:text-dark-vermillion bg-vermillion/10 dark:bg-dark-vermillion/15 px-2 py-0.5">
                  15% Recurring Discount Active
                </span>
              )}
            </div>

            <div role="radiogroup" aria-labelledby={freqGroupId} className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SUBSCRIPTION_FREQUENCIES.map((freq) => {
                const isSelected = selectedFrequency === freq.id;
                return (
                  <button
                    key={freq.id}
                    role="radio"
                    aria-checked={isSelected}
                    type="button"
                    onClick={() => setSelectedFrequency(freq.id)}
                    className={`relative p-3 text-left border flex flex-col justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'border-ink dark:border-dark-text-main bg-paper-dim dark:bg-dark-canvas shadow-xs ring-1 ring-ink dark:ring-dark-text-main'
                        : 'border-hairline dark:border-dark-hairline bg-paper dark:bg-dark-subtle hover:border-ink-muted dark:hover:border-dark-text-muted'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono font-bold text-xs text-ink dark:text-dark-text-main">
                          {freq.name}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-vermillion dark:text-dark-vermillion" />}
                      </div>
                      <p className="text-[11px] text-ink-muted dark:text-dark-text-muted leading-snug line-clamp-2">
                        {freq.description}
                      </p>
                    </div>

                    <div className="mt-2 pt-1 border-t border-hairline/40 dark:border-dark-hairline/40">
                      <span className={`text-[10px] font-mono font-bold ${freq.discountPct > 0 ? 'text-vermillion dark:text-dark-vermillion' : 'text-ink-muted dark:text-dark-text-muted'}`}>
                        {freq.badge}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Grind Profile Selector */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label id={grindGroupId} className="text-xs font-mono font-bold uppercase tracking-wider text-ink-muted dark:text-dark-text-muted flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-vermillion dark:text-dark-vermillion" />
                2. Grind Precision & Particle Size
              </label>
              <span className="text-xs font-mono text-ink-muted dark:text-dark-text-muted">
                Calibrated: <strong className="text-ink dark:text-dark-text-main">{currentGrind.micron}</strong>
              </span>
            </div>

            <div role="radiogroup" aria-labelledby={grindGroupId} className="space-y-1.5">
              {GRIND_PROFILES.map((grind) => {
                const isSelected = selectedGrind === grind.id;
                return (
                  <button
                    key={grind.id}
                    role="radio"
                    aria-checked={isSelected}
                    type="button"
                    onClick={() => setSelectedGrind(grind.id)}
                    className={`w-full p-2.5 sm:p-3 text-left border flex items-center justify-between gap-3 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-ink dark:border-dark-text-main bg-paper-dim dark:bg-dark-canvas ring-1 ring-ink dark:ring-dark-text-main'
                        : 'border-hairline dark:border-dark-hairline bg-paper dark:bg-dark-subtle hover:border-ink-muted dark:hover:border-dark-text-muted'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${isSelected ? 'border-ink dark:border-dark-text-main bg-ink dark:bg-dark-text-main text-paper dark:text-dark-canvas' : 'border-ink-muted dark:border-dark-text-muted'}`}>
                        {isSelected && <div className="w-1.5 h-1.5 bg-paper dark:bg-dark-canvas rounded-full" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-sans font-bold text-xs sm:text-sm text-ink dark:text-dark-text-main">
                            {grind.name}
                          </span>
                          <span className="text-[10px] font-mono text-ink-muted dark:text-dark-text-muted bg-paper dark:bg-dark-card px-1.5 py-0.5 border border-hairline/60 dark:border-dark-hairline/60">
                            {grind.subtitle}
                          </span>
                        </div>
                        <p className="text-[11px] text-ink-muted dark:text-dark-text-muted mt-0.5">
                          {grind.description}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0 font-mono text-[11px] text-ink-muted dark:text-dark-text-muted hidden xs:block">
                      {grind.micron}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Bag Weight Selector */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label id={bagGroupId} className="text-xs font-mono font-bold uppercase tracking-wider text-ink-muted dark:text-dark-text-muted flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-vermillion dark:text-dark-vermillion" />
                3. Bag Volume
              </label>
              <span className="text-xs font-mono text-ink-muted dark:text-dark-text-muted">
                Yield: <strong className="text-ink dark:text-dark-text-main">{currentBag.cupYield}</strong>
              </span>
            </div>

            <div role="radiogroup" aria-labelledby={bagGroupId} className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {BAG_SIZES.map((bag) => {
                const isSelected = selectedBagSize === bag.id;
                const priceForThisBag = Number((selectedBean.basePrice * bag.multiplier * discountMultiplier).toFixed(2));
                return (
                  <button
                    key={bag.id}
                    role="radio"
                    aria-checked={isSelected}
                    type="button"
                    onClick={() => setSelectedBagSize(bag.id)}
                    className={`p-3 text-left border flex flex-col justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'border-ink dark:border-dark-text-main bg-paper-dim dark:bg-dark-canvas ring-1 ring-ink dark:ring-dark-text-main'
                        : 'border-hairline dark:border-dark-hairline bg-paper dark:bg-dark-subtle hover:border-ink-muted dark:hover:border-dark-text-muted'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold font-sans text-xs text-ink dark:text-dark-text-main">
                          {bag.name}
                        </span>
                        {bag.volumeDiscountPct > 0 && (
                          <span className="text-[10px] font-mono text-vermillion dark:text-dark-vermillion font-semibold">
                            Save {bag.volumeDiscountPct}%
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] font-mono text-ink-muted dark:text-dark-text-muted mt-0.5">
                        {bag.weightOz} • {bag.cupYield}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-hairline/40 dark:border-dark-hairline/40 flex items-baseline justify-between font-mono">
                      <span className="text-xs font-bold text-ink dark:text-dark-text-main">
                        ${priceForThisBag.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-ink-muted dark:text-dark-text-muted">
                        / bag
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Guarantee & Freshness Callout */}
          <div className="p-3.5 bg-paper-dim dark:bg-dark-subtle border border-hairline dark:border-dark-hairline flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-vermillion dark:text-dark-vermillion shrink-0" />
            <div className="text-xs text-ink-muted dark:text-dark-text-muted">
              <span className="font-bold text-ink dark:text-dark-text-main">Roasted-to-Order Promise:</span> Small-batch roasted within 48 hours of dispatch. Pause, skip, or cancel your subscription anytime with 1 click.
            </div>
          </div>
        </div>

        {/* Modal Footer / Action CTA */}
        <div className="p-4 sm:p-6 bg-paper-dim dark:bg-dark-subtle border-t border-hairline dark:border-dark-hairline flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-4">
            {/* Quantity Stepper */}
            <div className="flex items-center border border-hairline dark:border-dark-hairline bg-paper dark:bg-dark-card">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                aria-label="Decrease quantity"
                className="min-h-[38px] min-w-[38px] flex items-center justify-center text-ink-muted hover:text-ink dark:hover:text-dark-text-main active:scale-90 transition-transform cursor-pointer"
              >
                -
              </button>
              <span className="px-3 font-mono font-bold text-xs text-ink dark:text-dark-text-main">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                aria-label="Increase quantity"
                className="min-h-[38px] min-w-[38px] flex items-center justify-center text-ink-muted hover:text-ink dark:hover:text-dark-text-main active:scale-90 transition-transform cursor-pointer"
              >
                +
              </button>
            </div>

            {/* Price Summary */}
            <div className="text-right sm:text-left">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-lg sm:text-xl font-bold text-ink dark:text-dark-text-main">
                  ${totalPrice.toFixed(2)}
                </span>
                {totalSavings > 0 && (
                  <span className="font-mono text-xs line-through text-ink-faint">
                    ${(fullPrice * quantity).toFixed(2)}
                  </span>
                )}
              </div>
              <p className="text-[11px] font-mono text-ink-muted dark:text-dark-text-muted">
                {isSubscription ? `Dispatched ${currentFreq.name}` : 'One-Time Delivery'}
              </p>
            </div>
          </div>

          {/* Primary Submit CTA */}
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 bg-ink dark:bg-dark-text-main text-paper dark:text-dark-canvas hover:bg-vermillion dark:hover:bg-dark-vermillion dark:hover:text-paper text-xs sm:text-sm font-bold flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer shadow-md"
          >
            {isSubscription ? (
              <>
                <Zap className="w-4 h-4 text-vermillion dark:text-dark-canvas fill-current" />
                <span>Start Subscription • Save 15%</span>
              </>
            ) : (
              <>
                <span>Add Bag to Cart</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
