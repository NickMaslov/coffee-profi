export interface FixedCosts {
  rent: number
  salaries: number
  utilities: number
  equipmentAmortization: number
  marketing: number
}

export type ProductIcon = 'coffee' | 'tea' | 'dessert' | 'beer' | 'sandwich' | 'star'

export interface Product {
  id: string
  name: string
  iconKey: ProductIcon
  pricePerUnit: number
  variableCostPerUnit: number
  unitsPerDay: number
}

export interface AppState {
  fixedCosts: FixedCosts
  products: Product[]
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
