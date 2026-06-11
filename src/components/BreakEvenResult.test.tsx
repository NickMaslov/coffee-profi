import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '../test/helpers'
import { BreakEvenResult } from './BreakEvenResult'

// Default state: 100 units/day sold, BE = 115 → loss zone

describe('BreakEvenResult', () => {
  it('renders the break-even number', () => {
    renderWithProviders(<BreakEvenResult />)
    // BE with default products = 115
    expect(screen.getByText('115')).toBeInTheDocument()
  })

  it('renders current sales units', () => {
    renderWithProviders(<BreakEvenResult />)
    // default products total 100 units/day
    expect(screen.getByText('100')).toBeInTheDocument()
  })

  it('shows LOSS ZONE when below break-even', () => {
    renderWithProviders(<BreakEvenResult />)
    expect(screen.getByText(/loss zone/i)).toBeInTheDocument()
  })

  it('shows progress percentage', () => {
    renderWithProviders(<BreakEvenResult />)
    // 100/115 ≈ 87%
    expect(screen.getByText('87%')).toBeInTheDocument()
  })

  it('renders break-even label', () => {
    renderWithProviders(<BreakEvenResult />)
    expect(screen.getByText(/break-even point/i)).toBeInTheDocument()
  })

  it('renders current sales label', () => {
    renderWithProviders(<BreakEvenResult />)
    expect(screen.getByText(/current sales/i)).toBeInTheDocument()
  })
})
