# Coffee Profi — Development Plan

## Goal

Web app that answers the question: **"How many items per day do I need to sell to break even?"**

Target user: an entrepreneur planning to open a coffee shop. No finance degree required — everything should be intuitive.

---

## Phase 1 — Core MVP (Coffee only) ✅ COMPLETE

### Step 1: Project scaffold ✅
- [x] Vite + React + TypeScript project
- [x] Dependencies: `recharts`, `i18next`, `react-i18next`
- [x] Folder structure: `src/components/`, `src/utils/`, `src/types.ts`, `src/i18n/`, `src/styles/`
- [x] CSS reset, layout, `src/styles/themes.css` with CSS custom properties

### Step 2: Types and calculation engine ✅
- [x] TypeScript types: `FixedCosts`, `VariableCosts`, `RevenueInputs`, `BreakEvenResult`, `ChartDataPoint`
- [x] Pure functions in `src/utils/calculations.ts`

### Step 3: State management ✅
- [x] React context with `useReducer` (`src/store/AppContext.tsx`)
- [x] Default values: realistic NYC coffee shop numbers
- [x] Theme and language persisted to `localStorage`

### Step 4: Input UI ✅
- [x] `InputSlider` component — slider + numeric input, synced
- [x] `CostsPanel` — fixed costs
- [x] `RevenuePanel` — daily sales volume

### Step 5: Results and chart ✅
- [x] `BreakEvenResult` — big number, profit/loss zone indicator
- [x] `BreakEvenChart` (Recharts `LineChart`) — Revenue vs. Total Costs, break-even reference line
- [x] `SummaryCard` — monthly revenue, costs, profit/loss, blended margin

### Step 6: Theming ✅
- [x] CSS custom properties in `themes.css` (light + dark tokens)
- [x] `ThemeToggle` — sun/moon button, saves to `localStorage`

### Step 7: Internationalization ✅
- [x] `i18next` with `en.json`, `ru.json`, `es.json`
- [x] `LanguageSwitcher` — icon-only globe dropdown

### Step 8: Polish ✅
- [x] Responsive layout (mobile-first)
- [x] Color shading on chart (loss/profit zones)
- [x] Accordion panels with smooth animation

---

## Phase 2 — Multiple menu items ✅ COMPLETE

- [x] `Product` type: `{ id, nameKey, iconKey, pricePerUnit, variableCostPerUnit, salesSharePct }`
- [x] `VariableCosts` removed; replaced by `products: Product[]`
- [x] Blended break-even: `dailyFixed / sum(share% * margin_per_unit)`
- [x] `MenuPanel` + `ProductCard` components — price, variable cost, sales share per product
- [x] 3 default products: Coffee (60%), Tea (25%), Dessert (15%)
- [x] Add / remove products dynamically (can't delete the last one)
- [x] Editable product name (inline text input)
- [x] Icon picker: coffee, tea, dessert, beer, sandwich, star
- [x] Per-product `unitsPerDay` replaces global sales volume and `salesSharePct`
- [x] Current sales shown alongside break-even in the result card
- [x] Current sales marker line on break-even chart (green/red)
- [x] Accordion max-height raised to prevent clipping with many products
- [x] i18n updated for all three languages

---

## Phase 3 — P&L, Scenarios & Onboarding (in progress)

### Phase 3A — P&L Statement

#### Part 1 — Static P&L card ✅ COMPLETE
- [x] `PnLProductRow` and `PnLResult` types in `types.ts`
- [x] `calcPnL()` pure function in `calculations.ts`
- [x] `ProfitLossCard` component: Revenue breakdown, Variable Costs, Gross Profit (+ margin %), Fixed Costs, Net Profit/Loss
- [x] Collapsible accordion header — net chip always visible, content hides/shows with animation
- [x] i18n keys added for EN / RU / ES

#### Part 2 — "What if" scenario slider (next)
- [ ] Sales multiplier slider (50% → 200% of current units)
- [ ] P&L recalculates in real time under the chosen scenario
- [ ] Quick-select buttons: Pessimistic / Base / Optimistic

### Phase 3B — Save & export
- [ ] Save and compare multiple named scenarios (e.g. "small kiosk" vs "full café")
- [ ] Export to PDF / CSV

### Phase 3C — Onboarding wizard
- [ ] Step-by-step wizard for new users instead of showing all panels at once

### Phase 3D — Time-based forecast
- [ ] Month-by-month chart showing when the business turns profitable as audience grows

---

## Default values (realistic NYC coffee shop)

| Parameter | Default |
|---|---|
| Rent | $5,000/month |
| Salaries | $8,000/month |
| Utilities | $800/month |
| Equipment amortization | $600/month |
| Marketing | $400/month |
| Coffee: price $6.00, var cost $1.25, 60% of sales |
| Tea: price $4.50, var cost $0.60, 25% of sales |
| Dessert: price $5.00, var cost $1.80, 15% of sales |
| Items sold per day | 100 |

---

## Folder structure

```
coffee-profi/
├── CLAUDE.md
├── PLAN.md
├── README.md
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── types.ts
    ├── vite-env.d.ts
    ├── store/
    │   └── AppContext.tsx
    ├── utils/
    │   └── calculations.ts
    ├── styles/
    │   ├── themes.css
    │   └── global.css
    ├── i18n/
    │   ├── index.ts
    │   ├── en.json
    │   ├── ru.json
    │   └── es.json
    └── components/
        ├── InputSlider.tsx / .module.css
        ├── CostsPanel.tsx
        ├── MenuPanel.tsx           ← Phase 2: multi-product accordion
        ├── ProductCard.tsx / .module.css  ← per-product sliders
        ├── RevenuePanel.tsx
        ├── BreakEvenChart.tsx / .module.css
        ├── BreakEvenResult.tsx / .module.css
        ├── ProfitLossCard.tsx / .module.css  ← Phase 3A: P&L statement accordion
        ├── SummaryCard.tsx / .module.css
        ├── ThemeToggle.tsx
        ├── LanguageSwitcher.tsx
        ├── Accordion.tsx / .module.css
        ├── icons.tsx
        └── TopBar.module.css
```
