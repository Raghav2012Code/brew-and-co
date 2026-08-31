import React, { useState, useEffect } from 'react';
import { Check, X, Clock, Printer, MapPin, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const OrderSuccessModal = () => {
  const { activeOrder, setActiveOrder, loyaltyStamps } = useStore();
  const [secondsRemaining, setSecondsRemaining] = useState(480);
  const [prepStage, setPrepStage] = useState(1);

  useEffect(() => {
    if (!activeOrder) return;
    setSecondsRemaining((activeOrder.prepMinutes || 8) * 60);

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    const stageTimer1 = setTimeout(() => setPrepStage(2), 6000);
    const stageTimer2 = setTimeout(() => setPrepStage(3), 18000);

    return () => {
      clearInterval(timer);
      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);
    };
  }, [activeOrder]);

  if (!activeOrder) return null;

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-dispatch-title"
      onClick={() => setActiveOrder(null)}
    >
      <div 
        className="relative w-full max-w-md bg-[#FBF9F5] dark:bg-[#161513] rounded-t-3xl sm:rounded-2xl border-t sm:border border-[#E8E4DC] dark:border-[#262420] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col text-left transition-colors animate-in slide-in-from-bottom-4 duration-300 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag Indicator */}
        <div className="sm:hidden w-12 h-1.5 bg-[#D5CFBF] dark:bg-[#38342E] rounded-full mx-auto mt-3 mb-1" />

        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#F3EFE6] dark:bg-[#1C1B18] border-b border-[#E8E4DC] dark:border-[#262420] text-center relative">
          <button
            onClick={() => setActiveOrder(null)}
            aria-label="Close Confirmation"
            className="absolute top-4 right-4 min-h-[36px] min-w-[36px] flex items-center justify-center rounded-full border border-[#D5CFBF] dark:border-[#38342E] text-[#666056] dark:text-[#A09A8E] hover:text-[#1A1816] active:scale-90 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>

          <div className="w-12 h-12 rounded-full bg-[#2E7D32] text-white flex items-center justify-center mx-auto mb-3 shadow-md">
            <Check className="w-6 h-6 stroke-[2.5]" aria-hidden="true" />
          </div>

          <h2 id="order-dispatch-title" className="font-serif font-bold text-xl sm:text-2xl text-[#1A1816] dark:text-[#EAE6DF]">
            Order #{activeOrder.orderId} Confirmed
          </h2>
          <p className="text-xs text-[#666056] dark:text-[#A09A8E] mt-1">
            We're preparing your order for pickup at the counter.
          </p>
        </div>

        {/* Live Prep Status */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 text-sm overflow-y-auto flex-1">
          
          {/* Estimated Timer Box */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-[#F3EFE6] dark:bg-[#1C1B18] border border-[#E0DACB] dark:border-[#302D27] flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#666056] dark:text-[#A09A8E]">
              <Clock className="w-4 h-4 text-[#C84B31]" aria-hidden="true" />
              <span>Estimated Time:</span>
            </div>
            <span className="font-serif font-bold text-xl text-[#C84B31]">
              {formattedTime}
            </span>
          </div>

          {/* 3 Step Indicator */}
          <div className="grid grid-cols-3 gap-2 text-xs text-center">
            <div className={`p-2.5 rounded-xl border font-semibold ${prepStage >= 1 ? 'border-[#1A1816] dark:border-[#EAE6DF] bg-[#1A1816] dark:bg-[#EAE6DF] text-[#FBF9F5] dark:text-[#11100F]' : 'border-[#E0DACB] dark:border-[#302D27] text-[#888276]'}`}>
              Grinding
            </div>
            <div className={`p-2.5 rounded-xl border font-semibold ${prepStage >= 2 ? 'border-[#1A1816] dark:border-[#EAE6DF] bg-[#1A1816] dark:bg-[#EAE6DF] text-[#FBF9F5] dark:text-[#11100F]' : 'border-[#E0DACB] dark:border-[#302D27] text-[#888276]'}`}>
              Brewing
            </div>
            <div className={`p-2.5 rounded-xl border font-semibold ${prepStage >= 3 ? 'border-[#1A1816] dark:border-[#EAE6DF] bg-[#1A1816] dark:bg-[#EAE6DF] text-[#FBF9F5] dark:text-[#11100F]' : 'border-[#E0DACB] dark:border-[#302D27] text-[#888276]'}`}>
              Ready
            </div>
          </div>

          {/* Pickup Details */}
          <div className="p-3.5 rounded-xl bg-[#F3EFE6] dark:bg-[#1C1B18] border border-[#E0DACB] dark:border-[#302D27] text-xs space-y-1 text-[#666056] dark:text-[#A09A8E]">
            <div className="flex justify-between">
              <span>Name on Order:</span>
              <strong className="text-[#1A1816] dark:text-[#EAE6DF]">{activeOrder.pickupName}</strong>
            </div>
            <div className="flex justify-between">
              <span>Pickup Spot:</span>
              <strong className="text-[#1A1816] dark:text-[#EAE6DF]">Front Counter</strong>
            </div>
          </div>

          {/* Item Breakdown */}
          <div className="space-y-2 border-t border-[#E8E4DC] dark:border-[#262420] pt-3 max-h-32 overflow-y-auto">
            {activeOrder.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-xs text-[#1A1816] dark:text-[#EAE6DF]">
                <span>{item.quantity}× {item.name}</span>
                <span className="font-semibold">${(item.unitPrice * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* Total Paid & Tasting Pass Progress */}
          <div className="border-t border-[#E8E4DC] dark:border-[#262420] pt-3 flex justify-between text-sm font-bold text-[#1A1816] dark:text-[#EAE6DF]">
            <span>Total Paid:</span>
            <span className="text-[#C84B31]">${activeOrder.total.toFixed(2)}</span>
          </div>

          {/* Actions */}
          <div className="flex gap-2.5 pt-1">
            <button
              onClick={() => window.print()}
              className="flex-1 min-h-[44px] py-2.5 px-4 rounded-xl border border-[#D5CFBF] dark:border-[#38342E] text-xs font-semibold text-[#1A1816] dark:text-[#EAE6DF] hover:border-[#1A1816] active:scale-98 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Receipt</span>
            </button>
            <button
              onClick={() => setActiveOrder(null)}
              className="flex-1 min-h-[44px] py-2.5 px-4 rounded-xl bg-[#1A1816] dark:bg-[#EAE6DF] text-[#FBF9F5] dark:text-[#11100F] text-xs font-semibold hover:bg-[#C84B31] active:scale-98 transition-all cursor-pointer"
            >
              Done
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
