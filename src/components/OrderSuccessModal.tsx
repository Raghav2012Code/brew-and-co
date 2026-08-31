import React, { useState, useEffect } from 'react';
import { Check, Clock, Printer } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export const OrderSuccessModal: React.FC = () => {
  const { activeOrder, setActiveOrder } = useStore();
  const initialSeconds = activeOrder?.prepMinutes ? activeOrder.prepMinutes * 60 : 480;
  const [secondsRemaining, setSecondsRemaining] = useState(initialSeconds);
  const [prepStage, setPrepStage] = useState(1);

  useEffect(() => {
    if (!activeOrder) return;

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
    <Dialog open={Boolean(activeOrder)} onOpenChange={(open) => !open && setActiveOrder(null)}>
      <DialogContent className="max-w-md p-0 bg-paper dark:bg-dark-subtle border border-hairline dark:border-dark-hairline flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <DialogHeader className="p-5 sm:p-6 bg-paper-dim dark:bg-dark-card border-b border-hairline dark:border-dark-hairline text-center items-center">
          <div className="w-12 h-12 bg-ink text-paper dark:bg-dark-text-main dark:text-dark-canvas flex items-center justify-center mx-auto mb-3 shadow-md">
            <Check className="w-6 h-6 stroke-[2.5]" aria-hidden="true" />
          </div>

          <DialogTitle className="font-serif font-bold text-xl sm:text-2xl text-ink dark:text-dark-text-main">
            Order #{activeOrder.orderId} Confirmed
          </DialogTitle>
          <p className="text-xs font-mono text-ink-muted dark:text-dark-text-muted mt-1">
            We're preparing your order for pickup at the counter.
          </p>
        </DialogHeader>

        {/* Live Prep Status */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 text-sm overflow-y-auto flex-1">
          
          {/* Estimated Timer Box */}
          <div className="p-3.5 sm:p-4 bg-paper-dim dark:bg-dark-card border border-hairline dark:border-dark-hairline flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-ink-muted dark:text-dark-text-muted">
              <Clock className="w-4 h-4 text-vermillion dark:text-dark-vermillion" aria-hidden="true" />
              <span>Estimated Time:</span>
            </div>
            <span className="font-mono font-bold text-xl text-vermillion dark:text-dark-vermillion">
              {formattedTime}
            </span>
          </div>

          {/* 3 Step Indicator */}
          <div className="grid grid-cols-3 gap-2 text-xs text-center font-mono uppercase tracking-wider">
            <div className={`p-2.5 border font-semibold ${prepStage >= 1 ? 'border-ink dark:border-dark-text-main bg-ink dark:bg-dark-text-main text-paper dark:text-dark-canvas' : 'border-hairline dark:border-dark-hairline text-ink-faint'}`}>
              Grinding
            </div>
            <div className={`p-2.5 border font-semibold ${prepStage >= 2 ? 'border-ink dark:border-dark-text-main bg-ink dark:bg-dark-text-main text-paper dark:text-dark-canvas' : 'border-hairline dark:border-dark-hairline text-ink-faint'}`}>
              Brewing
            </div>
            <div className={`p-2.5 border font-semibold ${prepStage >= 3 ? 'border-ink dark:border-dark-text-main bg-ink dark:bg-dark-text-main text-paper dark:text-dark-canvas' : 'border-hairline dark:border-dark-hairline text-ink-faint'}`}>
              Ready
            </div>
          </div>

          {/* Pickup Details */}
          <div className="p-3.5 bg-paper-dim dark:bg-dark-card border border-hairline dark:border-dark-hairline text-xs font-mono space-y-1 text-ink-muted dark:text-dark-text-muted">
            <div className="flex justify-between">
              <span>Name on Order:</span>
              <strong className="text-ink dark:text-dark-text-main">{activeOrder.pickupName}</strong>
            </div>
            <div className="flex justify-between">
              <span>Pickup Spot:</span>
              <strong className="text-ink dark:text-dark-text-main">Front Counter</strong>
            </div>
          </div>

          {/* Item Breakdown */}
          <div className="space-y-2 border-t border-hairline dark:border-dark-hairline pt-3 max-h-32 overflow-y-auto">
            {activeOrder.items.map((item: any, idx: number) => (
              <div key={idx} className="flex justify-between text-xs text-ink dark:text-dark-text-main font-mono">
                <span>{item.quantity}× {item.name}</span>
                <span className="font-semibold">${(item.unitPrice * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* Total Paid */}
          <div className="border-t border-hairline dark:border-dark-hairline pt-3 flex justify-between text-sm font-bold text-ink dark:text-dark-text-main">
            <span>Total Paid:</span>
            <span className="text-vermillion dark:text-dark-vermillion font-mono">${activeOrder.total.toFixed(2)}</span>
          </div>

          {/* Actions */}
          <div className="flex gap-2.5 pt-1">
            <Button
              onClick={() => window.print()}
              variant="outline"
              size="default"
              className="flex-1"
            >
              <Printer className="w-3.5 h-3.5 mr-1" />
              <span>Print</span>
            </Button>
            <Button
              onClick={() => setActiveOrder(null)}
              variant="editorial"
              size="default"
              className="flex-1"
            >
              Done
            </Button>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
};
