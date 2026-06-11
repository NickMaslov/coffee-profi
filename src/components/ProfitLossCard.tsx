import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppState } from '../store/AppContext'
import { calcPnL } from '../utils/calculations'
import styles from './ProfitLossCard.module.css'

function fmt(n: number) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}

function fmtPct(n: number) {
  return `${n.toFixed(1)}%`
}

interface RowProps {
  label: string
  detail?: string
  value: number
  colorClass?: string
  indent?: boolean
}

function Row({ label, detail, value, colorClass, indent }: RowProps) {
  return (
    <div className={`${styles.row} ${indent ? styles.rowIndent : ''}`}>
      <div className={styles.rowLeft}>
        <span className={styles.rowName}>{label}</span>
        {detail && <span className={styles.rowDetail}>{detail}</span>}
      </div>
      <span className={`${styles.rowValue} ${colorClass ?? ''}`}>{fmt(value)}</span>
    </div>
  )
}

export function ProfitLossCard() {
  const { t } = useTranslation()
  const { state } = useAppState()
  const [open, setOpen] = useState(true)
  const pnl = calcPnL(state.fixedCosts, state.products)
  const isProfit = pnl.netProfit >= 0

  const fixedRows: Array<{ key: keyof typeof state.fixedCosts; label: string }> = [
    { key: 'rent', label: t('rent') },
    { key: 'salaries', label: t('salaries') },
    { key: 'utilities', label: t('utilities') },
    { key: 'equipmentAmortization', label: t('equipmentAmortization') },
    { key: 'marketing', label: t('marketing') },
  ]

  return (
    <div className={`${styles.card} ${open ? styles.open : ''}`}>
      <button className={styles.header} onClick={() => setOpen(o => !o)} aria-expanded={open}>
        <div className={styles.headerLeft}>
          <span className={styles.accent} />
          <h3 className={styles.title}>{t('pnlTitle')}</h3>
        </div>
        <div className={styles.headerRight}>
          <span className={`${styles.netChip} ${isProfit ? styles.chipGreen : styles.chipRed}`}>
            {isProfit ? '+' : ''}{fmt(pnl.netProfit)}
          </span>
          <svg className={styles.chevron} width="16" height="16" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>

      <div className={styles.body}>
        <div className={styles.bodyInner}>

      {/* Revenue */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <span>{t('monthlyRevenue')}</span>
          <span className={styles.green}>{fmt(pnl.monthlyRevenue)}</span>
        </div>
        {pnl.products.map(p => (
          <Row
            key={p.id}
            label={p.name}
            detail={`${p.unitsPerDay} ${t('pnlPerDay')} × $${p.pricePerUnit.toFixed(2)}`}
            value={p.monthlyRevenue}
            indent
          />
        ))}
      </div>

      <div className={styles.divider} />

      {/* Variable Costs */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <span>{t('pnlVariableCosts')}</span>
          <span className={styles.red}>−{fmt(pnl.monthlyVariableCosts)}</span>
        </div>
        {pnl.products.map(p => (
          <Row
            key={p.id}
            label={p.name}
            detail={`${p.unitsPerDay} ${t('pnlPerDay')} × $${p.variableCostPerUnit.toFixed(2)}`}
            value={-p.monthlyVariableCost}
            colorClass={styles.red}
            indent
          />
        ))}
      </div>

      <div className={styles.divider} />

      {/* Gross Profit */}
      <div className={styles.subtotal}>
        <div className={styles.subtotalLeft}>
          <span className={styles.subtotalLabel}>{t('pnlGrossProfit')}</span>
          <span className={styles.pctBadge}>{fmtPct(pnl.grossMarginPct)} {t('pnlGrossMargin')}</span>
        </div>
        <span className={`${styles.subtotalValue} ${pnl.grossProfit >= 0 ? styles.green : styles.red}`}>
          {fmt(pnl.grossProfit)}
        </span>
      </div>

      <div className={styles.divider} />

      {/* Fixed Costs */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <span>{t('fixedCosts')}</span>
          <span className={styles.red}>−{fmt(pnl.monthlyFixedCosts)}</span>
        </div>
        {fixedRows.map(({ key, label }) => (
          <Row
            key={key}
            label={label}
            value={-state.fixedCosts[key]}
            colorClass={styles.red}
            indent
          />
        ))}
      </div>

      <div className={styles.divider} />

      {/* Net Profit */}
      <div className={`${styles.netRow} ${isProfit ? styles.netProfit : styles.netLoss}`}>
        <span className={styles.netLabel}>{isProfit ? t('monthlyProfit') : t('monthlyLoss')}</span>
        <div className={styles.netRight}>
          <span className={styles.netValue}>{isProfit ? '+' : ''}{fmt(pnl.netProfit)}</span>
          <span className={styles.netPct}>{fmtPct(pnl.netMarginPct)} {t('pnlNetMargin')}</span>
        </div>
      </div>
        </div>
      </div>
    </div>
  )
}
