import type { FixedCosts, Product, RevenueInputs, BreakEvenResult, ChartDataPoint } from '../types'

export function calcDailyFixedCosts(fixed: FixedCosts): number {
  return (fixed.rent + fixed.salaries + fixed.utilities + fixed.equipmentAmortization + fixed.marketing) / 30
}

export function calcBlendedMargin(products: Product[]): number {
  return products.reduce((sum, p) => sum + (p.salesSharePct / 100) * (p.pricePerUnit - p.variableCostPerUnit), 0)
}

export function calcBlendedVariableCost(products: Product[]): number {
  return products.reduce((sum, p) => sum + (p.salesSharePct / 100) * p.variableCostPerUnit, 0)
}

export function calcBlendedRevenue(products: Product[]): number {
  return products.reduce((sum, p) => sum + (p.salesSharePct / 100) * p.pricePerUnit, 0)
}

export function calcBreakEven(fixed: FixedCosts, products: Product[], _revenue: RevenueInputs): BreakEvenResult {
  const dailyFixedCosts = calcDailyFixedCosts(fixed)
  const blendedMarginPerUnit = calcBlendedMargin(products)
  const blendedVariableCostPerUnit = calcBlendedVariableCost(products)
  const unitsPerDay = blendedMarginPerUnit > 0 ? dailyFixedCosts / blendedMarginPerUnit : Infinity

  return {
    unitsPerDay: Math.ceil(unitsPerDay),
    unitsPerMonth: Math.ceil(unitsPerDay * 30),
    dailyFixedCosts,
    blendedMarginPerUnit,
    blendedVariableCostPerUnit,
  }
}

export function calcDailyProfit(units: number, fixed: FixedCosts, products: Product[]): number {
  const dailyFixed = calcDailyFixedCosts(fixed)
  const blendedRevenue = calcBlendedRevenue(products)
  const blendedVarCost = calcBlendedVariableCost(products)
  return units * blendedRevenue - units * blendedVarCost - dailyFixed
}

export function calcChartData(fixed: FixedCosts, products: Product[], revenue: RevenueInputs): ChartDataPoint[] {
  const breakEven = calcBreakEven(fixed, products, revenue)
  const maxUnits = Math.max(200, Math.ceil(breakEven.unitsPerDay * 1.8))
  const step = Math.max(1, Math.floor(maxUnits / 50))
  const blendedRevenue = calcBlendedRevenue(products)
  const blendedVarCost = calcBlendedVariableCost(products)
  const dailyFixed = calcDailyFixedCosts(fixed)
  const points: ChartDataPoint[] = []

  for (let units = 0; units <= maxUnits; units += step) {
    points.push({
      units,
      revenue: units * blendedRevenue,
      totalCosts: dailyFixed + units * blendedVarCost,
      fixedCosts: dailyFixed,
    })
  }

  return points
}
