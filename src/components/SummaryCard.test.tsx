import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '../test/helpers'
import { SummaryCard } from './SummaryCard'

// Default state: netProfit = -1885, revenue = 16425, totalCosts = 18285

describe('SummaryCard', () => {
  it('renders the Monthly Summary heading', () => {
    renderWithProviders(<SummaryCard />)
    expect(screen.getByText(/monthly summary/i)).toBeInTheDocument()
  })

  it('shows monthly revenue', () => {
    renderWithProviders(<SummaryCard />)
    // $16,425
    expect(screen.getByText('$16,425')).toBeInTheDocument()
  })

  it('shows monthly costs', () => {
    renderWithProviders(<SummaryCard />)
    // fixed 14800 + variable 3510 = 18310
    expect(screen.getByText('$18,310')).toBeInTheDocument()
  })

  it('shows net loss as negative value', () => {
    renderWithProviders(<SummaryCard />)
    // profit chip shows -$1,885
    expect(screen.getByText('-$1,885')).toBeInTheDocument()
  })

  it('shows blended margin label', () => {
    renderWithProviders(<SummaryCard />)
    expect(screen.getByText(/blended margin/i)).toBeInTheDocument()
  })
})
