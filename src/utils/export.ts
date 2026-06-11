import type { PnLResult } from '../types'
import type { FixedCosts } from '../types'

function fmtNum(n: number) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}

function fmtPct(n: number) {
  return `${n.toFixed(1)}%`
}

export function exportCsv(pnl: PnLResult, fixedCosts: FixedCosts, fixedLabels: Record<keyof FixedCosts, string>) {
  const rows: string[][] = []

  rows.push(['Monthly P&L Report'])
  rows.push(['Generated', new Date().toLocaleDateString('en-US')])
  rows.push([])
  rows.push(['Section', 'Item', 'Units/day', 'Monthly Amount'])

  // Revenue
  for (const p of pnl.products) {
    rows.push(['Revenue', p.name, String(Math.round(p.unitsPerDay)), fmtNum(p.monthlyRevenue)])
  }
  rows.push(['Revenue', 'TOTAL', '', fmtNum(pnl.monthlyRevenue)])
  rows.push([])

  // Variable Costs
  for (const p of pnl.products) {
    rows.push(['Variable Costs', p.name, String(Math.round(p.unitsPerDay)), fmtNum(-p.monthlyVariableCost)])
  }
  rows.push(['Variable Costs', 'TOTAL', '', fmtNum(-pnl.monthlyVariableCosts)])
  rows.push([])

  // Gross Profit
  rows.push(['', 'Gross Profit', '', fmtNum(pnl.grossProfit)])
  rows.push(['', 'Gross Margin', '', fmtPct(pnl.grossMarginPct)])
  rows.push([])

  // Fixed Costs
  for (const [key, label] of Object.entries(fixedLabels) as [keyof FixedCosts, string][]) {
    rows.push(['Fixed Costs', label, '', fmtNum(-fixedCosts[key])])
  }
  rows.push(['Fixed Costs', 'TOTAL', '', fmtNum(-pnl.monthlyFixedCosts)])
  rows.push([])

  // Net
  rows.push(['', pnl.netProfit >= 0 ? 'NET PROFIT' : 'NET LOSS', '', fmtNum(pnl.netProfit)])
  rows.push(['', 'Net Margin', '', fmtPct(pnl.netMarginPct)])

  const csv = rows.map(r => r.map(cell => `"${cell}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `pnl_${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
