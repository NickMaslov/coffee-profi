import { render } from '@testing-library/react'
import { AppProvider } from '../store/AppContext'
import type { ReactNode } from 'react'

export function renderWithProviders(ui: ReactNode) {
  return render(<AppProvider>{ui}</AppProvider>)
}
