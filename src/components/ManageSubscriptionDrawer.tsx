import React, { useState } from 'react';
import {
  Sparkles,
  Pause,
  Play,
  RotateCcw,
  Trash2,
  Package,
  ShieldCheck,
} from 'lucide-react';
import { useSubscription, ActiveSubscription } from '../context/SubscriptionContext';
import { SUBSCRIPTION_FREQUENCIES, GRIND_PROFILES } from '../data/roasteryData';
import { toast } from 'sonner';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

export const ManageSubscriptionDrawer: React.FC = () => {
  const {
    subscriptions,
    isManageDrawerOpen,
    setIsManageDrawerOpen,
    pauseSubscription,
    resumeSubscription,
    cancelSubscription,
    updateFrequency,
    updateGrind,
  } = useSubscription();

  const [editingSubId, setEditingSubId] = useState<string | null>(null);

  const handlePauseToggle = (sub: ActiveSubscription) => {
    if (sub.status === 'active') {
      pauseSubscription(sub.id);
      toast.info(`Paused subscription for ${sub.beanName}`);
    } else {
      resumeSubscription(sub.id);
      // Compute fresh dispatch date since state update is async and sub.nextDispatchDate is stale
      const freq = SUBSCRIPTION_FREQUENCIES.find((f) => f.id === sub.frequencyId);
      const days = freq?.days || 7;
      const next = new Date();
      next.setDate(next.getDate() + days);
      const nextStr = next.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
      toast.success(`Resumed subscription for ${sub.beanName}!`, {
        description: `Next roast scheduled for ${nextStr}.`,
      });
    }
  };

  const handleCancel = (sub: ActiveSubscription) => {
    if (window.confirm(`Are you sure you want to cancel your recurring subscription for ${sub.beanName}?`)) {
      cancelSubscription(sub.id);
      toast.info(`Cancelled subscription for ${sub.beanName}`);
    }
  };

  return (
    <Sheet open={isManageDrawerOpen} onOpenChange={setIsManageDrawerOpen}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 bg-paper dark:bg-dark-subtle border-l border-hairline dark:border-dark-hairline flex flex-col justify-between"
      >
        {/* Header */}
        <SheetHeader className="p-4 sm:p-6 bg-paper-dim dark:bg-dark-card border-b border-hairline dark:border-dark-hairline flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-vermillion dark:text-dark-vermillion" aria-hidden="true" />
            <SheetTitle className="font-serif font-bold text-lg sm:text-xl text-ink dark:text-dark-text-main">
              Subscription Vault
            </SheetTitle>
          </div>
        </SheetHeader>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 text-sm text-ink dark:text-dark-text-main">
          {subscriptions.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <Package className="w-10 h-10 mx-auto text-ink-muted dark:text-dark-text-muted stroke-[1.5]" />
              <h3 className="font-serif text-xl font-bold text-ink dark:text-dark-text-main">
                No Active Subscriptions
              </h3>
              <p className="text-xs text-ink-muted dark:text-dark-text-muted max-w-xs mx-auto">
                Subscribe to your favorite micro-lot beans for recurring doorstep delivery and 15% savings.
              </p>
              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  setIsManageDrawerOpen(false);
                  const el = document.getElementById('roastery');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="mt-2"
              >
                Browse Roastery Beans
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-ink-muted dark:text-dark-text-muted">
                Manage your recurring roast deliveries. Changes take effect on the next scheduled dispatch.
              </p>

              {subscriptions.map((sub) => {
                const isEditing = editingSubId === sub.id;
                const isPaused = sub.status === 'paused';

                return (
                  <div
                    key={sub.id}
                    className={`p-4 border transition-all ${
                      isPaused
                        ? 'border-hairline/60 dark:border-dark-hairline/60 bg-paper-dim/50 dark:bg-dark-card/50 opacity-80'
                        : 'border-hairline dark:border-dark-hairline bg-paper-dim dark:bg-dark-card shadow-xs'
                    }`}
                  >
                    {/* Top Row: Roast Info + Status Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider ${
                              isPaused
                                ? 'bg-ink-muted/15 text-ink-muted dark:text-dark-text-muted'
                                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            }`}
                          >
                            {isPaused ? 'Paused' : 'Active Dispatch'}
                          </span>
                          <span className="text-[11px] font-mono text-ink-muted dark:text-dark-text-muted">
                            {sub.roastLevel} Roast
                          </span>
                        </div>
                        <h4 className="font-serif font-bold text-base text-ink dark:text-dark-text-main mt-1">
                          {sub.beanName}
                        </h4>
                        <p className="text-xs text-ink-muted dark:text-dark-text-muted">
                          {sub.origin}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="font-mono font-bold text-sm text-vermillion dark:text-dark-vermillion">
                          ${sub.unitPrice.toFixed(2)}
                        </span>
                        <span className="text-[10px] font-mono text-ink-muted dark:text-dark-text-muted block">
                          / dispatch
                        </span>
                      </div>
                    </div>

                    {/* Meta tags */}
                    <div className="mt-3 p-2.5 bg-paper dark:bg-dark-canvas border border-hairline dark:border-dark-hairline space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-ink-muted dark:text-dark-text-muted">Grind:</span>
                        <strong className="text-ink dark:text-dark-text-main font-mono text-[11px]">
                          {sub.grindName}
                        </strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-ink-muted dark:text-dark-text-muted">Bag Size:</span>
                        <strong className="text-ink dark:text-dark-text-main font-mono text-[11px]">
                          {sub.bagSizeName}
                        </strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-ink-muted dark:text-dark-text-muted">Cadence:</span>
                        <strong className="text-ink dark:text-dark-text-main font-mono text-[11px]">
                          {sub.frequencyName}
                        </strong>
                      </div>
                      <div className="flex justify-between pt-1 border-t border-hairline/40 dark:border-dark-hairline/40 font-mono text-[11px]">
                        <span className="text-ink-muted dark:text-dark-text-muted">Next Roast:</span>
                        <span className="font-bold text-ink dark:text-dark-text-main">
                          {sub.nextDispatchDate}
                        </span>
                      </div>
                    </div>

                    {/* Edit Form (Expanded) */}
                    {isEditing && (
                      <div className="mt-3 p-3 bg-paper dark:bg-dark-subtle border border-ink/20 dark:border-dark-text-main/20 space-y-3 animate-in fade-in duration-150">
                        <div>
                          <label className="text-[11px] font-mono font-bold text-ink-muted dark:text-dark-text-muted block mb-1">
                            Change Frequency:
                          </label>
                          <select
                            value={sub.frequencyId}
                            onChange={(e) => updateFrequency(sub.id, e.target.value)}
                            className="w-full p-2 text-xs bg-paper-dim dark:bg-dark-card border border-hairline dark:border-dark-hairline text-ink dark:text-dark-text-main focus:outline-none"
                          >
                            {SUBSCRIPTION_FREQUENCIES.filter((f) => f.id !== 'onetime').map((freq) => (
                              <option key={freq.id} value={freq.id}>
                                {freq.name} ({freq.discountPct}% off)
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-[11px] font-mono font-bold text-ink-muted dark:text-dark-text-muted block mb-1">
                            Change Grind Profile:
                          </label>
                          <select
                            value={sub.grindId}
                            onChange={(e) => updateGrind(sub.id, e.target.value)}
                            className="w-full p-2 text-xs bg-paper-dim dark:bg-dark-card border border-hairline dark:border-dark-hairline text-ink dark:text-dark-text-main focus:outline-none"
                          >
                            {GRIND_PROFILES.map((grind) => (
                              <option key={grind.id} value={grind.id}>
                                {grind.name} ({grind.micron})
                              </option>
                            ))}
                          </select>
                        </div>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingSubId(null)}
                          className="w-full text-xs"
                        >
                          Done Editing
                        </Button>
                      </div>
                    )}

                    {/* Action Controls */}
                    <div className="mt-3 pt-2 border-t border-hairline/60 dark:border-dark-hairline/60 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handlePauseToggle(sub)}
                          className="min-h-[34px] px-2.5 py-1 text-xs font-mono font-medium border border-hairline dark:border-dark-hairline bg-paper dark:bg-dark-canvas hover:border-ink dark:hover:border-dark-text-main flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          {isPaused ? (
                            <>
                              <Play className="w-3 h-3 text-emerald-600" />
                              <span>Resume</span>
                            </>
                          ) : (
                            <>
                              <Pause className="w-3 h-3 text-amber-600" />
                              <span>Pause</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => setEditingSubId(isEditing ? null : sub.id)}
                          className="min-h-[34px] px-2.5 py-1 text-xs font-mono font-medium border border-hairline dark:border-dark-hairline bg-paper dark:bg-dark-canvas hover:border-ink dark:hover:border-dark-text-main flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>{isEditing ? 'Close' : 'Adjust'}</span>
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCancel(sub)}
                        aria-label="Cancel subscription"
                        className="min-h-[34px] px-2 text-ink-faint hover:text-vermillion dark:hover:text-dark-vermillion transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 sm:p-6 bg-paper-dim dark:bg-dark-card border-t border-hairline dark:border-dark-hairline">
          <div className="flex items-center gap-2 text-xs text-ink-muted dark:text-dark-text-muted">
            <ShieldCheck className="w-4 h-4 text-vermillion dark:text-dark-vermillion shrink-0" />
            <span>Zero lock-in. Skip weeks or swap roast profiles anytime.</span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
