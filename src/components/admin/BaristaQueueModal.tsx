import React, { useState, useMemo, useCallback } from 'react';
import { X, Coffee, Flame, CheckCircle2, Printer, ChevronRight, Check, Volume2 } from 'lucide-react';
import { useStore, playBaristaChime } from '../../context/StoreContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { toast } from 'sonner';

export const BaristaQueueModal: React.FC = () => {
  const {
    isBaristaModalOpen,
    setIsBaristaModalOpen,
    liveOrders,
    updateOrderStatus,
    clearCompletedOrders,
  } = useStore();

  const { subscriptions } = useSubscription();

  const [activeTab, setActiveTab] = useState<'barista' | 'roaster'>('barista');
  const [filterStatus, setFilterStatus] = useState<'all' | 'received' | 'brewing' | 'ready' | 'completed'>('all');

  // Compute Weekly Roastery Manifest from active subscriptions with cadence normalization & green coffee shrinkage
  const roasteryManifest = useMemo(() => {
    const manifestByBean: Record<
      string,
      {
        beanName: string;
        totalRoastedGrams: number;
        requiredGreenGrams: number;
        bagsCount: number;
        grinds: Record<string, number>;
      }
    > = {};
    let grandRoastedGrams = 0;
    let grandGreenGrams = 0;

    subscriptions
      .filter((s) => s.status === 'active')
      .forEach((sub) => {
        // Cadence normalization: weekly = 1x, biweekly = 0.5x, monthly = 0.25x
        const cadenceMultiplier =
          sub.frequencyId === 'weekly'
            ? 1.0
            : sub.frequencyId === 'biweekly'
            ? 0.5
            : sub.frequencyId === 'monthly'
            ? 0.25
            : 1.0;

        // Grams per bag size
        const grams = sub.bagSizeId === '1kg' ? 1000 : sub.bagSizeId === '500g' ? 500 : 250;
        const subQuantity = sub.quantity || 1;
        const totalRoastedGrams = grams * subQuantity * cadenceMultiplier;
        // 15.2% shrinkage compensation: Green = Roasted / (1 - 0.152)
        const requiredGreenGrams = totalRoastedGrams / (1 - 0.152);

        grandRoastedGrams += totalRoastedGrams;
        grandGreenGrams += requiredGreenGrams;

        if (!manifestByBean[sub.beanId]) {
          manifestByBean[sub.beanId] = {
            beanName: sub.beanName,
            totalRoastedGrams: 0,
            requiredGreenGrams: 0,
            bagsCount: 0,
            grinds: {},
          };
        }

        manifestByBean[sub.beanId].totalRoastedGrams += totalRoastedGrams;
        manifestByBean[sub.beanId].requiredGreenGrams += requiredGreenGrams;
        manifestByBean[sub.beanId].bagsCount += subQuantity;
        manifestByBean[sub.beanId].grinds[sub.grindName] =
          (manifestByBean[sub.beanId].grinds[sub.grindName] || 0) + subQuantity;
      });

    return {
      items: Object.values(manifestByBean),
      totalRoastedKg: (grandRoastedGrams / 1000).toFixed(2),
      totalGreenKg: (grandGreenGrams / 1000).toFixed(2),
      activeSubsCount: subscriptions.filter((s) => s.status === 'active').length,
    };
  }, [subscriptions]);

  const filteredOrders = liveOrders.filter((order: any) => {
    if (filterStatus === 'all') return order.status !== 'completed';
    return order.status === filterStatus;
  });

  const handleStatusAdvance = useCallback((orderId: string, currentStatus: string) => {
    // No toast: the ticket card itself restyles and re-filters on advance.
    if (currentStatus === 'received') {
      updateOrderStatus(orderId, 'brewing');
    } else if (currentStatus === 'brewing') {
      updateOrderStatus(orderId, 'ready');
    } else if (currentStatus === 'ready') {
      updateOrderStatus(orderId, 'completed');
    }
  }, [updateOrderStatus]);

  if (!isBaristaModalOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="barista-kds-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => setIsBaristaModalOpen(false)}
    >
      <div
        className="relative w-full max-w-5xl h-[94vh] flex flex-col bg-paper dark:bg-dark-card border border-hairline dark:border-dark-hairline shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top KDS Header */}
        <div className="p-4 sm:p-5 bg-surface dark:bg-dark-subtle border-b border-hairline dark:border-dark-hairline flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-none bg-vermillion text-paper dark:text-dark-canvas flex items-center justify-center font-mono font-bold text-xs shadow-xs">
              KDS
            </div>
            <div>
              <h2 id="barista-kds-title" className="font-serif font-bold text-xl sm:text-2xl text-ink dark:text-dark-text-main leading-tight flex items-center gap-2">
                <span>Roastery & Barista Operations Station</span>
              </h2>
              <p className="text-xs font-mono text-ink-muted dark:text-dark-text-muted">
                Real-Time Ticket Rail • Batch Roast Manifest
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Test Button */}
            <button
              type="button"
              onClick={() => {
                playBaristaChime('ready');
                toast.info('Test chime played');
              }}
              title="Test Barista Chime"
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-mono border border-hairline dark:border-dark-hairline bg-paper dark:bg-dark-canvas text-ink-muted hover:text-ink dark:hover:text-dark-text-main cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Chime</span>
            </button>

            <button
              onClick={() => setIsBaristaModalOpen(false)}
              aria-label="Close Operations Station"
              className="min-h-[38px] min-w-[38px] flex items-center justify-center border border-hairline dark:border-dark-hairline bg-paper dark:bg-dark-canvas text-ink-muted hover:text-ink dark:hover:text-dark-text-main cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Rail */}
        <div className="px-4 sm:px-6 bg-paper dark:bg-dark-canvas border-b border-hairline dark:border-dark-hairline flex items-center justify-between gap-4">
          <div className="flex items-center gap-1 sm:gap-2 pt-2">
            <button
              type="button"
              onClick={() => setActiveTab('barista')}
              className={`px-4 py-2.5 text-xs font-mono font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
                activeTab === 'barista'
                  ? 'border-vermillion text-vermillion dark:text-dark-vermillion'
                  : 'border-transparent text-ink-muted dark:text-dark-text-muted hover:text-ink dark:hover:text-dark-text-main'
              }`}
            >
              <Coffee className="w-4 h-4" />
              <span>Live Barista Rail ({filteredOrders.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('roaster')}
              className={`px-4 py-2.5 text-xs font-mono font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
                activeTab === 'roaster'
                  ? 'border-vermillion text-vermillion dark:text-dark-vermillion'
                  : 'border-transparent text-ink-muted dark:text-dark-text-muted hover:text-ink dark:hover:text-dark-text-main'
              }`}
            >
              <Flame className="w-4 h-4" />
              <span>Roast & Grind Manifest ({roasteryManifest.totalRoastedKg} kg)</span>
            </button>
          </div>

          {activeTab === 'barista' && (
            <div className="hidden sm:flex items-center gap-1.5 py-1.5">
              {(['all', 'received', 'brewing', 'ready', 'completed'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-2.5 py-1 text-[11px] font-mono capitalize transition-colors cursor-pointer ${
                    filterStatus === st
                      ? 'bg-ink dark:bg-dark-text-main text-paper dark:text-dark-canvas font-bold'
                      : 'bg-surface dark:bg-dark-subtle text-ink-muted dark:text-dark-text-muted border border-hairline/60'
                  }`}
                >
                  {st === 'all' ? 'Active' : st}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-surface/40 dark:bg-dark-subtle/40">
          {activeTab === 'barista' ? (
            /* TAB 1: BARISTA TICKET RAIL */
            <div>
              {filteredOrders.length === 0 ? (
                <div className="py-24 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-500 stroke-[1.5]" />
                  <h3 className="font-serif text-2xl font-bold text-ink dark:text-dark-text-main">
                    All Orders Clear & Dispatched
                  </h3>
                  <p className="text-xs text-ink-muted dark:text-dark-text-muted font-mono max-w-sm mx-auto">
                    New customer drink orders placed in the cafe or online will ring into this rail instantly with audio alerts.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredOrders.map((order: any) => {
                    const isReceived = order.status === 'received';
                    const isBrewing = order.status === 'brewing';
                    const isReady = order.status === 'ready';
                    const isCompleted = order.status === 'completed';

                    return (
                      <div
                        key={order.orderId}
                        className={`relative flex flex-col justify-between border transition-[color,background-color,border-color,opacity,transform] duration-200 shadow-sm ${
                          isCompleted
                            ? 'border-hairline dark:border-dark-hairline bg-paper/60 dark:bg-dark-card/60 opacity-80'
                            : isReady
                            ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20'
                            : isBrewing
                            ? 'border-vermillion bg-paper dark:bg-dark-card ring-1 ring-vermillion/40'
                            : 'border-hairline dark:border-dark-hairline bg-paper dark:bg-dark-card'
                        }`}
                      >
                        {/* Brass Rail Clip simulation */}
                        <div className="h-1.5 w-full bg-linear-to-r from-amber-600 via-amber-400 to-amber-700 opacity-80" />

                        {/* Ticket Header */}
                        <div className="p-4 border-b border-hairline/60 dark:border-dark-hairline/60 flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-base font-bold text-ink dark:text-dark-text-main">
                                #{order.orderId}
                              </span>
                              <span
                                className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider ${
                                  isCompleted
                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                    : isReady
                                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 animate-pulse'
                                    : isBrewing
                                    ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                                    : 'bg-ink-muted/15 text-ink-muted dark:text-dark-text-muted'
                                }`}
                              >
                                {order.status}
                              </span>
                            </div>
                            <h4 className="font-sans font-bold text-sm text-ink dark:text-dark-text-main mt-1">
                              {order.pickupName}
                            </h4>
                          </div>

                          <div className="text-right font-mono text-[11px] text-ink-muted dark:text-dark-text-muted">
                            <div>{order.timestamp}</div>
                            <div className="text-[10px] text-vermillion dark:text-dark-vermillion font-bold">
                              ${order.total?.toFixed(2)}
                            </div>
                          </div>
                        </div>

                        {/* Item lines */}
                        <div className="p-4 space-y-3 flex-1 text-xs">
                          {order.items?.map((item: any, idx: number) => (
                            <div key={idx} className="space-y-1 pb-2 border-b border-hairline/30 dark:border-dark-hairline/30 last:border-0 last:pb-0">
                              <div className="flex justify-between items-baseline font-bold text-ink dark:text-dark-text-main">
                                <span>
                                  {item.quantity}x {item.name}
                                </span>
                              </div>

                              {/* Customization pills */}
                              <div className="text-[11px] font-mono text-ink-muted dark:text-dark-text-muted space-y-0.5">
                                {item.options?.size?.name && (
                                  <div>Size: <strong className="text-ink dark:text-dark-text-main">{item.options.size.name}</strong></div>
                                )}
                                {item.options?.temp && (
                                  <div>Temp: <strong className="text-ink dark:text-dark-text-main">{item.options.temp}</strong></div>
                                )}
                                {item.options?.milk?.name && (
                                  <div>Milk: <strong className="text-ink dark:text-dark-text-main">{item.options.milk.name}</strong></div>
                                )}
                                {item.options?.specialNotes && (
                                  <div className="italic text-vermillion dark:text-dark-vermillion">
                                    "{item.options.specialNotes}"
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Status Transition Action Bar */}
                        <div className="p-3 bg-surface dark:bg-dark-subtle border-t border-hairline dark:border-dark-hairline">
                          {isCompleted ? (
                            <div className="w-full min-h-[38px] px-3 py-1.5 text-xs font-mono font-bold flex items-center justify-center gap-1.5 bg-paper dark:bg-dark-card border border-hairline dark:border-dark-hairline text-emerald-600 dark:text-emerald-400 shadow-xs">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Order Completed & Dispatched</span>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleStatusAdvance(order.orderId, order.status)}
                              className={`w-full min-h-[38px] px-3 py-1.5 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-[color,background-color,border-color,opacity,transform] cursor-pointer shadow-xs ${
                                isReceived
                                  ? 'bg-ink dark:bg-dark-text-main text-paper dark:text-dark-canvas hover:bg-vermillion'
                                  : isBrewing
                                  ? 'bg-amber-600 text-white hover:bg-amber-700'
                                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
                              }`}
                            >
                              {isReceived && (
                                <>
                                  <span>Start Brewing</span>
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </>
                              )}
                              {isBrewing && (
                                <>
                                  <span>Mark as Ready (Ring Chime)</span>
                                  <Check className="w-3.5 h-3.5" />
                                </>
                              )}
                              {isReady && (
                                <>
                                  <span>Complete & Hand Off</span>
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* TAB 2: WEEKLY ROAST & GRIND MANIFEST */
            <div className="space-y-6">
              {/* Roastery Summary KPI Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-paper dark:bg-dark-card border border-hairline dark:border-dark-hairline">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-ink-muted dark:text-dark-text-muted block">
                    Total Roasted Batch (Demand)
                  </span>
                  <span className="font-serif text-3xl font-bold text-vermillion dark:text-dark-vermillion mt-1 block">
                    {roasteryManifest.totalRoastedKg} kg
                  </span>
                  <span className="text-[11px] font-mono text-ink-faint">
                    Cadence-normalized weekly roasted weight
                  </span>
                </div>

                <div className="p-4 bg-paper dark:bg-dark-card border border-hairline dark:border-dark-hairline">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-ink-muted dark:text-dark-text-muted block">
                    Required Green Coffee Weight
                  </span>
                  <span className="font-serif text-3xl font-bold text-ink dark:text-dark-text-main mt-1 block">
                    {roasteryManifest.totalGreenKg} kg
                  </span>
                  <span className="text-[11px] font-mono text-ink-faint">
                    With 15.2% shrinkage compensation
                  </span>
                </div>

                <div className="p-4 bg-paper dark:bg-dark-card border border-hairline dark:border-dark-hairline">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-ink-muted dark:text-dark-text-muted block">
                    Active Subscriber Plans
                  </span>
                  <span className="font-serif text-3xl font-bold text-ink dark:text-dark-text-main mt-1 block">
                    {roasteryManifest.activeSubsCount} Plans
                  </span>
                  <span className="text-[11px] font-mono text-ink-faint">
                    Weekly (1x), Bi-Weekly (0.5x), Monthly (0.25x)
                  </span>
                </div>
              </div>

              {/* Manifest Table by Single-Origin */}
              <div className="bg-paper dark:bg-dark-card border border-hairline dark:border-dark-hairline p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-xl font-bold text-ink dark:text-dark-text-main">
                    Roast Batch Breakdown by Origin
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      window.print();
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono border border-hairline dark:border-dark-hairline bg-surface dark:bg-dark-canvas hover:border-ink cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Manifest</span>
                  </button>
                </div>

                {roasteryManifest.items.length === 0 ? (
                  <p className="text-xs font-mono text-ink-muted py-6 text-center">
                    No active bean subscriptions to calculate.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {roasteryManifest.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-surface dark:bg-dark-canvas border border-hairline dark:border-dark-hairline space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-hairline/60 dark:border-dark-hairline/60 pb-2">
                          <div>
                            <h4 className="font-serif font-bold text-lg text-ink dark:text-dark-text-main">
                              {item.beanName}
                            </h4>
                            <span className="text-xs font-mono text-ink-muted dark:text-dark-text-muted">
                              {item.bagsCount} Total Bags Ordered
                            </span>
                          </div>

                          <div className="font-mono text-right space-y-0.5">
                            <div className="text-lg font-bold text-vermillion dark:text-dark-vermillion">
                              {(item.totalRoastedGrams / 1000).toFixed(2)} kg <span className="text-xs font-normal text-ink-muted">roasted</span>
                            </div>
                            <div className="text-xs font-bold text-ink dark:text-dark-text-main">
                              {(item.requiredGreenGrams / 1000).toFixed(2)} kg green required
                            </div>
                            <span className="text-[10px] text-ink-faint block">
                              15.2% shrinkage compensated
                            </span>
                          </div>
                        </div>

                        {/* Grinds distribution */}
                        <div>
                          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-ink-muted dark:text-dark-text-muted block mb-1.5">
                            Grind Calibration Quantities:
                          </span>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                            {Object.entries(item.grinds).map(([grindName, qty]) => (
                              <div
                                key={grindName}
                                className="p-2 bg-paper dark:bg-dark-subtle border border-hairline/70 dark:border-dark-hairline/70 text-xs font-mono flex items-center justify-between"
                              >
                                <span className="text-ink-muted dark:text-dark-text-muted truncate pr-2">
                                  {grindName}:
                                </span>
                                <strong className="text-ink dark:text-dark-text-main font-bold">
                                  {qty} bag{qty > 1 ? 's' : ''}
                                </strong>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 sm:p-5 bg-surface dark:bg-dark-subtle border-t border-hairline dark:border-dark-hairline flex items-center justify-between">
          <div className="text-xs font-mono text-ink-muted dark:text-dark-text-muted">
            Status: <span className="text-emerald-600 font-bold">● Live KDS Stream Active</span>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'barista' && (
              <button
                type="button"
                onClick={() => {
                  // Silent success: the rail empties in place.
                  clearCompletedOrders();
                }}
                className="px-3 py-1.5 text-xs font-mono border border-hairline dark:border-dark-hairline bg-paper dark:bg-dark-canvas text-ink-muted hover:text-ink cursor-pointer"
              >
                Clear Completed
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsBaristaModalOpen(false)}
              className="px-4 py-1.5 text-xs font-mono font-bold bg-ink dark:bg-dark-text-main text-paper dark:text-dark-canvas hover:bg-vermillion cursor-pointer"
            >
              Exit Operations Station
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
