import type { FixedCosts, Product, BreakEvenResult, ChartDataPoint } from '../types'

export function calcDailyFixedCosts(fixed: FixedCosts): number {
  return (fixed.rent + fixed.salaries + fixed.utilities + fixed.equipmentAmortization + fixed.marketing) / 30
}

export function calcTotalUnitsPerDay(products: Product[]): number {
  return products.reduce((s, p) => s + p.unitsPerDay, 0)
}

export function calcBlendedRevenue(products: Product[]): number {
  const total = calcTotalUnitsPerDay(products)
  if (total === 0) return 0
  return products.reduce((s, p) => s + (p.unitsPerDay / total) * p.pricePerUnit, 0)
}

export function calcBlendedVariableCost(products: Product[]): number {
  const total = calcTotalUnitsPerDay(products)
  if (total === 0) return 0
  return products.reduce((s, p) => s + (p.unitsPerDay / total) * p.variableCostPerUnit, 0)
}

export function calcBlendedMargin(products: Product[]): number {
  return calcBlendedRevenue(products) - calcBlendedVariableCost(products)
}

export function calcBreakEven(fixed: FixedCosts, products: Product[]): BreakEvenResult {
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

export function calcChartData(fixed: FixedCosts, products: Product[]): ChartDataPoint[] {
  const breakEven = calcBreakEven(fixed, products)
  const currentUnits = calcTotalUnitsPerDay(products)
  const maxUnits = Math.max(200, Math.ceil(Math.max(breakEven.unitsPerDay, currentUnits) * 1.8))
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
