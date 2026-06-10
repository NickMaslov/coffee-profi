import { useTranslation } from 'react-i18next'
import { useAppState } from '../store/AppContext'
import { InputSlider } from './InputSlider'
import { Accordion } from './Accordion'
import { IconBuilding, IconUsers, IconZap, IconTool, IconMegaphone } from './icons'

export function CostsPanel() {
  const { t } = useTranslation()
  const { state, dispatch } = useAppState()
  const { fixedCosts } = state

  return (
    <Accordion title={t('fixedCosts')} desc={t('fixedCostsDesc')} defaultOpen>
      <div>
        <InputSlider icon={<IconBuilding />} label={t('rent')} value={fixedCosts.rent} min={500} max={20000} step={100} prefix="$" suffix={t('perMonth')} onChange={v => dispatch({ type: 'SET_FIXED', key: 'rent', value: v })} />
        <InputSlider icon={<IconUsers />} label={t('salaries')} value={fixedCosts.salaries} min={1000} max={30000} step={100} prefix="$" suffix={t('perMonth')} onChange={v => dispatch({ type: 'SET_FIXED', key: 'salaries', value: v })} />
        <InputSlider icon={<IconZap />} label={t('utilities')} value={fixedCosts.utilities} min={100} max={5000} step={50} prefix="$" suffix={t('perMonth')} onChange={v => dispatch({ type: 'SET_FIXED', key: 'utilities', value: v })} />
        <InputSlider icon={<IconTool />} label={t('equipmentAmortization')} value={fixedCosts.equipmentAmortization} min={50} max={5000} step={50} prefix="$" suffix={t('perMonth')} onChange={v => dispatch({ type: 'SET_FIXED', key: 'equipmentAmortization', value: v })} />
        <InputSlider icon={<IconMegaphone />} label={t('marketing')} value={fixedCosts.marketing} min={0} max={5000} step={50} prefix="$" suffix={t('perMonth')} onChange={v => dispatch({ type: 'SET_FIXED', key: 'marketing', value: v })} />
      </div>
    </Accordion>
  )
}
