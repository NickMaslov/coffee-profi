import { useTranslation } from 'react-i18next'
import { useAppState } from '../store/AppContext'
import { calcDailyFixedCosts, calcVariableCostPerCup } from '../utils/calculations'
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
      <h3 className={styles.title}>{t('summary')}</h3>
      <div className={styles.rows}>
        <div className={styles.row}>
          <span className={styles.rowLabel}>{t('monthlyRevenue')}</span>
          <span className={styles.rowValue}>{fmt(monthlyRevenue)}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.rowLabel}>{t('monthlyCosts')}</span>
          <span className={`${styles.rowValue} ${styles.costValue}`}>{fmt(monthlyCosts)}</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.row}>
          <span className={styles.rowLabel}>{isProfit ? t('monthlyProfit') : t('monthlyLoss')}</span>
          <span className={`${styles.rowValue} ${styles.big} ${isProfit ? styles.profitVal : styles.lossVal}`}>
            {fmt(Math.abs(profit))}
          </span>
        </div>
        <div className={styles.row}>
          <span className={styles.rowLabel}>{t('marginPerCup')}</span>
          <span className={styles.rowValue}>{fmtCup(marginPerCup)}</span>
        </div>
      </div>
    </div>
  )
}
