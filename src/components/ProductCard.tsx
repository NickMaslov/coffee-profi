import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppState } from '../store/AppContext'
import { InputSlider } from './InputSlider'
import { IconCoffee, IconDroplet, IconStar, IconBeer, IconSandwich, IconTrash } from './icons'
import type { Product, ProductIcon } from '../types'
import styles from './ProductCard.module.css'

const ICON_OPTIONS: { key: ProductIcon; el: JSX.Element }[] = [
  { key: 'coffee',   el: <IconCoffee size={14} /> },
  { key: 'tea',      el: <IconDroplet size={14} /> },
  { key: 'dessert',  el: <IconStar size={14} /> },
  { key: 'beer',     el: <IconBeer size={14} /> },
  { key: 'sandwich', el: <IconSandwich size={14} /> },
  { key: 'star',     el: <IconStar size={14} /> },
]

const ICON_MAP: Record<ProductIcon, JSX.Element> = {
  coffee:   <IconCoffee size={16} />,
  tea:      <IconDroplet size={16} />,
  dessert:  <IconStar size={16} />,
  beer:     <IconBeer size={16} />,
  sandwich: <IconSandwich size={16} />,
  star:     <IconStar size={16} />,
}

interface Props {
  product: Product
  canDelete: boolean
}

export function ProductCard({ product, canDelete }: Props) {
  const { t } = useTranslation()
  const { dispatch } = useAppState()
  const [showIconPicker, setShowIconPicker] = useState(false)

  const set = (key: 'pricePerUnit' | 'variableCostPerUnit' | 'unitsPerDay') =>
    (v: number) => dispatch({ type: 'SET_PRODUCT', id: product.id, key, value: v })

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <button
          className={styles.iconBtn}
          onClick={() => setShowIconPicker(v => !v)}
          title={t('changeIcon')}
          aria-label={t('changeIcon')}
        >
          {ICON_MAP[product.iconKey]}
        </button>

        <input
          className={styles.nameInput}
          value={product.name}
          onChange={e => dispatch({ type: 'SET_PRODUCT_NAME', id: product.id, name: e.target.value })}
          placeholder={t('itemName')}
          maxLength={32}
        />

        <span className={styles.units}>{product.unitsPerDay}<span className={styles.unitsLabel}>/d</span></span>

        {canDelete && (
          <button
            className={styles.deleteBtn}
            onClick={() => dispatch({ type: 'REMOVE_PRODUCT', id: product.id })}
            title={t('deleteItem')}
            aria-label={t('deleteItem')}
          >
            <IconTrash size={14} />
          </button>
        )}
      </div>

      {showIconPicker && (
        <div className={styles.iconPicker}>
          {ICON_OPTIONS.map(opt => (
            <button
              key={opt.key}
              className={`${styles.iconOption} ${product.iconKey === opt.key ? styles.iconOptionActive : ''}`}
              onClick={() => { dispatch({ type: 'SET_PRODUCT_ICON', id: product.id, iconKey: opt.key }); setShowIconPicker(false) }}
              aria-label={opt.key}
            >
              {opt.el}
            </button>
          ))}
        </div>
      )}

      <InputSlider label={t('price')} value={product.pricePerUnit} min={0.5} max={30} step={0.25} prefix="$" onChange={set('pricePerUnit')} />
      <InputSlider label={t('varCost')} value={product.variableCostPerUnit} min={0} max={15} step={0.25} prefix="$" onChange={set('variableCostPerUnit')} />
      <InputSlider label={t('unitsPerDay')} value={product.unitsPerDay} min={0} max={300} step={1} onChange={set('unitsPerDay')} />
    </div>
  )
}
