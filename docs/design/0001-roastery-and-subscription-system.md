# Roastery & Coffee Subscription System — Design Specification

**Status:** Approved  
**Aesthetic Thesis:** *Artisan Editorial Roastery / Japanese Kissa Tactile Craft*  
**DFII Score:** 13 / 15  

---

## 1. Understanding Summary

* **What is being built:** A dedicated **Roastery & Coffee Subscription System** featuring an editorial micro-lot bean catalog, an interactive tactile subscription configuration modal (grind size particle indicator, bag weight selector, delivery frequency slider with recurring discount calculation), unified cart badging, and a client-side subscription management interface.
* **Why it exists:** To expand Brew & Co. from on-premise cafe ordering into an artisanal roastery retail & recurring subscription experience, elevating customer engagement and home brewing versatility.
* **Who it is for:** Coffee connoisseurs, home baristas, and recurring subscribers seeking freshly roasted specialty beans.
* **Key constraints:** Client-side architecture with React 19, Tailwind CSS v4, Lucide icons, and persistent `localStorage` synchronization.
* **Explicit non-goals:** Live payment gateway charge processing (e.g. real Stripe tokenization) and real shipping courier API webhooks.

---

## 2. Non-Functional Assumptions

1. **Performance & Responsiveness:** Zero-lag UI updates, CSS-first micro-transitions, and responsive touch layout on both mobile bottom sheets and desktop drawers.
2. **State & Persistence:** Active subscriptions, delivery frequencies, and recurring order histories persist across browser reloads via `localStorage`.
3. **Accessibility:** Semantic HTML, ARIA radio groups for selection controls, keyboard trap inside modals, and WCAG AAA color contrast.
4. **Reliability & Safeguards:** Composite keying (`${id}-${grind}-${bagSize}-${cadence}`) prevents collision when ordering the same roast with different grind sizes.

---

## 3. Decision Log

| # | Decision | Alternatives Considered | Rationale |
|---|---|---|---|
| 1 | **Approach A (Integrated Hub + Unified Cart)** | Standalone Roastery portal, Multi-step quiz wizard | Preserves single-page fluidity and unifies drink ordering with bean subscriptions. |
| 2 | **Client-Side Simulation with `localStorage`** | External Stripe/Supabase backend | Zero cost, instant zero-latency feedback, easily pluggable into real API later. |
| 3 | **Integrated Subscription Badging in Cart** | Split carts for drinks vs beans | Allows customers to buy a morning latte and set up recurring beans in one checkout. |
| 4 | **Composite Customization Keying** | Simple ID-only keying | Prevents collision between different grinds/cadences. |

---

## 4. Final Architecture & Component Specifications

### 4.1 Component Breakdown
* **`RoasterySection.tsx`**: Editorial showcase featuring 4 single-origin micro-lots (e.g., *Ethiopia Yirgacheffe Aricha*, *Colombia Huila Pink Bourbon*, *Guatemala Huehuetenango*, *Kenya Nyeri Hill*) and 1 signature espresso blend (*Kissa Dark Velvet*). Includes cupping score meters, roast elevation badges, tasting notes, and "Subscribe & Save" quick triggers.
* **`SubscriptionModal.tsx`**: High-craft tactile modal featuring:
  * **Grind Selector**: Whole Bean, French Press, Chemex/Pour-over, Aeropress, Espresso, Cold Brew with tactile micron/texture preview.
  * **Bag Weight**: 250g, 500g (+volume savings), 1kg (+volume savings).
  * **Cadence & Savings**: Weekly (15% off), Every 2 Weeks (15% off), Monthly (10% off), or One-Time Purchase.
  * **Roast Freshness Seal**: Simulated roast-on-demand badge showing next roast date.
* **`SubscriptionContext.tsx`**: Context provider managing active subscriptions (`activeSubscriptions`, `pauseSubscription`, `resumeSubscription`, `cancelSubscription`, `updateFrequency`).
* **`CartDrawer.tsx` Integration**: Distinct subscription badge styling with recurrence interval, calculated savings pill, and unified checkout summary.
* **`ManageSubscriptionsModal.tsx`**: Customer portal drawer to view active recurring deliveries, skip next dispatch, or adjust grind sizes.

---

## 5. Differentiation Callout

> *“This avoids generic UI by replacing cookie-cutter e-commerce product grids with tactile, typography-driven roast index cards, archival wax-seal badges, and a seamless inline subscription cadence stepper.”*
