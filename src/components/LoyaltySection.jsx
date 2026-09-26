import React from 'react';
import { Gift, Check, X, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const LoyaltySection = () => {
  const {
    loyaltyStamps,
    setLoyaltyStamps,
    freeDrinksAvailable,
    setFreeDrinksAvailable,
    isLoyaltyModalOpen,
    setIsLoyaltyModalOpen,
  } = useStore();

  const handleTestStamp = async () => {
    let earnedReward = false;

    setLoyaltyStamps((prev) => {
      const next = prev + 1;
      if (next >= 6) {
        earnedReward = true;
        return 0;
      }
      return next;
    });

    if (earnedReward) {
      setFreeDrinksAvailable((prev) => prev + 1);
      try {
        const confettiModule = await import('canvas-confetti');
        const confetti = confettiModule.default || confettiModule;
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#1A1816', '#C84B31', '#E5A93C'],
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  const content = (
    <div className="rounded-2xl border border-hairline dark:border-dark-hairline bg-surface dark:bg-dark-card p-6 sm:p-10 text-left transition-colors">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left: Program Overview (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-paper dark:bg-dark-surface border border-hairline-strong dark:border-dark-hairline-strong text-xs font-semibold text-vermillion">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Tasting Pass</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink dark:text-dark-text-main tracking-tight leading-tight">
            Buy 6 drinks, <br />
            get the 7th free.
          </h2>

          <p className="text-sm text-ink-muted dark:text-dark-text-muted leading-relaxed">
            Every pickup order adds a stamp to your pass in your browser. Complete 6 stamps to redeem a free coffee or specialty drink on your next order.
          </p>

          <div className="pt-1 flex items-center gap-4 text-xs font-semibold text-ink dark:text-dark-text-main">
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-success" aria-hidden="true" />
              No app or sign-in needed
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-success" aria-hidden="true" />
              Saved automatically
            </span>
          </div>
        </div>

        {/* Right: Stamp Card (6 cols) — no nested border, the panel above is the container */}
        <div className="lg:col-span-6">
          <div className="p-6 sm:p-7 space-y-6">
            
            <div className="flex items-center justify-between border-b border-hairline dark:border-dark-hairline pb-4">
              <div>
                <h3 className="font-serif font-bold text-lg text-ink dark:text-dark-text-main">
                  Your Digital Stamp Card
                </h3>
                <p className="text-xs text-ink-faint">
                  {6 - loyaltyStamps} more drinks until your free cup
                </p>
              </div>

              {freeDrinksAvailable > 0 && (
                <span className="px-3 py-1 rounded-full bg-vermillion text-paper text-xs font-bold shadow-sm">
                  {freeDrinksAvailable} Free Drink Available
                </span>
              )}
            </div>

            {/* 6 Stamp Circles */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {[0, 1, 2, 3, 4, 5].map((index) => {
                const isStamped = index < loyaltyStamps;
                const isLast = index === 5;

                return (
                  <div
                    key={index}
                    className={`aspect-square rounded-full border-2 flex flex-col items-center justify-center transition-colors ${
                      isStamped
                        ? 'border-vermillion bg-vermillion text-paper shadow-sm'
                        : isLast
                        ? 'border-dashed border-vermillion bg-paper dark:bg-dark-surface text-vermillion'
                        : 'border-dashed border-hairline-strong dark:border-dark-hairline-strong bg-surface dark:bg-dark-card text-ink-faint'
                    }`}
                  >
                    {isStamped ? (
                      <span className="font-serif font-bold text-lg">★</span>
                    ) : isLast ? (
                      <Gift className="w-5 h-5 text-vermillion" aria-hidden="true" />
                    ) : (
                      <span className="text-xs font-semibold">{index + 1}</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Demo Button */}
            <div className="flex items-center justify-between gap-3 pt-2 border-t border-hairline dark:border-dark-hairline">
              <span className="text-xs text-ink-faint">
                Stamps are added automatically at checkout
              </span>

              <button
                onClick={handleTestStamp}
                aria-label="Add a sample stamp to your Tasting Pass"
                className="px-3 py-1.5 rounded-lg border border-hairline-strong dark:border-dark-hairline-strong hover:border-ink dark:hover:border-dark-text-main text-xs font-semibold text-ink dark:text-dark-text-main transition-colors shrink-0 cursor-pointer"
              >
                + Add Sample Stamp
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );

  return (
    <>
      <section id="rewards" className="border-b border-hairline dark:border-dark-hairline bg-paper dark:bg-dark-canvas py-16 sm:py-24 anchor-offset transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          {content}
        </div>
      </section>

      {/* Modal View for Direct Click from Header */}
      {isLoyaltyModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-6 bg-black/70 backdrop-blur-sm anim-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Tasting Pass Modal"
          onClick={() => setIsLoyaltyModalOpen(false)}
        >
          <div 
            className="relative w-full max-w-2xl max-h-[88vh] sm:max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl anim-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsLoyaltyModalOpen(false)}
              aria-label="Close Tasting Pass Modal"
              className="absolute top-4 right-4 z-20 min-h-[38px] min-w-[38px] flex items-center justify-center rounded-full bg-paper dark:bg-dark-surface border border-hairline-strong dark:border-dark-hairline-strong text-ink dark:text-dark-text-main hover:bg-ink dark:hover:bg-dark-text-main hover:text-paper dark:hover:text-dark-canvas transition-[color,background-color,border-color,opacity,transform] cursor-pointer shadow-md"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
            {content}
          </div>
        </div>
      )}
    </>
  );
};
