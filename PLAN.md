# Coffee Profi — Development Plan

## Goal

Web app that answers the question: **"How many cups of coffee per day do I need to sell to break even?"**

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
- [x] Pure functions in `src/utils/calculations.ts`:
  - `calcBreakEven(fixed, variable, revenue)`
  - `calcDailyProfit(cups, fixed, variable, revenue)`
  - `calcChartData(fixed, variable, revenue)` → array of points for chart

### Step 3: State management ✅
- [x] React context with `useReducer` (`src/store/AppContext.tsx`)
- [x] Default values: realistic NYC coffee shop numbers
- [x] Theme and language persisted to `localStorage`

### Step 4: Input UI ✅
- [x] `InputSlider` component — slider + numeric input, synced
- [x] `CostsPanel` — fixed costs + variable costs
- [x] `RevenuePanel` — price per cup + cups sold per day

### Step 5: Results and chart ✅
- [x] `BreakEvenResult` — big number, profit/loss zone indicator
- [x] `BreakEvenChart` (Recharts `LineChart`) — Revenue vs. Total Costs, break-even reference line
- [x] `SummaryCard` — monthly revenue, costs, profit/loss, margin per cup

### Step 6: Theming ✅
- [x] CSS custom properties in `themes.css` (light + dark tokens)
- [x] `ThemeToggle` — sun/moon button, saves to `localStorage`
- [x] `data-theme` on `<html>`, Recharts colors via `getComputedStyle`

### Step 7: Internationalization ✅
- [x] `i18next` with `en.json`, `ru.json`, `es.json`
- [x] All UI strings through `t('key')` — no hardcoded text
- [x] `LanguageSwitcher` — dropdown in top-right corner, saves to `localStorage`

### Step 8: Polish (next)
- [ ] Responsive layout (mobile-first)
- [ ] Color shading on chart: red zone below break-even, green zone above
- [ ] Animate chart when values change

---

## Phase 2 — Multiple menu items (future)

- Add tea, desserts as separate product categories
- Each product has its own price + variable cost + estimated % of daily sales
- Blended break-even across the whole menu
- Architecture note: `FixedCosts` stays the same, `products: Product[]` replaces single coffee inputs

---

## Phase 3 — Scenarios (future)

- Save and compare multiple scenarios (e.g. "small kiosk" vs "full café")
- Export to PDF
- Shareable URL with encoded state

---

## Default values (realistic NYC coffee shop)

| Parameter | Default |
|---|---|
| Rent | $5,000/month |
| Salaries | $8,000/month |
| Utilities | $800/month |
| Equipment amortization | $600/month |
| Marketing | $400/month |
| Coffee beans (per cup) | $0.50 |
| Milk (per cup) | $0.40 |
| Cup + lid (per cup) | $0.20 |
| Syrups (per cup) | $0.15 |
| Price per cup | $6.00 |

Break-even with these defaults: ~109 cups/day (~3,300/month)

---

## Folder structure

```
coffee-profi/
├── CLAUDE.md
├── PLAN.md
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── types.ts
    ├── store/
    │   └── AppContext.tsx
    ├── utils/
    │   └── calculations.ts
    ├── styles/
    │   ├── themes.css          ← CSS custom properties (light/dark)
    │   └── global.css          ← reset + body styles
    ├── i18n/
    │   ├── index.ts            ← i18next setup
    │   ├── en.json
    │   ├── ru.json
    │   └── es.json
    └── components/
        ├── InputSlider.tsx / .module.css
        ├── CostsPanel.tsx
        ├── RevenuePanel.tsx
        ├── Panel.module.css    ← shared panel styles
        ├── BreakEvenChart.tsx / .module.css
        ├── BreakEvenResult.tsx / .module.css
        ├── SummaryCard.tsx / .module.css
        ├── ThemeToggle.tsx
        ├── LanguageSwitcher.tsx
        └── TopBar.module.css   ← header + controls styles
```
