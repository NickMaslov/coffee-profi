# Coffee Profi

A business planning simulator for entrepreneurs who want to open a coffee shop. Calculates break-even points and full P&L so you know exactly how many cups per day you need to sell to be profitable.

## Features

- **Break-even calculator** — see the exact number of units/day and units/month to cover all costs
- **Monthly P&L statement** — full income statement: per-product revenue, variable costs, gross profit with margin %, fixed cost breakdown, net profit/loss — collapsible accordion
- **Interactive sliders** — adjust every parameter with sliders or numeric inputs, results update instantly
- **Revenue vs. Costs chart** — visual line chart with color zones (red = loss, green = profit) and break-even reference line
- **Multi-product menu** — add coffee, tea, desserts and more; blended break-even across all items
- **Monthly summary** — revenue, total costs, net profit/loss, blended margin
- **Light / dark theme** — toggle with the moon/sun button, preference saved
- **3 languages** — English, Русский, Español — switch via the globe icon, preference saved
- **Collapsible sections** — accordion panels throughout, all content hideable
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
| Coffee | $6.00 price / $1.25 var cost / 60 units/day |
| Tea | $4.50 price / $0.60 var cost / 25 units/day |
| Dessert | $5.00 price / $1.80 var cost / 15 units/day |

Break-even with these defaults: **~115 units/day** (~3,438/month)

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

- **Phase 2** ✅ — Multiple menu items (tea, desserts) with blended break-even
- **Phase 3A** ✅ — Full monthly P&L statement with collapsible accordion
- **Phase 3A pt.2** — "What if" scenario slider (50–200% of current sales)
- **Phase 3B** — Save & compare named scenarios, export to PDF
- **Phase 3C** — Step-by-step onboarding wizard
- **Phase 3D** — Month-by-month profitability forecast chart
