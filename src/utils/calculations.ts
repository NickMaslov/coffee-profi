import type { FixedCosts, VariableCosts, RevenueInputs, BreakEvenResult, ChartDataPoint } from '../types'

export function calcDailyFixedCosts(fixed: FixedCosts): number {
  return (fixed.rent + fixed.salaries + fixed.utilities + fixed.equipmentAmortization + fixed.marketing) / 30
}

export function calcVariableCostPerCup(variable: VariableCosts): number {
  return variable.coffeeBeans + variable.milk + variable.cupAndLid + variable.syrups
}

export function calcBreakEven(fixed: FixedCosts, variable: VariableCosts, revenue: RevenueInputs): BreakEvenResult {
  const dailyFixedCosts = calcDailyFixedCosts(fixed)
  const variableCostPerCup = calcVariableCostPerCup(variable)
  const marginPerCup = revenue.pricePerCup - variableCostPerCup

  const cupsPerDay = marginPerCup > 0 ? dailyFixedCosts / marginPerCup : Infinity

  return {
    cupsPerDay: Math.ceil(cupsPerDay),
    cupsPerMonth: Math.ceil(cupsPerDay * 30),
    dailyFixedCosts,
    variableCostPerCup,
    marginPerCup,
  }
}

export function calcDailyProfit(cups: number, fixed: FixedCosts, variable: VariableCosts, revenue: RevenueInputs): number {
  const dailyFixed = calcDailyFixedCosts(fixed)
  const varCost = calcVariableCostPerCup(variable)
  return cups * revenue.pricePerCup - cups * varCost - dailyFixed
}

export function calcChartData(fixed: FixedCosts, variable: VariableCosts, revenue: RevenueInputs): ChartDataPoint[] {
  const breakEven = calcBreakEven(fixed, variable, revenue)
  const maxCups = Math.max(200, Math.ceil(breakEven.cupsPerDay * 1.8))
  const step = Math.max(1, Math.floor(maxCups / 50))
  const points: ChartDataPoint[] = []

  for (let cups = 0; cups <= maxCups; cups += step) {
    const dailyFixed = calcDailyFixedCosts(fixed)
    const varCostPerCup = calcVariableCostPerCup(variable)
    points.push({
      cups,
      revenue: cups * revenue.pricePerCup,
      totalCosts: dailyFixed + cups * varCostPerCup,
      fixedCosts: dailyFixed,
    })
  }

  return points
}
