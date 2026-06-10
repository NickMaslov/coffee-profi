import { useTranslation } from 'react-i18next'
import { useAppState } from '../store/AppContext'
import { InputSlider } from './InputSlider'
import styles from './Panel.module.css'

export function RevenuePanel() {
  const { t } = useTranslation()
  const { state, dispatch } = useAppState()
  const { revenue } = state

  return (
    <div className={styles.panel}>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>{t('revenue')}</h3>
        <p className={styles.sectionDesc}>{t('revenueDesc')}</p>
        <InputSlider label={t('pricePerCup')} value={revenue.pricePerCup} min={1} max={20} step={0.25} prefix="$" onChange={v => dispatch({ type: 'SET_REVENUE', key: 'pricePerCup', value: v })} />
        <InputSlider label={t('cupsPerDay')} value={revenue.cupsPerDay} min={0} max={500} step={5} onChange={v => dispatch({ type: 'SET_REVENUE', key: 'cupsPerDay', value: v })} />
      </div>
    </div>
  )
}
