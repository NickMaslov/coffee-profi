import { describe, it, expect } from 'vitest'
import {
  calcDailyFixedCosts,
  calcTotalUnitsPerDay,
  calcBlendedRevenue,
  calcBlendedVariableCost,
  calcBlendedMargin,
  calcBreakEven,
  calcPnL,
  calcForecast,
} from './calculations'
import type { FixedCosts, Product } from '../types'

// --- fixtures ---

const FIXED: FixedCosts = [
  { id: 'rent',                  name: 'Rent',                   value: 5000 },
  { id: 'salaries',              name: 'Salaries',               value: 8000 },
  { id: 'utilities',             name: 'Utilities',              value: 800  },
  { id: 'equipmentAmortization', name: 'Equipment amortization', value: 600  },
  { id: 'marketing',             name: 'Marketing',              value: 400  },
] // total = 14 800 / mo → 493.33.../day

const PRODUCTS: Product[] = [
  { id: 'coffee',  name: 'Coffee',  iconKey: 'coffee',  pricePerUnit: 6.00, variableCostPerUnit: 1.25, unitsPerDay: 60 },
  { id: 'tea',     name: 'Tea',     iconKey: 'tea',     pricePerUnit: 4.50, variableCostPerUnit: 0.60, unitsPerDay: 25 },
  { id: 'dessert', name: 'Dessert', iconKey: 'dessert', pricePerUnit: 5.00, variableCostPerUnit: 1.80, unitsPerDay: 15 },
]

// ----------------------------------------------------------------
describe('calcDailyFixedCosts', () => {
  it('divides monthly total by 30', () => {
    expect(calcDailyFixedCosts(FIXED)).toBeCloseTo(14800 / 30, 5)
  })

  it('returns 0 when all costs are 0', () => {
    const zero: FixedCosts = []
    expect(calcDailyFixedCosts(zero)).toBe(0)
  })
})

// ----------------------------------------------------------------
describe('calcTotalUnitsPerDay', () => {
  it('sums unitsPerDay across products', () => {
    expect(calcTotalUnitsPerDay(PRODUCTS)).toBe(100)
  })

  it('returns 0 for empty array', () => {
    expect(calcTotalUnitsPerDay([])).toBe(0)
  })
})

// ----------------------------------------------------------------
describe('calcBlendedRevenue', () => {
  it('returns weighted average price', () => {
    // 0.60×6 + 0.25×4.5 + 0.15×5 = 3.6 + 1.125 + 0.75 = 5.475
    expect(calcBlendedRevenue(PRODUCTS)).toBeCloseTo(5.475, 5)
  })

  it('returns 0 for empty products', () => {
    expect(calcBlendedRevenue([])).toBe(0)
  })

  it('returns exact price for a single product', () => {
    expect(calcBlendedRevenue([PRODUCTS[0]])).toBe(6.00)
  })
})

// ----------------------------------------------------------------
describe('calcBlendedVariableCost', () => {
  it('returns weighted average variable cost', () => {
    // 0.60×1.25 + 0.25×0.60 + 0.15×1.80 = 0.75 + 0.15 + 0.27 = 1.17
    expect(calcBlendedVariableCost(PRODUCTS)).toBeCloseTo(1.17, 5)
  })
})

// ----------------------------------------------------------------
describe('calcBlendedMargin', () => {
  it('equals blended revenue minus blended variable cost', () => {
    // 5.475 - 1.17 = 4.305
    expect(calcBlendedMargin(PRODUCTS)).toBeCloseTo(4.305, 3)
  })
})

// ----------------------------------------------------------------
describe('calcBreakEven', () => {
  it('computes break-even units per day (ceiling)', () => {
    // dailyFixed = 14800/30 ≈ 493.33; margin ≈ 4.305 → 493.33/4.305 ≈ 114.59 → ceil = 115
    const { unitsPerDay } = calcBreakEven(FIXED, PRODUCTS)
    expect(unitsPerDay).toBe(115)
  })

  it('computes break-even units per month', () => {
    const { unitsPerMonth } = calcBreakEven(FIXED, PRODUCTS)
    // ceil(114.59 × 30) = ceil(3437.7) = 3438
    expect(unitsPerMonth).toBe(3438)
  })

  it('returns Infinity when margin is zero', () => {
    const zeroPriceProducts: Product[] = [
      { ...PRODUCTS[0], pricePerUnit: 1.25, variableCostPerUnit: 1.25 },
    ]
    const { unitsPerDay } = calcBreakEven(FIXED, zeroPriceProducts)
    expect(unitsPerDay).toBe(Infinity)
  })

  it('returns Infinity when margin is negative (selling at a loss)', () => {
    const lossProducts: Product[] = [
      { ...PRODUCTS[0], pricePerUnit: 1.00, variableCostPerUnit: 2.00 },
    ]
    const { unitsPerDay } = calcBreakEven(FIXED, lossProducts)
    expect(unitsPerDay).toBe(Infinity)
  })
})

