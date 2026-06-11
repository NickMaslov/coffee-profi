import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppState } from '../store/AppContext'
import { calcBreakEven, calcPnL } from '../utils/calculations'
import { Accordion } from './Accordion'
import type { SavedScenario } from '../types'
import styles from './ScenariosPanel.module.css'

function fmt(n: number) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}

function ScenarioRow({ scenario, onLoad, onDelete }: {
  scenario: SavedScenario
  onLoad: () => void
  onDelete: () => void
}) {
  const { t } = useTranslation()
  const be = calcBreakEven(scenario.fixedCosts, scenario.products)
  const pnl = calcPnL(scenario.fixedCosts, scenario.products)
  const isProfit = pnl.netProfit >= 0

  return (
    <div className={styles.scenarioRow}>
      <div className={styles.rowTop}>
        <span className={styles.scenarioName}>{scenario.name}</span>
        <span className={`${styles.profitChip} ${isProfit ? styles.chipGreen : styles.chipRed}`}>
          {isProfit ? '+' : ''}{fmt(pnl.netProfit)}
        </span>
      </div>
      <div className={styles.rowMeta}>
        {t('scenarioBreakEven')}: <strong>{isFinite(be.unitsPerDay) ? be.unitsPerDay : '∞'}</strong> {t('breakEvenCupsDay')}
      </div>
      <div className={styles.rowActions}>
        <button className={styles.loadBtn} onClick={onLoad}>{t('scenarioLoad')}</button>
        <button className={styles.deleteBtn} onClick={onDelete} aria-label={t('deleteItem')}>×</button>
      </div>
    </div>
  )
}

export function ScenariosPanel() {
  const { t } = useTranslation()
  const { state, dispatch } = useAppState()
  const [name, setName] = useState('')

  const placeholder = `${t('scenarioDefaultName')} ${state.savedScenarios.length + 1}`

  function handleSave() {
    dispatch({ type: 'SAVE_SCENARIO', name: name || placeholder })
    setName('')
  }

  return (
    <Accordion title={t('scenariosTitle')} desc={t('scenariosDesc')} defaultOpen={false}
      collapsedDesc={state.savedScenarios.length > 0
        ? `${state.savedScenarios.length} ${t('scenariosSaved')}`
        : undefined
      }
    >
      <div className={styles.wrap}>
        {/* Save row */}
        <div className={styles.saveRow}>
          <input
            className={styles.nameInput}
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder={placeholder}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
            maxLength={40}
          />
          <button className={styles.saveBtn} onClick={handleSave}>
            {t('scenarioSave')}
          </button>
        </div>

        {/* Saved list */}
        {state.savedScenarios.length === 0 ? (
          <p className={styles.empty}>{t('scenariosEmpty')}</p>
        ) : (
          <div className={styles.list}>
            {[...state.savedScenarios].reverse().map(s => (
              <ScenarioRow
                key={s.id}
                scenario={s}
                onLoad={() => dispatch({ type: 'LOAD_SCENARIO', id: s.id })}
                onDelete={() => dispatch({ type: 'DELETE_SCENARIO', id: s.id })}
              />
            ))}
          </div>
        )}
      </div>
    </Accordion>
  )
}
