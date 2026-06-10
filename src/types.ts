export interface FixedCosts {
  rent: number
  salaries: number
  utilities: number
  equipmentAmortization: number
  marketing: number
}

export interface VariableCosts {
  coffeeBeans: number
  milk: number
  cupAndLid: number
  syrups: number
}

export interface RevenueInputs {
  pricePerCup: number
  cupsPerDay: number
}

export interface AppState {
  fixedCosts: FixedCosts
  variableCosts: VariableCosts
  revenue: RevenueInputs
  theme: 'light' | 'dark'
  language: 'en' | 'ru' | 'es'
}

export interface BreakEvenResult {
  cupsPerDay: number
  cupsPerMonth: number
  dailyFixedCosts: number
  variableCostPerCup: number
  marginPerCup: number
}

export interface ChartDataPoint {
  cups: number
  revenue: number
  totalCosts: number
  fixedCosts: number
}