// ----------------------------------------------------------------
describe('calcPnL', () => {
  it('calculates monthly revenue correctly', () => {
    // 6×60×30 + 4.5×25×30 + 5×15×30 = 10800 + 3375 + 2250 = 16425
    const { monthlyRevenue } = calcPnL(FIXED, PRODUCTS)
    expect(monthlyRevenue).toBe(16425)
  })

  it('calculates monthly variable costs correctly', () => {
    // 1.25×60×30 + 0.60×25×30 + 1.80×15×30 = 2250 + 450 + 810 = 3510
    const { monthlyVariableCosts } = calcPnL(FIXED, PRODUCTS)
    expect(monthlyVariableCosts).toBe(3510)
  })

  it('calculates gross profit', () => {
    // 16425 - 3510 = 12915
    const { grossProfit } = calcPnL(FIXED, PRODUCTS)
    expect(grossProfit).toBe(12915)
  })

  it('calculates gross margin percent', () => {
    // 12915 / 16425 × 100 ≈ 78.63%
    const { grossMarginPct } = calcPnL(FIXED, PRODUCTS)
    expect(grossMarginPct).toBeCloseTo(78.63, 1)
  })

  it('calculates net profit (loss when below break-even)', () => {
    // 12915 - 14800 = -1885
    const { netProfit } = calcPnL(FIXED, PRODUCTS)
    expect(netProfit).toBe(-1885)
  })

  it('returns positive net profit when above break-even', () => {
    const profitable: Product[] = [
      { ...PRODUCTS[0], unitsPerDay: 200 },
    ]
    const { netProfit } = calcPnL(FIXED, profitable)
    expect(netProfit).toBeGreaterThan(0)
  })

  it('includes per-product rows', () => {
    const { products } = calcPnL(FIXED, PRODUCTS)
    expect(products).toHaveLength(3)
    expect(products[0].monthlyRevenue).toBe(10800)
    expect(products[1].monthlyRevenue).toBe(3375)
  })
})

// ----------------------------------------------------------------
describe('calcForecast', () => {
  it('month 1 has base units (no growth applied)', () => {
    const [first] = calcForecast(FIXED, PRODUCTS, 10, 6)
    expect(first.month).toBe(1)
    expect(first.unitsPerDay).toBe(100) // baseUnits = 100
  })

  it('applies compound growth each month', () => {
    const points = calcForecast(FIXED, PRODUCTS, 10, 3)
    // month 2: 100 × 1.1^1 = 110; month 3: 100 × 1.1^2 = 121
    expect(points[1].unitsPerDay).toBe(110)
    expect(points[2].unitsPerDay).toBe(121)
  })

  it('cumulative is running sum of netProfits', () => {
    const points = calcForecast(FIXED, PRODUCTS, 10, 3)
    expect(points[1].cumulative).toBe(points[0].cumulative + points[1].netProfit)
    expect(points[2].cumulative).toBe(points[1].cumulative + points[2].netProfit)
  })

  it('returns correct number of months', () => {
    expect(calcForecast(FIXED, PRODUCTS, 5, 12)).toHaveLength(12)
  })

  it('returns empty array for 0 months', () => {
    expect(calcForecast(FIXED, PRODUCTS, 5, 0)).toHaveLength(0)
  })

  it('0% growth keeps units flat', () => {
    const points = calcForecast(FIXED, PRODUCTS, 0, 3)
    expect(points[0].unitsPerDay).toBe(points[1].unitsPerDay)
    expect(points[1].unitsPerDay).toBe(points[2].unitsPerDay)
  })
})
