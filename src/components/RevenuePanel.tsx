import { useTranslation } from 'react-i18next'
import { useAppState } from '../store/AppContext'
import { InputSlider } from './InputSlider'
import { Accordion } from './Accordion'
import { IconCoffee, IconTrendingUp } from './icons'

export function RevenuePanel() {
  const { t } = useTranslation()
  const { state, dispatch } = useAppState()
  const { revenue } = state

  return (
    <Accordion title={t('revenue')} desc={t('revenueDesc')} defaultOpen>
      <div>
        <InputSlider icon={<IconCoffee size={16} />} label={t('pricePerCup')} value={revenue.pricePerCup} min={1} max={20} step={0.25} prefix="$" onChange={v => dispatch({ type: 'SET_REVENUE', key: 'pricePerCup', value: v })} />
        <InputSlider icon={<IconTrendingUp size={16} />} label={t('cupsPerDay')} value={revenue.cupsPerDay} min={0} max={500} step={5} onChange={v => dispatch({ type: 'SET_REVENUE', key: 'cupsPerDay', value: v })} />
      </div>
    </Accordion>
  )
}
