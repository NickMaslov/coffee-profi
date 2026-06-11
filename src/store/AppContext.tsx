import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react'
import i18n from '../i18n'
import type { AppState, Product, ProductIcon, SavedScenario } from '../types'

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

function loadScenarios(): SavedScenario[] {
  try {
    return JSON.parse(localStorage.getItem('savedScenarios') ?? '[]')
  } catch {
    return []
  }
}

const defaultState: AppState = {
  fixedCosts: {
    rent: 5000,
    salaries: 8000,
    utilities: 800,
    equipmentAmortization: 600,
    marketing: 400,
  },
  products: defaultProducts,
  theme: (localStorage.getItem('theme') as 'light' | 'dark') ?? 'light',
  language: (localStorage.getItem('language') as 'en' | 'ru' | 'es') ?? 'en',
  savedScenarios: loadScenarios(),
}

type Action =
  | { type: 'SET_FIXED'; key: keyof AppState['fixedCosts']; value: number }
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
      return { ...state, fixedCosts: { ...state.fixedCosts, [action.key]: action.value } }
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
        fixedCosts: { ...state.fixedCosts },
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
