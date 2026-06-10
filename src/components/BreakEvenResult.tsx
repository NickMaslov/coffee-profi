import { useTranslation } from 'react-i18next'
import { useAppState } from '../store/AppContext'
import { calcBreakEven } from '../utils/calculations'
import styles from './BreakEvenResult.module.css'

export function BreakEvenResult() {
  const { t } = useTranslation()
  const { state } = useAppState()
  const result = calcBreakEven(state.fixedCosts, state.variableCosts, state.revenue)
  const currentCups = state.revenue.cupsPerDay
  const isProfitable = currentCups >= result.cupsPerDay

  return (
    <div className={`${styles.card} ${isProfitable ? styles.profit : styles.loss}`}>
      <div className={styles.label}>{t('breakEvenTitle')}</div>
      <div className={styles.mainNumber}>
        {isFinite(result.cupsPerDay) ? result.cupsPerDay : '∞'}
      </div>
      <div className={styles.unit}>{t('breakEvenCupsDay')}</div>
      <div className={styles.sub}>
        {isFinite(result.cupsPerMonth) ? result.cupsPerMonth.toLocaleString() : '∞'} {t('breakEvenCupsMonth')}
      </div>
      <div className={styles.badge}>
        {isProfitable ? `✓ ${t('profitZone')}` : `✗ ${t('lossZone')}`}
      </div>
    </div>
  )
}
