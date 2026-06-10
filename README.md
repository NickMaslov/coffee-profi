# Coffee Profi

A business planning simulator for entrepreneurs who want to open a coffee shop. Calculates break-even points and P&L so you know exactly how many cups per day you need to sell to be profitable.

## Features

- **Break-even calculator** — see the exact number of cups/day and cups/month to cover all costs
- **Interactive sliders** — adjust every parameter with sliders or numeric inputs, results update instantly
- **Revenue vs. Costs chart** — visual line chart with color zones (red = loss, green = profit) and break-even reference line
- **Monthly summary** — revenue, total costs, net profit/loss, margin per cup
- **Light / dark theme** — toggle with the moon/sun button, preference saved
- **3 languages** — English, Русский, Español — switch via the globe icon, preference saved
- **Collapsible sections** — accordion panels for Fixed Costs, Variable Costs, and Revenue
- **Mobile-friendly** — responsive layout works on phones and tablets

## Tech stack

- React 18 + TypeScript
- Vite
- Recharts
- i18next + react-i18next
- CSS Modules

## Getting started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The app runs at `http://localhost:5173` by default.

## Default values

Pre-filled with realistic NYC coffee shop numbers:

| Parameter | Default |
|---|---|
| Rent | $5,000/month |
| Salaries | $8,000/month |
| Utilities | $800/month |
| Equipment amortization | $600/month |
| Marketing | $400/month |
| Coffee beans | $0.50/cup |
| Milk | $0.40/cup |
| Cup + lid | $0.20/cup |
| Syrups | $0.15/cup |
| Price per cup | $6.00 |

Break-even with these defaults: **~104 cups/day** (~3,116/month)

## Project structure

```
src/
├── components/       # UI components
├── store/            # React context + state
├── utils/            # Break-even calculation logic
├── i18n/             # Translation files (en, ru, es)
├── styles/           # Global CSS + theme tokens
└── types.ts          # Shared TypeScript types
```

## Roadmap

- **Phase 2** — Multiple menu items (tea, desserts) with blended break-even
- **Phase 3** — Save and compare scenarios, export to PDF, shareable URL
