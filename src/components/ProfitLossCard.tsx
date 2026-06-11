import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppState } from '../store/AppContext'
import { calcPnL } from '../utils/calculations'
import { exportCsv } from '../utils/export'
import styles from './ProfitLossCard.module.css'

const PRESETS = [
  { key: 'scenarioPessimistic', value: 0.7 },
  { key: 'scenarioBase',        value: 1.0 },
  { key: 'scenarioOptimistic',  value: 1.5 },
] as const

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
  const [multiplier, setMultiplier] = useState(1)

  const scenarioProducts = state.products.map(p => ({
    ...p,
    unitsPerDay: p.unitsPerDay * multiplier,
  }))
  const pnl = calcPnL(state.fixedCosts, scenarioProducts)
  const basePnl = calcPnL(state.fixedCosts, state.products)
  const isProfit = pnl.netProfit >= 0
  const isBase = Math.abs(multiplier - 1) < 0.001
  const delta = pnl.netProfit - basePnl.netProfit
  const sliderPct = ((multiplier * 100 - 50) / 150) * 100

  const fixedRows: Array<{ key: keyof typeof state.fixedCosts; label: string }> = [
    { key: 'rent',                 label: t('rent') },
    { key: 'salaries',             label: t('salaries') },
    { key: 'utilities',            label: t('utilities') },
    { key: 'equipmentAmortization', label: t('equipmentAmortization') },
    { key: 'marketing',            label: t('marketing') },
  ]

  const fixedLabels = Object.fromEntries(fixedRows.map(r => [r.key, r.label])) as Record<keyof typeof state.fixedCosts, string>

  function handleCsv() {
    exportCsv(pnl, state.fixedCosts, fixedLabels)
  }

  function handlePdf() {
    window.print()
  }

  return (
    <div className={`${styles.card} ${open ? styles.open : ''}`}>

      {/* Header */}
      <button className={styles.header} onClick={() => setOpen(o => !o)} aria-expanded={open}>
        <div className={styles.headerLeft}>
          <span className={styles.accent} />
          <h3 className={styles.title}>{t('pnlTitle')}</h3>
        </div>
        <div className={styles.headerRight}>
          <span className={`${styles.netChip} ${isProfit ? styles.chipGreen : styles.chipRed}`}>
            {isProfit ? '+' : ''}{fmt(pnl.netProfit)}
          </span>
          {!isBase && (
            <span className={styles.scenarioBadge}>{Math.round(multiplier * 100)}%</span>
          )}
          <svg className={styles.chevron} width="16" height="16" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>

      <div className={styles.body}>
        <div className={styles.bodyInner}>

          {/* Scenario controls */}
          <div className={styles.scenarioBlock}>
            <div className={styles.scenarioTopRow}>
              <span className={styles.scenarioLabel}>{t('scenarioTitle')}</span>
              <span className={`${styles.scenarioPct} ${!isBase ? styles.scenarioPctActive : ''}`}>
                {Math.round(multiplier * 100)}%
              </span>
            </div>
            <div className={styles.presets}>
              {PRESETS.map(({ key, value }) => (
                <button
                  key={key}
                  className={`${styles.presetBtn} ${Math.abs(multiplier - value) < 0.01 ? styles.presetActive : ''}`}
                  onClick={() => setMultiplier(value)}
                >
                  {t(key)}
                </button>
              ))}
            </div>
            <div className={styles.sliderTrack}>
              <div className={styles.sliderBg}>
                <div className={styles.sliderFill} style={{ width: `${sliderPct}%` }} />
              </div>
              <input
                type="range" min={50} max={200} step={5}
                value={Math.round(multiplier * 100)}
                onChange={e => setMultiplier(Number(e.target.value) / 100)}
                className={styles.sliderInput}
              />
              <div className={styles.sliderThumb} style={{ left: `calc(${sliderPct}% - 8px)` }} />
            </div>
            <div className={styles.sliderLabels}>
              <span>50%</span>
              <span>200%</span>
            </div>
          </div>

          <div className={styles.divider} />

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
                detail={`${Math.round(p.unitsPerDay)} ${t('pnlPerDay')} × $${p.pricePerUnit.toFixed(2)}`}
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
                detail={`${Math.round(p.unitsPerDay)} ${t('pnlPerDay')} × $${p.variableCostPerUnit.toFixed(2)}`}
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

          {/* Net Profit / Loss */}
          <div className={`${styles.netRow} ${isProfit ? styles.netProfit : styles.netLoss}`}>
            <span className={styles.netLabel}>{isProfit ? t('monthlyProfit') : t('monthlyLoss')}</span>
            <div className={styles.netRight}>
              <span className={styles.netValue}>{isProfit ? '+' : ''}{fmt(pnl.netProfit)}</span>
              <span className={styles.netPct}>{fmtPct(pnl.netMarginPct)} {t('pnlNetMargin')}</span>
              {!isBase && (
                <span className={`${styles.netDelta} ${delta >= 0 ? styles.green : styles.red}`}>
                  {delta >= 0 ? '+' : ''}{fmt(delta)} {t('scenarioVsBase')}
                </span>
              )}
            </div>
          </div>

          {/* Export buttons */}
          <div className={styles.exportRow}>
            <button className={styles.exportBtn} onClick={handleCsv}>
              ↓ {t('exportCsv')}
            </button>
            <button className={`${styles.exportBtn} ${styles.exportBtnPdf}`} onClick={handlePdf}>
              ⎙ {t('exportPdf')}
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
