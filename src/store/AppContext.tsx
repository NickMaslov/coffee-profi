import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react'
import i18n from '../i18n'
import type { AppState, Product, ProductIcon, SavedScenario, FixedCostItem } from '../types'

const defaultProducts: Product[] = [
  { id: 'coffee',  name: 'Coffee',  iconKey: 'coffee',   pricePerUnit: 6.00, variableCostPerUnit: 1.25, unitsPerDay: 60 },
  { id: 'tea',     name: 'Tea',     iconKey: 'tea',      pricePerUnit: 4.50, variableCostPerUnit: 0.60, unitsPerDay: 25 },
  { id: 'dessert', name: 'Dessert', iconKey: 'dessert',  pricePerUnit: 5.00, variableCostPerUnit: 1.80, unitsPerDay: 15 },
]

function makeProduct(): Product {
  return {
    id: `product_${crypto.randomUUID()}`,
    name: 'New item',
    iconKey: 'star',
    pricePerUnit: 5.00,
    variableCostPerUnit: 1.50,
    unitsPerDay: 10,
  }
}

// Migrate a legacy fixedCosts object ({ rent, salaries, ... }) to the new
// FixedCostItem[] format. Returns the value unchanged if it's already an array.
function migrateFixedCosts(fixed: unknown): FixedCostItem[] {
  if (Array.isArray(fixed)) return fixed as FixedCostItem[]
  if (fixed && typeof fixed === 'object') {
    return Object.entries(fixed as Record<string, number>).map(([id, value]) => ({
      id,
      name: id.charAt(0).toUpperCase() + id.slice(1),
      value: Number(value) || 0,
    }))
  }
  return []
}

function loadScenarios(): SavedScenario[] {
  try {
    const raw = JSON.parse(localStorage.getItem('savedScenarios') ?? '[]')
    if (!Array.isArray(raw)) return []
    return raw.map((s: SavedScenario) => ({ ...s, fixedCosts: migrateFixedCosts(s.fixedCosts) }))
  } catch {
    return []
  }
}

const defaultState: AppState = {
  fixedCosts: [
    { id: 'rent',                  name: 'Rent',                   value: 5000 },
    { id: 'salaries',              name: 'Salaries',               value: 8000 },
    { id: 'utilities',             name: 'Utilities',              value: 800  },
    { id: 'equipmentAmortization', name: 'Equipment amortization', value: 600  },
    { id: 'marketing',             name: 'Marketing',              value: 400  },
  ],
  products: defaultProducts,
  theme: (localStorage.getItem('theme') as 'light' | 'dark') ?? 'light',
  language: (localStorage.getItem('language') as 'en' | 'ru' | 'es') ?? 'en',
  savedScenarios: loadScenarios(),
}

type Action =
  | { type: 'SET_FIXED'; id: string; value: number }
  | { type: 'SET_FIXED_NAME'; id: string; name: string }
  | { type: 'ADD_FIXED' }
  | { type: 'REMOVE_FIXED'; id: string }
  | { type: 'SET_PRODUCT'; id: string; key: keyof Omit<Product, 'id' | 'name' | 'iconKey'>; value: number }
  | { type: 'SET_PRODUCT_NAME'; id: string; name: string }
  | { type: 'SET_PRODUCT_ICON'; id: string; iconKey: ProductIcon }
  | { type: 'ADD_PRODUCT' }
  | { type: 'REMOVE_PRODUCT'; id: string }
  | { type: 'SET_THEME'; value: 'light' | 'dark' }
  | { type: 'SET_LANGUAGE'; value: 'en' | 'ru' | 'es' }
  | { type: 'SAVE_SCENARIO'; name: string }
  | { type: 'LOAD_SCENARIO'; id: string }
  | { type: 'DELETE_SCENARIO'; id: string }

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_FIXED':
      return { ...state, fixedCosts: state.fixedCosts.map(i => i.id === action.id ? { ...i, value: action.value } : i) }
    case 'SET_FIXED_NAME':
      return { ...state, fixedCosts: state.fixedCosts.map(i => i.id === action.id ? { ...i, name: action.name } : i) }
    case 'ADD_FIXED':
      return { ...state, fixedCosts: [...state.fixedCosts, { id: `fixed_${crypto.randomUUID()}`, name: 'New expense', value: 0 }] }
    case 'REMOVE_FIXED':
      return { ...state, fixedCosts: state.fixedCosts.filter(i => i.id !== action.id) }
    case 'SET_PRODUCT':
      return {
        ...state,
        products: state.products.map(p =>
          p.id === action.id ? { ...p, [action.key]: action.value } : p
        ),
      }
    case 'SET_PRODUCT_NAME':
      return {
        ...state,
        products: state.products.map(p =>
          p.id === action.id ? { ...p, name: action.name } : p
        ),
      }
    case 'SET_PRODUCT_ICON':
      return {
        ...state,
        products: state.products.map(p =>
          p.id === action.id ? { ...p, iconKey: action.iconKey } : p
        ),
      }
    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, makeProduct()] }
    case 'REMOVE_PRODUCT':
      return { ...state, products: state.products.filter(p => p.id !== action.id) }
    case 'SET_THEME':
      return { ...state, theme: action.value }
    case 'SET_LANGUAGE':
      return { ...state, language: action.value }
    case 'SAVE_SCENARIO': {
      const scenario: SavedScenario = {
        id: `scenario_${crypto.randomUUID()}`,
        name: action.name.trim() || `Scenario ${state.savedScenarios.length + 1}`,
        createdAt: Date.now(),
        fixedCosts: state.fixedCosts.map(i => ({ ...i })),
        products: state.products.map(p => ({ ...p })),
      }
      return { ...state, savedScenarios: [...state.savedScenarios, scenario] }
    }
    case 'LOAD_SCENARIO': {
      const scenario = state.savedScenarios.find(s => s.id === action.id)
      if (!scenario) return state
      return { ...state, fixedCosts: { ...scenario.fixedCosts }, products: scenario.products.map(p => ({ ...p })) }
    }
    case 'DELETE_SCENARIO':
      return { ...state, savedScenarios: state.savedScenarios.filter(s => s.id !== action.id) }
  }
}

interface AppContextValue {
  state: AppState
  dispatch: React.Dispatch<Action>
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, defaultState)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme)
    localStorage.setItem('theme', state.theme)
  }, [state.theme])

  useEffect(() => {
    localStorage.setItem('language', state.language)
    i18n.changeLanguage(state.language)
  }, [state.language])

  useEffect(() => {
    localStorage.setItem('savedScenarios', JSON.stringify(state.savedScenarios))
  }, [state.savedScenarios])

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>
}

export function useAppState() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppState must be used inside AppProvider')
  return ctx
}
