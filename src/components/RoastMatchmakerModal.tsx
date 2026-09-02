import React, { useState } from 'react';
import { X, ArrowRight, Zap, RotateCcw, Compass } from 'lucide-react';
import { ROASTERY_BEANS } from '../data/roasteryData';
import { useStore } from '../context/StoreContext';
import { useSubscription } from '../context/SubscriptionContext';

interface QuizState {
  brewMethod: string;
  flavorPreference: string;
  milkPreference: string;
}

export const RoastMatchmakerModal: React.FC = () => {
  const { isMatchmakerOpen, setIsMatchmakerOpen } = useStore();
  const { openSubscriptionModalFor } = useSubscription();

  const [step, setStep] = useState<number>(1);
  const [answers, setAnswers] = useState<QuizState>({
    brewMethod: '',
    flavorPreference: '',
    milkPreference: '',
  });

  if (!isMatchmakerOpen) return null;

  const handleSelectAnswer = (key: keyof QuizState, value: string) => {
    const updated = { ...answers, [key]: value };
    setAnswers(updated);
    if (step < 3) {
      setStep(step + 1);
    } else {
      setStep(4); // Result screen
    }
  };

  // Palate Matching Algorithm
  const getMatchedBean = () => {
    const { brewMethod, flavorPreference, milkPreference } = answers;

    if (flavorPreference === 'floral' || (brewMethod === 'pourover' && milkPreference === 'black')) {
      return ROASTERY_BEANS.find((b) => b.id === 'ethiopia-yirgacheffe-aricha') || ROASTERY_BEANS[0];
    }
    if (flavorPreference === 'fruity' || brewMethod === 'coldbrew') {
      return ROASTERY_BEANS.find((b) => b.id === 'colombia-huila-pink-bourbon') || ROASTERY_BEANS[1];
    }
    if (flavorPreference === 'citrus' || (flavorPreference === 'bright' && brewMethod === 'pourover')) {
      return ROASTERY_BEANS.find((b) => b.id === 'kenya-nyeri-hill-aa') || ROASTERY_BEANS[3];
    }
    if (flavorPreference === 'deep' || brewMethod === 'espresso' || milkPreference === 'milk') {
      return ROASTERY_BEANS.find((b) => b.id === 'kissa-dark-velvet-blend') || ROASTERY_BEANS[4];
    }
    return ROASTERY_BEANS.find((b) => b.id === 'guatemala-huehuetenango-antigua') || ROASTERY_BEANS[2];
  };

  const matchedBean = getMatchedBean();

  const resetQuiz = () => {
    setStep(1);
    setAnswers({ brewMethod: '', flavorPreference: '', milkPreference: '' });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="matchmaker-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-xl flex flex-col bg-paper dark:bg-dark-card border border-hairline dark:border-dark-hairline shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 bg-paper-dim dark:bg-dark-subtle border-b border-hairline dark:border-dark-hairline flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Compass className="w-5 h-5 text-vermillion dark:text-dark-vermillion animate-spin-slow" />
            <h2 id="matchmaker-modal-title" className="font-serif font-bold text-xl sm:text-2xl text-ink dark:text-dark-text-main">
              Find Your Ideal Roast
            </h2>
          </div>

          <button
            onClick={() => {
              setIsMatchmakerOpen(false);
              resetQuiz();
            }}
            aria-label="Close Quiz"
            className="min-h-[38px] min-w-[38px] flex items-center justify-center text-ink-muted hover:text-ink dark:hover:text-dark-text-main cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quiz Progress Bar */}
        <div className="w-full bg-paper-dim dark:bg-dark-canvas h-1">
          <div
            className="bg-vermillion dark:bg-dark-vermillion h-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-8 text-ink dark:text-dark-text-main">
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-200">
              <div className="space-y-1">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-vermillion dark:text-dark-vermillion">
                  Step 1 of 3 • Brewing Routine
                </span>
                <h3 className="font-serif text-2xl font-bold">
                  How do you brew coffee at home?
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { id: 'pourover', title: 'Pour-Over / Chemex', desc: 'V60, Kalita, or glass cone' },
                  { id: 'espresso', title: 'Espresso / Moka Pot', desc: 'High-pressure portafilter or stovetop' },
                  { id: 'frenchpress', title: 'French Press / Immersion', desc: 'Full-bodied steeped cup' },
                  { id: 'drip', title: 'Automatic Drip Maker', desc: 'Daily batch pot / Moccamaster' },
                  { id: 'coldbrew', title: 'Cold Brew / Iced', desc: 'Slow steeped chilled batch' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectAnswer('brewMethod', opt.id)}
                    className="p-3.5 text-left border border-hairline dark:border-dark-hairline bg-paper-dim dark:bg-dark-subtle hover:border-ink dark:hover:border-dark-text-main hover:bg-paper dark:hover:bg-dark-canvas active:scale-98 transition-all cursor-pointer"
                  >
                    <span className="font-bold text-xs sm:text-sm block">{opt.title}</span>
                    <span className="text-[11px] text-ink-muted dark:text-dark-text-muted">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-200">
              <div className="space-y-1">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-vermillion dark:text-dark-vermillion">
                  Step 2 of 3 • Flavor Palate
                </span>
                <h3 className="font-serif text-2xl font-bold">
                  What tasting notes excite you most?
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { id: 'floral', title: 'Bright & Floral', desc: 'Jasmine, bergamot, white peach' },
                  { id: 'fruity', title: 'Wild Berry & Jammy', desc: 'Strawberry, pink grapefruit, panela' },
                  { id: 'citrus', title: 'Sparkling Citrus & Cassis', desc: 'Blackcurrant, Meyer lemon, crisp acidity' },
                  { id: 'chocolate', title: 'Balanced Milk Chocolate', desc: 'Toffee crisp, red apple, praline' },
                  { id: 'deep', title: 'Dark Truffle & Smokey', desc: 'Dark cacao, hazelnut, cedar wood' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectAnswer('flavorPreference', opt.id)}
                    className="p-3.5 text-left border border-hairline dark:border-dark-hairline bg-paper-dim dark:bg-dark-subtle hover:border-ink dark:hover:border-dark-text-main hover:bg-paper dark:hover:bg-dark-canvas active:scale-98 transition-all cursor-pointer"
                  >
                    <span className="font-bold text-xs sm:text-sm block">{opt.title}</span>
                    <span className="text-[11px] text-ink-muted dark:text-dark-text-muted">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-200">
              <div className="space-y-1">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-vermillion dark:text-dark-vermillion">
                  Step 3 of 3 • Drinking Style
                </span>
                <h3 className="font-serif text-2xl font-bold">
                  Do you add milk or drink it black?
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'black', title: 'Pure Black', desc: 'I want to taste the full clarity and terroir of the bean' },
                  { id: 'milk', title: 'With Milk / Oat / Cream', desc: 'I love silky lattes, cortados, or a splash of oat milk' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectAnswer('milkPreference', opt.id)}
                    className="p-4 text-left border border-hairline dark:border-dark-hairline bg-paper-dim dark:bg-dark-subtle hover:border-ink dark:hover:border-dark-text-main hover:bg-paper dark:hover:bg-dark-canvas active:scale-98 transition-all cursor-pointer"
                  >
                    <span className="font-bold text-sm block">{opt.title}</span>
                    <span className="text-xs text-ink-muted dark:text-dark-text-muted mt-1 block">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && matchedBean && (
            <div className="space-y-6 animate-in zoom-in-95 duration-200">
              {/* Match Score Badge */}
              <div className="flex items-center justify-between border-b border-hairline/60 dark:border-dark-hairline/60 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    98% Palate Match Found
                  </span>
                </div>
                <button
                  onClick={resetQuiz}
                  className="inline-flex items-center gap-1 text-xs font-mono text-ink-muted hover:text-ink cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Retake</span>
                </button>
              </div>

              {/* Matched Bean Showcase */}
              <div className="p-4 sm:p-5 bg-paper-dim dark:bg-dark-subtle border border-hairline dark:border-dark-hairline space-y-4">
                <div className="flex items-start gap-4">
                  <img
                    src={matchedBean.image}
                    alt={matchedBean.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover border border-hairline shrink-0"
                  />
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-vermillion/10 text-vermillion dark:text-dark-vermillion px-2 py-0.5 border border-vermillion/30">
                      {matchedBean.badge}
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-ink dark:text-dark-text-main mt-1 leading-snug">
                      {matchedBean.name}
                    </h3>
                    <p className="text-xs font-mono text-ink-muted dark:text-dark-text-muted">
                      {matchedBean.origin} • Cupping {matchedBean.cuppingScore}/100
                    </p>
                  </div>
                </div>

                <p className="text-xs text-ink-muted dark:text-dark-text-muted leading-relaxed">
                  {matchedBean.description}
                </p>

                {/* Tasting notes */}
                <div className="flex flex-wrap gap-1">
                  {matchedBean.tastingNotes.map((note) => (
                    <span
                      key={note}
                      className="px-2 py-0.5 text-[11px] font-mono bg-paper dark:bg-dark-canvas border border-hairline dark:border-dark-hairline"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsMatchmakerOpen(false);
                    openSubscriptionModalFor(matchedBean);
                  }}
                  className="min-h-[44px] px-4 py-2.5 bg-ink dark:bg-dark-text-main text-paper dark:text-dark-canvas hover:bg-vermillion text-xs sm:text-sm font-bold flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer shadow-md"
                >
                  <Zap className="w-4 h-4 text-vermillion dark:text-dark-canvas fill-current" />
                  <span>Subscribe & Save 15%</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsMatchmakerOpen(false);
                    openSubscriptionModalFor(matchedBean);
                  }}
                  className="min-h-[44px] px-4 py-2.5 bg-paper dark:bg-dark-subtle border border-hairline dark:border-dark-hairline text-ink dark:text-dark-text-main text-xs sm:text-sm font-bold flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
                >
                  <span>Buy One-Time Bag</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
