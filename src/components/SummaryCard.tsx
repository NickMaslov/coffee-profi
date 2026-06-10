import { useTranslation } from 'react-i18next'
import { useAppState } from '../store/AppContext'
import { calcVariableCostPerCup } from '../utils/calculations'
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
  const { fixedCosts, variableCosts, revenue } = state

  const monthlyRevenue = revenue.cupsPerDay * revenue.pricePerCup * 30
  const monthlyFixed = Object.values(fixedCosts).reduce((a, b) => a + b, 0)
  const varCostPerCup = calcVariableCostPerCup(variableCosts)
  const monthlyVariable = revenue.cupsPerDay * varCostPerCup * 30
  const monthlyCosts = monthlyFixed + monthlyVariable
  const profit = monthlyRevenue - monthlyCosts
  const isProfit = profit >= 0
  const marginPerCup = revenue.pricePerCup - varCostPerCup

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
          <span className={styles.statLabel}>{t('marginPerCup')}</span>
          <div className={styles.marginWrap}>
            <IconCoffee size={13} />
            <span className={styles.statValue}>{fmtCup(marginPerCup)}</span>
          </div>
        </div>
      </div>

      <div className={styles.barSection}>
        <div className={styles.barLabels}>
          <span className={styles.barLabel}>{t('monthlyRevenue')}</span>
          <span className={styles.barLabel}>{t('monthlyCosts')}</span>
        </div>
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
