import type { FixedCosts, Product, BreakEvenResult, ChartDataPoint, PnLResult } from '../types'

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

export function calcPnL(fixed: FixedCosts, products: Product[]): PnLResult {
  const monthlyRevenue = products.reduce((s, p) => s + p.pricePerUnit * p.unitsPerDay * 30, 0)
  const monthlyVariableCosts = products.reduce((s, p) => s + p.variableCostPerUnit * p.unitsPerDay * 30, 0)
  const grossProfit = monthlyRevenue - monthlyVariableCosts
  const grossMarginPct = monthlyRevenue > 0 ? (grossProfit / monthlyRevenue) * 100 : 0
  const monthlyFixedCosts = Object.values(fixed).reduce((a, b) => a + b, 0)
  const netProfit = grossProfit - monthlyFixedCosts
  const netMarginPct = monthlyRevenue > 0 ? (netProfit / monthlyRevenue) * 100 : 0

  return {
    monthlyRevenue,
    monthlyVariableCosts,
    grossProfit,
    grossMarginPct,
    monthlyFixedCosts,
    netProfit,
    netMarginPct,
    products: products.map(p => ({
      id: p.id,
      name: p.name,
      unitsPerDay: p.unitsPerDay,
      pricePerUnit: p.pricePerUnit,
      variableCostPerUnit: p.variableCostPerUnit,
      monthlyRevenue: p.pricePerUnit * p.unitsPerDay * 30,
      monthlyVariableCost: p.variableCostPerUnit * p.unitsPerDay * 30,
    })),
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
