# Coffee Profi — Development Plan

## Goal

Web app that answers the question: **"How many cups of coffee per day do I need to sell to break even?"**

Target user: an entrepreneur planning to open a coffee shop. No finance degree required — everything should be intuitive.

---

## Phase 1 — Core MVP (Coffee only)

### Step 1: Project scaffold
- [ ] `npm create vite@latest` with React + TypeScript template
- [ ] Install dependencies: `recharts`, `i18next`, `react-i18next`
- [ ] Set up folder structure: `src/components/`, `src/utils/`, `src/types.ts`, `src/i18n/`
- [ ] CSS reset, layout, and `src/styles/themes.css` with CSS custom properties

### Step 2: Types and calculation engine
- [ ] Define TypeScript types: `FixedCosts`, `VariableCosts`, `RevenueInputs`, `BreakEvenResult`
- [ ] Write pure functions in `src/utils/calculations.ts`:
  - `calcBreakEvenCupsPerDay(fixed, variable, price)`
  - `calcDailyProfit(cups, price, variable, fixed)`
  - `calcChartData(range, fixed, variable, price)` → array of points for chart

### Step 3: State management
- [ ] React context with `useReducer` (simple, no extra library for v1)
- [ ] Default values: realistic Moscow coffee shop numbers
- [ ] All inputs in one flat state object

### Step 4: Input UI
- [ ] `InputSlider` component — slider + numeric input, synced
- [ ] `CostsPanel` — left column with all fixed and variable cost inputs
- [ ] `RevenuePanel` — price per cup + target cups per day

### Step 5: Results and chart
- [ ] `BreakEvenResult` component — big number: "Break-even: 87 cups/day"
- [ ] `BreakEvenChart` component (Recharts `LineChart`):
  - X axis: cups per day (0 → 200)
  - Y axis: money (₽ / day)
  - Line 1 (red): total costs (fixed + variable × cups)
  - Line 2 (green): revenue (price × cups)
  - Reference line at break-even point
- [ ] `SummaryCard` — monthly view: revenue, costs, profit/loss

### Step 6: Theming
- [ ] CSS custom properties for all colors in `themes.css` (light + dark tokens)
- [ ] `ThemeToggle` button — sun/moon icon, saves to `localStorage`
- [ ] Apply `data-theme` to `<html>`, Recharts colors read from CSS vars via JS
- [ ] Chart colors switch with theme

### Step 7: Internationalization
- [ ] Set up `i18next` with `en.json`, `ru.json`, `es.json` translation files
- [ ] All UI strings go through `t('key')` — no hardcoded text
- [ ] `LanguageSwitcher` component — small dropdown in top-right corner (`🌐 English ▾` / `Русский`)
- [ ] Language preference saved to `localStorage`

### Step 8: Polish
- [ ] Responsive layout (mobile-first)
- [ ] Color coding: red = loss zone, green = profit zone
- [ ] Tooltips on sliders with descriptions
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
    │   └── themes.css          ← CSS custom properties (light/dark)
    ├── i18n/
    │   ├── index.ts            ← i18next setup
    │   ├── en.json             ← English strings
    │   ├── ru.json             ← Russian strings
    │   └── es.json             ← Spanish strings
    └── components/
        ├── InputSlider.tsx
        ├── CostsPanel.tsx
        ├── RevenuePanel.tsx
        ├── BreakEvenChart.tsx
        ├── BreakEvenResult.tsx
        ├── SummaryCard.tsx
        ├── ThemeToggle.tsx     ← sun/moon button
        └── LanguageSwitcher.tsx ← RU | EN button (top-right corner)
```
