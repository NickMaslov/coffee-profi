import { useTranslation } from 'react-i18next'
import { useAppState } from '../store/AppContext'
import { InputSlider } from './InputSlider'
import styles from './Panel.module.css'

export function CostsPanel() {
  const { t } = useTranslation()
  const { state, dispatch } = useAppState()
  const { fixedCosts, variableCosts } = state

  return (
    <div className={styles.panel}>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>{t('fixedCosts')}</h3>
        <p className={styles.sectionDesc}>{t('fixedCostsDesc')}</p>
        <InputSlider label={t('rent')} value={fixedCosts.rent} min={500} max={20000} step={100} prefix="$" suffix={t('perMonth')} onChange={v => dispatch({ type: 'SET_FIXED', key: 'rent', value: v })} />
        <InputSlider label={t('salaries')} value={fixedCosts.salaries} min={1000} max={30000} step={100} prefix="$" suffix={t('perMonth')} onChange={v => dispatch({ type: 'SET_FIXED', key: 'salaries', value: v })} />
        <InputSlider label={t('utilities')} value={fixedCosts.utilities} min={100} max={5000} step={50} prefix="$" suffix={t('perMonth')} onChange={v => dispatch({ type: 'SET_FIXED', key: 'utilities', value: v })} />
        <InputSlider label={t('equipmentAmortization')} value={fixedCosts.equipmentAmortization} min={50} max={5000} step={50} prefix="$" suffix={t('perMonth')} onChange={v => dispatch({ type: 'SET_FIXED', key: 'equipmentAmortization', value: v })} />
        <InputSlider label={t('marketing')} value={fixedCosts.marketing} min={0} max={5000} step={50} prefix="$" suffix={t('perMonth')} onChange={v => dispatch({ type: 'SET_FIXED', key: 'marketing', value: v })} />
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>{t('variableCosts')}</h3>
        <p className={styles.sectionDesc}>{t('variableCostsDesc')}</p>
        <InputSlider label={t('coffeeBeans')} value={variableCosts.coffeeBeans} min={0.1} max={3} step={0.05} prefix="$" suffix={t('perCup')} onChange={v => dispatch({ type: 'SET_VARIABLE', key: 'coffeeBeans', value: v })} />
        <InputSlider label={t('milk')} value={variableCosts.milk} min={0} max={2} step={0.05} prefix="$" suffix={t('perCup')} onChange={v => dispatch({ type: 'SET_VARIABLE', key: 'milk', value: v })} />
        <InputSlider label={t('cupAndLid')} value={variableCosts.cupAndLid} min={0.05} max={1} step={0.05} prefix="$" suffix={t('perCup')} onChange={v => dispatch({ type: 'SET_VARIABLE', key: 'cupAndLid', value: v })} />
        <InputSlider label={t('syrups')} value={variableCosts.syrups} min={0} max={1} step={0.05} prefix="$" suffix={t('perCup')} onChange={v => dispatch({ type: 'SET_VARIABLE', key: 'syrups', value: v })} />
      </div>
    </div>
  )
}
