# Coffee Profi

**A business planning simulator for coffee shop entrepreneurs.**

Enter your costs and menu — Coffee Profi tells you exactly how many items you need to sell each day to break even and become profitable.

🚀 **[Live demo → nickmaslov.github.io/coffee-profi](https://nickmaslov.github.io/coffee-profi/)**

---

## Features

| | |
|---|---|
| **Break-even calculator** | Exact units/day and units/month to cover all costs |
| **Monthly P&L** | Per-product revenue, variable costs, gross profit, net profit/loss |
| **Multi-product menu** | Add coffee, tea, desserts and more — blended break-even across all items |
| **Sales scenario analysis** | Pessimistic / Base / Optimistic multipliers with delta vs base |
| **Profit forecast** | Month-by-month compound growth projection with cumulative P&L |
| **Saved scenarios** | Save, load, and delete named configurations |
| **Revenue vs. Costs chart** | Visual line chart with loss/profit color zones and break-even marker |
| **Onboarding wizard** | Guided setup flow for new users (re-launchable via ✦ in the topbar) |
| **Light / dark theme** | Toggle with the moon/sun button, preference saved to localStorage |
| **3 languages** | English, Русский, Español — globe icon in the top-right corner |
| **Mobile-friendly** | Responsive layout works on phones and tablets |

---

## Getting started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

The dev server runs at `http://localhost:5173` by default.

---

## Default values

Pre-filled with realistic NYC coffee shop numbers:

| Parameter | Default |
|---|---|
| Rent | $5,000 / month |
| Salaries | $8,000 / month |
| Utilities | $800 / month |
| Equipment amortization | $600 / month |
| Marketing | $400 / month |
| **Total fixed costs** | **$14,800 / month** |
| Coffee | $6.00 price · $1.25 var cost · 60 units/day |
| Tea | $4.50 price · $0.60 var cost · 25 units/day |
| Dessert | $5.00 price · $1.80 var cost · 15 units/day |

Break-even with these defaults: **115 units/day** (~3,438/month)

---

## Tech stack

- **React 18** + **TypeScript**
- **Vite** — build tool and dev server
- **Recharts** — charts and graphs
- **i18next** + **react-i18next** — internationalization (EN / RU / ES)
- **CSS Modules** + CSS custom properties — theming, no UI framework
- **Vitest** + **React Testing Library** — unit and component tests

---

## Project structure

```
src/
├── components/       # UI components (cards, sliders, charts, wizard)
├── store/            # React context + useReducer state management
├── utils/            # Pure calculation functions (break-even, P&L, forecast)
├── i18n/             # Translation files: en.json, ru.json, es.json
├── styles/           # Global CSS and theme tokens
├── test/             # Test helpers and setup
└── types.ts          # Shared TypeScript types
```

---

## Math & formulas

All formulas used in the app — break-even, blended margin, P&L, forecast compound growth, and saved scenarios — are documented in detail in **[FORMULAS.md](./FORMULAS.md)**.

---

## Tests

The test suite covers all core calculation logic and key UI components:

```bash
npm test           # run once
npm run test:watch # watch mode — re-runs on file save
```

| Suite | Tests | Covers |
|---|---|---|
| `calculations.test.ts` | 26 | break-even, P&L, blended margin, forecast |
| `BreakEvenResult.test.tsx` | 6 | rendered numbers, loss/profit zone, progress % |
| `SummaryCard.test.tsx` | 5 | revenue, costs, net profit display |

---

## Deployment

The app is deployed to **GitHub Pages** via GitHub Actions on every push to `main`.

Workflow: `.github/workflows/deploy.yml`
Live URL: **[nickmaslov.github.io/coffee-profi](https://nickmaslov.github.io/coffee-profi/)**
