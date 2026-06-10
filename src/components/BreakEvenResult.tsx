import { useTranslation } from 'react-i18next'
import { useAppState } from '../store/AppContext'
import { calcBreakEven, calcTotalUnitsPerDay } from '../utils/calculations'
import { IconTrendingUp, IconCoffee } from './icons'
import styles from './BreakEvenResult.module.css'

export function BreakEvenResult() {
  const { t } = useTranslation()
  const { state } = useAppState()
  const result = calcBreakEven(state.fixedCosts, state.products)
  const currentUnits = calcTotalUnitsPerDay(state.products)
  const isProfitable = currentUnits >= result.unitsPerDay
  const pct = isFinite(result.unitsPerDay) ? Math.min(100, Math.round((currentUnits / result.unitsPerDay) * 100)) : 100

  return (
    <div className={`${styles.card} ${isProfitable ? styles.profit : styles.loss}`}>
      <div className={styles.topRow}>
        <div className={styles.iconWrap}>
          <IconCoffee size={22} />
        </div>
        <span className={`${styles.badge} ${isProfitable ? styles.badgeProfit : styles.badgeLoss}`}>
          <IconTrendingUp size={12} />
          {isProfitable ? t('profitZone') : t('lossZone')}
        </span>
      </div>

      <div className={styles.numbersRow}>
        <div>
          <div className={styles.label}>{t('breakEvenTitle')}</div>
          <div className={styles.mainNumber}>
            {isFinite(result.unitsPerDay) ? result.unitsPerDay : '∞'}
          </div>
          <div className={styles.unit}>{t('breakEvenCupsDay')}</div>
          <div className={styles.sub}>
            {isFinite(result.unitsPerMonth) ? result.unitsPerMonth.toLocaleString() : '∞'} {t('breakEvenCupsMonth')}
          </div>
        </div>
        <div className={styles.currentBlock}>
          <div className={styles.label}>{t('currentSales')}</div>
          <div className={styles.currentNumber}>{currentUnits}</div>
          <div className={styles.unit}>{t('breakEvenCupsDay')}</div>
          <div className={styles.sub}>{(currentUnits * 30).toLocaleString()} {t('breakEvenCupsMonth')}</div>
        </div>
      </div>

      <div className={styles.progressWrap}>
        <div className={styles.progressBar}>
          <div
            className={`${styles.progressFill} ${isProfitable ? styles.progressProfit : styles.progressLoss}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className={styles.progressLabel}>{pct}%</span>
      </div>
    </div>
  )
}
