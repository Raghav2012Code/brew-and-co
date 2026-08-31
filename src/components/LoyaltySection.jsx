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
    let nextStamps = loyaltyStamps + 1;
    let nextFree = freeDrinksAvailable;

    if (nextStamps >= 6) {
      nextStamps = 0;
      nextFree += 1;
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

    setLoyaltyStamps(nextStamps);
    setFreeDrinksAvailable(nextFree);
  };

  const content = (
    <div className="rounded-2xl border border-[#E8E4DC] dark:border-[#262420] bg-[#F3EFE6] dark:bg-[#161513] p-6 sm:p-10 text-left transition-colors">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left: Program Overview (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FBF9F5] dark:bg-[#1C1B18] border border-[#E0DACB] dark:border-[#302D27] text-xs font-semibold text-[#C84B31]">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Tasting Pass</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1816] dark:text-[#EAE6DF] tracking-tight leading-tight">
            Buy 6 drinks, <br />
            get the 7th free.
          </h2>

          <p className="text-sm text-[#666056] dark:text-[#A09A8E] leading-relaxed">
            Every pickup order adds a stamp to your pass in your browser. Complete 6 stamps to redeem a free coffee or specialty drink on your next order.
          </p>

          <div className="pt-1 flex items-center gap-4 text-xs font-semibold text-[#1A1816] dark:text-[#EAE6DF]">
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-[#2E7D32]" aria-hidden="true" />
              No app or sign-in needed
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-[#2E7D32]" aria-hidden="true" />
              Saved automatically
            </span>
          </div>
        </div>

        {/* Right: Clean Stamp Card (6 cols) */}
        <div className="lg:col-span-6">
          <div className="rounded-xl border border-[#E0DACB] dark:border-[#302D27] bg-[#FBF9F5] dark:bg-[#1C1B18] p-6 sm:p-7 shadow-sm space-y-6">
            
            <div className="flex items-center justify-between border-b border-[#E8E4DC] dark:border-[#262420] pb-4">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#1A1816] dark:text-[#EAE6DF]">
                  Your Digital Stamp Card
                </h3>
                <p className="text-xs text-[#888276]">
                  {6 - loyaltyStamps} more drinks until your free cup
                </p>
              </div>

              {freeDrinksAvailable > 0 && (
                <span className="px-3 py-1 rounded-full bg-[#C84B31] text-[#FBF9F5] text-xs font-bold shadow-sm">
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
                    className={`aspect-square rounded-full border-2 flex flex-col items-center justify-center transition-all ${
                      isStamped
                        ? 'border-[#C84B31] bg-[#C84B31] text-[#FBF9F5] shadow-sm'
                        : isLast
                        ? 'border-dashed border-[#C84B31] bg-[#FBF9F5] dark:bg-[#1C1B18] text-[#C84B31]'
                        : 'border-dashed border-[#D5CFBF] dark:border-[#302D27] bg-[#F3EFE6] dark:bg-[#161513] text-[#888276]'
                    }`}
                  >
                    {isStamped ? (
                      <span className="font-serif font-bold text-lg">★</span>
                    ) : isLast ? (
                      <Gift className="w-5 h-5 text-[#C84B31]" aria-hidden="true" />
                    ) : (
                      <span className="text-xs font-semibold">{index + 1}</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Demo Button */}
            <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#E8E4DC] dark:border-[#262420]">
              <span className="text-xs text-[#888276]">
                Stamps are added automatically at checkout
              </span>

              <button
                onClick={handleTestStamp}
                aria-label="Add a sample stamp to your Tasting Pass"
                className="px-3 py-1.5 rounded-lg border border-[#D5CFBF] dark:border-[#38342E] hover:border-[#1A1816] dark:hover:border-[#EAE6DF] text-xs font-semibold text-[#1A1816] dark:text-[#EAE6DF] transition-colors shrink-0 cursor-pointer"
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
      <section id="rewards" className="border-b border-[#E8E4DC] dark:border-[#262420] bg-[#FBF9F5] dark:bg-[#11100F] py-12 sm:py-20 scroll-mt-16 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          {content}
        </div>
      </section>

      {/* Modal View for Direct Click from Header */}
      {isLoyaltyModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-label="Tasting Pass Modal"
          onClick={() => setIsLoyaltyModalOpen(false)}
        >
          <div 
            className="relative w-full max-w-2xl max-h-[88vh] sm:max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl animate-in slide-in-from-bottom-4 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsLoyaltyModalOpen(false)}
              aria-label="Close Tasting Pass Modal"
              className="absolute top-4 right-4 z-20 min-h-[38px] min-w-[38px] flex items-center justify-center rounded-full bg-[#FBF9F5] dark:bg-[#1C1B18] border border-[#E0DACB] dark:border-[#302D27] text-[#1A1816] dark:text-[#EAE6DF] hover:bg-[#1A1816] dark:hover:bg-[#EAE6DF] hover:text-[#FBF9F5] dark:hover:text-[#11100F] active:scale-90 transition-all cursor-pointer shadow-md"
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
