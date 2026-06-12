import { useTranslation } from 'react-i18next'
import { useAppState } from '../store/AppContext'
import { calcBreakEven, calcBlendedRevenue, calcBlendedVariableCost, calcTotalUnitsPerDay } from '../utils/calculations'
import { IconTrendingUp, IconCoffee } from './icons'
import styles from './SummaryCard.module.css'

function fmt(n: number) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}

function fmtCup(n: number) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function SummaryCard() {
  const { t } = useTranslation()
  const { state } = useAppState()
  const { fixedCosts, products } = state

  const totalUnits = calcTotalUnitsPerDay(products)
  const blendedRevPerUnit = calcBlendedRevenue(products)
  const blendedVarPerUnit = calcBlendedVariableCost(products)
  const monthlyFixed = fixedCosts.reduce((s, i) => s + i.value, 0)
  const monthlyRevenue = totalUnits * blendedRevPerUnit * 30
  const monthlyVariable = totalUnits * blendedVarPerUnit * 30
  const monthlyCosts = monthlyFixed + monthlyVariable
  const profit = monthlyRevenue - monthlyCosts
  const isProfit = profit >= 0
  const breakEven = calcBreakEven(fixedCosts, products)

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{t('summary')}</h3>
        <span className={`${styles.profitChip} ${isProfit ? styles.profitChipGreen : styles.profitChipRed}`}>
          <IconTrendingUp size={13} />
          {isProfit ? '+' : ''}{fmt(profit)}
        </span>
      </div>

      <div className={styles.statsRow}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>{t('monthlyRevenue')}</span>
          <span className={`${styles.statValue} ${styles.green}`}>{fmt(monthlyRevenue)}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>{t('monthlyCosts')}</span>
          <span className={`${styles.statValue} ${styles.red}`}>{fmt(monthlyCosts)}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>{t('blendedMargin')}</span>
          <div className={styles.marginWrap}>
            <IconCoffee size={13} />
            <span className={styles.statValue}>{fmtCup(breakEven.blendedMarginPerUnit)}</span>
          </div>
        </div>
      </div>

      <div className={styles.barSection}>
<div className={styles.barTrack}>
          <div
            className={styles.barRevenue}
            style={{ width: `${Math.min(100, (monthlyRevenue / Math.max(monthlyRevenue, monthlyCosts)) * 100)}%` }}
          />
        </div>
        <div className={styles.barTrack}>
          <div
            className={styles.barCosts}
            style={{ width: `${Math.min(100, (monthlyCosts / Math.max(monthlyRevenue, monthlyCosts)) * 100)}%` }}
          />
        </div>
      </div>
    </div>
  )
}
