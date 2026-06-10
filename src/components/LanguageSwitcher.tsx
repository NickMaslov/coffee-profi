import { useAppState } from '../store/AppContext'
import styles from './TopBar.module.css'

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Русский' },
  { code: 'es', label: 'Español' },
] as const

export function LanguageSwitcher() {
  const { state, dispatch } = useAppState()

  return (
    <div className={styles.langWrap}>
      <span className={styles.globe}>🌐</span>
      <select
        className={styles.langSelect}
        value={state.language}
        onChange={e => dispatch({ type: 'SET_LANGUAGE', value: e.target.value as 'en' | 'ru' | 'es' })}
        aria-label="Select language"
      >
        {LANGUAGES.map(l => (
          <option key={l.code} value={l.code}>{l.label}</option>
        ))}
      </select>
    </div>
  )
}
