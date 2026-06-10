import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react'
import i18n from '../i18n'
import type { AppState, Product, ProductIcon } from '../types'

const defaultProducts: Product[] = [
  { id: 'coffee',  name: 'Coffee',  iconKey: 'coffee',   pricePerUnit: 6.00, variableCostPerUnit: 1.25, unitsPerDay: 60 },
  { id: 'tea',     name: 'Tea',     iconKey: 'tea',      pricePerUnit: 4.50, variableCostPerUnit: 0.60, unitsPerDay: 25 },
  { id: 'dessert', name: 'Dessert', iconKey: 'dessert',  pricePerUnit: 5.00, variableCostPerUnit: 1.80, unitsPerDay: 15 },
]

function makeProduct(): Product {
  return {
    id: `product_${Date.now()}`,
    name: 'New item',
    iconKey: 'star',
    pricePerUnit: 5.00,
    variableCostPerUnit: 1.50,
    unitsPerDay: 10,
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

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>
}

export function useAppState() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppState must be used inside AppProvider')
  return ctx
}
