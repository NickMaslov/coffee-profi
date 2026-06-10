import { useTranslation } from 'react-i18next'
import { useAppState } from '../store/AppContext'
import { Accordion } from './Accordion'
import { ProductCard } from './ProductCard'
import { IconPlus } from './icons'
import { calcTotalUnitsPerDay, calcBlendedRevenue } from '../utils/calculations'
import styles from './MenuPanel.module.css'

export function MenuPanel() {
  const { t } = useTranslation()
  const { state, dispatch } = useAppState()
  const totalUnits = calcTotalUnitsPerDay(state.products)

  const blendedPrice = calcBlendedRevenue(state.products)
  const collapsedDesc = `${totalUnits} ${t('unitsPerDayShort')} · $${blendedPrice.toFixed(2)} ${t('avgPrice')}`

  return (
    <Accordion
      title={t('menuItems')}
      desc={`${t('menuItemsDesc')} · ${totalUnits} ${t('unitsPerDayShort')}`}
      collapsedDesc={collapsedDesc}
      defaultOpen
    >
      <div>
        {state.products.map(p => (
          <ProductCard key={p.id} product={p} canDelete={state.products.length > 1} />
        ))}

        <button
          className={styles.addBtn}
          onClick={() => dispatch({ type: 'ADD_PRODUCT' })}
        >
          <IconPlus size={14} />
          {t('addItem')}
        </button>
      </div>
    </Accordion>
  )
}
