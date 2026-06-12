export interface FixedCostItem {
  id: string
  name: string
  value: number
}

export type FixedCosts = FixedCostItem[]

export type ProductIcon = 'coffee' | 'tea' | 'dessert' | 'beer' | 'sandwich' | 'star'

export interface Product {
  id: string
  name: string
  iconKey: ProductIcon
  pricePerUnit: number
  variableCostPerUnit: number
  unitsPerDay: number
}

export interface SavedScenario {
  id: string
  name: string
  createdAt: number
  fixedCosts: FixedCosts
  products: Product[]
}

export interface AppState {
  fixedCosts: FixedCosts
  products: Product[]
  theme: 'light' | 'dark'
  language: 'en' | 'ru' | 'es'
  savedScenarios: SavedScenario[]
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

export interface ForecastDataPoint {
  month: number
  unitsPerDay: number
  netProfit: number
  cumulative: number
}

export interface PnLProductRow {
  id: string
  name: string
  unitsPerDay: number
  pricePerUnit: number
  variableCostPerUnit: number
  monthlyRevenue: number
  monthlyVariableCost: number
}

export interface PnLResult {
  monthlyRevenue: number
  monthlyVariableCosts: number
  grossProfit: number
  grossMarginPct: number
  monthlyFixedCosts: number
  netProfit: number
  netMarginPct: number
  products: PnLProductRow[]
}
