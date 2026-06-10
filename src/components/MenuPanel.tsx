import { useTranslation } from 'react-i18next'
import { useAppState } from '../store/AppContext'
import { Accordion } from './Accordion'
import { ProductCard } from './ProductCard'

export function MenuPanel() {
  const { t } = useTranslation()
  const { state } = useAppState()
  const total = state.products.reduce((s, p) => s + p.salesSharePct, 0)

  return (
    <Accordion
      title={t('menuItems')}
      desc={`${t('menuItemsDesc')} (${total}% total)`}
      defaultOpen
    >
      <div>
        {state.products.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
        {total !== 100 && (
          <p style={{ fontSize: 12, color: 'var(--loss)', marginTop: 4 }}>
            {t('salesShareWarning', { total })}
          </p>
        )}
      </div>
    </Accordion>
  )
}
