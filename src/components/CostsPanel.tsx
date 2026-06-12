import { useRef, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppState } from '../store/AppContext'
import { InputSlider } from './InputSlider'
import { Accordion } from './Accordion'
import { IconTrash, IconPlus } from './icons'
import styles from './CostsPanel.module.css'

function EditableName({ id, name }: { id: string; name: string }) {
  const { dispatch } = useAppState()
  const [editing, setEditing] = useState(false)
  const [val, setVal] = useState(name)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { setVal(name) }, [name])
  useEffect(() => { if (editing) inputRef.current?.select() }, [editing])

  function commit(v: string) {
    const trimmed = v.trim() || name
    dispatch({ type: 'SET_FIXED_NAME', id, name: trimmed })
    setEditing(false)
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        className={styles.nameInput}
        value={val}
        onChange={e => setVal(e.target.value)}
        onBlur={e => commit(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') commit(val); if (e.key === 'Escape') setEditing(false) }}
      />
    )
  }

  return (
    <span className={styles.nameLabel} onClick={() => setEditing(true)} title="Click to rename">
      {name}
    </span>
  )
}

export function CostsPanel() {
  const { t } = useTranslation()
  const { state, dispatch } = useAppState()
  const { fixedCosts } = state
  const canDelete = fixedCosts.length > 1

  return (
    <Accordion title={t('fixedCosts')} desc={t('fixedCostsDesc')} defaultOpen>
      <div>
        {fixedCosts.map(item => (
          <div key={item.id} className={styles.row}>
            <div className={styles.rowHeader}>
              <EditableName id={item.id} name={item.name} />
              {canDelete && (
                <button
                  className={styles.deleteBtn}
                  onClick={() => dispatch({ type: 'REMOVE_FIXED', id: item.id })}
                  title={t('deleteItem')}
                >
                  <IconTrash size={13} />
                </button>
              )}
            </div>
            <InputSlider
              label=""
              value={item.value}
              min={0}
              max={30000}
              step={50}
              prefix="$"
              suffix={t('perMonth')}
              onChange={v => dispatch({ type: 'SET_FIXED', id: item.id, value: v })}
            />
          </div>
        ))}
        <button className={styles.addBtn} onClick={() => dispatch({ type: 'ADD_FIXED' })}>
          <IconPlus size={14} />
          {t('addExpense')}
        </button>
      </div>
    </Accordion>
  )
}
