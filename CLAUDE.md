# Coffee Profi — AI Context

## What is this project

A business planning simulator for entrepreneurs who want to open a coffee shop.
The app calculates break-even points and P&L, helping users understand how many cups per day they need to sell to cover costs and become profitable.

## Tech stack

- **React 18** + **TypeScript**
- **Vite** (build tool / dev server)
- **Recharts** (charts and graphs)
- **CSS Modules** (styling, no UI framework)
- **i18next** + **react-i18next** (internationalization: RU / EN)
- CSS custom properties for theming (light / dark)

## Architecture

Single-page app, no backend. All calculations happen in the browser.

Key files:
- `src/store/` — state (React context or Zustand)
- `src/components/` — UI components (sliders, inputs, chart)
- `src/components/ProfitLossCard.tsx` — P&L accordion: revenue/costs breakdown, gross profit, net profit
- `src/utils/calculations.ts` — pure math functions (break-even, P&L via `calcPnL()`)
- `src/types.ts` — shared TypeScript types (incl. `PnLResult`, `PnLProductRow`)
- `src/i18n/` — translation files: `en.json`, `ru.json`, `es.json`
- `src/styles/themes.css` — CSS custom properties for light/dark themes

## Core business logic

**Break-even formula:**
```
break_even_cups_per_day = fixed_costs_per_day / (price_per_cup - variable_cost_per_cup)
```

**Fixed costs** (per month → divide by 30 for daily):
- Rent
- Salaries
- Utilities
- Equipment amortization
- Marketing

**Variable costs** (per cup):
- Coffee beans
- Milk
- Cup + lid
- Syrups

**Revenue:**
- Price per cup × cups sold per day

## Key principles

- Start with coffee only, but architect for multiple menu items (tea, desserts) later
- All inputs have sliders AND numeric fields (synced)
- Chart shows revenue line vs. total cost line — break-even is where they cross
- Mobile-friendly layout
- No backend, no auth, no database — pure client-side
- Currency: **USD ($)**, target market is the US (NYC-realistic default values)

## Theming

- Light / dark mode via `data-theme="light|dark"` attribute on `<html>`
- All colors via CSS custom properties — never hardcoded
- Recharts colors also switch with theme (pass colors from CSS vars via JS)
- Theme preference saved to `localStorage`

## Internationalization

- Languages: **English** (default), **Russian**, **Spanish**
- Library: `i18next` + `react-i18next`
- Translation keys in `src/i18n/en.json`, `src/i18n/ru.json`, `src/i18n/es.json`
- Language switcher: small unobtrusive **dropdown** in the **top-right corner** (e.g. `🌐 English ▾` with options English / Русский)
- Language preference saved to `localStorage`

## What NOT to do

- Don't add a backend
- Don't use a heavy UI library (MUI, Antd) — keep it lightweight
- Don't over-engineer state management for v1
