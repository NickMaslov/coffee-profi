import { useTranslation } from 'react-i18next'
import { useAppState } from '../store/AppContext'
import { InputSlider } from './InputSlider'
import { IconCoffee, IconDroplet, IconStar } from './icons'
import type { Product } from '../types'
import styles from './ProductCard.module.css'

const ICONS: Record<string, JSX.Element> = {
  coffee: <IconCoffee size={16} />,
  tea: <IconDroplet size={16} />,
  dessert: <IconStar size={16} />,
}

interface Props {
  product: Product
}

export function ProductCard({ product }: Props) {
  const { t } = useTranslation()
  const { dispatch } = useAppState()

  const set = (key: 'pricePerUnit' | 'variableCostPerUnit' | 'salesSharePct') =>
    (v: number) => dispatch({ type: 'SET_PRODUCT', id: product.id, key, value: v })

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.icon}>{ICONS[product.iconKey]}</span>
        <span className={styles.name}>{t(product.nameKey)}</span>
        <span className={styles.share}>{product.salesSharePct}%</span>
      </div>
      <InputSlider
        label={t('price')}
        value={product.pricePerUnit}
        min={0.5}
        max={30}
        step={0.25}
        prefix="$"
        onChange={set('pricePerUnit')}
      />
      <InputSlider
        label={t('varCost')}
        value={product.variableCostPerUnit}
        min={0}
        max={15}
        step={0.25}
        prefix="$"
        onChange={set('variableCostPerUnit')}
      />
      <InputSlider
        label={t('salesShare')}
        value={product.salesSharePct}
        min={0}
        max={100}
        step={1}
        suffix="%"
        onChange={set('salesSharePct')}
      />
    </div>
  )
}
