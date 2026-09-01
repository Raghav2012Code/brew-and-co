# Brew & Co. — Single-Origin Roastery & SaaS Platform

> **Live Demo:** [https://brew-and-co-phi.vercel.app](https://brew-and-co-phi.vercel.app)

An artisan, specialty coffee roastery web application and micro-SaaS platform featuring direct-trade coffee subscriptions, a live back-of-house Barista KDS ticket rail, an interactive palate matchmaker, a multi-tenant brand customizer, digital stamp card rewards, and dark/light themes.

[![Vercel Deployment](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat&logo=vercel)](https://brew-and-co-phi.vercel.app)
[![React 19](https://img.shields.io/badge/React-19.2-61dafb?style=flat&logo=react)](https://react.dev/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-v4.3-38b2ac?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646cff?style=flat&logo=vite)](https://vite.dev/)

---

## 🌟 Key Features

### ☕ Direct-Trade Roastery & Subscriptions
- **Single-Origin Catalog**: High-altitude micro-lots with harvest telemetry, elevation, varietal, cupping scores, and process profiles.
- **Doorstep Subscription Engine**: Flexible frequency options (*Weekly*, *Bi-Weekly*, *Monthly*) with automated 15% recurring discounts.
- **Grind Precision**: 5 calibrated micron particle profiles (*Whole Bean*, *French Press*, *Chemex / V60*, *Aeropress*, *Espresso*).
- **Customer Subscription Vault**: Dedicated drawer to pause, resume, cancel, or modify delivery cadence in 1 click.

### 📋 Barista Station & Roastery Operations (KDS)
- **Brass-Rail Ticket KDS**: Real-time incoming pickup ticket management with order status progression (`Received` $\rightarrow$ `Brewing` $\rightarrow$ `Ready` $\rightarrow$ `Completed`).
- **Web Audio API Synth Chimes**: Pure oscillator alerts for new order arrivals and ready hand-offs.
- **Weekly Batch Roast & Grind Manifest**: Automated calculation of total roast batch weights (kg), grind particle distribution, and green coffee shrinkage compensation (15.2%) with print-ready output.

### 🧭 "Find Your Roast" Interactive Palate Matchmaker
- 30-second sensory flavor questionnaire analyzing brew apparatus, flavor preferences (floral, fruity, chocolate, dark roast), and milk usage.
- 98% match recommendation engine with 1-click subscription pre-fill.

### 🎨 Multi-Tenant Roastery Brand & Catalog Studio
- **Live White-Label Customization**: Instant DOM CSS variable synchronization for 5 artisan palette presets (*Artisan Vermillion*, *Kissa Amber*, *Highland Forest*, *Direct Trade Cobalt*, *Cast-Iron Espresso*).
- **Catalog Editor**: Live price, stock, and metadata adjustments persisted via local storage.

### 🛍️ Cafe Menu, Dial-In Guide & Rewards
- **Cafe Drink Builder**: Real-time item customizer with milk alternatives, syrup infusions, espresso shot dosing, and temperature controls.
- **Digital Tasting Pass**: 6-stamp auto-saving loyalty reward system with celebratory confetti and free drink redemption.
- **Home Brew Guide**: Interactive cup size calculator and step-by-step pour-over routine.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript
- **Bundler & Dev Server**: Vite 8
- **Styling**: Tailwind CSS v4, Lucide React Icons, Radix UI Dialog & Sheet Primitives
- **State & Storage**: React Context API with defensive localStorage hydration
- **Audio & Visuals**: Web Audio API Oscillators, Canvas Confetti
- **Deployment & Hosting**: Vercel (SPA rewrites, immutable caching, security headers)

---

## 🚀 Local Development

```bash
# Clone the repository
git clone https://github.com/Raghav2012Code/brew-and-co.git

# Navigate to directory
cd brew-and-co

# Install dependencies
npm install

# Run development server
npm run dev

# Run TypeScript check
npm run typecheck

# Build for production
npm run build
```

---

## 🌐 Production Deployment

The project is configured for Vercel with [`vercel.json`](./vercel.json):

* **Live URL:** [https://brew-and-co-phi.vercel.app](https://brew-and-co-phi.vercel.app)
* **Build Command:** `npm run build`
* **Output Directory:** `dist`
