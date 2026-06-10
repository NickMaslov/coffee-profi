import { useTranslation } from 'react-i18next'
import { useAppState } from '../store/AppContext'
import { InputSlider } from './InputSlider'
import { Accordion } from './Accordion'
import { IconTrendingUp } from './icons'

export function RevenuePanel() {
  const { t } = useTranslation()
  const { state, dispatch } = useAppState()
  const { revenue } = state

  return (
    <Accordion title={t('revenue')} desc={t('revenueDesc')} defaultOpen>
      <div>
        <InputSlider icon={<IconTrendingUp size={16} />} label={t('unitsPerDay')} value={revenue.unitsPerDay} min={0} max={500} step={5} onChange={v => dispatch({ type: 'SET_REVENUE', key: 'unitsPerDay', value: v })} />
      </div>
    </Accordion>
  )
}
