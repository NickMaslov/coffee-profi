export interface FixedCosts {
  rent: number
  salaries: number
  utilities: number
  equipmentAmortization: number
  marketing: number
}

export interface Product {
  id: string
  nameKey: string
  iconKey: string
  pricePerUnit: number
  variableCostPerUnit: number
  salesSharePct: number
}

export interface RevenueInputs {
  unitsPerDay: number
}

export interface AppState {
  fixedCosts: FixedCosts
  products: Product[]
  revenue: RevenueInputs
  theme: 'light' | 'dark'
  language: 'en' | 'ru' | 'es'
}

export interface BreakEvenResult {
  unitsPerDay: number
  unitsPerMonth: number
  dailyFixedCosts: number
  blendedMarginPerUnit: number
  blendedVariableCostPerUnit: number
}

export interface ChartDataPoint {
  units: number
  revenue: number
  totalCosts: number
  fixedCosts: number
}
