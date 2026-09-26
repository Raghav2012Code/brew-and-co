import React, { useState, useEffect } from 'react';
import { X, ArrowRight, Zap, RotateCcw, Compass } from 'lucide-react';
import { ROASTERY_BEANS } from '../data/roasteryData';
import { useStore } from '../context/StoreContext';
import { useSubscription } from '../context/SubscriptionContext';
import { useTenant } from '../context/TenantContext';

interface QuizState {
  brewMethod: string;
  flavorPreference: string;
  milkPreference: string;
}

export const RoastMatchmakerModal: React.FC = () => {
  const { isMatchmakerOpen, setIsMatchmakerOpen } = useStore();
  const { openSubscriptionModalFor } = useSubscription();
  const { roasteryBeans } = useTenant();

  const [step, setStep] = useState<number>(1);
  const [answers, setAnswers] = useState<QuizState>({
    brewMethod: '',
    flavorPreference: '',
    milkPreference: '',
  });

  const resetQuiz = () => {
    setStep(1);
    setAnswers({ brewMethod: '', flavorPreference: '', milkPreference: '' });
  };

  // Reset quiz state when modal is closed
  useEffect(() => {
    if (!isMatchmakerOpen) {
      resetQuiz();
    }
  }, [isMatchmakerOpen]);

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

  // Weighted Palate Matching Algorithm (Flavor choice 3x weight)
  const getMatchedBean = () => {
    const candidateBeans = roasteryBeans && roasteryBeans.length > 0 ? roasteryBeans : ROASTERY_BEANS;
    const { brewMethod, flavorPreference, milkPreference } = answers;

    if (!candidateBeans || candidateBeans.length === 0) {
      return ROASTERY_BEANS[0];
    }

    const flavorKeywords: Record<string, string[]> = {
      floral: ['floral', 'jasmine', 'bergamot', 'blossom', 'peach', 'tea', 'honey', 'aricha', 'light'],
      fruity: ['fruit', 'fruity', 'berry', 'strawberry', 'grapefruit', 'guava', 'jam', 'bourbon', 'honey'],
      citrus: ['citrus', 'lemon', 'cassis', 'blackcurrant', 'sparkling', 'acid', 'acidity', 'bright', 'kenya'],
      chocolate: ['chocolate', 'toffee', 'praline', 'apple', 'walnut', 'caramel', 'guatemala', 'balanced'],
      deep: ['dark', 'velvet', 'cocoa', 'cacao', 'truffle', 'hazelnut', 'smoke', 'crema', 'espresso', 'moka', 'kissa'],
    };

    const targetKeywords = flavorKeywords[flavorPreference] || [];

    const scored = candidateBeans.map((bean) => {
      let score = 0;
      const beanText = [
        bean.name || '',
        bean.roastLevel || '',
        bean.description || '',
        bean.tagline || '',
        bean.process || '',
        ...(bean.tastingNotes || []),
        bean.flavorProfile?.acidity || '',
        bean.flavorProfile?.body || '',
        bean.flavorProfile?.sweetness || '',
      ].join(' ').toLowerCase();

      // 1. FLAVOR PREFERENCE (3x weight -> 30 pts max)
      const canonicalIds: Record<string, string> = {
        floral: 'ethiopia-yirgacheffe-aricha',
        fruity: 'colombia-huila-pink-bourbon',
        citrus: 'kenya-nyeri-hill-aa',
        chocolate: 'guatemala-huehuetenango-antigua',
        deep: 'kissa-dark-velvet-blend',
      };

      if (canonicalIds[flavorPreference] === bean.id) {
        score += 30;
      } else {
        let keywordHits = 0;
        targetKeywords.forEach((kw) => {
          if (beanText.includes(kw.toLowerCase())) {
            keywordHits += 1;
          }
        });
        score += Math.min(30, keywordHits * 10);
      }

      // 2. BREW METHOD (1x weight -> 10 pts max)
      if (brewMethod === 'pourover') {
        if (bean.roastLevel === 'Light' || bean.roastLevel === 'Medium-Light') score += 10;
        else if (bean.roastLevel === 'Medium') score += 6;
      } else if (brewMethod === 'espresso') {
        if (bean.roastLevel === 'Medium-Dark' || beanText.includes('espresso')) score += 10;
        else if (bean.roastLevel === 'Medium') score += 6;
      } else if (brewMethod === 'frenchpress') {
        if (bean.roastLevel === 'Medium-Dark' || bean.roastLevel === 'Medium') score += 10;
        else score += 5;
      } else if (brewMethod === 'drip') {
        if (bean.roastLevel === 'Medium' || bean.roastLevel === 'Medium-Light') score += 10;
        else score += 6;
      } else if (brewMethod === 'coldbrew') {
        if (beanText.includes('fruity') || bean.roastLevel === 'Medium-Dark' || bean.roastLevel === 'Medium-Light') score += 10;
        else score += 5;
      }

      // 3. MILK PREFERENCE (1x weight -> 10 pts max)
      if (milkPreference === 'milk') {
        if (bean.roastLevel === 'Medium-Dark') score += 10;
        else if (bean.roastLevel === 'Medium') score += 8;
        else score += 3;
      } else if (milkPreference === 'black') {
        if (bean.roastLevel === 'Light' || bean.roastLevel === 'Medium-Light') score += 10;
        else if (bean.roastLevel === 'Medium') score += 7;
        else score += 4;
      }

      return { bean, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored[0]?.bean || candidateBeans[0];
  };

  const matchedBean = getMatchedBean();

  const handleDismiss = () => {
    setIsMatchmakerOpen(false);
    resetQuiz();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="matchmaker-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm anim-overlay"
      onClick={handleDismiss}
    >
      <div
        className="relative w-full max-w-xl flex flex-col bg-paper dark:bg-dark-card border border-hairline dark:border-dark-hairline shadow-2xl overflow-hidden anim-panel"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 bg-surface dark:bg-dark-subtle border-b border-hairline dark:border-dark-hairline flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Compass className="w-5 h-5 text-vermillion dark:text-dark-vermillion" />
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
        <div className="w-full bg-surface dark:bg-dark-canvas h-1">
          <div
            className="bg-vermillion dark:bg-dark-vermillion h-full transition-colors duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-8 text-ink dark:text-dark-text-main">
          {step === 1 && (
            <div className="space-y-5 anim-panel">
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
                    className="p-3.5 text-left border border-hairline dark:border-dark-hairline bg-surface dark:bg-dark-subtle hover:border-ink dark:hover:border-dark-text-main hover:bg-paper dark:hover:bg-dark-canvas transition-[color,background-color,border-color,opacity,transform] cursor-pointer"
                  >
                    <span className="font-bold text-xs sm:text-sm block">{opt.title}</span>
                    <span className="text-[11px] text-ink-muted dark:text-dark-text-muted">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 anim-panel">
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
                    className="p-3.5 text-left border border-hairline dark:border-dark-hairline bg-surface dark:bg-dark-subtle hover:border-ink dark:hover:border-dark-text-main hover:bg-paper dark:hover:bg-dark-canvas transition-[color,background-color,border-color,opacity,transform] cursor-pointer"
                  >
                    <span className="font-bold text-xs sm:text-sm block">{opt.title}</span>
                    <span className="text-[11px] text-ink-muted dark:text-dark-text-muted">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5 anim-panel">
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
                    className="p-4 text-left border border-hairline dark:border-dark-hairline bg-surface dark:bg-dark-subtle hover:border-ink dark:hover:border-dark-text-main hover:bg-paper dark:hover:bg-dark-canvas transition-[color,background-color,border-color,opacity,transform] cursor-pointer"
                  >
                    <span className="font-bold text-sm block">{opt.title}</span>
                    <span className="text-xs text-ink-muted dark:text-dark-text-muted mt-1 block">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && matchedBean && (
            <div className="space-y-6 anim-panel">
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
              <div className="p-4 sm:p-5 bg-surface dark:bg-dark-subtle border border-hairline dark:border-dark-hairline space-y-4">
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
                  {matchedBean.tastingNotes?.map((note: string) => (
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
                    handleDismiss();
                    openSubscriptionModalFor(matchedBean, 'biweekly');
                  }}
                  className="min-h-[44px] px-4 py-2.5 bg-ink dark:bg-dark-text-main text-paper dark:text-dark-canvas hover:bg-vermillion text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-[color,background-color,border-color,opacity,transform] cursor-pointer shadow-md"
                >
                  <Zap className="w-4 h-4 text-vermillion dark:text-dark-canvas fill-current" />
                  <span>Subscribe & Save 15%</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleDismiss();
                    openSubscriptionModalFor(matchedBean, 'onetime');
                  }}
                  className="min-h-[44px] px-4 py-2.5 bg-paper dark:bg-dark-subtle border border-hairline dark:border-dark-hairline text-ink dark:text-dark-text-main text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-[color,background-color,border-color,opacity,transform] cursor-pointer"
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
